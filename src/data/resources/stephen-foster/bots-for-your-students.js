import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { OutOfCreditsIfOutOfCredits, useCheckCredits } from "../../../useGpt";
import { TutorManager } from "../../../Tutor";
import { Link } from "react-router-dom";
import { CreditStringContext } from "../../../useGpt";

export default () => {
    const {creditString,setCreditString,remainingCredits} = React.useContext(CreditStringContext);

    return <>
        <ReactMarkdown>{
            `I made a platform for you to make bots for your students.

### Step 1: Login`}
        </ReactMarkdown>
        <OutOfCreditsIfOutOfCredits afterRefresh={() => {
        }} />
        <ReactMarkdown>
            {`---\n### Step 2: Create a bot`}
        </ReactMarkdown>
        {remainingCredits > 0 ? <TutorManager /> : "Log in first (see above)"}
        <br />
        <br />
        <br />
    </>
}