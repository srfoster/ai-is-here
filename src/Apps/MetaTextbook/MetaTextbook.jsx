import React from 'react';
import { EReader } from './EReader';
import { Introduction, Chapter1, Acknowledgements } from './Sections';

const fullText = [
  ...Introduction,
  ...Chapter1,
  Acknowledgements
];

const footnotes = {
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

const MetaTextbook = () => {
  return (
    <>
      <EReader content={fullText} footnotes={footnotes} />
    </>
  );
};

export default MetaTextbook;