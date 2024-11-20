TODO:

  - The Big Polish!
    - Bots 
      - Better send message bar
      - Something weird with placement of in-progress response
      - Enter sends message
    - Keys
      - snackbar to confirm creation 
      - If I have 1m credits, it is very difficult to use the slider to give a small amount of credits. (Cap it at ____)
      - Chrome bug: - Deleted items don't fully disappear 
    - Misc
      - Hide or fix the textbook for the time being
      - OutOfCredits is a bit ugly on the homepage
        - Make it more of a "Welcome" "Please enter credits" feel
      - Emails
        - Can we prevent invites from going to spam?





  - The Debt Payoff

  - Need a solution for mass-distributing access keys
    - Testing TODO:
      - Make sure you can't transfer more credits than you have
      - Make sure you can't take more credits than the child has


  - SECURITY
    * Really need to think through some worst case scenarios
      (Someone gets my key and deletes all other keys?)

  - DEBT ACCRUED! 
    - Plan:
      There's so much to fix here.  Need to set up testing/staging envs, deployment plan, and start refactoring the crap out of everything...
    - lambda error messages are the WORST!
    - UI is crappy.
      - At some point we'll need pagination for the Keys page...
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
