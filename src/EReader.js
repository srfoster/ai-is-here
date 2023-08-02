/*TODO
  * Extract eReader component
  * Footnotes as modals
  * More content!
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
import Stack from '@mui/material/Stack';
import '@fontsource/roboto/400.css';

import {useLocalStorage} from 'react-use'
import Confetti from 'react-confetti'
import {
  useWindowSize,
} from '@react-hook/window-size'
import { useSwipeable } from "react-swipeable";

import Modal from '@mui/material/Modal';

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
  let [pageLengths, setPageLengths] = React.useState([])
  let [lastRecalc, setLastRecalc] = React.useState(new Date())
  let [showFootnote, setShowFootnote] = React.useState(null)
  const [windowWidth, windowHeight] = useWindowSize()

  const ref = React.useRef(null);

  const nextPage = () => {
    if (page < pageLengths.length)
      setPage(page + 1)
  }

  const prevPage = () => {
    if (page > 1)
      setPage(page - 1)
  }

  const swipeHandlers = useSwipeable({
    onSwipedRight: (eventData) => prevPage(),
    onSwipedLeft: (eventData) => nextPage(),
  });


    React.useEffect(() => {
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
  },[])

  //Get off the ground: Calculate page lengths
  React.useEffect(() => {
    if (ref.current) {
      let nodes = [...ref.current.childNodes].filter(x => x.style)
      let parentRect = ref.current.getBoundingClientRect()

      //Hide all elements
      for(let i = 0; i < nodes.length; i++) {
        let element = nodes[i]
        element.style.display = "block"
        element.style.visibility = "hidden"
      }

      let lengths = []
      let numElementsOnCurrentPage = 0 
      let currentPagePixelHeight = 0 
      let maxPagePixelHeight = parentRect.height 

      //console.log("Total elements", nodes.length)

      let fuzz = 20 // Keeps things from being clipped (I guess this is currently a magic number that equals the top padding of the text container.  Should de-magic it.)

      let lastElement;
      for(let i = 0; i < nodes.length; i++) {
        let element = nodes[i]

        let rect = element.getBoundingClientRect()
        let currentElementPixelHeight = rect.height 

        //console.log("Considering",element)
        if (!shouldStartNewPage(element, lastElement, i, 4) && currentPagePixelHeight + currentElementPixelHeight <= maxPagePixelHeight - fuzz) {
          //console.log("Adding",element)
          numElementsOnCurrentPage += 1
          currentPagePixelHeight += currentElementPixelHeight
        } else {
          //console.log("Heights", currentPagePixelHeight + currentElementPixelHeight, maxPagePixelHeight)
          lengths.push(numElementsOnCurrentPage)
          numElementsOnCurrentPage = 0
          currentPagePixelHeight = 0
          lastElement = element;

          //console.log("**********NEXT PAGE**********")
          i--; //Current element will be on next page.  Process it again.
        }
      }

      if(numElementsOnCurrentPage > 0)
        lengths.push(numElementsOnCurrentPage)

      //console.log("Elements assigned to pages", lengths.reduce((sum, x) => sum + x, 0))
      //console.log("Page lengths", lengths)
      setPageLengths(lengths)
    }
  }, [lastRecalc]);


  React.useEffect(() => {
    if(!pageLengths) return

    if (ref.current) {
      let nodes = [...ref.current.childNodes].filter(x => x.style)

      let pageIndex = page - 1

      let startElement; 

      startElement = pageLengths.slice(0, pageIndex).reduce((sum, x) => sum + x, 0) 

      let endElement
      endElement = startElement + pageLengths[pageIndex]

      //console.log("page turn", pageIndex, startElement, endElement, pageLengths)

      //Hide everything before the page
      for (let i = 0; i < startElement; i++) {
        let element = nodes[i]
        //console.log("Hiding", i,  element)
        element.style.display = "none"
        element.style.visibility = "hidden"
      }

      //Show everything on the page
      for (let i = startElement; i < endElement; i++) {
        let element = nodes[i]
        //console.log("Showing", i, element)

        element.style.display = "block"
        element.style.visibility = "visible"
      }

      //Hide everything after the page
      for (let i = endElement; i < nodes.length; i++) {
        let element = nodes[i]
        //console.log("Hiding", i, element)

        element.style.display = "none"
        element.style.visibility = "hidden"
      }
    }
  }, [pageLengths, page])

  const repaginate = ()=> setLastRecalc(new Date()) 

  React.useEffect(() => {
     repaginate()
  }, [windowWidth, windowHeight])

  return (
    <>
      <Container maxWidth="sm"
          {...swipeHandlers} 
      >
        <Box style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column"}}>
          <Box ref={ref}  style={{
            flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", display: "block", width: "100%",
            whiteSpace: "unset",
            marginTop: 20,
          }}
          
          >
            {content.map(
              (x, i) => {
                //console.log(x)
                if (typeof (x) == "string")
                  return <ReactMarkdown key={i}>{x}</ReactMarkdown>
                
                if (typeof (x) == "function")
                  return x({ repaginate })
                
                return x
              })}
          </Box>
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

let SimplePagination = ({ count, page, prev, next }) => {
  return <Stack direction="row">
    <Button onClick={ prev }>Prev</Button>
    <Button disabled>Page {page} of { count }</Button>
    <Button onClick={ next }>Next</Button>
  </Stack>
}

let shouldStartNewPage = (element, lastElement, elementIndex, ignoreElements) => {
  if(elementIndex < ignoreElements) return false //Don't start a new page for the first few elements (e.g. title, author, etc.
  if(element == lastElement) return false //Don't start a new page if we're seeing the element again
  if(elementIndex == 0) return false //Otherwise we never start the book...

  return element.tagName == "H2" || element.tagName == "H3" || element.tagName == "H4" || element.tagName == "H5" || element.tagName == "H6" 
}

export let ClickToReveal = ({contents, repaginate}) => {
  let [opened, setOpened] = React.useState(false)
  let [openedCount, setOpenedCount] = React.useState(0)
  return <Card style={{marginBottom: 15}}>
    <CardContent>
      <Button onClick={() => { 
        setOpened(!opened); 
        if(!opened)
          setOpenedCount(openedCount + 1)
        repaginate() 
        }}>
        Press this button
      </Button>
      {opened && <>
        <Confetti
            recycle={false}
            numberOfPieces={200}
        />
        <Typography>{contents[(openedCount-1)%contents.length]}</Typography>
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
            { toShow }
        </Box>
      </Modal>
    </>
  );
}


export let Benchmark = ({ name, goal, modelsTested, result }) => {
  return <Card style={{marginBottom: 20}}>
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

