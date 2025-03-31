
import * as React from 'react';
import gptProxyData from "./gptProxyData.json";
import { Alert, Button, Card, CardContent, Chip, Typography, TextField, Stack} from '@mui/material';
import { useLocalStorage } from 'react-use'
import { useLocation } from 'react-router-dom';

export const UsageContext = React.createContext();
export const CreditStringContext = React.createContext();

export let useCheckCredits = (creditString) => {
  const [remainingCredits, setRemainingCredits] = React.useState(null);
  const [lastRefresh, setLastRefresh] = React.useState(Date.now())

  React.useEffect(()=>{
    if (!creditString) {
      setRemainingCredits(null)
      return
    }
    console.log("Checking credits for", creditString)
    //setRemainingCredits(null)
    fetch(gptProxyData.get_credits+"?credits="+creditString)
      .then((response) => {
        console.log("Credits response", response)
         return response.json()
      })
      .then((data) => {
        console.log("Credits response", JSON.parse(data.body).remainingCredits)
        setRemainingCredits(JSON.parse(data.body).remainingCredits)
      })
  },[lastRefresh, creditString])

  console.log("useCheckCredits",{creditString, remainingCredits})

  return {
    remainingCredits,
    refreshCredits: () => {
      setLastRefresh(Date.now())
    }
  }
}

export function LoginWidget({loggedInContent}){
  let location = useLocation()
  let accessKey = new URLSearchParams(location.search).get("key")
  const {creditString,setCreditString,remainingCredits} = React.useContext(CreditStringContext);

  React.useEffect(() => {
    if (!accessKey) {
      return
    }

    setCreditString(accessKey)
    // Update the URL without reloading the page
    //window.location = "/ai-is-here/#/";
  },[accessKey])

  return (
    <div>
      <OutOfCreditsIfOutOfCredits afterRefresh={() => {

      }} />
      {remainingCredits && loggedInContent}
    </div>
  )
}

export let OutOfCreditsIfOutOfCredits = ({afterRefresh, showLogout}) => {
  
  let {remainingCredits, creditString, refreshCredits} = React.useContext(CreditStringContext)

  console.log("Remaining Credits", remainingCredits)

  if(remainingCredits < 0 || remainingCredits == undefined){
    return <OutOfCredits afterRefresh={afterRefresh} />
  } else {
    return <Stack direction="row" spacing={1} alignItems="center">
        <Chip label={"Remaining credits: " + remainingCredits} />
        {(showLogout || showLogout === undefined) && creditString && <>
          <Logout afterRefresh={afterRefresh} />
        </>}
      </Stack>
  }
}

export let Logout = ({afterRefresh}) => {
  let {creditString, setCreditString, refreshCredits} = React.useContext(CreditStringContext)

  return <Button variant="text"
                 onClick={() => {
                   setCreditString("")
                   afterRefresh()
    }}>Logout</Button>
}

export let OutOfCredits = ({afterRefresh}) => {
  const {creditString,setCreditString} = React.useContext(CreditStringContext);

  //A material ui form for entering a credit string
  return <Card>
    <CardContent>
      <Typography variant="body2">
        Enter an access key
      </Typography>
      <TextField id="outlined-basic" label="Access Key" variant="outlined" 
        value={creditString} 
        type="password"
        onChange={(e) => setCreditString(e.target.value)}
      />
      <br/>
      <br/>
    </CardContent>
  </Card> 
}

export let useGpt = ({prompt, onParagraph}) => {
  let url = gptProxyData.url 
  let [response, setResponse] = React.useState("")

  const {usageData, increaseGPTWords} = React.useContext(UsageContext);
  const {creditString,setCreditString} = React.useContext(CreditStringContext);

  React.useEffect(() => {
    onParagraph()
  },[response.split("\n").length]);

  

  let startStreaming = React.useCallback(async (morePrompt, onStreamComplete, extraParams) => {
    console.log({prompt, morePrompt})
    if(!creditString){
      console.log("No credit string")
      let ooc = "[OutOfCredits]" 
      setResponse(ooc)

      //onStreamComplete && onStreamComplete(ooc)
      return
    }

    if(!prompt || prompt == "") 
      prompt = {role: "system", content: [{type: "text", text: "You are a helpful assistant."}]}

    if(typeof(prompt) === "object" && 
       (!prompt.content || prompt.content.length == 0 || !prompt.content[0].text)) return



    setResponse("")


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
          { 
            ...extraParams,
            credits: creditString, 
            content: finalPrompt,
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
  }, [prompt]);

  return [response, startStreaming]
}
