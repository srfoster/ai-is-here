import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { MetaTextbookAppCard } from "../../../Apps/AppCards";
import { CreditStringContext } from "../../../Hooks/useGpt";
import { MainHamburgerMenu } from "../../../Components/MainAppBar";

export default () => {
    const {creditString,setCreditString,remainingCredits} = React.useContext(CreditStringContext);

    return <>
        <ReactMarkdown>{`I'm working on web-based textbooks that have AI inside of them

### Step 1

Ask me for an access key.  

### Step 2

Select "Apps" from the menu at the top of the page.  It looks like this:
`}</ReactMarkdown>
        <div style={{marginLeft: 10, marginTop: -10}}><MainHamburgerMenu /></div >
        <ReactMarkdown>{
            `Login with your access key and select the "Textbook" app. It looks like this:
`}</ReactMarkdown>
        <MetaTextbookAppCard />
        <ReactMarkdown>{
            `### Step 3

Contact me if you want to collaborate on a similar textbook for your area of expertise!`
        }</ReactMarkdown>
    </>
}