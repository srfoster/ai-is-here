import * as React from 'react';
import { UsageContext, Benchmark, ClickToReveal, GPT, CustomizedText,GatedSection, AvatarSays, AVATARS, wordsToDollars, BookCard} from './EReader';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

let TitleAndAuthor = <>
  <Typography pt={1} style={{ textAlign: "center" }} component="h1" variant="h2">Education and AI</Typography>

  <Typography pt={1} style={{ textAlign: "center" }} component="h2" variant="h5">By Stephen R. Foster, Ph.D. </Typography>
</>

let FirstPage =
  <>
{TitleAndAuthor}
<ReactMarkdown>
  {`### Introduction

#### 0.

This is a book about AI and education.  I wrote it for my present and future students and for my fellow educators.  But I hope it will be useful to anyone interested in education now that AI is here.  It's a wild world.

#### 1.

The arrival of AI-assisted writing is best understood in the context of two other famous technological arrivals – of machines in general and of computers in particular.  Once upon a time, as the story goes, labor was something done exclusively by human hands.  Then came the factories – not all of a sudden, but pretty quickly once they got going.  The Luddites of the early 1800s did try to resist, managing to burn down a few of them.  But in the end, the factories won. 

Still, there were forms of human labor that were hard to mechanize.  

In the mid 1900s (after much economic upheaval and a couple of big wars) came the computer, which could do something that had previously been a human-only form of labor: namely, **math.** As it turns out, a lot of cool stuff boils down to "fast math on binary numbers" – everything from putting pixels on your screen, to reading the mouse and keyboard, to making the internet work, to *Fortnite*.  Bit by bit (byte by byte), the computers secured their place in history too.

Still, there were forms of human labor that were hard to mechanize.

Now, [AI](/#/footnote/ai-informal) has arrived.  And by "arrived" – I mean that AI can, at times, perform what was once believed to be another human-only kind of labor: namely, **writing.**  AI-writing isn't perfect, and it can't write everything – but admit it, dear reader: 

> *You know in your heart that some parts of this very text might have been AI-generated, and you can never be sure exactly which ones.*

Even if I could somehow convince you I wrote this myself ("Look, Ma!  No ChatGPT!"), three inconvenient truths remain:

* Much writing can be automated.
* New types of automation tend to change the nature of work.
* When the nature of work changes, systems of education must adapt.

Lately, as an educator and writer (of much software and even a few books), I've begun using AI in my lectures and professional writing.  The more it increases my productivity, the more I find myself mulling heavy questions as I lay awake at night.  (Who will lose their jobs?  And how must education adapt?)

In my quest to find answers and present them to others, I've ended up writing the textbook you're currently reading.  I firmly believe that AI in education is here to stay -- so I hope you'll take away from this book concrete ways of using AI to enhance your life, both as a student and as an educator.  I also hope you'll take away a deeper understanding of the big picture, including the ways in which AI will disrupt the nature of human labor and the world beyond our hallowed halls.`}</ReactMarkdown>
</>

let InteractivityDemo = <GatedSection>
  <ReactMarkdown>{`#### 2.

We're still in the introduction, but how about a quick break?  If you've made it this far, then I want to let you in on a secret.  Click below to find out!`}
    </ReactMarkdown>

  <ClickToReveal
    contents={[
      `This book is interactive (so be on the lookout for Easter eggs).`,
      `You found an Easter Egg!`,
      `Okay, you can stop clicking now.  I promise there are no more Easter eggs.`
    ]}
  />
  
  <ReactMarkdown>{`
  ##
  ##
  
  In fact, the intereactions in this book aren't just trivial ones.  I've built ChatGPT into it, and we'll use this to explore AI's ability to power interactive textbooks.  When you see a section like the one below, try clicking the "Ask GPT" button.`}
    </ReactMarkdown>
 <GPT prompt="If everything a computer does is just math on binary numbers, can AI-writing be considered math-powered language production?" /> 
  </GatedSection>


let AIVoicesDemo = <GatedSection>
  <ReactMarkdown>{`#### 3.
  
  Also, let's remember that models like GPT are capable of taking on various "roles" or "voices" when they produce text.   
  `}</ReactMarkdown>
  <AvatarSays avatar={AVATARS.teacher1} say="Hi!  I'm a teacher." />
  <AvatarSays avatar={AVATARS.student1} say="Hi!  I'm a student." direction={"row-reverse"} />
  <ReactMarkdown>{`When this is the case, I'll denote it with avatars like the ones above, so you'll know how to interpret the text being generated.`}</ReactMarkdown>
  
  <GPT
    avatar={AVATARS.teacher1}
    hiddenPrompt="Answer this question as a teacher would."
    prompt="If everything a computer does is just math on binary numbers, can AI-writing be considered math-powered language production?" /> 

  <GPT
    avatar={AVATARS.student1}
    hiddenPrompt="Answer this question as a weak, uniformed, incorrect student might."
    prompt="If everything a computer does is just math on binary numbers, can AI-writing be considered math-powered language production?" /> 
</GatedSection>

let EndOfIntroduction = ()=>{
  let {usageData}  = React.useContext(UsageContext)
return <GatedSection>
  <ReactMarkdown>{`#### 4.

I'll close the introduction by sketching out what's to come.

In **Part One: The New Currency of Words**, we'll examine how the fundamental strength of AI-writing is also its fundamental weakness: namely, that it can mint lot of words very quickly.  This is a double-edged sword because words **sometimes** have value, but they **always** have cost.  In fact, there are three kinds of costs associated with words:

1. **Writing Cost**. There's a monetary cost associated with each word generated by models like GPT.  (You've generated ${usageData.gptWords} words so far, which has cost me $${wordsToDollars(usageData.gptWords)}.)
2. **Reading Cost**. There's the cognitive cost associated with each word that a human brain must read and think about.  This is time not spent doing other things -- what economists call "opportunity cost."  
3. **Context Cost**.  Models like GPT have a context window of 8000 to 32000 words -- meaning that they can only "think about" this many words at a time.  As a document grows beyond this limit (which can happen in a matter of seconds), the model begins to forget what it previously wrote.  Words generated in ignorance of context have unique costs of their own.

In addition to an investigation of costs, we'll also investigate how words generate value.  This will enable us to tackle the big question for the future of knowledge work: Under what circumstances does the value justify the cost?  This is a question that almost every sector of the knowledge economy (including education) will have to grapple with as AI-writing becomes more ubiquitous. 

In **Part Two: The New Market of Expertise**, we'll examine how the value of human expertise is changing in the age of AI.  Some forms of human expertise will inevitably decrease in value, in much the same way that spelling skills became less valuable with the arrival of ubiquitous spellchecking.  Other forms of human expertise will increase in value -- in particular the kinds of expertise that help offset the costs and maximize the value of AI-writing.  This will help set the stage for a deep look at the challenges facing educational institutions.

In **Part Three: The New Economy of Education**, we'll discuss how AI's disruption of the expertise market creates problems for education systems that only AI can solve -- namely by automating the production of textbooks, assessments, and tutoring sessions.  The good news is that the age of one-size-fits all education is largely over, with AI-writing poised to personalize several key areas of instruction from K-12 to higher ed, disrupting not only how educators and students have operated for centuries, but also the organizational structure of educational institutions as we know them.  

~Stephen R. Foster, Ph.D.
`}
</ReactMarkdown>
</GatedSection>
}
    

export let Introduction = [
    FirstPage,
    InteractivityDemo,
    AIVoicesDemo,
    <EndOfIntroduction />
]

export let Chapter1Section1 = (props) => {
    let { usageData } = React.useContext(UsageContext)

    return <GatedSection>
        {TitleAndAuthor}
        <ReactMarkdown>{`

##
##
##
##

## Part One: The Currency of Words

#### 1. 

Every word has a cost.  If this were a normal book (without embedded AI), then it would only have cost me the usual: time up front.  But because parts of this textbook are written while you're reading it, **someone** has to pay OpenAI, the owners of the GPT model that powers this book.  That person is me.

But please don't feel bad about it.  In fact, please take a moment to investigate the cost of words with the two AI personalities below.  Generate as much text as you like.
`}</ReactMarkdown>
  <BookCard>
        <AvatarSays avatar={AVATARS.student2} say={<span>Hi!  I'm long-winded, wordy, verbose AI that is also kinda dumb.</span>} />
        <br />
        <GPT
            avatar={AVATARS.student2}
            hiddenPrompt="Answer this question as a weak, uniformed, inarticulate, incorrect, and very verbose wordy student might."
            prompt="What is the history of automation in education?" 
            showCosts/>
  </BookCard>
  <BookCard>
        <AvatarSays avatar={AVATARS.teacher1} say={<span>Hi! I omit needless words.</span>} />
        <br />
        <GPT
            avatar={AVATARS.teacher1}
            hiddenPrompt="Answer succinctly with a few short bullets."
            prompt="What is the history of automation in education?"
            showCosts />
  </BookCard>
</GatedSection>
}

export let Chapter1Section2 = (props) => {
    let { usageData } = React.useContext(UsageContext)

    return <GatedSection>
            <ReactMarkdown>{`
#### 2. 

It's worth mentioning that it's not free for OpenAI to generate words either.  GPT is a neural network that runs on computing hardware.  Like any software, it cannot escape the laws of physics and economics:  Computers run on electricity, and that isn't free.  Neither are the resources required to build computers parts and to replace them when they fail.  Economists have a saying, "There's no such thing as a free lunch" -- and there's no such thing as free cloud computing either.  Someone always pays something. 

OpenAI charges me [per word](/footnotes/#/per-word) generated.  A few observations:

1. If the average reader of this book generates $10 in AI-written words, then acquiring 100 readers means that I must pay $1000 to OpenAI.
2. If 1 reader clicks a GPT button that generates $1 in AI-written words and then clicks 999 more times, I have to pay $1000 to OpenAI.

This probably sounds like I'm leading up to a request that you buy this book, but that's not true.  I'm just pointing out an economic reality that any creator of AI-powered experiences needs to take into account, whether they're making a video game, chat bot, or AI-powered textbook.  Anything that causes an AI to generate text is also generating income for whomever owns the AI model.

When the owner of the model isn't you (and until open source models catch up to proprietary ones, it won't be), using AI to enhance an experience for your users places you in a dilemma: 

> *Either pay the cost yourself, or try to pass it on to your users.*

I know that many of my colleagues in education are already facing this same dilemma, so I've come up with a few tricks.  In fact, I've even implemented most of them in this textbook to avoid having to charge my readers and to avoid being charged myself.  

One you've already seen (though you might not have realized it) is the **Cached Prompt Technique**.
`}</ReactMarkdown>
<BookCard>
  <ReactMarkdown>
  {`**Cached Prompt Technique**

**Use case.** You have an experience that you're providing to others and you'd like to enhance it by allowing users to prompt an AI model and see the response.  (Examples: Teachers using AI in lessons, developers using AI in their software, authors using AI in their textbooks.)

**Solution.** For any such prompt your experience might send to an AI model on behalf of your users, send it yourself ahead of time and cache the response.  When a user is about to trigger one of these prompts, show them the cached response instead of fetching one from the model.

**Pros** 

* Makes any such cached prompt into a fixed cost instead of an ongoing cost.  
* Can cache many responses for a single prompt and cycle between them to give the illusion of dynamic, realtime responses.  
* Can do this to any prompt that you can predict ahead of time.
* Don't have to do this for all your prompts.

**Cons** 

* Reduces any such prompt to a static output instead of a dynamic one.  
* Requires you to know ahead of time the prompts that a user will generate.  Won't work on prompts that a user comes up with themselves, unless you can somehow predict the future.
* Requires some engineering work if you want to do this with a large number of prompts.  (More on this later if you're an educator wanting to make interactive books and lessons like this one.)
  `}
  </ReactMarkdown>
</BookCard>
      <ReactMarkdown>{`
It should come as no surprise that the prompts you've seen so far in this book have all been protected by the **Cached Prompt Technique**.  I mean, no offense but... I don't know you; for all I know, you're a troll who likes to mash buttons for fun.  `}</ReactMarkdown><span>And yes, when I said you'd spent <span style={{ color: "red" }}>${wordsToDollars(usageData.gptWords)}</span> of my hard-earned money -- that was virtual money.  (Thankfully, for my sake.)</span>
      
      <ReactMarkdown>{`#
But obviously an AI-powered textbook that wants to provide a truly personalized experience to each user can't use the **Cached Prompt Technique** all the time.`}</ReactMarkdown>
    </GatedSection>
}


export let Chapter1Section3 = (props) => {
  let { usageData } = React.useContext(UsageContext)

  return <GatedSection><ReactMarkdown>{`
#### 3.

Let's pause so you have a moment to investigate the matter for yourself, here are five of the prompts you've seen so far.  If you press the Ask GPT button enough times, you'll see the text on any given prompt begin to repeat -- evidence of the **cached response trick.**

`}</ReactMarkdown>

            <GPT prompt="If everything a computer does is just math on binary numbers, can AI-writing be considered math-powered language production?" />
            <GPT
                avatar={AVATARS.teacher1}
                hiddenPrompt="Answer this question as a teacher would."
                prompt="If everything a computer does is just math on binary numbers, can AI-writing be considered math-powered language production?" />

            <GPT
                avatar={AVATARS.student1}
                hiddenPrompt="Answer this question as a weak, uniformed, incorrect student might."
                prompt="If everything a computer does is just math on binary numbers, can AI-writing be considered math-powered language production?" />
            <GPT
                avatar={AVATARS.student2}
                hiddenPrompt="Answer this question as a weak, uniformed, inarticulate, incorrect, and very verbose wordy student might."
                prompt="What is the history of automation in education?"
                showCosts />
            <GPT
                avatar={AVATARS.teacher1}
                hiddenPrompt="Answer succinctly with a few short bullets."
                prompt="What is the history of automation in education?"
                showCosts />
</GatedSection>
}

export let Chapter1Section4 = (props) => {
  let { usageData } = React.useContext(UsageContext)

  return <GatedSection>
    <ReactMarkdown>{`
#### 4.

In order to see where the **Cached Response Technique** falls short, let's take a deeper look at some of those prompts.  Take this one for example: 
`}</ReactMarkdown>

    <GPT
      avatar={AVATARS.student2}
      hiddenPrompt="Answer this question as a weak, uniformed, inarticulate, incorrect, and very verbose wordy student might."
      prompt="What is the history of automation in education?"
      showCosts />


    <ReactMarkdown>{`#
Whereas it may appear that the prompt is simply "What is the history of automation in education?" -- in fact, the prompt is much longer.  It's actually this:  

> *What is the history of automation in education?  Answer this question as a weak, uniformed, inarticulate, incorrect, and very verbose wordy student might.*
`}</ReactMarkdown>

    <ReactMarkdown>{`#

Likewise, consider this one: 
`}</ReactMarkdown>

    <GPT
      avatar={AVATARS.teacher1}
      hiddenPrompt="Answer succinctly with a few short bullets."
      prompt="What is the history of automation in education?"
      showCosts />


<ReactMarkdown>{`#

This one's complete prompt is:

> *What is the history of automation in education?  Answer succinctly with a few short bullets.*

The technique at work here is called **Prompt Injection** -- where the prompt you see is only part of the prompt that the AI model sees.  The rest of the prompt is hidden from you.  This is a powerful technique because it allows you to control the "voice" of the AI model.  Among other things, it can allow content to be written:

1. In the reader's native language
2. At the reader's preferred reading level
3. With the reader's preferred style (e.g. formal vs. informal, verbose vs. succinct, with bullets vs. with long prose, etc.)

I mention this to underscore that what makes AI-writing so powerful is its ability to write custom text in realtime.  Response caching makes it impossible to take advantage of all that AI has to offer.
`}
</ReactMarkdown>
</GatedSection>}


export let Chapter1Section5 = (props) => {
  let { usageData } = React.useContext(UsageContext)

  return <GatedSection>
    <ReactMarkdown>{`
#### 5.

In an effort to discuss the value and cost of words, I've demonstrated two key techniques:

* **Prompt caching**, which lowers the cost of words by recycling them.
* **Prompt injection**, which can (among other things) raise the value of words by tailoring them to the reader.

We need these to understand the much more subtle technique that powers much of this textbook -- namely: 

* **Word currency**, which introduces a virtual currency as a medium of exchange between the reader and the author. 

This is easiest to understand if I just tell you how I've already been using word currency in this book, and how it affects you.  When I was still writing the first draft, I invited several of my colleagues to read it and give me feedback.  Obviously, since they were doing me a favor, I didn't want to charge them for the words they generated.  But I also didn't want them generating an unexpected number of words and inadvertently cutting into my coffee budget.  (Some professors get excited about proofreading.)

So I built a system that allowed me to allocate a fixed number of free words to each proofreader.  Basically, I gifted them *unwritten* words -- the potential to generate words.  Much like a dollar is the potential to buy something; an unwritten word is the potential to write something.  
`}</ReactMarkdown>
  </GatedSection>
}

export let Chapter1Section6 = (props) => {
  let { usageData } = React.useContext(UsageContext)

  return <GatedSection>
    <ReactMarkdown>{`
#### 6.

If you want to see this in action yourself (which you are [by no means required to do](/#/footnotes/student-signup) in order to read this textbook).  You can click below and sign up.  You'll end up back here with a few thousand unwritten words to spend on any prompts that aren't cached.`}</ReactMarkdown>
  <BookCard>
    <a href="https://ai-is-here.auth.us-east-1.amazoncognito.com/oauth2/authorize?client_id=2vs918871e1lh19ump5oblk25v&response_type=token&scope=email+openid+phone&redirect_uri=https%3A%2F%2Fsrfoster.github.io%2Fai-is-here%2F">Sign In</a>
  </BookCard>
    <ReactMarkdown>{`
#

If you don't want to sign up now, it's okay.  You'll have chances later.
`}</ReactMarkdown>

</GatedSection>
}


export let Chapter1 = [
        <Chapter1Section1/>,
        <Chapter1Section2/>,
        <Chapter1Section3/>,
        <Chapter1Section4/>,
        <Chapter1Section5/>,
        <Chapter1Section6/>,

/*
<<Social stuff, personal pages, comments, user chips, and additional compelling reasons to sign up (in addition to the free words)>>

<<Let's check the cost calc.  Something feels off.  BTW, we are using gpt3-turbo, right?  Need to redo the math>>

<<Segue to sign up...>>

<<No such thing as a free lunch -- means what?>>

<<AI's biggest strength is its biggest weakness -- it generates text.>>

<<Coder are the world's highest paid writers.>>
*/
]



export let Acknowledgements = <GatedSection>
 <GPT prompt="Beginning with pre-history, give a brief history of human education systems.  Use short bullet points." /> 
 <ReactMarkdown>{`##  
##  
##  
##  

**That's all for now!**

If you'd like to be notified when I update this book, please [email me](mailto:stephen@thoughtstem.com) and I'll add you to my mailing list.  Alternatively, you can subscribe to the [GitHub repo](https://github.com/srfoster/ai-is-here) to get notified of updates to the text or the underlying code.

**Acknowledgements**

Special thanks to the following people for their contributions to this book:

* **Lindsey Handley**, for being generally awesome and for helping me edit this book.

`}
  </ReactMarkdown>
</GatedSection>






//Unused



let TextRewritingDemo = <GatedSection>
  <ReactMarkdown>{`#### 2.`}</ReactMarkdown>
  <CustomizedText>
    {`You can click any of these paragraphs (including this one) to rewrite it according to the preferences you've selected in the box above.

Like many of you, I have vivid memories of experiencing first-hand education at its worst.

As a child with crippling anxiety and a penchant for daydreaming, I was constantly in trouble for not paying attention, for not doing my homework, for not following directions, and for not being able to sit still.  Also, having a minor disability in my hands, I experienced excruciating cramps when writing by hand -- a pain that 1) I was forced to engage in despite my protests, and for which 2) I recieved no obvious results, aside from my own barely legible pencil scrawls and poor grades for penmanship.

This was in the early 1990s, so if I'd asked "When am I ever going to use this?" I'm sure I would have been told that penmanship was still quite important for getting a job.  (Less than a decade earlier, the New York Times was still [claiming that the personal computer might be a fad](/#/footnote/computer-is-a-fad).)  Learning to write by hand was something that well-meaning educators of the time still believed to be crucial for educated citizens.  This lofty goal justified 1) overriding my lack of consent and 2) subjecting me to physical pain.

When I share this story with educators today, they are quick to point out that this is an example of education "done wrong" -- that my disabilities ought to have been better supported.  They're right, and in many places education is indeed "done right."  But the point remains: Done right or done wrong, early education is legally permitted to be a non-consensual arrangement.  It's just that this state of affairs is more obvious when education is "done wrong" because students are more likely to be vocal about it.  If the system doesn't work for you, too bad.

But here we are, on the cusp of a future in which a one-size-fits-all education might soon be as antiquated as penmanship classes.  Who knows?  Maybe a universally consensual education system is on the horizon too.`}</CustomizedText>
</GatedSection>

let MusingsOnTranslation = <GatedSection>
  <ReactMarkdown>{`#### 4.

With one unfair benchmark out of the way, let's balance things out with a benchmark where AI performs extremely well -- namely translation.  For example, here's a benchmark that can be passed with flying colors:`}</ReactMarkdown>
  <Benchmark
      name="Translate a Sentence to a New Language"
      goal="Get an AI to translate a novel from English to Spanish."
      modelsTested="GPT 3.5 and GPT 4.0" 
      result="PASSED"
      />
<ReactMarkdown>{`In fact machine translation is the OG benchmark.  Back in 2017, the ground-breaking "transformer" neural network archetecture was introduced in a paper called ["Attention Is All You Need"](/#/footnote/attention-is-all-you-need).  This paper was a breakthrough in the field of natural language processing (NLP) because it showed that AI (using transformers) could translate between languages better than techniques like recurrent neural networks, which had been used for decades.  As it turned out, the same technology that performed so well at translation also performed well at many other benchmarks that boil down to "say this, but different." As a quick demonstration, here's a sentence I wrote earlier:

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
AI's victory *can* be a victory for education as well.  But this is by no means guaranteed.`}</ReactMarkdown>
</GatedSection>


let MusingsOnCoherence = <GatedSection>
  <ReactMarkdown>{`#### 3.

In the conversations around AI and education, many are quick to point out one of the big weaknesses of AI-writing, namely [its tendency to hallucinate and lie](/#/footnote/hallucinations).  It's true: You can't trust everything an AI says.  And it's true that educators and students should learn to look critically at the output of AI-writing tools, cross-checking as necessary.

On the other hand, if you're looking for some consolation that human intelligence has a secure place in the future of knowledge work, I would urge you not to make hallucinations the AI flaw in which you take comfort.  Why?  Because even if we allow (for the sake of argument) that AI hallucinations are here to stay, a future in which the last bastion of human intelligence is to "fact check" AI-generated output is one where humans are stuck playing second fiddle to a the creative output of machines.  Personally, I aspire to something better.

Rather, of the two big flaws in AI-writing (hallucinations and incoherence), I take more consolation in the second.  To define incoherence breifly:

> The more text an AI generates, the less coherent it becomes.

Here, for example, is a benchmark that I've been using to track the coherence of AI-writing tools:
`}</ReactMarkdown>
  <Benchmark
     name="Write a Novel" 
     goal="Get an AI to write a novel that I'd actually want to read."
     modelsTested="GPT 3.5 and GPT 4.0"
     result="FAILED"
  />
  <ReactMarkdown>{`
  I'll admit, this benchmark might seem unfair at first glance.  Maybe I don't even like novels.  Maybe I have unreasonably high standards.  Who am I to appoint myself judge?  Look, these are valid concerns.   But if I may:

* I'm not subjecting AI to harsher criticism than human writers have been since the birth of writing (3400 BCE).  Writing is good if readers like it.
* Moreover, I'm not publishing these benchmarks in hopes that you'll accept my results; rather, I'm asking you to evaluate such benchmarks for yourself.

In other words, when you see a benchmark like the one above, [please](/#/footnote/homework-for-my-students) take a moment to open up your favorite AI-writing tool and use whatever clever prompting tricks you'd like.  In particular, are your results different from mine?  Partly, this is for you (dear reader) – much like the exercises in a mathematics textbook, serving to imbue you with new intuitions about the subject.

But partly, it's for me and for your fellow human readers: We need your help maintaining this living document.  AI-writing tools and the techniques for prompting them are advancing.  So please [get in touch](/#/footnote/contact-me) if you ever find that your results differ from mine.

For the above benchmark, all you have to do is send me the output of your awesome AI-written novel along with a prompting process I can replicate.  If your novel (or one that pops out from your process) seems enjoyable to me, I'll update the benchmark, rewrite this section, and list you under the **Acknowledgements** section at the end of this book.  Pinky swear! 

This is a living document, as any meaningful text about a moving target must inevitably be.  What I mean is that as AI-writing tools improve, I'll update the text to reflect the new reality.

We'll look at a lot of benchmarks in the coming pages – some easy, some hard, some passed, some failed – all of them relevant to students, educators, and humanity in general.  The reason I started with the novel-writing benchmark is that it illustrates the incoherence problem and shows us something important about the underlying technology of AI-writing – namely that the number of words a model like GPT 4.0 can "think about" is 8,000.  This is also known as its "context window."

Want to test the context window for yourself?  Here's a benchmark for that:`}</ReactMarkdown>
  <Benchmark
     name="Context Window" 
     goal="Get an AI to remember your name after pasting in 8,000 words of nonsense."
     modelsTested="GPT 3.5 and GPT 4.0"
     result="FAILED"
  />
<ReactMarkdown>{`I mention this because it gives a sense of why the novel-writing benchmark is so hard for AI-writing tools.  To put the 8,000-word context window into perspective, the first Harry Potter novel is about 77,000 words.  An AI-writing tool that attempts to write such a book will, after the first 8000 words, begin to forget what it previously wrote.

It's an open question whether an AI model's context window can be circumvented (either now or in the future). Optimists would point out that human authors don't keep every previous word in mind while writing new ones.  Thus, perhaps a clever prompter could simulate a human writing process by continually supplying the AI with a running 500-word "summary-thus-far," while asking it to generate 7,500 words at a time.  Do this 10 times and... *bam!* – you have a novel!

If you get good results with this methodology, please get in touch, so I can update the benchmark.  But please know: I've poured many hours into this problem, tried various such tricks, and generated nothing but trash.  (More on this later – because sometimes even trash can be instructive.)

I'll close this section by mentioning a strange internet phenomenon I've noticed:

* YouTube is filling up with videos about "How to Write a Book with ChatGPT"? 
* Everything I've generated with these techniques sucks.

Again, maybe it's me.  Or maybe (just maybe) the labor of authoring book-length works can't be fully automated.  My current assumption is that it won't be ([not for a long time, if ever](/#/footnote/bigger-context-window)).  In fact, I've based a lot of what follows on this assumption.
This means that if I'm wrong, then two things will become instantly true:

* I'll have to re-write much of this book.
* I won't be the one doing the work.`
}</ReactMarkdown>
 </GatedSection>

let MusingsOnEducation = 
<GatedSection>
  <ReactMarkdown>{`#### 2.
In this book, we'll make a distinction between learning and education.

* **Learning** is a natural process that happens in the brain.
* **Education** is a system of institutions and practices that are designed to facilitate learning.

Education is a human invention; learning is not.  Likewise, although many animals learn, only humans build education systems.  In fact, we even sometimes build them for other animals.  For example, we adopt dogs, train them to sit, stay, roll over, etc.  We train horses to be saddled, wear shoes, and carry loads.  We even teach dophins to do military operations.  There are various techniques for accomplishing these aims, and they have been refined over the course of human history.  But the basic idea is the same: we build an environment around the animal, carefully control the behaviors in which they engage, and the outcome is a trained animal.

I would [not be the first to argue](/#/footnote/domestication-references) that these systems for domesticating and training animals were instrumental to our success as a species.  A trained animal is a powerful tool.  Or to put it another way: an animal whose brain has been rewired to do something useful is a powerful tool.  

Admittedly, it might seem strange to start off a conversation about education by talking about animal training.  

One key difference, of course, is that humans are (ideally) willing participants in the whole process.  Whereas not much work goes into convincing a dog, horse, or dolphin that getting trained is in its best interest, we do make an effort for human students.  Our first line of defense in this regard is that learning should be fun -- an end in itself.

When this line of defense crumbles (as it all too often does), all is not lost.  There is a second line of defense:  to justify the system to students by way of philosophical argument.  This process is most classically illustrated when a student Socratically demands to know "When am I ever going to use this?" and receives one of the classic answers:

* **The economic one:** You need this to get a job. (The economy needs this of you.)
  - **Example:** You should learn to code if you want to become a software engineer.
* **The social one:** You need this to be a good citizen. (Society needs this of you.)
  - **Example:** You should learn about the American Civil War to better understand political tensions in the United States.
* **The personal one:** You'll be happy you learned this.  (You need this of you.)
  - **Example:** You should learn to read literature because you'll find lifelong joy in it.

If one or more of the above arguments resonates with the student (and sometimes it does), all is well.  Tedium, unpleasantness, and even pain do sometimes become endurable when there is faith in long-term payoffs. 

But sometimes philosophical arguments fail to instill such faith.  What happens in cases like these depends on where you live and how old you are.  In America, education is compulsory up to a [certain age](/#/footnote/compulsory-education-ages) -- so the result is that students are forced to learn even when the process is painful and no long-term benefit is perceivable.  Above the age of compulsory education, students are free to opt out, but the result is that they are also opting out of the economic, social, and personal benefits that education provides.  Not exactly a great success story for education, in either case.

As a student, if you've had the misfortune of experiencing this crumbling of the system's ability to justify itself, it probably sucked.  (I know it did for me.)  You were forced to do something unpleasant for what probably sounded like really dumb reasons.  I wouldn't blame you if it made you a bit jaded about the education system in general.

I've heard people try to defend the education system's "occasional" failures in this regard by appealing to the fact that the education system has a lot of people to serve.  The bigger a system gets, the more it simply can't work for everyone.  For one thing, it becomes hard to make learning fun or even painless for everyone, because everyone learns differently.  For another, it becomes hard to justify the system to everyone, because everyone has different goals in life.

And prior to the arrival of AI, it was certainly true that one-size-fits-all services or products were easier to mass produce and deliver at scale than customized ones.  Now, though, AI has the ability to start customizing both the *how* and the *why* of education from pre-K to higher ed.

To get a sense of what this means, let's try to imagine a system in which every student gets different textbooks, different curricula, and different justifications for why they have the textbooks and curricula they have.  (Whether or not they get different standardized tests and assessments is an interesting question that we'll come back to in the next chapter.)

To make this thought experiment concrete, I've decided to do something radical: write a textbook that's different for everyone who reads it.`}</ReactMarkdown>
</GatedSection>

