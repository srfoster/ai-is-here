import React from "react";
import { BotsForYourStudentsAppCard } from "../../../Apps/AppCards";
import { MainHamburgerMenu } from "../../../Components/MainAppBar";

export default [
        `I made a platform for you to make bots for your students.

### Step 1

Ask me for an access key.  

### Step 2

Select "Apps" from the menu at the top of the page.  It looks like this:
`,
        <div style={{marginLeft: 10, marginTop: -10}}><MainHamburgerMenu /></div >,
            `Login with your access key and select the "Bots for your students" app. It looks like this:
`,
        <BotsForYourStudentsAppCard />,
            `### Step 3

Make tutoring bots for your students!`
    ]