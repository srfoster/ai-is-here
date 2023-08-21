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

import { animated, to, useSpring } from '@react-spring/web'


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
  let [page, setPage] = useLocalStorage("current-page",1)
  let [readerHeight, setReaderHeight] = React.useState(undefined)
  let [readerWidth, setReaderWidth] = React.useState(undefined)
  let [lastExpandRecalc, setLastExpandRecalc] = React.useState(new Date())
  let [lastShrinkRecalc, setLastShrinkRecalc] = React.useState(new Date())
  let [showFootnote, setShowFootnote] = React.useState(null)
  let [totalTextHeight, setTotalTextHeight] = React.useState(null)
  const [windowWidth, windowHeight] = useWindowSize()

  const outerRef = React.useRef(null);
  const pageCalcDivRef = React.useRef(null);
  const ref = React.useRef(null);

  const previousPage = React.useRef(-1);
  let [pageMarginOffset, setPageMarginOffset] = React.useState(0)
  let [pageMarginOffsetTarget, setPageMarginOffsetTarget] = React.useState(0)

  React.useEffect(() => {
    if(page > 1 && readerWidth){
      setPageMarginOffsetTarget((page - 1) * -readerWidth)
    }
  },[readerWidth])

  const [animatedPageMarginOffsetProps, api] = useSpring(() => ({
    from: {
      marginLeft: isNaN(pageMarginOffset) ? 0 : pageMarginOffset,
    },
    to: {
      marginLeft: isNaN(pageMarginOffsetTarget) ? 0 : pageMarginOffsetTarget,
    },
  }), [pageMarginOffset, pageMarginOffsetTarget])


  const nextPage = () => {
    if (page < totalPages()){
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
    if (!pageCalcDivRef.current) {
      return
    }
    let parentRect = outerRef.current.getBoundingClientRect()
    let maxPagePixelHeight = parentRect.height 

    setReaderHeight(maxPagePixelHeight)
    console.log("Reader Height", maxPagePixelHeight)
    setReaderWidth(outerRef.current.getBoundingClientRect().width)

    setTotalTextHeight(pageCalcDivRef.current.getBoundingClientRect().height)

  }, [pageCalcDivRef.current]);

  /*
  React.useEffect(() => {
  }, [pageLengths])
  */

  const repaginate = ({anchor})=> {
    if(!ref.current) return

    setLastShrinkRecalc(new Date())

  }

  React.useEffect(() => {
    //Kick off the recalculation process
    let timeout = setTimeout(() => {
      setLastShrinkRecalc(new Date())

      let nodes = [...ref.current.childNodes].filter(x => x.style)
      let lastNodeOnFirstPage;
      for(let i = 0; i < nodes.length; i++){
        if(nodes[i].getBoundingClientRect().x > nodes[0].getBoundingClientRect().x){
          lastNodeOnFirstPage = nodes[i-1]
          break
        }
      }
      
      let lastNodeOnFirstPageRect = lastNodeOnFirstPage.getBoundingClientRect()

      if(readerHeight - (lastNodeOnFirstPageRect.y + lastNodeOnFirstPage.height) > 10){
        //We have too many pages
        setTotalTextHeight(totalTextHeight - readerHeight)
        setLastShrinkRecalc(new Date())
      } else {
        //We've shrunk enough, so start expanding
        //setLastExpandRecalc(new Date())
      }

    }, 10)

    return () => { clearTimeout(timeout) }

  }, [lastShrinkRecalc])

  React.useEffect(() => {
    if(!ref.current) return

    //Now we need to determine if this node would be off the screen if we were on the last page...

    let timeout = setTimeout(() => {

    let pagesRemaining = totalPages() - page
    let pageWidth = readerWidth
    let marginLeft = outerRef.current.getBoundingClientRect().x

    let nodes = [...ref.current.childNodes].filter(x => x.style)
    let lastNode = nodes[nodes.length - 1]
    let lastNodeX = lastNode.getBoundingClientRect().x
    //console.log({lastNodeX, pagesRemaining, marginLeft, lastPageX: (pageWidth * pagesRemaining) + marginLeft})
    let lastNodeIsOffLastPage = lastNodeX > (pageWidth * pagesRemaining) + marginLeft + pageWidth

    if(lastNodeIsOffLastPage){
      setTotalTextHeight(
        totalTextHeight + readerHeight 
      )
      setLastExpandRecalc(new Date()) 
    }
  },10)

    return ()=>{clearTimeout(timeout)}

  }, [lastExpandRecalc])


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

  let totalPages = () => {
    let fudgeFactor = 2 // Column-count will nudge content onto the next page, so we need to add a little extra.  Not sure how to calculate this ahead of time.  5 extra pages should be plenty...
    return Math.floor(totalTextHeight / readerHeight) + fudgeFactor
  }
  
  let stuff = content.map((x, i) => {
                //console.log(x)
                if (typeof (x) == "string")
                  return <ReactMarkdown key={i}>{x}</ReactMarkdown>

                if (typeof (x) == "function")
                  return x({ repaginate })

                return x
              })

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
          {totalTextHeight == undefined ?
            //Put it in a big long div to calculate the pages
            <div ref={pageCalcDivRef} >
              Calculating...
              {stuff}
            </div> :
            //Then put it in the fancy animated reader
            <animated.div ref={ref} style={{
              overflow: "hidden",
              height: readerHeight,
              width: (totalPages()*100)+"%",
              columnCount: totalPages(),
              //width: (pageLengths.length * 100) + "%",
              //columnCount: pageLengths.length,
              ...animatedPageMarginOffsetProps,
            }} >
              {stuff}
            </animated.div>
          }
          <Box style={
            {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderTop: "1px solid gray",
              padding: 5
            }}>
            <SimplePagination count={totalPages()}
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