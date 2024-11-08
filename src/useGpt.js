
import * as React from 'react';
import gptProxyData from "./gptProxyData.json";
import { Alert, Button, Card, CardContent, Chip, Typography, TextField} from '@mui/material';
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

  if(remainingCredits < 0 || remainingCredits === undefined){
    return <OutOfCredits afterRefresh={afterRefresh} />
  } else {
    return <Alert severity='info'>
      <Chip label={"Remaining credits: " + remainingCredits} />
      <br/>
      <br/>
      <Logout afterRefresh={afterRefresh} />
    </Alert>
  }
}

export let Logout = ({afterRefresh}) => {
  let [currentCreditString, setCurrentCreditString] = useLocalStorage("credit-string","")
  return <Button variant="contained"
                 onClick={() => {
                   setCurrentCreditString("")
                   afterRefresh()
                 }}>Logout</Button>
}

export let OutOfCredits = ({afterRefresh}) => {
  let [currentCreditString, setCurrentCreditString] = useLocalStorage("credit-string","")

  //A material ui form for entering a credit string
  return <Card>
    <CardContent>
      <Typography variant="body2">
        Enter an access key
      </Typography>
      <TextField id="outlined-basic" label="Access Key" variant="outlined" 
        value={currentCreditString} 
        type="password"
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

  let url = gptProxyData.url 
  let [response, setResponse] = React.useState("")

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
    if(!prompt) return
    if(typeof(prompt) === "object" && 
       (!prompt.content || prompt.content.length == 0 || !prompt.content[0].text)) return

    if(!currentCreditString){
      setResponse("[OutOfCredits] Please enter a credit string")
      return
    }


    setResponse("")


    if(typeof(morePrompt) !== typeof(prompt)){
      throw new Error("Prompt and morePrompt must be the same type")
    }

    //Not even sure we should keep this caching logic, but it's used in the "textbook" and I want to avoid breaking it for now (caching ensures people don't need to be logged in with an access key)
    if(typeof(morePrompt) === "string"){
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
    }

    if(typeof(prompt) === "string"){
      prompt = {role: "system", content: [{type: "text", text: prompt}]}
    }

    if(typeof(morePrompt) === "string"){
      morePrompt = {role: "user", content: [{type: "text", text: morePrompt}]}
    }

    let finalPrompt =  [prompt, morePrompt].flat()

    console.log("Sending prompt to Proxy", finalPrompt)

    let response = await fetch(url, 
      { method: "POST", 
        body: JSON.stringify(
          { credits: currentCreditString, 
            content: finalPrompt
          })});
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
