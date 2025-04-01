TODO:

Spring 2025 re-envisioning.

04/01/2025

  - [ ] Refactor into "Apps"   
    - [x] Hamburger item hit boxes are buggy
    - [x] Move main app pages into their app folders
    - [x] Do the textbook post
  - Content and presentation
    - [ ] 30 min? Spruce up the author and blog post pages
      - [x] Regression: App cards dynamic avatar broke
      - More info (author avatars, etc.)
      - Bots for your student page - no content
    - [ ] 30 min? CAT video. Upload.
    - [ ] 30 min? AI summaries (transcripts?) for all videos
      - Click to read more

    12:00 LUNCH??
    - [ ] 30 min? Search (by text) and filter (by tags)


   * Deploy to ai-is-here.com/olympic-college
   * Solicit content:
     - Lindsey has more videos?
     - Respond to Kathy (re: CAT video)
     - Student voices (ask on discord)
     - Marco polo solicitations to: Candice, Davis, Sage, Mirelle
     - Graph to track "conversations"
       - Conversation view instead of feed view?
     - Solicit from other colleges/universities

03/31/2025
  - [x] Bots 
    - Streamline the login->manage bots experience
    - Clicking on a bot should swap in the show page, not link to it...
    - Self contained components embedded in posts (or lifted to top nav...)
  - Step 3: How to reach this again?

03/28/2025
   TODO:
   * Posts:
     - [BEGUN!] Bots 
       - Streamline the login->manage bots experience
       - Clicking on a bot should swap in the show page, not link to it...
     - Textbook
     - CAT video.
   * AI summaries (transcripts?) for all videos
     - Click to read more

   Backlog:
   * Top nav (videos, software, text, login?)

   * Deploy to ai-is-here.com/olympic-college

   * Solicit content:
     - Student voices (ask on discord)
     - Marco polo solicitations to: Candice, Davis, Sage, Mirelle
     - Graph to track "conversations"
       - Conversation view instead of feed view?
     - Solicit from other colleges/universities



03/26/2025
   TODO:
   * [x] Port more ambassador content
     - Day 1, 2, 4 (on youtube)
   * [x] Author pages:
     - Auto-generate list of posts w/ preview.
   * Posts:
     - Textbook
     - Bots 
     - CAT video.
   * AI summaries (transcripts?) for all videos
     - Click to read more
     - [x] Fix markdown on pages/:id view (render youtube embed, e.g.)


   Backlog:
   * Top nav (videos, software, text, login?)

   * Deploy to ai-is-here.com/olympic-college
   * Solicit content:
     - Student voices (ask on discord)
     - Marco polo solicitations to: Candice, Davis, Sage, Mirelle
     - Graph to track "conversations"
       - Conversation view instead of feed view?
     - Solicit from other colleges/universities

03/26/2025
  - Revise homepage
    - [x] Content and authorship (avatars)
    - [x] Port old assessment day content

  Backlog:
   * Port more ambassador content
     - Day 1, 2, 4 (on youtube)
   * Author pages:
     - Auto-generate list of posts w/ preview.
   * Posts:
     - Textbook
     - Bots 
     - CAT video.
   * AI summaries (transcripts?) for all videos
     - Click to read more
     - Fix markdown on pages/:id view (render youtube embed, e.g.)
   * Top nav (videos, software, text, login?)

   * Deploy to ai-is-here.com/olympic-college
   * Solicit content:
     - Student voices (ask on discord)
     - Marco polo solicitations to: Candice, Davis, Sage, Mirelle
     - Graph to track "conversations"
       - Conversation view instead of feed view?
     - Solicit from other colleges/universities


03/25/2025 -
  Fixed it by `git checkout src/gptProxyData.json`  Seems like maybe the teraform build is broken on the PC but works on the laptop?

  Anyway, goals:
  - Revise homepage
    [x] Cool banner
  - Placeholder content
    - Routing is aware of JSON
      - Links to author pages
      - Link to full blog posts

  Backlog:
   * Deploy to ai-is-here.com/olympic-college
   * Actual content.  CAT video.  Workshops.  Opinion pieces.
     - Student voices
     - Graph to track "conversations"
       - Conversation view instead of feed view?


03/05/2025 - 
  Well, I broke everything.  Gotta remember how the deployment is supposed to work.  After deploying the backend, the frontend is not working (Killed the proxy data).  ./deploy.sh failed with errors about not being able to recreate various resources (e.g. IAM??)
  
  "Rebrand" for AI stakeholders at OC
  - Do video for Kathy (modeling Candice's)
  - [x] "Logo"
  - Add welcome tile
    - Convey message and navigation options (imply site layout / information architecture)
      - Model after Candice's areas of interest...
      - Videos / Lectures
      - Articles / Blogs
      - Login
      - Logged in content

  - Fix Navbar





----

  - The Big Polish!
    - Misc
      - Emails
        - Can we prevent invites from going to spam?

  
  - Test plan
    - Make the powerpoint so we know how the workshop will flow...
      * Good bots / bad bots?
    - Load testing...
    - Check OpenAPI usage so far.  Rate limits?  Throttles?





  - The Debt Payoff

  - Need a solution for mass-distributing access keys
    - Testing TODO:
      - Make sure you can't transfer more credits than you have
      - Make sure you can't take more credits than the child has

  - Optimizations
    - Make streaming faster?  Decrementing credits in the streaming loop could be made faster...   (Dec at end, and just allow some negative -- or stop at zero...)

  - SECURITY
    * Use transaction to make sure you can't give more credits than you have... (2 requests in quick succession??)
    * Really need to think through some worst case scenarios
      (Someone gets my key and deletes all other keys?)

  - DEBT ACCRUED! 
    - Plan:
      There's so much to fix here.  Need to set up testing/staging envs, deployment plan, and start refactoring the crap out of everything...
    - lambda error messages are the WORST!
    - UI is crappy.
      - At some point we'll need pagination for the Keys page...
      - snackbar to confirm creation of keys
    - Tests!
      - Have integration tests on document_management lambdas, but should really unit test common-js
        - Ideally on an isolated terraform environment
        - Need cleanup after tests (littering dynamo with child keys e.g.)
    - creditString is a weird convention (accessKey?)
      - While we're at it -- there are other oddities (consider document_management as a resource and standardize everything...)
      - documentId => just id


New features!!
    
* Tutor improvements
  - A way to resume/clear a converation
  - Be able to see your own past conversations with a bot
  - Be able to assign avatars to the bots

* POS for getting more credits
  
* Next feature?  
  - Clean up UI of the tutoring bot
  - Make better homepage

UI/UX
  - Consider: Running low on credits message...

11/12/2024:
  - Tons of features over the past few sessions.  Access Key management

11/1/2024:
  - Implemented the lambda backend for check_credits
  - Fixed frontend component 
  - Put on homepage

10/31/2024:
  - Decided that this may as well double as the reservoir/repository of AI info for OC, so why not course materials too?
    * No need for everything to be AI-powered from the get-go.  Can always AI-power things one by one if we want.
  - See notes/HowToCheat.md

10/22/2024:
* Added ui for entering credit strings
* Decided not to worry about a hierarchy of credit strings.  One string connects to one pool of credits.  Pools can be replenished monthly (or whatever), and with whatever policy makes sense for the client org 

10/16/2024:
* Made s3 store the prompt as well as the responses
* Made credit tracking track the prompt
* Investigated cost per credit (same for prompt and output?)
  - https://openai.com/api/pricing/
    * Not sure which gpt-3.5-turbo model we're using, but it seems to be between $.5 and $1 for a million tokens
