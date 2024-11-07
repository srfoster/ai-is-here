TODO:

* Document management features
  - Purpose: Let users CRUDI documents so that they can (among other things) store documents that are used as bot prompts
  - Need frontend for document management (or use the bot interface).  Somehow need to let bots be created, managed, and shared via URL.  Abstracting away the fact that documents are being managed.  Should feel like creating/managing bots.

  - DEBT ACCRUED! 
    - Tests!
      - Have integration tests on document_management lambdas, but should really unit test common-js
        - Ideally on an isolated terraform environment
    - creditString is a weird convention (accessKey?)
      - While we're at it -- there are other oddities (consider document_management as a resource and standardize everything...)
    
* Tutor improvements
  - Make it possible to edit the prompt
    * Store in backend?
  - Make various tutor bots, tile them on the tutors index page
  - Be able to assign avatars to the bots
  - Do a UI/UX pass on the chat itself (bubbles, pressing enter, etc)

  
* Next feature?  
  - Clean up UI of the tutoring bot
  - Make better homepage
  - Maybe a "backend" for teachers bots?  (Could also be on s3?)
     s:///bucket/users/ABCDE/prompts/blah-bla-blah
  - CRUD operations on prompts (bots)?

* OutOfCredits is a bit ugly on the homepage
  - Make it more of a "Welcome" "Please enter credits" feel
  - Consider: Running low on credits message...
  - Make it display your current number of credits (possibly show a progress bar somewhere?)


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
