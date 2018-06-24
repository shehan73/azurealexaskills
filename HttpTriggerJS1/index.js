'use strict';

const Alexa = require('ask-sdk');

let skill;

// HelpIntentHandler re-written following v2 request handler interface
const HelpIntentHandler = {
  canHandle: function ({ requestEnvelope }) {
    return true; //requestEnvelope.request.type === 'IntentRequest'
      //&& requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle: function ({ responseBuilder }) {
    const speechOutput = 'This is the Hello World Sample Skill. ';
    const reprompt = 'Say hello, to hear me speak.';
    return responseBuilder.speak(speechOutput)
      .reprompt(reprompt)
      .getResponse();
  },
};

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');


  const skill = Alexa.SkillBuilders.custom()
    .addRequestHandlers(HelpIntentHandler)
    .create();

  skill.invoke(req, context);
  context.res = skill.getResponse();
  context.log(skill.getResponse);

//    const alexa = Alexa.handler(req, context);
    //alexa.registerHandlers(handlers);
 //   alexa.registerV2Handlers(HelpIntentHandler); // New API functions for registering v2 request handlers
 //   alexa.execute();

    //if (req.query.name || (req.body && req.body.name)) {
    //    context.res = {
    //        // status: 200, /* Defaults to 200 */
    //        body: "Hello " + (req.query.name || req.body.name)
    //    };
    //}
    //else {
    //    context.res = {
    //        status: 400,
    //        body: "Please pass a name on the query string or in the request body"
    //    };
    //}
    context.done();
};