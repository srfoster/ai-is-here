
/*TODO

  * Authentication
     * https://aws.amazon.com/blogs/security/use-the-hosted-ui-or-create-a-custom-ui-in-amazon-cognito/
     * 
     - Authentication url works: https://ai-is-here.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=2vs918871e1lh19ump5oblk25v&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fsrfoster.github.io%2Fai-is-here%2F
     - Directs back to:  https://srfoster.github.io/ai-is-here/#id_token=<<>>&access_token=<<>>&expires_in=3600&token_type=Bearer
     - Need to store this in local storage, send it along with lambda requests
     - Need to check it on the "backend" along with available credits
     - Update credits when used
     - Send back error message when out of credits
     - Decide on how much to give for free 
  * Add history push (links to sections), 
  * Chapter 1
    - On Reading (speed and cost)
  * Cover page: "Praise for..."
  * Bugs with customization
    - Prefs don't update until refresh.  Need to propagate state or use context
    - Consider making customized text styled slightly differently
    - Fix the flashing
    - Can't click footnote links
  * Another section showing an edgier use of AI (to censor and rewrite certain things accoring to overarching dystopian worldviews...  Flat earth.  Racism.  Alt-right.  Newspeak.)  
  * Missing footnotes  
  * Demo ideas: 
    - Flash card app embedded
    - English to code to UI?  Make buttons and stuff?
*/

import * as React from 'react';
import './App.css';
import { CreditStringContext, OutOfCreditsIfOutOfCredits, useCheckCredits } from './useGpt';
import { EReader} from './EReader';
import { Introduction,  Chapter1, Acknowledgements, } from './Sections';
import { Tutor, TutorManager, ChildKeyManager } from './Tutor';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useLocation,
  HashRouter as Router,
  Routes,
  Route,
  Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, Container,Typography } from '@mui/material';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocalStorage } from 'react-use';

function MainAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{color: "white"}}>Home</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/bots" style={{color: "white"}}>Bots</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/keys" style={{color: "white"}}>Keys</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

let fullText = [
  ...Introduction, 
  ...Chapter1,
  Acknowledgements
]

let footnotes = {
  "bigger-context-window": `I say this knowing full well that OpenAI is already offering (for a steep price tag) a model with a [context-window of 32,000 words](https://community.openai.com/t/it-looks-like-gpt-4-32k-is-rolling-out/194615/3).  Will this solve the incoherence problem?  Maybe.  But I doubt it.`,
  "ai-informal": `By "AI," I mean what is referred to as a "transformer" -- the technical term for the dominant neural network architecture for natural language processing and text generation.  In fact, it's the T in ChatGPT.  We'll get to transformers later.  Until then, I'll use the coloquial term "AI" because this book is intended to be approachable to a non-technical audience.`,
  "homework-for-my-students": `If you're one of my students, then (as you probably already know) each benchmark is assigned as homework.  Send me your results!`,
  "my-grandfathers-thesis": `You can:`,
  "change-is-hard": `You can:`,
  "hallucinations": `For more information, I'd recommend [the wikipedia article on AI hallucinations](https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)).`,
  "context-window": `You can:`,
  "domestication-references": `
* **"Guns, Germs, and Steel: The Fates of Human Societies"** by Jared Diamond.  Diamond's Pulitzer-winning work argues that environmental factors, including the availability and domestication of animals, played a vital role in the uneven distribution of global resources and power.
* **"The Horse, the Wheel, and Language: How Bronze-Age Riders from the Eurasian Steppes Shaped the Modern World"** by David W. Anthony. This book discusses the domestication of horses and the role they played in the spread of language, culture, and technology from the Eurasian steppes.
* **"The Dog: A Natural History"** by Ádám Miklósi. While focusing mainly on the evolution and behavior of dogs, this book also touches on the profound effects that the domestication of dogs had on human societies.`,
  "computer-is-a-fad": `See the 1985 article called [The Executive Computer](https://www.nytimes.com/1985/12/08/business/the-executive-computer.html)
  `,
  "contact-me": `You can:
* Open a [GitHub issue](https://github.com/srfoster/ai-is-here/issues)
* Or email me: [stephen@thoughtstem.com](mailto:stephen@thoughtstem.com)`,
  "attention-is-all-you-need": "You can find the full paper [here](https://arxiv.org/abs/1706.03762).",
  "compulsory-education-ages": `This differs from state to state but begins between ages 5 and 8 and ends between ages 16 and 18.  See [here for details by state](https://nces.ed.gov/programs/statereform/tab5_1.asp).`,
  "per-word": "Technically, they charge 'per token', which includes partial words.  But I'll say 'per word' for simplicity.",
  "student-signup": "If you're one of my students, you **are** required to do this.  You will not be able to complete the homework for my class if you don't sign up."
}

function Home() {
  return (
    <Container maxWidth="sm" >
      <Typography pt={1} style={{ textAlign: "center" }} component="h1" variant="h2">AI for Education</Typography>

      <OutOfCreditsIfOutOfCredits afterRefresh={()=>{window.location.reload()}} />

      <HomePageTile title="Automated Tutor">
       <p>Configurable AI tutoring bots.
            Click <Link to="/bots">here</Link>.</p>
      </HomePageTile>

      <HomePageTile title="Book">
       <p>I've written part of a sample textbook. 
            Click <Link to="/book">here</Link> to start reading.</p>
      </HomePageTile>
    </Container>
  ) 
}

function HomePageTile({title, children}) {
  return (
    <Card>
      <CardHeader title={title}></CardHeader> 
      <CardContent> 
        {children}
      </CardContent>
    </Card>
  )
}

function App() {

  let [creditString, setCreditString] = useLocalStorage("credit-string", "")

  let {remainingCredits, 
       refreshCredits} = useCheckCredits(creditString)

  return (
    <>
      <CreditStringContext.Provider value={{creditString, 
        setCreditString,
        remainingCredits,
        refreshCredits}}>
        <Router>
          <MainAppBar />
          <br/>
          <Routes>
            <Route path="/book" element={
              <EReader content={fullText} footnotes={footnotes} />
            }>
            </Route>
            <Route path="/bots" element={
              <TutorManager />
            }>
            </Route>
            <Route path="/keys" element={
              <ChildKeyManager />
            }>
            </Route>
            <Route path="/bots/:documentId"
              element={
                <Tutor />
              }
            >
            </Route>
            <Route path="*" element={
              <Home />
            }>
            </Route>
          </Routes>
        </Router>
      </CreditStringContext.Provider>
    </>
  );
}

export default App;
