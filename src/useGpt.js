
import * as React from 'react';
import gptProxyData from "./gptProxyData.json";
import { Card, CardContent, Typography, TextField, Button } from '@mui/material';
import {useLocalStorage} from 'react-use'

export const UsageContext = React.createContext();

export let useCheckCredits = () => {
  let [remainingCredits, setRemainingCredits] = React.useState(null);
  let [currentCreditString, setCurrentCreditString] = useLocalStorage("credit-string","")

  React.useEffect(()=>{
    fetch(gptProxyData.get_credits+"?credits="+currentCreditString)
      .then((response) => {
         return response.json()
      })
      .then((data) => {
        setRemainingCredits(JSON.parse(data.body).remainingCredits)
      })
  },[])

  return remainingCredits 
}

export let OutOfCreditsIfOutOfCredits = ({afterRefresh}) => {
  let [currentCreditString, setCurrentCreditString] = useLocalStorage("credit-string","")
  
  let remainingCredits = useCheckCredits()

  console.log("Remaining Credits", remainingCredits)

  if(remainingCredits === null) return <div>Checking credits...</div>

  if(remainingCredits < 0){
    return <OutOfCredits afterRefresh={afterRefresh} />
  } else {
    return <div>Credits: {remainingCredits}</div>
  }
}

export let OutOfCredits = ({afterRefresh}) => {
  let [currentCreditString, setCurrentCreditString] = useLocalStorage("credit-string","")

  //A material ui form for entering a credit string
  return <Card>
    <CardContent>
      <Typography variant="h5" component="div">
        Out of Credits
      </Typography>
      <Typography variant="body2">
        Enter a new credit code:
      </Typography>
      <TextField id="outlined-basic" label="Credits" variant="outlined" 
        value={currentCreditString} 
        onChange={(e) => setCurrentCreditString(e.target.value)}
      />
      <br/>
      <br/>
      <Button variant="contained" onClick={() => afterRefresh ? afterRefresh() : console.log("No afterRefresh specified for OutOfCredits component")}>Submit</Button>
    </CardContent>
  </Card> 
}

export let useGpt = ({prompt, onParagraph}) => {
  let [currentCreditString, setCurrentCreditString] = useLocalStorage("credit-string","")

  //NOTE: Use terraform state show aws_lambda_function_url.openai_proxy to find the current url
  let url = gptProxyData.url 
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

  let startStreaming = React.useCallback(async (morePrompt, onStreamComplete) => {
    setResponse("")
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

      onStreamComplete && onStreamComplete(response)

      return
    }
    
    let response = await fetch(url, { method: "POST", body: JSON.stringify({ credits: currentCreditString, role: "user", content: prompt + (morePrompt || "")}) });
    let streamResponse = response.body;
    let reader = streamResponse.getReader();
    let decoder = new TextDecoder();
    let done = false;
    let fullResponse = ""
    setResponse("")

    while (!done) {
      let { value, done: doneReading } = await reader.read();
      done = doneReading;
      let chunkValue = decoder.decode(value);
      increaseGPTWords(chunkValue.replace(/\S/g, "").length)
      fullResponse = fullResponse + chunkValue
      setResponse((response) => response + chunkValue)
    }
    onStreamComplete && onStreamComplete(fullResponse)
  }, [prompt,cachedPrompts]);

  return [response, startStreaming]
}
