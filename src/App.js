
/*TODO
  * More content!
*/

import * as React from 'react';
import './App.css';
import Typography from '@mui/material/Typography';
import { EReader, Benchmark, ClickToReveal, Footnote} from './EReader';

let fullText = [
  <Typography pt={1} style={{ textAlign: "center" }} component="h1" variant="h2">Education and AI</Typography>,

  <Typography pt={1} style={{ textAlign: "center" }} component="h2" variant="h5">By Stephen R. Foster, Ph.D. </Typography>,

  `
### Introduction

#### 1.

The impact of AI-assisted writing is best understood in context of two other famous technological arrivals – of machines in general and of computers in particular.

Once upon a time, as the story goes, labor was something done exclusively by human hands.  Then came the machines – not all of a sudden, but pretty quickly once they got going.  The Luddites of the early 1800s did try to resist, managing to burn down a few factories.  But in the end, the machines won.  

Next (after much economic upheaval and a couple of big wars) came a very special kind of machine called the computer.  Unlike your run-of-the-mill machine, the computer could do something very important – something that had previously been a human-only form of labor: namely, math.  

To make a long story short, the "digital revolution" showed that a lot of cool stuff actually boiled down to "really fast math" – everything from putting pixels on your screen, to reading the mouse and keyboard, to making the internet work, to *Fortnite*.  Bit by bit (byte by byte), the computers won.

Now, [AI](/#/footnote/ai-informal) has arrived.  And by "arrived" – I mean that AI can, at times, perform what was once believed to be another human-only kind of labor: namely, writing.  AI-writing isn't perfect, and it can't write everything – but admit it, dear reader: 

> *You know in your heart that some parts of this very text might have been AI-generated, and you can never be sure exactly which ones.*

Even if I could somehow convince you I wrote this myself ("Look, Ma!  No ChatGPT!"), three inconvenient truths remain:

* Much writing can be automated.
* New types of automation tend to change the nature of work.
* When work changes, systems of education must adapt.

Lately, as an educator and writer (of much software and even a few books), I've begun using AI in my lectures and professional writing.  The more it increases my productivity, the more I find myself mulling certain questions as I lay awake at night.  (Who will lose their jobs?  If writing can be automated, what else can?  And how must education adapt?)

What follows are the answers I've found, prepared in a way that I hope will be useful to other writers, educators, students (including mine), and even just the average worrier.  It's a wild world.

#### 2.

If you've made it this far, then I want to let you in on a secret.  Click below to find out what it is!`,

  (extraProps) => <ClickToReveal
    text={`Nice!  You clicked a button.  I just wanted you to know that this is more than a text document.  It's an interactive experience.  Stay tuned for more of that.`}
    {...extraProps}
  />,

`#### 3. 

Not only is this an interactive document.  It's also a living one, as any meaningful text about a moving target must inevitably be.  What I mean is that as AI-writing tools improve, I'll update the text to reflect the new reality.

Let me try to explain how by introducing what I'll refer to as a "benchmark." Since this is the first one, I'll try to make it fun (though admittedly very subjective).`,

  (extraProps) => <Benchmark
     name="Write a Novel" 
     goal="Get an AI to write a novel that I'd actually want to read."
     modelsTested="GPT 3.5 and GPT 4.0"
     result="FAILED (as of Jul 26, 2023)"
      {...extraProps}
  />,

`I'll admit, this benchmark might seem unfair at first glance.  Maybe I don't even like novels.  Maybe I have unreasonably high standards.  Who am I to appoint myself judge?  Look, these are valid concerns.   But if I may:

* On the one hand, I'm not subjecting AI to any more subjectivity than human writers have been subjected to since the birth of writing (3400 BCE).  Writing is good if readers like it.
* On the other hand, I'm not publishing these benchmarks in hopes that you'll accept my results; rather, I'm asking you to evaluate the benchmarks for yourself.

In other words, when you see a benchmark, if you're so inclined, please take a moment to open up your favorite AI-writing tool and use whatever clever prompting tricks you'd like.  In particular, are your results different from mine?  Partly, this is for you (dear reader) – much like the exercises in a mathematics textbook, serving to imbue you with new intuitions about the subject.

But partly, it's for me and for your fellow readers: We need your help maintaining this living document.  AI-writing tools and the techniques for prompting them are advancing.  So please get in touch if you ever find that your results differ from mine.  All you have to do is send me the output of your awesome AI-written novel along with a prompting process I can replicate.  If your novel (or one that pops out from your process) seems enjoyable to me, I'll update the benchmark, rewrite this section, and make you a co-author.  Pinky swear! 

We'll look at a lot of benchmarks in the coming pages – some easy, some hard, some passed, some failed.  The reason I started with the novel-writing benchmark is that we'll use it momentarily to illustrate something important about the underlying technology of AI-writing – namely that the number of words GPT 4.0 can "think about" is 8,000.  For comparison, the first Harry Potter novel is about 77,000.  This means that the moment an AI tool writes 8000 words, it begins to forget its own words.

This is what makes the novel-writing benchmark so interesting – can the 8000-word "context window" be circumvented?  Optimists would point out here that JK Rowling likely doesn't keep every previous word in mind while she writes new ones.  Thus, perhaps a clever prompter could simulate a human writing process by continually supplying the AI with a running 500-word "summary-thus-far," while also asking it to generate 7,500 words.  Do this 10 times and… bam! – you have a novel!

If you get good results with this methodology, please get in touch, so I can update the benchmark.  But please know: I've poured many hours into this problem, tried various such methodologies, and generated nothing but trash.  (More on this later – because sometimes even trash can be instructive.)

I'll close this section by mentioning a strange internet phenomenon I've noticed:

* YouTube is filling up with videos about "How to Write a Book with ChatGPT"? 
* Everything I've generated with these techniques sucks.

Again, maybe it's me.  Or maybe (just maybe) the labor of book-writing can't be fully automated.  My current assumption is that it won't be for a long time.  If I'm wrong, then two things will become true:

* I'll have to re-write much of what follows.
* I won't be doing the work.

#### 3.

Test content

More test content

* A
* B
* C

The end
  `]

let footnotes = {
  "ai-informal": `By "AI," I mean what is referred to as a "transformer" -- the technical term for the dominant neural network architecture for natural language processing and generative AI.  We'll get to these later.  Until then, I'll use the coloquial term "AI" because this book is intended to be approachable to a non-technical audience.`
}

/*

<<Successful benchmarks:

Rewrite this in that form 
(BS/CS course list bullets…)
Language learning
Entertaining kids

Unsuccessful:

Writing fiction that doesn't suck…


Heuristics: 
If you can't check the work more quickly than doing the work, don't use AI

>>


*/

function App() {
  return (
    <>
      <EReader content={fullText} footnotes={footnotes} />
    </>
  );
}


export default App;
