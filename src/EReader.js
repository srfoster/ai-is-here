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
import Chip from '@mui/material/Chip';
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
import { CognitoJwtVerifier } from "aws-jwt-verify";

import { useGpt, UsageContext } from "./useGpt";

/*
import {
  useWindowSize,
} from '@react-hook/window-size'
import { useSwipeable } from "react-swipeable";
import { animated, to, useSpring } from '@react-spring/web'
*/

import { useLocation,
  HashRouter as Router,
  Routes,
  Route,
  Link } from 'react-router-dom';
// custom hook to get the current pathname in React

const usePathname = () => {
  const location = useLocation();
  return location.pathname;
}

const decodeToken = async (type,token) => {
  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create({
    userPoolId: "us-east-1_5eFNzSJSY",
    tokenUse: type,
    clientId: "2vs918871e1lh19ump5oblk25v",
  });

  try {
    const payload = await verifier.verify(
      token
    );
    console.log("Token is valid. Payload:", payload);
    return payload
  } catch(e) {
    console.log("Token not valid!",e);
  }
}

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


export const wordsToTokens = (words)=>{
  // Multiple models, each with different capabilities and price points. Prices are per 1,000 tokens. You can think of tokens as pieces of words, where 1,000 tokens is about 750 words. This paragraph is 35 tokens. 

  //1000t = 750w
  //(1000/750)t = 1w

  return words * (1000/750) 
}

export const tokensToDollars = (tokens) => {
  //8K context	$0.03 / 1K tokens	$0.06 / 1K tokens
  //32K context	$0.06 / 1K tokens	$0.12 / 1K tokens
 
  let num = (tokens/1000) * 0.06
  return Math.round(num * 100) / 100
}

export const wordsToDollars = (words) => {
  return tokensToDollars(wordsToTokens(words))
}

export function EReader({ content, footnotes }) {
  let [currentSectionIndex, setCurrentSectionIndex] = useLocalStorage("current-section",0)
  let [usageData, setUsageData] = React.useState({
     gptWords: 0
  })
  let increaseGPTWords = (more)=>{
    setUsageData((ud) => ({...ud, gptWords: ud.gptWords + more}))
  }
  let [showFootnote, setShowFootnote] = React.useState(null)
  let [idToken, setIdToken] = useLocalStorage("id_token", null)
  let [username, setUsername] = React.useState(null) //Comes from id_token

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

  let pathname = usePathname();

  React.useEffect(() => {
    async function func() {
      if (pathname.startsWith("/id_token")) {
        let { id_token, access_token } = parseOutToken(pathname)
        setIdToken(id_token)
        let payload = await decodeToken("id",id_token)
        if(payload){
          setUsername(payload["cognito:username"])
        }
      }
    }
    func()
  }, [])

  React.useEffect(() => {
    console.log("HERE", idToken)
    if(!idToken) return 

    async function func() {
      let payload = await decodeToken("id", idToken)
      if (payload) {
        setUsername(payload["cognito:username"])
      }
    }

    func()
  }, [idToken])


  return (
    <>
      <UsageContext.Provider value={{ usageData, increaseGPTWords }}>
        <Container maxWidth="sm" >
          <Box
            ref={outerRef}
            style={{
              width: "100%", display: "flex", flexDirection: "column", overflow: "hidden"
            }}>
            {username && "You're logged in as " + username}
            <div ref={ref} >
              {content[currentSectionIndex]}
              <NavBar
                prev={() => setCurrentSectionIndex(currentSectionIndex - 1)}
                next={() => setCurrentSectionIndex(currentSectionIndex + 1)}
              />
            </div>
          </Box>
          <Footnote toShow={footnotes[showFootnote]}
            handleClose={() => setShowFootnote(null)} />
        </Container>
      </UsageContext.Provider>
    </>
  );
}

let parseOutToken = (path)=>{
  let parts = path.replace("/id_token=","").split("&")
  let id_token = parts[0]
  let access_token = parts[1].replace("access_token=","")
  return {id_token,access_token}
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


export let GPT = ({prompt, avatar, hiddenPrompt, showCosts}) => {
  let { usageData } = React.useContext(UsageContext)
  let [response, startStreaming] = useGpt({ prompt:  (hiddenPrompt || "") + " " + prompt, onParagraph: () => { } })


  let words = response.split(" ").length

  return <Card style={{ border: "1px solid black" }}>
    <CardContent>
      <CardHeader subheader={prompt}
      />
      {response.split("\n").map((x, i) => <ReactMarkdown key={i}>{x}</ReactMarkdown>)}
    </CardContent>
    <CardActions>
      <Button variant="outlined" onClick={startStreaming}>Ask GPT</Button>
      {avatar &&
        <div style={{marginLeft: 5}} onClick={startStreaming}>
          <Avatar style={{ width: 50, height: 50, cursor: "pointer" }} {...avatar} />
        </div> }
      {showCosts && (
        <>
          <Chip label={<span>Words: {words} | ${wordsToDollars(words)}</span>}/>
          <Chip label={<span>Total: ${wordsToDollars(usageData.gptWords)}</span>} />
        </>
      )}
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

export let BookCard = (props) =>{
  return <Card style={{marginBottom: 15, position: "relative", border: "1px solid black"}}><CardContent>{props.children}</CardContent></Card>
}



export let AVATARS = {
  student1: genConfig({
  "sex": "man",
  "faceColor": "#F9C9B6",
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
  student2: genConfig({
  "sex": "man",
  "faceColor": "#F9C9B6",
  "earSize": "big",
  "eyeStyle": "oval",
  "noseStyle": "long",
  "mouthStyle": "laugh",
  "shirtStyle": "hoody",
  "glassesStyle": "none",
  "hairColor": "#FC909F",
  "hairStyle": "thick",
  "hatStyle": "none",
  "hatColor": "#D2EFF3",
  "eyeBrowStyle": "up",
  "shirtColor": "#6BD9E9",
  "bgColor": "linear-gradient(45deg, #ff1717 0%, #ffd368 100%)"
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