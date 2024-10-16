TODO:

* Make UI for entering credits (save in session)
  - Document business process (how will teachers/students manage credit strings?)
  - Can credits be bundled -- e.g. a student credit string "links" to a teacher's which "links" to the departments, etc...
    - Want to charge the top most one, but also want to count credits at the level of each individual string (for data vis purposes)
    - Also, for that matter, how do we "refill" a credit string without wiping data?  Should we be aggregating the total usage per string also?
* Next feature?  


10/16/2023:
* Made s3 store the prompt as well as the responses
* Made credit tracking track the prompt
* Investigated cost per credit (same for prompt and output?)
  - https://openai.com/api/pricing/
    * Not sure which gpt-3.5-turbo model we're using, but it seems to be between $.5 and $1 for a million tokens
