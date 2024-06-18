import * as React from 'react';
import './App.css';
import { Button, Container, Typography } from '@mui/material';

import "react-chat-elements/dist/main.css"
import { MessageBox } from "react-chat-elements";
import { useGpt, UsageContext } from "./useGpt";

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
    let hiddenPrompt = "You are an automated tutor for a lesson about the American Civil War.  Greet the user."

    let prompt = ""
    let [response, startStreaming] = useGpt({ prompt:  hiddenPrompt + " " + prompt, onParagraph: () => { } })


    return <>
          <Typography pt={1} style={{ textAlign: "center" }} component="h1" variant="h2">Tutor</Typography>
          <MessageBox
            position={"left"}
            type={"text"}
            title={"Tutor"}
            text={response}
          />
          <Button onClick={startStreaming}>Start</Button>
        </>
}