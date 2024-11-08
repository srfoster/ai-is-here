/*

To get rid of the [GPT] flicker and send a proper conversation, need to fix up the backend to accept messages like [{role: "user", ...}, {role: "agent", ...}]:
* https://github.com/srfoster/ai-is-here-backend/blob/main/js/main.js

*/


import * as React from 'react';
import './App.css';
import { Button, Container, TextField, Typography, Stack } from '@mui/material';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import "react-chat-elements/dist/main.css"
import { MessageBox } from "react-chat-elements";
import { useGpt, UsageContext, OutOfCredits } from "./useGpt";
import { useDocs, useDoc } from "./useDocuments";

import { Input } from 'react-chat-elements'
import * as RCE from 'react-chat-elements'

import { Link, useParams } from 'react-router-dom';
import Markdown from 'react-markdown'


let civilWarHiddenPrompt = "You are an automated tutor for a lesson about the American Civil War.  Greet the user once.  Then continually ask them one simple question at a time.  Use the Socratic method."

export function TutorManager() {
  let [documents, createDocument, deleteDocument, updateDocument] = useDocs()

  return <>
      <Container maxWidth="sm" >
        <Typography variant="h2">Bots</Typography>
        <ul>
          {documents.map((d) => { 
            return <li key={ d.documentId}>
              <Link to={"/bots/"+d.documentId}>{d.title}</Link>
            </li>
          })}
        </ul>
        <Button onClick={() => { 
          createDocument({ title: "New Bot", content: civilWarHiddenPrompt})

        }} >Add Bot</Button>
      </Container>
  </>
}

export function Tutor() {
    let [usageData, setUsageData] = React.useState({
        gptWords: 0
    })
    let increaseGPTWords = (more)=>{
        setUsageData((ud) => ({...ud, gptWords: ud.gptWords + more}))
    }

    return (
      <Container maxWidth="sm" style={{paddingTop: 30}}>
        <UsageContext.Provider value={{ usageData, increaseGPTWords }}>
            <Chat />
        </UsageContext.Provider> 
      </Container>
    )
}

function postProcessGPT(text, afterRefresh){
  if(typeof(text) !== "string") return text
  console.log("postProcessGPT", text, text.match(/\[OutOfCredits\]/))
  let newText = text


  if(newText.match(/\[OutOfCredits\]/)){
    let newText = text.replace(/\[OutOfCredits\]/g, "")
    return [newText, <OutOfCredits afterRefresh={afterRefresh} />]
  }

  return newText
}


function Chat(){

    let [streaming, setStreaming] = React.useState(false)
    let [shouldReply, setShouldReply] = React.useState(true)
    let [inputs, setInputs] = React.useState([])

    let [inputVal, setInputVal] = React.useState("")
    let inputRef = React.createRef()

    let { documentId } = useParams()
    let [doc, updateDoc, deleteDoc] = useDoc(documentId)

    let [hiddenPrompt, setHiddenPrompt] = React.useState(undefined)

    let [editMode, setEditMode] = React.useState(false)
    let [nextPrompt, setNextPrompt] = React.useState(hiddenPrompt)
    let [nextTitle, setNextTitle] = React.useState(undefined)
    let [owner, setOwner] = React.useState(false)

    let [response, startStreaming] = useGpt({ prompt:  {role: "system", content: [{type: "text", text: hiddenPrompt}]},  
      onParagraph: (p) => { 
        console.log("onParagraph", p)

      } })

    React.useEffect(() => {
      if(doc && doc.content){
        setHiddenPrompt(doc.content)
        setNextPrompt(doc.content)
        setNextTitle(doc.title)
        setOwner(doc.owner)
        setShouldReply(true)
      } 
    }, [JSON.stringify(doc)])

    React.useEffect(()=>{
        if(!shouldReply) return 
        setShouldReply(false)
        setStreaming(true);

        //Note: Filter because if the text is an object, it's some kind of react widget displayed in the chat bubble (e.g. OutOfCredits).  Don't want to send these back to GPT.  In the future, though, we might have to rethink this.
        let morePrompt = 
           inputs.filter((i)=>typeof(i.text)=="string").map(
            (i)=>{
              return {role: i.user == "GPT" ? "assistant" : "user", 
                      content: [{type: "text", text: i.text}]}
        })

        startStreaming(morePrompt, (finalResponse)=>{
            setStreaming(false)
            setInputs(inputs.concat({user: "GPT", text: postProcessGPT(finalResponse, ()=>{setShouldReply(true)})}))
        })
    }, [hiddenPrompt, shouldReply])

    let editButton = <Button 
        //variant='contained' 
        onClick={()=>{
        if(editMode && (nextPrompt != hiddenPrompt || nextTitle != doc.title)){
          console.log("Setting hidden prompt", nextPrompt)
          setHiddenPrompt(nextPrompt)
          updateDoc(nextTitle, nextPrompt)
          setInputs([]); 
          setInputVal("");
          setShouldReply(true);
          setStreaming(false);
        }
        setEditMode(!editMode);
      }}>{!editMode ? "Edit this Bot" : "Done Editing"}</Button>
    
    console.log(owner)
    if(!owner){
      editButton = <></>
    }

    let postProcessedResponse = postProcessGPT(response, ()=>{setShouldReply(true)})
    return <>
      
      {editMode ? 
        <EditMode setNextPrompt={setNextPrompt} 
                  nextPrompt={nextPrompt}
                  setNextTitle={setNextTitle}
                  nextTitle={nextTitle}
                  deleteBot={deleteDoc}
                  updateBot={updateDoc}
                  doneEditingButton={editButton}
                  /> :
          <>
          <Typography pt={1} style={{ textAlign: "center" }} component="h1" variant="h2">{nextTitle}</Typography>
          <Stack alignItems="flex-end">
            {editButton}
          </Stack>
          {inputs.map((i)=>{
            return <MessageBox
                position={i.user == "GPT" ? "left" : "right"}
                type={"text"}
                title={i.user}
                text={typeof(i.text) == "string" ? <Markdown>{i.text}</Markdown> : i.text}
            />
          })}
          {streaming && <MessageBox
            position={"left"}
            type={"text"}
            title={"GPT"}
            text={typeof(postProcessedResponse) == "string" ? <Markdown>{postProcessedResponse}</Markdown> : postProcessedResponse}
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

function EditMode({setNextPrompt, nextPrompt, nextTitle, setNextTitle, deleteBot, doneEditingButton}){
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

    return <>
      <Typography>Use the fields below to edit the bot's name and prompt.  Prompts should be written in the second-person imperative voice (like you're telling the AI how to interact with people)</Typography>
      <br/>
      <TextField 
        label="Bot Name"
      style={{width: "100%"}} value={nextTitle} onChange={(e)=>{setNextTitle(e.target.value)}} />
      <br/>
      <br/>
      <TextField
        label="Bot Prompt"
        style={{width: "100%"}}
        multiline
        maxRows={10}
        value={nextPrompt} 
        onChange={(e)=>{setNextPrompt(e.target.value)}
        } />
      <br/>
      <br/>
      <br/>
      <hr/>
      <Stack direction="row"
        justifyContent="space-between"
        alignItems="center">
      {doneEditingButton}
      <Button 
        color="error"
        variant='contained'
        onClick={handleClickOpen}
          >Delete</Button>
      </Stack>
      <AlertDialog open={open} handleClose={handleClose} deleteBot={deleteBot} />
    </>
}


export default function AlertDialog({open, handleClose, deleteBot}) {

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box style={{padding: 50}}>
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this bot?"}
        </DialogTitle>
        <Stack direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Button 
            variant='contained'
            color="primary"
            onClick={handleClose} autoFocus>
              No.  Let it live.
          </Button>
          <Button 
            variant='contained'
            color="error"
            onClick={
            ()=>{
              deleteBot(()=>window.location = "/#/bots")
            }
            }>Yes. Destroy it!</Button>
        </Stack>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}