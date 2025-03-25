TODO:

Spring 2025 re-envisioning.

03/25/2025 -
  Fixed it by `git checkout src/gptProxyData.json`  Seems like maybe the teraform build is broken on the PC but works on the laptop?

  Anyway, goals:
  - Revise homepage
  - Subpages:
    - Videos
    - Blogs?
    - Software / Bots
    - Textbooks?


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
