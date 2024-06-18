/*

To get rid of the [GPT] flicker and send a proper conversation, need to fix up the backend to accept messages like [{role: "user", ...}, {role: "agent", ...}]:
* https://github.com/srfoster/ai-is-here-backend/blob/main/js/main.js

*/


import * as React from 'react';
import './App.css';
import { Button, Container, Typography } from '@mui/material';

import "react-chat-elements/dist/main.css"
import { MessageBox } from "react-chat-elements";
import { useGpt, UsageContext } from "./useGpt";

import { Input } from 'react-chat-elements'
import * as RCE from 'react-chat-elements'

export function Tutor() {

    let [usageData, setUsageData] = React.useState({
        gptWords: 0
    })
    let increaseGPTWords = (more)=>{
        setUsageData((ud) => ({...ud, gptWords: ud.gptWords + more}))
    }

    return (
      <Container maxWidth="sm" >
        <UsageContext.Provider value={{ usageData, increaseGPTWords }}>
            <Chat />
        </UsageContext.Provider> 
      </Container>
    )
}

function Chat(){

    let [streaming, setStreaming] = React.useState(false)
    let [shouldReply, setShouldReply] = React.useState(true)
    let [inputs, setInputs] = React.useState([])

    let [inputVal, setInputVal] = React.useState("")
    let inputRef = React.createRef()

    let hiddenPrompt = "You are an automated tutor for a lesson about the American Civil War.  Greet the user once.  Then continually ask them one simple question at a time.  Use the Socratic method."
    let [response, startStreaming] = useGpt({ prompt:  hiddenPrompt + " " + prompt, onParagraph: (p) => { console.log(p)} })


    React.useEffect(()=>{
        if(!shouldReply) return 
        setShouldReply(false)
        setStreaming(true);
        let morePrompt = inputs.map((i)=>"["+i.user + "]:" + i.text).join("\n\n\n")
        startStreaming(morePrompt, (finalResponse)=>{
            setStreaming(false)
            setInputs(inputs.concat({user: "GPT", text: finalResponse.replace(/\[GPT\]:/g, "")}))
        })
    }, [shouldReply])

    return <>
          <Typography pt={1} style={{ textAlign: "center" }} component="h1" variant="h2">Tutor</Typography>
          {inputs.map((i)=>{
            return <MessageBox
                position={i.user == "GPT" ? "left" : "right"}
                type={"text"}
                title={i.user}
                text={i.text}
            />
          })}
          {streaming && <MessageBox
            position={"left"}
            type={"text"}
            title={"GPT"}
            text={response}
          />}
          <Input
            ref={inputRef}
            placeholder='Type here...'
            multiline={false}
            value={inputVal}
            onChange={(x)=>{setInputVal(x.target.value)}}
            rightButtons={
              <RCE.Button 
              onClick={()=>{
                setInputVal("")
                setShouldReply(true)
                setInputs(inputs.concat({user: "User", text: inputVal})); 
                }
              }
              color='white' backgroundColor='black' text='Send' />
            }
          />
        </>
}