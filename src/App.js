import * as React from 'react';
import './App.css';
import { LoginWidget, CreditStringContext, useCheckCredits } from './useGpt';
import { EReader } from './EReader';
import { Introduction, Chapter1, Acknowledgements } from './Sections';
import { Conversation, Tutor, TutorManager, ChildKeyManager } from './Tutor';
import { 
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useParams
} from 'react-router-dom';
import { Container, Typography, CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import { useLocalStorage } from 'react-use';

import { Home } from './Pages/Home';
import resourcesData from './data/resources.json';
import authorsData from './data/authors.json';
import Logo from './Components/Logo'; // Import the Logo component

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Light blue
    },
    secondary: {
      main: '#f48fb1', // Pink
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Slightly lighter for cards
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b0bec5', // Light gray text
    },
  },
});

function MainAppBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>Home</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/bots" style={{ color: "white", textDecoration: "none" }}>Bots</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/keys" style={{ color: "white", textDecoration: "none" }}>Keys</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

function ResourcePage() {
  const { slug } = useParams();
  const resource = resourcesData.find((res) => res.slug === slug);

  if (!resource) {
    return <p>Resource not found.</p>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">{resource.title}</Typography>
      <Typography variant="subtitle1">{resource.description}</Typography>
      <Typography variant="body1">{resource.content}</Typography>
    </Container>
  );
}

function AuthorPage() {
  const { slug } = useParams();
  const author = authorsData.find((auth) => auth.slug === slug);

  if (!author) {
    return <p>Author not found.</p>;
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4">{author.name}</Typography>
      <img src={author.avatar} alt={author.name} style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
      <Typography variant="body1">{author.bio}</Typography>
      <Typography variant="body2">{author.homepageContent}</Typography>
    </Container>
  );
}

let fullText = [
  ...Introduction,
  ...Chapter1,
  Acknowledgements
];

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
};

function App() {
  let [creditString, setCreditString] = useLocalStorage("credit-string", "");

  let { remainingCredits, refreshCredits } = useCheckCredits(creditString);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CreditStringContext.Provider value={{
        creditString,
        setCreditString,
        remainingCredits,
        refreshCredits
      }}>
        <Router>
          <br />

          <Container maxWidth="sm">
            <Logo />
          </Container>
          <br/>

          <Routes>
            <Route path="/book" element={
              <>
                <MainAppBar />
                <EReader content={fullText} footnotes={footnotes} />
              </>
            }>
            </Route>
            <Route path="/bots" element={
              <>
                <MainAppBar />
                <TutorManager />
              </>
            }>
            </Route>
            <Route path="/keys" element={
              <>
                <MainAppBar />
                <ChildKeyManager />
              </>
            }>
            </Route>
            <Route path="/bots/:documentId"
              element={
                <>
                  <MainAppBar />
                  <Tutor />
                </>
              }
            >
            </Route>
            <Route path="/conversations/:botId/:conversationId"
              element={
                <>
                  <MainAppBar />
                  <Conversation />
                </>
              }
            >
            </Route>
            <Route path="/login"
              element={
                <Container maxWidth="sm" >
                  <LoginWidget />
                </Container>
              }
            >
            </Route>
            <Route path="/pages/:slug" element={<ResourcePage />} />
            <Route path="/authors/:slug" element={<AuthorPage />} />
            <Route path="*" element={
              <Home />
            }>
            </Route>
          </Routes>
        </Router>
      </CreditStringContext.Provider>
    </ThemeProvider>
  );
}

export default App;
