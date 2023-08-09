
/*TODO
  * Fix the flashing
  * Missing footnotes  
  * Chapter 1
*/

import * as React from 'react';
import './App.css';
import Typography from '@mui/material/Typography';
import { EReader, Benchmark, ClickToReveal, GPT} from './EReader';

let fullText = [
  <Typography pt={1} style={{ textAlign: "center" }} component="h1" variant="h2">Education and AI</Typography>,

  <Typography pt={1} style={{ textAlign: "center" }} component="h2" variant="h5">By Stephen R. Foster, Ph.D. </Typography>,

  `
### Introduction

#### 0.

This is a book about AI and education.  I wrote it for my present and future students and for my fellow educators.  But I hope it will be useful to anyone who is interested in the future of knowledge work.  It's a wild world.

#### 1.

The impact of AI-assisted writing is best understood in context of two other famous technological arrivals – of machines in general and of computers in particular.

Once upon a time, as the story goes, labor was something done exclusively by human hands.  Then came the machines – not all of a sudden, but pretty quickly once they got going.  The Luddites of the early 1800s did try to resist, managing to burn down a few factories.  But in the end, the machines won.  

Next (after much economic upheaval and a couple of big wars) came a very special kind of machine called the computer.  Unlike your run-of-the-mill machine, the computer could do something very important – something that had previously been a human-only form of labor: namely, **math.**

To make a long story short, the digital revolution proved that a lot of cool stuff actually boiled down to "really fast math on binary numbers" – everything from putting pixels on your screen, to reading the mouse and keyboard, to making the internet work, to *Fortnite*.  Bit by bit (byte by byte), the computers won.

Now, [AI](/#/footnote/ai-informal) has arrived.  And by "arrived" – I mean that AI can, at times, perform what was once believed to be another human-only kind of labor: namely, **writing.**  AI-writing isn't perfect, and it can't write everything – but admit it, dear reader: 

> *You know in your heart that some parts of this very text might have been AI-generated, and you can never be sure exactly which ones.*

Even if I could somehow convince you I wrote this myself ("Look, Ma!  No ChatGPT!"), three inconvenient truths remain:

* Much writing can be automated.
* New types of automation tend to change the nature of work.
* When the nature of work changes, systems of education must adapt.

Lately, as an educator and writer (of much software and even a few books), I've begun using AI in my lectures and professional writing.  The more it increases my productivity, the more I find myself mulling heavy questions as I lay awake at night.  (Who will lose their jobs?  If writing can be automated, what else can?  And how must education adapt?)

What follows are the answers I've found, prepared in a way that I hope will be useful to other writers, educators, students (including mine), and even just the average worrier. 

#### 2.

I understand that these topics can be heavy.  How about a quick break?

If you've made it this far, then I want to let you in on a secret.  Click below to find out what it is!`,

  (extraProps) => <ClickToReveal
    contents={[
      `This book is interactive (so be on the lookout for Easter eggs).`,
      `You found an Easter Egg!`,
      `Okay, you can stop clicking now.  I promise there are no more Easter eggs.`
    ]}
    {...extraProps}
  />,

`#### 3.

In the conversations around AI and education, many are quick to point out one of the big weaknesses of AI-writing, namely [its tendency to hallucinate and lie](/#/footnote/hallucinations).  It's true: You can't trust everything an AI says.  And it's true that educators and students should learn to look critically at the output of AI-writing tools, cross-checking as necessary.

On the other hand, if you're looking for some consolation that human intelligence has a secure place in the future of knowledge work, I would urge you not to make hallucinations the AI flaw in which you take comfort.  Why?  Because even if we allow (for the sake of argument) that AI hallucinations are here to stay, a future in which the last bastion of human intelligence is to "fact check" AI-generated output is one where humans are stuck playing second fiddle to a the creative output of machines.  Personally, I aspire to something better.

Rather, of the two big flaws in AI-writing (hallucinations and incoherence), I take more consolation in the second.  To define incoherence breifly:

> The more text an AI generates, the less coherent it becomes.

Here, for example, is a benchmark that I've been using to track the coherence of AI-writing tools:
`,

  (extraProps) => <Benchmark
     name="Write a Novel" 
     goal="Get an AI to write a novel that I'd actually want to read."
     modelsTested="GPT 3.5 and GPT 4.0"
     result="FAILED"
      {...extraProps}
  />,

`I'll admit, this benchmark might seem unfair at first glance.  Maybe I don't even like novels.  Maybe I have unreasonably high standards.  Who am I to appoint myself judge?  Look, these are valid concerns.   But if I may:

* I'm not subjecting AI to harsher criticism than human writers have been since the birth of writing (3400 BCE).  Writing is good if readers like it.
* Moreover, I'm not publishing these benchmarks in hopes that you'll accept my results; rather, I'm asking you to evaluate such benchmarks for yourself.

In other words, when you see a benchmark like the one above, [please](/#/footnote/homework-for-my-students) take a moment to open up your favorite AI-writing tool and use whatever clever prompting tricks you'd like.  In particular, are your results different from mine?  Partly, this is for you (dear reader) – much like the exercises in a mathematics textbook, serving to imbue you with new intuitions about the subject.

But partly, it's for me and for your fellow human readers: We need your help maintaining this living document.  AI-writing tools and the techniques for prompting them are advancing.  So please [get in touch](/#/footnote/contact-me) if you ever find that your results differ from mine.

For the above benchmark, all you have to do is send me the output of your awesome AI-written novel along with a prompting process I can replicate.  If your novel (or one that pops out from your process) seems enjoyable to me, I'll update the benchmark, rewrite this section, and list you under the **Acknowledgements** section at the end of this book.  Pinky swear! 

This is a living document, as any meaningful text about a moving target must inevitably be.  What I mean is that as AI-writing tools improve, I'll update the text to reflect the new reality.

We'll look at a lot of benchmarks in the coming pages – some easy, some hard, some passed, some failed – all of them relevant to students, educators, and humanity in general.  The reason I started with the novel-writing benchmark is that it illustrates the incoherence problem and shows us something important about the underlying technology of AI-writing – namely that the number of words a model like GPT 4.0 can "think about" is 8,000.  This is also known as its "context window."

Want to test the context window for yourself?  Here's a benchmark for that:`,

  (extraProps) => <Benchmark
     name="Context Window" 
     goal="Get an AI to remember your name after pasting in 8,000 words of nonsense."
     modelsTested="GPT 3.5 and GPT 4.0"
     result="FAILED"
      {...extraProps}
  />

,`I mention this because it gives a sense of why the novel-writing benchmark is so hard for AI-writing tools.  To put the 8,000-word context window into perspective, the first Harry Potter novel is about 77,000 words.  An AI-writing tool that attempts to write such a book will, after the first 8000 words, begin to forget what it previously wrote.

It's an open question whether an AI model's context window can be circumvented (either now or in the future). Optimists would point out that human authors don't keep every previous word in mind while writing new ones.  Thus, perhaps a clever prompter could simulate a human writing process by continually supplying the AI with a running 500-word "summary-thus-far," while asking it to generate 7,500 words at a time.  Do this 10 times and... *bam!* – you have a novel!

If you get good results with this methodology, please get in touch, so I can update the benchmark.  But please know: I've poured many hours into this problem, tried various such tricks, and generated nothing but trash.  (More on this later – because sometimes even trash can be instructive.)

I'll close this section by mentioning a strange internet phenomenon I've noticed:

* YouTube is filling up with videos about "How to Write a Book with ChatGPT"? 
* Everything I've generated with these techniques sucks.

Again, maybe it's me.  Or maybe (just maybe) the labor of authoring book-length works can't be fully automated.  My current assumption is that it won't be ([not for a long time, if ever](/#/footnote/bigger-context-window)).  In fact, I've based a lot of what follows on this assumption.
This means that if I'm wrong, then two things will become instantly true:

* I'll have to re-write much of this book.
* I won't be the one doing the work.

#### 4.

With one unfair benchmark out of the way, let's balance things out with a benchmark where AI performs extremely well -- namely translation.  For example, here's a benchmark that can be passed with flying colors:`,

  (extraProps) => <Benchmark
      name="Translate a Sentence to a New Language"
      goal="Get an AI to translate a novel from English to Spanish."
      modelsTested="GPT 3.5 and GPT 4.0" 
      result="PASSED"
      />

,
`In fact machine translation is the OG benchmark.  Back in 2017, the ground-breaking "transformer" neural network archetecture was introduced in a paper called ["Attention Is All You Need"](/#/footnote/attention-is-all-you-need).  This paper was a breakthrough in the field of natural language processing (NLP) because it showed that AI (using transformers) could translate between languages better than techniques like recurrent neural networks, which had been used for decades.  As it turned out, the same technology that performed so well at translation also performed well at many other benchmarks that boil down to "say this, but different." As a quick demonstration, here's a sentence I wrote earlier:

> Next (after much economic upheaval and a couple of big wars) came a very special kind of machine called the computer. 

Obviously, GPT 4.0 can translate this sentence to Spanish:

> Después (tras muchos trastornos económicos y un par de grandes guerras) llegó un tipo de máquina muy especial llamada ordenador.

And of course, pirate speak is an easy "say this, but different" benchmark for GPT 4.0:

> Next, matey (after a whole mess o' economic squalls and a pair of hearty wars), there came into bein' a special kind o' contraption, named by folks as the 'computer'. Arr! 

From an educational perspective, though, two other kinds of transformation matter -- ones that reduce and ones that increase the amount of information.  For example, here's what happens when I ask GPT 4.0 to rewrite my sentence in as few words as possible:

> After economic strife and wars, the computer came.

By contrast, here's what happens when I ask GPT 4.0 to expand on the sentence, adding historical details:

> Following a period characterized by considerable economic turbulence, including the Great Depression and the economic aftermath of two major world conflicts - World War I and II - a revolutionary invention was introduced: the computer. This technological breakthrough, which emerged in the mid-20th century, marked a significant turning point in human history, with its roots in devices like the British Bombe and the American ENIAC, designed during World War II for code-breaking and artillery trajectory calculations, respectively. 

What this means is that writers (both dead and alive) now have the ability to reach not just the audience they are writing to -- but also: Spanish speakers, pirates, history buffs, and people who like short sentences.  

I think this scares some educators because part of our job is to translate texts -- not necessarily into new languages, but into a form comprehensible to our students.  And this is why, within a few short years following the ground-breaking 2017 paper, the transformer is not just transforming text, but also education as we know it.

AI might not be able to write good books, but it can rewrite them just fine.  And it can do this in a way that is tailored to the needs of individual students.

I mentioned earlier:

* Much writing can be automated.
* New types of automation tend to change the nature of work.
* When work changes, systems of education must adapt.

But education is also a form of work.  And writing (or rewriting, or transforming, or whatever word you'd like) is a big part of educational knowledge work.  With the automation of writing, education must adapt in two ways: to the changing nature of external work, and to the changing nature of its own internal work.

I think we can do it.  But I also think it's not going to be easy, partly because making quick adaptations has [historically been a weakness of education systems](/#/footnote/my-grandfathers-thesis), and partly because making quick adaptations is [psychologically difficult for humans in general](/#/footnote/change-is-hard).  I think it's going to be difficult for educators and for students alike and that many in both groups will resist.  But in the end, AI will win -- just as machines and computers won their respective revolutions. 

The nice thing is that AI winning doesn't mean education losing.  
AI's victory *can* be a victory for education as well.  But this is by no means guaranteed.  

#### 5.

I'll close the introduction of this book by summarizing: 

1. AI is here, and things are going to change
2. AI has trouble coherently writing long texts, but it can translate them just fine

We'll pick up these threads in the rest of the book and, hopefully, carve out a solid understanding of what the future of knowledge work will look like -- along with some clarity about what we need to do to prepare.

#### 6.

Oh, and one last thing for the introduction.  As you can see below, this book has GPT built into it.  We'll be using this to explore AI's ability to power interactive textbooks.  As the saying goes, "The best way to predict the future is to build it." 

`,
 (extraProps) => <GPT prompt="If everything a computer does is actually just 'really fast math on binary numbers,' is AI text generation really just math underneath the hood?" {...extraProps}/> 
  ,`

##
##
##
##

### Chapter 1: The Future of Learning

#### 1.

In this book, we'll make a distinction between learning and education.

* **Learning** is a natural process that happens in the brain.
* **Education** is a system of institutions and practices that are designed to facilitate learning.

Education is a human invention; learning is not.  Likewise, although many animals learn, only humans build education systems.  In fact, we even sometimes build them for other animals.  For example, we adopt dogs, train them to sit, stay, roll over, etc.  We train horses to be saddled, wear shoes, and carry loads.  We even teach dophins to do military operations.  There are various techniques for accomplishing these aims, and they have been refined over the course of human history.  But the basic idea is the same: we build an environment around the animal, carefully control the behaviors in which they engage, and the outcome is a trained animal.

I would [not be the first to argue](/#/footnote/domestication-references) that these systems for domesticating and training animals were instrumental to our success as a species.  A trained animal is a powerful tool.  Or to put it another way: an animal whose brain has been rewired to something useful is a powerful tool.  

Admittedly, it might seem strange to start off a conversation about education by talking about animal training.  The systems we build around untrained animals and the systems we build around not-yet-educated citizens are, after all, only superficially similar: we build an environment, carefully control behaviors, and the outcome is a brain with key differences from the one we started with.  

The key difference, of course, is that humans are (ideally) willing participants in the whole process.  Whereas not much work goes into convincing a dog, horse, or dolphin that the outcome of getting trained is in its best interest, we do make an effort to this effect with humans.  This takes many forms but is most classically illustrated by our general willingness to answer the never-ending stream of questions that boil down to: "When am I ever going to use this?"  

I get asked this on a daily basis, and I always answer.  It's part of my job.

Consent in edcuation is a dicey topic though -- because at the end of the day, education in most first world countries is compusory.  You can't really opt out. 

I have vivid memories of learning this first-hand.  In fact, I hated school from the moment I arrived.  As a child with crippling anxiety and a penchant for daydreaming, I was constantly in trouble for not paying attention, for not doing my homework, for not following directions, and for not being able to sit still.  Also, having a minor disability in my hands, I experienced excruciating cramps when writing by hand -- a pain that 1) I was forced to engage despite my protests, and for which 2) I recieved no immediate results from aside from my own barely legible pencil scrawls and poor grades for penmanship.

This was in the early 1990s so if I'd asked "When am I ever going to use this?" I'm sure I would have been told that penmanship was still quite important for getting a job.  (Less than a decade earlier, the New York Times was [claiming that the personal computer might be a fad](/#/footnote/computer-is-a-fad).)  Learning to write by hand was something that well-meaning educators of the time still believed to be critical.  This therefore overrode my lack of consent and justified subjecting a child to physical pain.

When I share this story with educators today, they are quick to point out that this is an example of education "done wrong" -- that my disabilities ought to have been better supported.  They're right, and I'm sure that in many places education is "done right."  But the point remains: Early education is non-consensual.  It's just more obvious when it's done wrong.  If the system doesn't work for you, you're out of luck.  As a child, you don't have a say in the matter and don't have the vocabulary to critique the system.

But here we are, on the cusp of a future in which a one-size-fits-all education might soon be as antiquated as penmanship classes.  Who knows?  Maybe a universally consensual education system is on the horizon too.`,

 (extraProps) => <GPT prompt="Beginning with pre-history, give a brief history of human education systems.  Use short bullet points." {...extraProps}/> 

,` 2.  

<<Can this book escape the one-size-fits-all model?  Let's try it.  Goal: Learn something -- but you get to pick what it is.>>

<<Education systems are powerful tools.  An educated workforce/citizenship is one of those rare things that economy and state agree upon.  Competition with China (or Russia in decades past) is as much a force on the American education system as Microsoft and Amazon's need to have future software engineers (e.g., who funds code.org??)>>


---



---

**That's all for now!**

If you'd like to be notified when I update this book, please [email me](mailto:stephen@thoughtstem.com) and I'll add you to my mailing list.  Althernatively, you can subscribe to the [GitHub repo](https://github.com/srfoster/ai-is-here), although I can't promise that I'll only push updates to the book.  I'm a programmer, so I'll be pushing code to the repo as well.

**Acknolwedgements**

Special thanks to the following people for their contributions to this book:

* **Lindsey Handley**, for being generally awesome and for helping me edit this book.


  `]

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
