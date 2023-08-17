/*TODO
  * Fix pagination:  What if element is too long?  Also, can we get put on the wrong page?  Or on a non-existent page?
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
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';

import '@fontsource/roboto/400.css';

import {useLocalStorage} from 'react-use'
import Confetti from 'react-confetti'
import {
  useWindowSize,
} from '@react-hook/window-size'
import { useSwipeable } from "react-swipeable";

import Modal from '@mui/material/Modal';
import remarkGfm from 'remark-gfm'

import { animated, useSpring } from '@react-spring/web'


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

export function EReader({ content, footnotes }) {
  let [textAnchor, setTextAnchor] = React.useState(null)
  let [page, setPage] = useLocalStorage("current-page",1)
  let [pageLengths, setPageLengths] = React.useState([])
  let [readerHeight, setReaderHeight] = React.useState(undefined)
  let [readerWidth, setReaderWidth] = React.useState(undefined)
  let [lastRecalc, setLastRecalc] = React.useState(new Date())
  let [showFootnote, setShowFootnote] = React.useState(null)
  const [windowWidth, windowHeight] = useWindowSize()

  const outerRef = React.useRef(null);
  const middleRef = React.useRef(null);
  const ref = React.useRef(null);

  const previousPage = React.useRef(-1);
  let [pageMarginOffset, setPageMarginOffset] = React.useState(0)
  let [pageMarginOffsetTarget, setPageMarginOffsetTarget] = React.useState(0)

  const [animatedPageMarginOffsetProps, api] = useSpring(() => ({
    from: {
      marginLeft: isNaN(pageMarginOffset) ? 0 : pageMarginOffset,
    },
    to: {
      marginLeft: isNaN(pageMarginOffsetTarget) ? 0 : pageMarginOffsetTarget,
    },
  }), [pageMarginOffset, pageMarginOffsetTarget])


  const nextPage = () => {
    if (page < pageLengths.length){
      previousPage.current = page;
      setPage(page + 1)
      setPageMarginOffsetTarget(pageMarginOffsetTarget - readerWidth)
    }
  }

  const prevPage = () => {
    if (page > 1){
      previousPage.current = page;
      setPage(page - 1)
      setPageMarginOffsetTarget(pageMarginOffsetTarget + readerWidth)
    }
  }

  const swipeHandlers = useSwipeable({
    onSwipedRight: (eventData) => prevPage(),
    onSwipedLeft: (eventData) => nextPage(),
  });


  React.useEffect(() => {
    if (!ref.current) return

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
  }, [])

  //Get off the ground: Calculate page lengths
  React.useEffect(() => {
    if (ref.current) {
      let nodes = [...ref.current.childNodes].filter(x => x.style)
      let parentRect = outerRef.current.getBoundingClientRect()
      let maxPagePixelHeight = parentRect.height 

      setReaderHeight(maxPagePixelHeight)
      console.log("Reader Height", maxPagePixelHeight)
      setReaderWidth(outerRef.current.getBoundingClientRect().width)

      let lengths = []
      let numElementsOnCurrentPage = 0 
      let currentPagePixelHeight = 0 

      //console.log("Total elements", nodes.length)

      let fuzz = 20 // Keeps things from being clipped (I guess this is currently a magic number that equals the top padding of the text container.  Should de-magic it.)

      //console.log("calc page lengths", nodes)

      let iters = 0
      for(let i = 0; i < nodes.length; i++) {
        iters++;
        if(iters> 1000) break; //To ease develpment: Infinite loop protection

        let element = nodes[i]

        let rect = element.getBoundingClientRect()
        let currentElementPixelHeight = rect.height 

        if (currentPagePixelHeight + currentElementPixelHeight <= maxPagePixelHeight - fuzz) {
         // console.log("Adding",currentPagePixelHeight, element)
          numElementsOnCurrentPage += 1
          currentPagePixelHeight += currentElementPixelHeight
        } else {
         // console.log("Heights", currentPagePixelHeight + currentElementPixelHeight, maxPagePixelHeight)
          lengths.push(numElementsOnCurrentPage)

          numElementsOnCurrentPage = 0
          currentPagePixelHeight = 0

          //console.log("**********NEXT PAGE**********")
          i--; //Current element will be on next page.  Process it again.
        }
      }

      if(numElementsOnCurrentPage > 0)
        lengths.push(numElementsOnCurrentPage)

      console.log("calculated lengths", lengths)
      setPageLengths(lengths)
    }
  }, [lastRecalc]);

  /*
  React.useEffect(() => {
  }, [pageLengths])
  */

  const repaginate = ({anchor})=> {

    setLastRecalc(new Date()) 
  }

  const pageNodes = (pageI, pageLengths) => {
    if(!ref.current) return []
    if(!pageLengths) return []

    let nodes = [...ref.current.childNodes].filter(x => x.style)
    for(let i = 0; i < pageLengths.length; i++) {
      let length = pageLengths[i]
      let slice = nodes.slice(0, length)
      nodes.splice(0, length)

      if(i == pageI - 1) {
        return slice
      }
    }


    return [];
  }

  const pageIndexContaining = (text, lengths) => {
    let nodes = [...ref.current.childNodes].filter(x => x.style)

    for(let i = 0; i < lengths.length; i++) {
      let length = lengths[i]
      let slice = nodes.slice(0, length)
      nodes.splice(0, length)

      let sliceText = slice.reduce((t, x) => t + "\n" + x.textContent, "")
      //console.log("Slice contains?", text, sliceText, sliceText.match(text))

      if(sliceText.includes(text)) {
        return i;
      }
    }

    return undefined
  }

  React.useEffect(() => {
     repaginate({})
  }, [windowWidth, windowHeight])

  return (
    <>
      <Container maxWidth="sm"
          {...swipeHandlers} 
      >
        <Box
          ref={outerRef}
          style={{
            width: "100%", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden"
      }}>
          <animated.div ref={ref} style={{
            overflow: "hidden", 
            height: readerHeight,
            width: "1000%", 
            columnCount: 10,
            //width: (pageLengths.length * 100) + "%",
            //columnCount: pageLengths.length,
            ... animatedPageMarginOffsetProps,
          }} >
            {content.map(
              (x, i) => {
                //console.log(x)
                if (typeof (x) == "string")
                  return <ReactMarkdown key={i}>{x}</ReactMarkdown>

                if (typeof (x) == "function")
                  return x({ repaginate })

                return x
              })}
          </animated.div>
          <Box style={
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTop: "1px solid gray",
              padding: 5
            }}>
            <SimplePagination count={pageLengths.length}
              page={page}
              prev={prevPage}
              next={nextPage}
            />
            {/* <Button onClick={repaginate}>Repaginate</Button> */}
          </Box>
        </Box>

              <Footnote toShow={footnotes[showFootnote]}
                  handleClose={ ()=>setShowFootnote(null)} />
      </Container>
    </>
  );
}

let SimplePagination = ({ count, page, prev, next, anchor }) => {
//}
  return <Stack direction="row">
    <Button onClick={ prev }>Prev</Button>
    <Button disabled>Page {page} of { count }</Button>
    <Button onClick={ next }>Next</Button>
    {anchor}
  </Stack>
}

export let ClickToReveal = ({contents, repaginate}) => {
  let [open, setOpen] = React.useState(false)
  let [count, setCount] = React.useState(-1)

  return <Card style={{marginBottom: 15}}>
    <CardContent>
      <Button onClick={() => { 
        setOpen(!open); 
        if(!open)
          setCount(count => (count + 1) % contents.length)
        repaginate({}) }}>
        Press this button
      </Button>
      {open && <>
        <Confetti
            recycle={false}
            numberOfPieces={200}
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

export let GPT = ({prompt, repaginate}) => {
  let [response, startStreaming] = useGpt({prompt, onParagraph: ()=> repaginate({anchor: response.substring(response.length - 100) })
  })

  return <Card style={{border: "1px solid black", maxHeight: "50%", overflowY: "scroll"}}>
    <CardContent>
      <CardHeader subheader={prompt}
        action={
          <Button variant="contained" onClick={startStreaming}>Ask GPT</Button>
        }/>
      {response.split("\n").map((x, i) => <ReactMarkdown key={i}>{x}</ReactMarkdown>)}
    </CardContent>
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

export let CustomizedText = ({ children, repaginate}) => {
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
      repaginate={repaginate}
      key={i}>{x}</RewritableParagraph>)}
  </>
}

export let RewritableParagraph= ({ children, repaginate}) => {
  let prefs = useReaderPreferences()

  let [response, startStreaming] = useGpt({prompt: stringifyPrefs(prefs) + "  Rewrite the following accordingly ```" +  children + "```", onParagraph: ()=> repaginate({anchor: response.substring(response.length - 100) })
  })

  return <>
    <span style={{cursor: "pointer"}} onClick={startStreaming}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{response ? "~" + children.trim() + "~" : children}</ReactMarkdown> 
      <ReactMarkdown>{response}</ReactMarkdown> 
    </span>
  </>
}