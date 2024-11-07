/*

To get rid of the [GPT] flicker and send a proper conversation, need to fix up the backend to accept messages like [{role: "user", ...}, {role: "agent", ...}]:
* https://github.com/srfoster/ai-is-here-backend/blob/main/js/main.js

*/


import * as React from 'react';
import './App.css';
import { Button, Container, TextField, Typography } from '@mui/material';

import "react-chat-elements/dist/main.css"
import { MessageBox } from "react-chat-elements";
import { useGpt, UsageContext, OutOfCredits } from "./useGpt";

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

function postProcessGPT(text, afterRefresh){
  console.log("postProcessGPT", text, text.match(/\[OutOfCredits\]/))
  let newText = text.replace(/\[GPT\]:/g, "")

  if(newText.match(/\[OutOfCredits\]/)){
    let newText = text.replace(/\[OutOfCredits\]/g, "")
    return [newText, <OutOfCredits afterRefresh={afterRefresh} />]
  }

  return newText
}

let civilWarHiddenPrompt = "You are an automated tutor for a lesson about the American Civil War.  Greet the user once.  Then continually ask them one simple question at a time.  Use the Socratic method."

function Chat(){

    let [streaming, setStreaming] = React.useState(false)
    let [shouldReply, setShouldReply] = React.useState(true)
    let [inputs, setInputs] = React.useState([])

    let [inputVal, setInputVal] = React.useState("")
    let inputRef = React.createRef()

    let [hiddenPrompt, setHiddenPrompt] = React.useState(civilWarHiddenPrompt)

    let [editMode, setEditMode] = React.useState(false)
    let [nextPrompt, setNextPrompt] = React.useState(hiddenPrompt)

    let [response, startStreaming] = useGpt({ prompt:  hiddenPrompt, 
      onParagraph: (p) => { 
        console.log("onParagraph", p)

      } })


    React.useEffect(()=>{
        if(!shouldReply) return 
        setShouldReply(false)
        setStreaming(true);
        let morePrompt = inputs.map((i)=>"["+i.user + "]:" + i.text).join("\n\n\n")

        startStreaming(morePrompt, (finalResponse)=>{
            setStreaming(false)
            setInputs(inputs.concat({user: "GPT", text: postProcessGPT(finalResponse, ()=>{setShouldReply(true)})}))
        })
    }, [shouldReply])

    return <>
      <Button onClick={()=>{
        if(editMode && nextPrompt != hiddenPrompt){
          console.log("Setting hidden prompt", nextPrompt)
          setHiddenPrompt(nextPrompt)
          setInputs([]); 
          setInputVal("");
          setShouldReply(true);
          setStreaming(false);
        }
        setEditMode(!editMode);
      }}>Edit this Bot</Button>
      {editMode ? 
        <EditMode setNextPrompt={setNextPrompt} 
                  nextPrompt={nextPrompt}  /> :
          <>
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
            text={postProcessGPT(response, ()=>{setShouldReply(true)})}
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
        </>

}

function EditMode({setNextPrompt, nextPrompt}){
    return <>
      <Typography>You can edit the prompt below to configure the bot</Typography>
      <TextField
        style={{width: "100%"}}
        multiline
        maxRows={10}
        value={nextPrompt} 
        onChange={(e)=>{setNextPrompt(e.target.value)}
        } />
    </>
}
