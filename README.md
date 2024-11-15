TODO:

  - MVP - be able to view users' past conversations with your bot
    * On key page, expand out conversations
    * This is currently wacked. Sends a request per bot id.  Need the lambda to take an child key, and return all the child's conversations.  Then on the client-side, we can filter it down to just the bots that the current access key owns (or seperate out the lists)
       - Also, is this hard because we're using S3's path structure instead of 

  - Need a solution for mass-distributing access keys
    - Testing TODO:
      - Make sure you can't transfer more credits than you have
      - Make sure you can't take more credits than the child has

  - Chrome bug:
    - Deleted items don't fully disappear 


  - SECURITY
    * Really need to think through some worst case scenarios
      (Someone gets my key and deletes all other keys?)

  - DEBT ACCRUED! 
    - Plan:
      There's so much to fix here.  Need to set up testing/staging envs, deployment plan, and start refactoring the crap out of everything...
    - lambda error messages are the WORST!
    - UI is crappy.
      - Polishings etc (enter sends chat message)
      - At some point we'll need pagination for the Keys page...
    - Tests!
      - Have integration tests on document_management lambdas, but should really unit test common-js
        - Ideally on an isolated terraform environment
        - Need cleanup after tests (littering dynamo with child keys e.g.)
    - creditString is a weird convention (accessKey?)
      - While we're at it -- there are other oddities (consider document_management as a resource and standardize everything...)
      - documentId => just id
    
* Tutor improvements
  - Be able to assign avatars to the bots

* POS for getting more credits
  
* Next feature?  
  - Clean up UI of the tutoring bot
  - Make better homepage

UI/UX
* OutOfCredits is a bit ugly on the homepage
  - Make it more of a "Welcome" "Please enter credits" feel
  - Consider: Running low on credits message...
  - Make it display your current number of credits (possibly show a progress bar somewhere?)
* Can we prevent invites from going to spam?

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
