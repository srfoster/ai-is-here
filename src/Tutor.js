/*

To get rid of the [GPT] flicker and send a proper conversation, need to fix up the backend to accept messages like [{role: "user", ...}, {role: "agent", ...}]:
* https://github.com/srfoster/ai-is-here-backend/blob/main/js/main.js

*/


import * as React from 'react';
import './App.css';
import { Button, Card, Checkbox, Container, TextField, Typography, Stack, Slider, CardContent } from '@mui/material';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import "react-chat-elements/dist/main.css"
import { MessageBox } from "react-chat-elements";
import { useGpt, UsageContext, OutOfCredits, CreditStringContext } from "./useGpt";
import { useDocs, useDoc, useChildKeys } from "./useDocuments";

import { Input } from 'react-chat-elements'
import * as RCE from 'react-chat-elements'

import { Link, useParams } from 'react-router-dom';
import Markdown from 'react-markdown'

import { OutOfCreditsIfOutOfCredits } from './useGpt';

import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useLocalStorage } from 'react-use';
import { v4 as uuidv4 } from 'uuid';


TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');


let civilWarHiddenPrompt = "You are an automated tutor for a lesson about the American Civil War.  Greet the user once.  Then continually ask them one simple question at a time.  Use the Socratic method."

export function ChildKeyManager() {
  const {remainingCredits} = React.useContext(CreditStringContext);
  let [keys, createKey, deleteKey, transferCreditsToKey, sendInvite] = useChildKeys()
  let [amount, setAmount] = React.useState(1000)
  let [newKeyName, setNewKeyName] = React.useState("")
  let [selectedKeys, setSelectedKeys] = React.useState([])
  let splitAmount = Math.floor(amount/selectedKeys.length)
  let minSplitAmount = Math.min(
    ...[
      ...keys.filter((k)=>selectedKeys.includes(k.childKey))
             .map((k)=>k.remainingCredits)]
  )

  return <>
      <Container maxWidth="sm" style={{marginBottom: 100}}>
        <Typography variant="h2">Keys</Typography>
        <KeyManagementTools 
          keys={keys} 
          remainingCredits={remainingCredits} 
          setAmount={setAmount} 
          createKey={createKey}
          setNewKeyName={setNewKeyName}
          newKeyName={newKeyName}
          />
        {keys.length === 0 ? <Typography variant="p">You have no keys.  Create one with the widget above.</Typography> : 
        <>
        <br/> 
        <hr/>
        <Stack direction="row" alignItems={"center"}>
          <Checkbox onClick={(e) => {
            if(e.target.checked){
              setSelectedKeys(keys.map((k) => k.childKey))
            } else {
              setSelectedKeys([])
            }
          }} />  
          <Typography variant="span">Select All</Typography>
            {selectedKeys.length > 0 && <>
              <Button 
                onClick={async () => {
                  for (let k of keys.filter(k => selectedKeys.includes(k.childKey))) {
                    await transferCreditsToKey(k.childKey, splitAmount)
                  }
                } } >Give to selected {isFinite(splitAmount) ? `(${splitAmount})` : ""}</Button>
              <Button 
                color="error" 
                onClick={async () => {
                  for (let k of keys.filter(k => selectedKeys.includes(k.childKey))) {
                    await transferCreditsToKey(k.childKey, -minSplitAmount)
                  }
                } } >Take from selected {isFinite(splitAmount) ? `(-${minSplitAmount})` : ""}</Button>
              {/*<Button
                variant="contained"
                color="error"
                onClick={async () => {
                  for (let k of keys.filter(k => selectedKeys.includes(k.childKey))) {
                    await deleteKey(k.childKey)
                  }
                } } >Delete selected</Button>*/}
            </>}
        </Stack>
          <hr/>
          {keys.map((k) => { 
            let takeAmount = Math.min(amount, k.remainingCredits)
            let giveAmount = Math.min(amount, remainingCredits)

            return <div key={k.childKey} className={k.justDeleted ? "fade-out" : (k.justCreated ? "fade-in" : "")}>
              <Stack direction="row" alignItems="center">
                <Checkbox
                  checked={selectedKeys.includes(k.childKey)}
                  onClick={
                      (e) => {
                        if(e.target.checked){
                          setSelectedKeys([...selectedKeys, k.childKey])
                        } else {
                          setSelectedKeys(selectedKeys.filter((sk) => sk !== k.childKey))
                        }
                      }
                    }
                  />
               <SafeShowKey k={k} 
                 deleteKey={() => deleteKey(k.childKey)}
                 sendInvite={() => sendInvite(k.childKey)}
                 creditActions={<>
                    <Button onClick={() => {
                        transferCreditsToKey(k.childKey, amount)
                      }} >Give +{giveAmount}</Button>
                    {k.remainingCredits > 0 &&
                      <Button 
                        color="error"
                        onClick={() => {
                          transferCreditsToKey(k.childKey, -takeAmount)
                        }} >Take -{takeAmount}</Button>
                    }
                    </>} />
               </Stack>
               <hr/>
            </div>
          })}
        </>}
        <br/>
        <br/>
      </Container>
  </>
}

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BasicTabs({items}) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {items.map((i, index)=>{
            return <Tab label={i.title} {...a11yProps(index)} />
          })}
        </Tabs>
      </Box>
      {items.map((i, index)=>{
        return <CustomTabPanel value={value} index={index}>
          {i.content}
        </CustomTabPanel>
      })}
    </Box>
  );
}

//Too many params
export function KeyManagementTools({keys, remainingCredits, setAmount, createKey, setNewKeyName, newKeyName}){

  return <>
  <BasicTabs items={[
    {title: "Create Keys", 
     content: <KeyCreationWidgets 
                createKey={createKey}
                newKeyName={newKeyName}
                setNewKeyName={setNewKeyName} 
                />},
    {title: "Manage Credits", content:
    <>
        <Typography variant="p">You have {remainingCredits} credits. Use the slider and the buttons in the list below to control how many credits you'd like to give or take</Typography>
        <Stack direction="row">
          <Slider 
            min={0} 
            max={
              Math.max(
                ...[remainingCredits, ...keys.map((k)=>k.remainingCredits)])
            } 
            step={1000}  
            valueLabelDisplay="auto"
            onChange={(e)=>{setAmount(e.target.value)}}
            />
        </Stack>
      </>},
  ]} />
  </>
}

function KeyCreationWidgets({newKeyName, setNewKeyName, createKey}){
  return <>
        <Typography variant="p">Create a new key to give to someone else.  Give it a name to help you remember what the key is for.  </Typography>
        <br/>
        <br/>
        <Stack direction="row" alignItems={"center"} >
          <TextField 
            label="New Key Name"
            value={newKeyName}
            onChange={(e) => {setNewKeyName(e.target.value)}} />
          <Button onClick={() => {
            createKey({name: newKeyName})
            setNewKeyName("")
          }} >Create Key</Button>
        </Stack>
        <br/>
        <Typography variant="p">
          Or, if you need to create a lot of keys at once, 
          use the bulk key creation tool below.  Each key needs its
          own line containing a name, an email address, or both. 
          Emails must be enclosed in angle brackets like so: {`<me@example.com>`}  
        </Typography>
        <br/>
        <br/>
        <BulkKeyCreation createKey={createKey} />
        
  </>
}

//A single box where user can enter comma separated list of names and email addresses
function BulkKeyCreation({createKey}){
  let [bulkKeyString, setBulkKeyString] = React.useState("")

  return <>
    <TextField 
      label="Bulk Key Creation"
      multiline
      rows={4}
      value={bulkKeyString}
      onChange={(e) => {setBulkKeyString(e.target.value)}} />
    <Button onClick={async () => {
      let lines = bulkKeyString.split("\n").map((s) => s.trim())
      for(let l of lines){
        let e = l.match(/<([^<>]*)>/)
        let n = e ? l.replace(e[0], "").trim() : l
        await createKey({name: n, email: e ? e[1] : ""})
      }
      setBulkKeyString("")
    }} >Create Keys</Button>
  </>
}


export function SafeShowKey({k, deleteKey, creditActions, sendInvite}){
  let [expanded, setExpanded] = React.useState(false)
  if(!k) return ""
  const date = new Date(k.createdAt);
  const formattedDateString = timeAgo.format(date);

  return <Stack direction="row" alignItems="center" justifyContent={"space-between"} spacing={10}>
    <Stack>
      <div><b>Secret:</b> {<>{expanded ? k.childKey : k.childKey.slice(0, 4)} <span style={{cursor:"pointer", color: "blue", textDecoration: "underline"}} onClick={()=>setExpanded(!expanded)}>{expanded ? "(hide)" : "..."}</span></>}
      <div><b>Created:</b> {formattedDateString}</div>
      {k.metadata && Object.keys(k.metadata).length > 0 && Object.keys(k.metadata).map((key) => {
        return <div><Typography variant="div"><b>{key}:</b> {k.metadata[key]}</Typography></div>
      })}
      </div>
      <Stack direction="row" alignItems={"center"}>
        <span><b>Remaining Credits:</b> {k.remainingCredits}</span> 
        {creditActions}
      </Stack>
    </Stack>
    <Button variant="contained" color="primar" onClick={sendInvite}>Invite{k.inviteSent && " ✓"}</Button>
    <Button variant="contained" color="error" onClick={deleteKey}>Delete</Button>
   </Stack>
  }

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

export function Tutor({hiddenPrompt}) {
    let [usageData, setUsageData] = React.useState({
        gptWords: 0
    })
    let increaseGPTWords = (more)=>{
        setUsageData((ud) => ({...ud, gptWords: ud.gptWords + more}))
    }

    return (
      <Container maxWidth="sm" style={{paddingTop: 30}}>
        <UsageContext.Provider value={{ usageData, increaseGPTWords }}>
            <Chat providedHiddenPrompt={hiddenPrompt} />
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


function Chat({providedHiddenPrompt}){

    let [streaming, setStreaming] = React.useState(false)
    let [shouldReply, setShouldReply] = React.useState(true)
    let [inputs, setInputs] = React.useState([])

    let [inputVal, setInputVal] = React.useState("")
    let inputRef = React.createRef()


    let [hiddenPrompt, setHiddenPrompt] = React.useState(providedHiddenPrompt)

    let [editMode, setEditMode] = React.useState(false)
    let [nextPrompt, setNextPrompt] = React.useState(hiddenPrompt)
    let [nextTitle, setNextTitle] = React.useState(undefined)
    let [owner, setOwner] = React.useState(false)


    let { documentId } = useParams()
    let [doc, updateDoc, deleteDoc] = useDoc(documentId)

    let [conversationId, setConversationId] = useLocalStorage("conversationId", uuidv4()
    )

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
      if(providedHiddenPrompt){
        console.log("Starting the bot...")
        setHiddenPrompt(providedHiddenPrompt)
        setNextPrompt(providedHiddenPrompt)
        setNextTitle("")
        setShouldReply(true)
      }

    }, [JSON.stringify(doc), providedHiddenPrompt])

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

        let extraParams = {}

        if(documentId){
          extraParams = {logPrefix: documentId+ "/" + conversationId}
        }

        startStreaming(morePrompt, (finalResponse)=>{
            setStreaming(false)
            setInputs(inputs.concat({user: "GPT", text: postProcessGPT(finalResponse, ()=>{setShouldReply(true)})}))
        }, extraParams)
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