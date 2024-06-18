
import * as React from 'react';

export const UsageContext = React.createContext();

export let useGpt = ({prompt, onParagraph}) => {

  let url = "https://anx45lyxrwvwwu55z3zj67ndzy0naqal.lambda-url.us-east-1.on.aws/"
  let [response, setResponse] = React.useState("")
  //TODO: Response caching to reduce costs?

  const {usageData, increaseGPTWords} = React.useContext(UsageContext);

  let [cachedPrompts, setCachedPrompts] = React.useState({}) //Where should this get set?

  React.useEffect(()=>{
    fetch("/ai-is-here/cached-prompts.json")
      .then((response) => response.json())
      .then((data) => {
        setCachedPrompts(data)
      })
  },[])

  React.useEffect(() => {
    onParagraph()
  },[response.split("\n").length]);

  let startStreaming = React.useCallback(async () => {
    console.log("Prompt", prompt, "Cached", cachedPrompts)
    let availableResponses = cachedPrompts[prompt.trim()]
    if(availableResponses){
      //Cycle, rather than choosing randomly
      if(availableResponses.count === undefined) availableResponses.count = -1
      availableResponses.count = (availableResponses.count + 1) % availableResponses.length

      //Fake stream it
      let fullResponse = availableResponses[availableResponses.count].split(" "); 
      setResponse("")

      while (fullResponse.length > 0) {
        let value = fullResponse.shift() 
        await new Promise((resolve) => setTimeout(resolve, 30));
        increaseGPTWords(1)
        setResponse((response) => response + value + " ")
      }

      return
    }
    
    let response = await fetch(url, { method: "POST", body: JSON.stringify({ credits: "ABXLDLE", role: "user", content: prompt}) });
    let streamResponse = response.body;
    let reader = streamResponse.getReader();
    let decoder = new TextDecoder();
    let done = false;
    setResponse("")

    console.log("Starting loop")
    while (!done) {
      let { value, done: doneReading } = await reader.read();
      done = doneReading;
      let chunkValue = decoder.decode(value);
      increaseGPTWords(chunkValue.replace(/\S/g, "").length)
      setResponse((response) => response + chunkValue)

    }
  }, [cachedPrompts]);

  return [response, startStreaming]
}
