import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { BotsForYourStudentsAppCard } from "../../../Apps/AppCards";
import { CreditStringContext } from "../../../Hooks/useGpt";
import { MainHamburgerMenu } from "../../../Components/MainAppBar";

export default () => {
    const {creditString,setCreditString,remainingCredits} = React.useContext(CreditStringContext);

    return <>
        <ReactMarkdown>{`I made a platform for you to make bots for your students.

### Step 1

Ask me for an access key.  

### Step 2

Select "Apps" from the menu at the top of the page.  It looks like this:
`}</ReactMarkdown>
        <div style={{marginLeft: 10, marginTop: -10}}><MainHamburgerMenu /></div >
        <ReactMarkdown>{
            `Login with your access key and select the "Bots for your students" app. It looks like this:
`}</ReactMarkdown>
        <BotsForYourStudentsAppCard />
        <ReactMarkdown>{
            `### Step 3

Make tutoring bots for your students!`
        }</ReactMarkdown>
    </>
}