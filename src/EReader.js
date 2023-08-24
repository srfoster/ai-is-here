/*TODO
  * Fix repagination.  How to calculate the new height of the text?  If we knew what element was added, we could add its height to total height.  But if an element grew, we would need to know its previous height.  Maybe we can store this on the nodes themselves?  Then a recalculation pass can look at all the previous heights, detect differences, and update the total height. 
  * More content!
  * Notes for next revision:
    - Context window applies to large code bases, not just novels
*/

import * as React from 'react';
import './App.css';
import ReactMarkdown from 'react-markdown'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Fade from '@mui/material/Fade';
import Modal from '@mui/material/Modal';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';

import '@fontsource/roboto/400.css';

import {useLocalStorage} from 'react-use'
import Confetti from 'react-confetti'

import remarkGfm from 'remark-gfm'
import { useThemeProps } from '@mui/material';
import Avatar, { genConfig } from 'react-nice-avatar'
import Tooltip from '@mui/material/Tooltip';

/*
import {
  useWindowSize,
} from '@react-hook/window-size'
import { useSwipeable } from "react-swipeable";
import { animated, to, useSpring } from '@react-spring/web'
*/


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function useOnScreen(ref) {
  const [isIntersecting, setIntersecting] = React.useState(false)

  const observer = React.useMemo(() => new IntersectionObserver(
    ([entry]) => {
      setIntersecting(entry.isIntersecting)
    }
  ), [ref])


  React.useEffect(() => {
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return isIntersecting
}

export function GatedSection({children}){
  return <div style={{paddingTop: 10}}>
    {children}
  </div>
}

export function FadeInOnDiscover({ children}) {
  const ref = React.useRef(null);
  const isIntersecting = useOnScreen(ref);
  const [doFun, setDoFun] = React.useState(false)

  React.useEffect(() => {
    if(!isIntersecting) return

    setTimeout(() => { 
      setDoFun(true) 
    }, 1000)
  },[isIntersecting])

  return <Fade in={doFun}>
    <div ref={ref}>{ children}</div>
  </Fade>
}

export function EReader({ content, footnotes }) {
  let [currentSectionIndex, setCurrentSectionIndex] = useLocalStorage("current-section",0)
  let [showFootnote, setShowFootnote] = React.useState(null)

  const outerRef = React.useRef(null);
  const ref = React.useRef(null);

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentSectionIndex])

  React.useEffect(() => {
    if (!ref.current) return
    console.log("Transforming footnote links")

    let as = ref.current.querySelectorAll("a")

    for (let a of as) {
      let parts = a.getAttribute("href").split("/")
      let footnoteKey = parts[parts.length - 1]
      a.style.cursor = "pointer"
      a.style.color = "blue"
      a.style.textDecoration = "underline"
      a.addEventListener("click", (e) => {
        if (!showFootnote) {
          setShowFootnote(footnoteKey)
        } else {
          setShowFootnote(null)
        }
        e.preventDefault()
      })
    }

  }, [currentSectionIndex])

  return (
    <>
      <Container maxWidth="sm" >
        <Box
          ref={outerRef}
          style={{
            width: "100%", display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
            <div ref={ref} >
              {content[currentSectionIndex]}
              <NavBar 
                prev={()=>setCurrentSectionIndex(currentSectionIndex-1)}
                next={()=>setCurrentSectionIndex(currentSectionIndex+1)}
              /> 
            </div> 
        </Box>
              <Footnote toShow={footnotes[showFootnote]}
                  handleClose={ ()=>setShowFootnote(null)} />
      </Container>
    </>
  );
}

let NavBar = ({prev, next}) => {
  return <>
    <FadeInOnDiscover>
      <Stack direction="row" style={{justifyContent: "center"}}>
        <Button onClick={prev}>Prev</Button>
        <Button onClick={next}>Next</Button>
      </Stack>
    </FadeInOnDiscover>
  </>
}

export let ClickToReveal = ({contents}) => {
  let [open, setOpen] = React.useState(false)
  let [count, setCount] = React.useState(-1)

  let ref = React.useRef(null)

  return <Card ref={ref} style={{marginBottom: 15, position: "relative", border: "1px solid black"}}>
    <CardContent>
      <Button onClick={() => { 
        setOpen(!open); 
        if(!open)
          setCount(count => (count + 1) % contents.length)
         }}>
        Press this button
      </Button>
      {open && <>
        <Confetti
            recycle={false}
            numberOfPieces={500}
            initialVelocityY={{min: 5, max: 5}}
        />
        <Typography>{[contents[count]]}</Typography>
      </>}
    </CardContent>
  </Card>
}

export let Footnote = ({ toShow, handleClose }) => {
 return (
    <>
      <Modal
        open={!!toShow}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
            <ReactMarkdown>{ toShow }</ReactMarkdown>
        </Box>
      </Modal>
    </>
  );
}


export let Benchmark = ({ name, goal, modelsTested, result }) => {
  return <Card style={{marginBottom: 20, border: "1px solid black"}}>
    <CardContent>
      <ReactMarkdown>{`
**${name}**
* **Goal:** ${goal} 
* **Models Tested:**  ${modelsTested}
* **Result:** ${result}`}
      </ReactMarkdown>
    </CardContent>
  </Card>
}

let useGpt = ({prompt, onParagraph}) => {
  let url = "https://anx45lyxrwvwwu55z3zj67ndzy0naqal.lambda-url.us-east-1.on.aws/"
  let [response, setResponse] = React.useState("")
  //TODO: When response is complete, store full output in localstorage.

  React.useEffect(() => {
    onParagraph()
  },[response.split("\n").length]);

  let startStreaming = async () => {
    console.log("prompt", prompt)
    let response = await fetch(url, { method: "POST", body: JSON.stringify({ credits: "ABXLDLE", role: "user", content: prompt}) });
    let streamResponse = response.body;
    let reader = streamResponse.getReader();
    let decoder = new TextDecoder();
    let done = false;
    setResponse("")

    while (!done) {
      let { value, done: doneReading } = await reader.read();
      done = doneReading;
      let chunkValue = decoder.decode(value);
      setResponse((response) => response + chunkValue)

    }
  }

  return [response, startStreaming]
}

export let GPT = ({prompt, avatar, hiddenPrompt}) => {
  let [response, startStreaming] = useGpt({ prompt:  hiddenPrompt + " " + prompt, onParagraph: () => { } })

  return <Card style={{ border: "1px solid black" }}>
    <CardContent>
      <CardHeader subheader={prompt}
      />
      {response.split("\n").map((x, i) => <ReactMarkdown key={i}>{x}</ReactMarkdown>)}
    </CardContent>
    <CardActions>
      {avatar ?
        <div onClick={startStreaming}>
          <Avatar style={{ width: 50, height: 50, cursor: "pointer" }} {...avatar} />
        </div> : <Button onClick={startStreaming}>Ask GPT</Button>
      }
    </CardActions>
  </Card>
}

let useReaderPrefersBullets = () => {
  let key = "Rewrite paragraphs as bullets" 

  let [getter, setter] = useLocalStorage(key, false)

  return [getter, setter, key]
}

let useReaderPrefersShortSentences = () => {
  let key = "Rewrite sentences to be as short as possible" 

  let [getter, setter] = useLocalStorage(key, false)

  return [getter, setter, key]
}

let useReaderPreferences = () => {
  let [likesBullets, setLikesBullets, likesBulletsKey] = useReaderPrefersBullets()

  let [likesShortSentences, setLikesShortSentences, likesShortSentencesKey] = useReaderPrefersShortSentences()
  
  return {[likesBulletsKey]: likesBullets, [likesShortSentencesKey]: likesShortSentences}
}

let stringifyPrefs = (prefs)=>{
  //console.log("prefs", prefs)
  let s = [];
 
  for(let key of Object.keys(prefs)){
    if(prefs[key]) s.push(key)
  }

  return s.join(". ") + "."
}

export let CustomizationWidget = ({ }) => {
  let [likesBullets, setLikesBullets, likesBulletsKey] = useReaderPrefersBullets()

  let [likesShortSentences, setLikesShortSentences, likesShortSentencesKey] = useReaderPrefersShortSentences()

  let checkBoxForPref = (pref, setPref, key) => {
      return <FormControlLabel
          control={

            <Checkbox
              checked={!!(pref)}
              onChange={(e) => { setPref(e.target.checked) }}
            />}
          label={key} />
  }

  return <>
      <FormGroup>
        
        {checkBoxForPref(likesBullets, 
          setLikesBullets, 
          likesBulletsKey)}

        {checkBoxForPref(likesShortSentences,
          setLikesShortSentences,
          likesShortSentencesKey)}
      </FormGroup>
  </>
}

export let CustomizedText = ({ children}) => {
  return <>
    <Card
      style={{ marginBottom: 20, border: "1px solid black" }}>
      <CardHeader
        subheader="The text below can be rewritten  according to your preferences:"
      ></CardHeader>
      <CardContent>
        <CustomizationWidget />
      </CardContent>
    </Card>
    {children.split("\n\n").map((x, i) => <RewritableParagraph 
      key={i}>{x}</RewritableParagraph>)}
  </>
}

export let RewritableParagraph= ({ children }) => {
  let prefs = useReaderPreferences()

  let [response, startStreaming] = useGpt({
    prompt: stringifyPrefs(prefs) + "  Rewrite the following accordingly ```" + children + "```", onParagraph: () => { } 
  
  })

  return <>
    <span style={{cursor: "pointer"}} onClick={startStreaming}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{response ? "~" + children.trim() + "~" : children}</ReactMarkdown> 
      <ReactMarkdown>{response}</ReactMarkdown> 
    </span>
  </>
}

export let AVATARS = {
  student1: genConfig({
  "sex": "man",
  "faceColor": "#AC6651",
  "earSize": "small",
  "eyeStyle": "oval",
  "noseStyle": "round",
  "mouthStyle": "smile",
  "shirtStyle": "hoody",
  //"glassesStyle": "square",
  "hairColor": "#000",
  "hairStyle": "normal",
  "hatStyle": "none",
  "hatColor": "#fff",
  "eyeBrowStyle": "up",
  "shirtColor": "#F4D150",
  "bgColor": "#E0DDFF"
  }),
  teacher1: genConfig({
  "sex": "man",
  "faceColor": "#F9C9B6",
  "earSize": "big",
  "eyeStyle": "circle",
  "noseStyle": "short",
  "mouthStyle": "smile",
  "shirtStyle": "short",
  "glassesStyle": "square",
  "hairColor": "#000",
  "hairStyle": "thick",
  "hatStyle": "none",
  "hatColor": "#D2EFF3",
  "eyeBrowStyle": "up",
  "shirtColor": "#77311D",
  "bgColor": "linear-gradient(45deg, #56b5f0 0%, #45ccb5 100%)"
  })
}

export let AvatarSays = ({avatar, say, direction}) => {
  return <>
    <Grid container alignItems={"center"} direction={direction || "row"}>
      <Grid item>
        <Avatar style={{ width: 100, height: 100 }} {...avatar} />
      </Grid>
      <Grid item>
        <div style={{ margin: 20, fontSize: 18, color: "gray" }}>"{say}"</div>
      </Grid>
    </Grid>
  </>
}