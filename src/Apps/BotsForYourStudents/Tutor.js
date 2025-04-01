import * as React from 'react';
import Avatar, { genConfig } from 'react-nice-avatar'
import { Button, Card, Checkbox, Container, TextField, Typography, Stack, Slider, CardContent, IconButton } from '@mui/material';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import { Link, useParams, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import en from 'javascript-time-ago/locale/en';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useLocalStorage } from 'react-use';
import { v4 as uuidv4 } from 'uuid';

import TimeAgo from 'javascript-time-ago';

import Tooltip from "@mui/material/Tooltip";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import DoneIcon from "@mui/icons-material/Done";


import { Route } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { useGpt, UsageContext, OutOfCredits, CreditStringContext } from "../../Hooks/useGpt";
import { useDocs, useDoc, useChildKeys, useConversations } from "../../Hooks/useDocuments";
import { AvatarSays, AVATARS } from '../../Apps/MetaTextbook/EReader';
import gptProxyData from "../../gptProxyData.json";
import ChatBubble from '../../Components/ChatBubble';
import ChatInput from '../../Components/ChatInput';
import '../../App.css';



TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo('en-US');


let civilWarHiddenPrompt = "You are an automated tutor for a lesson about the American Civil War.  Greet the user once.  Then continually ask them one simple question at a time.  Use the Socratic method."
let defaultBotPrompt = "You are a bot that helps the user (educators and students) modify you for educational purposes.  You can be modified if the user presses the Edit Bot button above (mention this to the user).  They must then enter a prompt, which will become your system prompt.  You can give the user prompt suggestions, like: `"+civilWarHiddenPrompt+"`.  Give examples that relate to education and tutoring."

export function Conversation(){
  let { botId, conversationId } = useParams()

  let [doc, updateDoc, deleteDoc] = useDoc(`${botId}/${conversationId}`)

  return <>
    <Container maxWidth="sm" style={{}}>
      <DocConversationHistory doc={doc} />
    </Container>
  </>
}

function DocConversationHistory({doc}){  
  return doc && <ChatHistory messages={JSON.parse(doc.content).map(gptMessageToLocal)} />
}

let gptMessageToLocal = (c)=>{
    return {user: c.role, text: typeof(c.content) == "object" && c.content.length ? c.content[0].text : c.content.text}
}

export function ChildKeyManager() {
  const {remainingCredits} = React.useContext(CreditStringContext);
  let [keys, createKey, deleteKey, transferCreditsToKey, transferCreditsFromKey, sendInvite] = useChildKeys()
  let [amount, setAmount] = React.useState(1000)
  let [newKeyName, setNewKeyName] = React.useState("")
  let [selectedKeys, setSelectedKeys] = React.useState([])
  let totalGivable = Math.min(remainingCredits, amount*selectedKeys.length)
  let totalTakable = 
    [
      ...keys.filter((k)=>selectedKeys.includes(k.childKey))
             .map((k)=>Math.min(k.remainingCredits, amount))].reduce((a,b)=>a+b, 0)

  return <>
      <Container maxWidth="sm" style={{}}>
        <Typography variant="h2">Keys</Typography>
        <KeyManagementTools 
          keys={keys} 
          remainingCredits={remainingCredits} 
          amount={amount} 
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
                    await transferCreditsToKey(k.childKey, Math.min(amount,remainingCredits))
                  }
                } } >Give to selected {isFinite(totalGivable) ? `(${totalGivable})` : ""}</Button>
              <Button 
                color="error" 
                onClick={async () => {
                  for (let k of keys.filter(k => selectedKeys.includes(k.childKey))) {
                    await transferCreditsFromKey(k.childKey, Math.min(amount,k.remainingCredits))
                  }
                } } >Take from selected {isFinite(totalTakable) ? `(-${totalTakable})` : ""}</Button>
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

            return <div key={k.childKey} className={k.justDeleted ? "fade-out" : (k.justCreated ? "fade-in" : "")} onAnimationEnd={(e)=>{
              if(k.justDeleted)
                e.target.style.display="none"
              }}>
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
                          transferCreditsFromKey(k.childKey, takeAmount)
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
export function KeyManagementTools({keys, remainingCredits, amount, setAmount, createKey, setNewKeyName, newKeyName}){

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
        <Stack spacing={3}>
            <Typography variant="p">You have {remainingCredits} credits. Use the field below to control how many credits you'd like to give or take</Typography>
              <TextField
                onChange={(e)=>{setAmount(e.target.value)}}
                label="Number"
                type="number"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            {amount > 0 && <Typography variant="p">Now use the Give or Take buttons below, or select specifc keys</Typography>}
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
        let e = l.match(/([^ ]*@[^ ]*.[^ ]*)/)
        let n = e ? l.replace(e[0], "").trim() : l
        await createKey({name: n, email: e ? e[1] : ""})
      }
      setBulkKeyString("")
    }} >Create Keys</Button>
  </>
}


export function SafeShowKey({k, deleteKey, creditActions, sendInvite}){
  let [expanded, setExpanded] = React.useState(false)
  let [showConversations, setShowConversations] = React.useState(false)

  if(!k) return ""
  const date = new Date(k.createdAt);
  const formattedDateString = timeAgo.format(date);


  return <Stack direction="row" alignItems="center" justifyContent={"space-between"} spacing={10}>
    <Stack>
      <div>{<>{expanded ? k.childKey : k.childKey.slice(0, 4)} <span style={{cursor:"pointer", color: "blue", textDecoration: "underline"}} onClick={()=>setExpanded(!expanded)}>{expanded ? "(hide)" : "..."}</span>  <CopyToClipboardButton text={k.childKey}/> </>} 
      <div><b>Created:</b> {formattedDateString}</div>
      {k.metadata && Object.keys(k.metadata).length > 0 && Object.keys(k.metadata).map((key) => {
        return <div><Typography variant="div"><b>{key}:</b> {k.metadata[key]}</Typography></div>
      })}
      <div>
        <Typography variant="div"><b>Conversations: </b> 
          <a onClick={()=>{
            setShowConversations(!showConversations) 
          }} 
             style={{color: "blue", textDecoration: "underline"}}>Click here</a>
        </Typography></div>
        {showConversations && <ListConversations k={k} />}
      </div>
      <Stack direction="row" alignItems={"center"}>
        <span><b>Remaining Credits:</b> {k.remainingCredits}</span> 
        {creditActions}
      </Stack>
    </Stack>
    <Button variant="contained" color="primary" onClick={sendInvite}>Invite{k.inviteSent && " ✓"}</Button>
    <Button variant="text" color="error" onClick={deleteKey}>Delete</Button>
   </Stack>
  }

function ListConversations({k}){
  let [conversations, setConversations] = React.useState([])
  let [loading, setLoading] = React.useState(false)
  let [documents, createDocument, deleteDocument, updateDocument] = useDocs()

  React.useEffect(()=>{
    if(!documents || !k.childKey) return

    (async ()=>{
      setLoading(true)

      let r = await fetch(gptProxyData.conversation_management, { method: "POST", body: JSON.stringify({ accessKey: k.childKey, operation: "list" }) })
      let response = await r.json()
      let newCs = JSON.parse(response.body)
      setConversations((cs)=>{
        return newCs
      }) //TODO: Filter by documentIds

      setLoading(false)
    })()
  }, [k.childKey, documents])

  return <Stack>
    {loading && <Typography>Loading...</Typography>}
    <ul>
      {conversations.map((c)=>{
        return <li><Link to={`/conversations/${c.documentId}`}>{timeAgo.format(new Date(c.updatedAt))}</Link></li>
      })}
    </ul>
  </Stack>
}

export function TutorManager() {
  let [documents, createDocument, deleteDocument, updateDocument] = useDocs()

  let [selectedBot, setSelectedBot] = React.useState(undefined)
  let navigate = useNavigate()

  if(!documents) return <>You must log in first...</>

  return <>
      <Container maxWidth="sm" style={{}} >
      {selectedBot ? <>
        <Button variant="text" onClick={() => {
          setSelectedBot(undefined)
        }
        }>Back to bots</Button>
        <Tutor bot={selectedBot} />
      </> :
        <>
          <Typography variant="h2">Bots</Typography>
          <ul>
            {documents.filter((d)=>d.type != "conversation").map((d) => { 
              return <li key={ d.documentId}>
                <Link style={{ color: "cyan" }} onClick={(e) => {
                  e.preventDefault()
                  //navigate("/bots/" + d.documentId)
                  setSelectedBot(d.documentId)
                }}>{d.title}</Link>
              </li>
            })}
          </ul>
          <Button variant="contained" onClick={() => { 
            createDocument({ title: "New Bot", content: defaultBotPrompt})

          }} >Add Bot</Button>
        </>
      }
      </Container>
  </>
}

export function Tutor({hiddenPrompt, bot}) {
    let [usageData, setUsageData] = React.useState({
        gptWords: 0
    })
    let increaseGPTWords = (more)=>{
        setUsageData((ud) => ({...ud, gptWords: ud.gptWords + more}))
    }

    return (
      <Container maxWidth="lg" style={{paddingTop: 30}}>
        <UsageContext.Provider value={{ usageData, increaseGPTWords }}>
            <Chat providedHiddenPrompt={hiddenPrompt} bot={bot} />
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


function Chat({providedHiddenPrompt, bot}){

    let [streaming, setStreaming] = React.useState(false)
    let [shouldReply, setShouldReply] = React.useState(true)

    let [inputVal, setInputVal] = React.useState("")
    let inputRef = React.createRef()


    let [hiddenPrompt, setHiddenPrompt] = React.useState(providedHiddenPrompt)

    let [editMode, setEditMode] = React.useState(false)
    let [nextPrompt, setNextPrompt] = React.useState(hiddenPrompt)
    let [nextTitle, setNextTitle] = React.useState(undefined)
    let [owner, setOwner] = React.useState(false)


    let { documentId } = useParams()
    if (bot) documentId = bot

    let [inputs, setInputs] = useLocalStorage(documentId+"-conversation",[])
    let [doc, updateDoc, deleteDoc] = useDoc(documentId)

    let [conversationId, setConversationId] = useLocalStorage("conversationId", uuidv4()
    )

    let [response, startStreaming] = useGpt({ prompt:  {role: "system", content: [{type: "text", text: hiddenPrompt}]},  
      onParagraph: (p) => { 
        console.log("onParagraph", p)

      } })
    
  
    const {creditString,setCreditString} = React.useContext(CreditStringContext);
    let [conversations] = useConversations(creditString)

    let [conversationHistory, setConversationHistory] = React.useState(null)


    React.useEffect(()=>{
      if(!conversations || conversations.lenght == 0) return

      let lastConversation = 
         conversations.filter((c)=>c.documentId.match(`${documentId}/`))
                      .sort((a,b)=>a.updatedAt < b.updatedAt ? 1 : -1)[0]

      if(!lastConversation) return

      fetch(gptProxyData.document_management, { method: "POST", body: JSON.stringify({ creditString: creditString, operation: "read", documentId: lastConversation.documentId }) })
        .then((response) => {
          return response.json()
        })
        .then((data) => {
          let doc = JSON.parse(data.body)
          console.log("Last conversation doc", doc)
          let history = JSON.parse(doc.content).map(gptMessageToLocal)
          setConversationHistory(history)
        })
    

    }, [conversations])

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
        console.log("Should reply", shouldReply)
        if(!shouldReply) return 
        //If the bot spoke last, don't let it speak again
        let lastInput = inputs[inputs.length-1] 
        console.log("Last input", lastInput)
        if(lastInput && lastInput.user == "GPT") {
          console.log("Bot spoke last")
          setShouldReply(false)
          //setStreaming(true);
          return 
        }

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
        variant='contained' 
        disabled={streaming}
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

    let avatar = 
      <div style={{width:50,height:50}}>
        <Avatar style={{ width: 50, height: 50, cursor: "pointer" }}  
                  {...(genConfig(documentId))}
                />
      </div>

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
          <Stack 
            justifyContent="center"
            direction={"row"} 
            alignItems="center" 
            spacing={1}>
            {avatar}
            <div 
              style={{ textAlign: "center", paddingBottom: "0px important!", marginBottom: 0, fontSize: "3em", fontWeight: "bold"}} 
              >
                {nextTitle}
            </div>
          </Stack>
          <br/>
          <Stack alignItems="center" justifyContent={"center"} spacing={2} direction="row">
            <Button variant="text" color="error" onClick={()=>{
              setInputs([])
              setInputVal("")
              setShouldReply(true)
              setStreaming(false)
            }} >New Conversation</Button>
            {editButton}
          </Stack>
          <br/>
          <br/>
          <ChatHistory messages={inputs} avatar={avatar}/>
          {streaming && 
            <ChatBubble
              position={"left"}
              type={"text"}
              title={"GPT"}
              text={typeof(postProcessedResponse) == "string" ? 
              <Markdown remarkPlugins={remarkGfm}>{postProcessedResponse}</Markdown> : postProcessedResponse}
            />
          }
          <ChatInput
            value={inputVal}
            onChange={setInputVal}
            onSend={() => {
              if (streaming) return;
              setInputVal("");
              setShouldReply(true);
              setInputs(inputs.concat({ user: "user", text: inputVal }));
            }}
            disabled={streaming}
          />
          </>
        }
        </>

}

function ChatHistory({messages, avatar}){
  return <>
      {messages.map((i)=>{
        return <>
            <ChatBubble
                position={i.user != "user" ? "left" : "right"}
                type={"text"}
                title={i.user}
                text={typeof(i.text) == "string" ? 
                  <Markdown remarkPlugins={remarkGfm}>{i.text}</Markdown> : i.text}
            />
        </>
      })}
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
      <Button 
        color="error"
        variant='text'
        onClick={handleClickOpen}
          >Delete</Button>
                {doneEditingButton}
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
              deleteBot(()=>window.location = "/ai-is-here/#/bots")
            }
            }>Yes. Destroy it!</Button>
        </Stack>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}

export function CopyToClipboardButton({ text }) {
  const [tooltip, setTooltip] = React.useState("Copy to Clipboard");
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTooltip("Copied!");
      setTimeout(() => {
        setCopied(false);
        setTooltip("Copy to Clipboard");
      }, 2000); // Reset tooltip after 2 seconds
    });
  };

  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        onClick={handleCopy} >
        {copied ? <DoneIcon /> : <FileCopyIcon />}
      </IconButton>
    </Tooltip>
  );
}

export function TutorRoutes() {

  return <>
            <Route path="/bots" element={
              <>
                <TutorAppBar />
                <TutorManager />
              </>
            }>
            </Route>
            <Route path="/keys" element={
              <>
                <TutorAppBar />
                <ChildKeyManager />
              </>
            }>
            </Route>
            <Route path="/bots/:documentId"
              element={
                <>
                  <TutorAppBar />
                  <Tutor />
                </>
              }
            >
            </Route>
            <Route path="/conversations/:botId/:conversationId"
              element={
                <>
                  <TutorAppBar />
                  <Conversation />
                </>
              }
            >
            </Route>
  </>
}

function TutorAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar style={{minHeight: 40}}>
          <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/bots" style={{ color: "white", textDecoration: "none" }}>Bots</Link>
          </Typography>
          <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/keys" style={{ color: "white", textDecoration: "none" }}>Keys</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}