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
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import '@fontsource/roboto/400.css';

import {useLocalStorage} from 'react-use'
import Confetti from 'react-confetti'
import {
  useWindowSize,
} from '@react-hook/window-size'
import { useSwipeable } from "react-swipeable";
import { PROPERTY_TYPES } from '@babel/types';

export function EReader({ content }) {
  let [page, setPage] = useLocalStorage("current-page",1)
  let [pageLengths, setPageLengths] = React.useState([])
  let [lastRecalc, setLastRecalc] = React.useState(new Date())
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

      for(let i = 0; i < nodes.length; i++) {
        let element = nodes[i]

        let rect = element.getBoundingClientRect()
        let currentElementPixelHeight = rect.height 

        //console.log("Considering",element)
        if (currentPagePixelHeight + currentElementPixelHeight <= maxPagePixelHeight - fuzz) {
          //console.log("Adding",element)
          numElementsOnCurrentPage += 1
          currentPagePixelHeight += currentElementPixelHeight
        } else {
          //console.log("Heights", currentPagePixelHeight + currentElementPixelHeight, maxPagePixelHeight)
          lengths.push(numElementsOnCurrentPage)
          numElementsOnCurrentPage = 0
          currentPagePixelHeight = 0

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

      </Container>
    </>
  );
}

let SimplePagination = ({ count, page, prev, next }) => {
//}
  return <Stack direction="row">
    <Button onClick={ prev }>Prev</Button>
    <Button disabled>Page {page} of { count }</Button>
    <Button onClick={ next }>Next</Button>
  </Stack>
}

export let ClickToReveal = ({text, repaginate}) => {
  let [clicked, setClicked] = React.useState(false)
  return <Card style={{marginBottom: 15}}>
    <CardContent>
      <Button onClick={() => { setClicked(!clicked); repaginate() }}>
        Press this button
      </Button>
      {clicked && <>
        <Confetti
            recycle={false}
            numberOfPieces={200}
        />
        <Typography>{text}</Typography>
      </>}
    </CardContent>
  </Card>
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

