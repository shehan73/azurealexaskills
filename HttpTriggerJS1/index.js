'use strict';

const Alexa = require('ask-sdk');

let skill;

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const METRIC_RESET = '';
const METRIC_REVENUE = 'revenue';
const METRIC_MARGIN = 'margin';
const METRIC_ATTRITION = 'attrition';

const STATE_PREV_METRIC = 'prevMetric';

const vrtuRevenue = '204000000';
const vrtuMargin = '40.94%';
const vrtuAttrition = '14.5%';

const gsbuRevenue = [
  { "name": "<say-as interpret-as='spell-out'>BFS</say-as> A. PAC", "value": "5350000" },
  { "name": "<say-as interpret-as='spell-out'>BFS</say-as> <say-as interpret-as='spell-out'>CEMEA</say-as>", "value": "39500000" },
  { "name": "<say-as interpret-as='spell-out'>BFS</say-as> CITI", "value": "33100000" },
  { "name": "<say-as interpret-as='spell-out'>BFS</say-as> GENUS", "value": "93100000" },
  { "name": "<say-as interpret-as='spell-out'>US</say-as> GAMMA", "value": "17100000" },
  { "name": "<say-as interpret-as='spell-out'>CMIE</say-as>", "value": "29200000" },
  { "name": "Diversified", "value": "10000000" },
  { "name": "<say-as interpret-as='spell-out'>HIL</say-as>", "value": "33000000" },
  { "name": "Channel", "value": "1500000" }
];

const gsbuMargin = [
  { "name": "<say-as interpret-as='spell-out'>BFS</say-as> A. PAC", "value": "44.65%" },
  { "name": "<say-as interpret-as='spell-out'>BFS</say-as> <say-as interpret-as='spell-out'>CEMEA</say-as>", "value": "35.67%" },
  { "name": "<say-as interpret-as='spell-out'>BFS</say-as> CITI", "value": "37.42%" },
  { "name": "<say-as interpret-as='spell-out'>BFS</say-as> GENUS", "value": "49.42%" },
  { "name": "<say-as interpret-as='spell-out'>US</say-as> GAMMA", "value": "30.45%" },
  { "name": "<say-as interpret-as='spell-out'>CMIE</say-as>", "value": "42.57%" },
  { "name": "Diversified", "value": "45.16%" },
  { "name": "<say-as interpret-as='spell-out'>HIL</say-as>", "value": "47.33%" },
  { "name": "Channel", "value": "59.12%" }
];

const gsbuAttrition = [
  { "name": "<say-as interpret-as='spell-out'>CMIE</say-as>", "value": "9.5%" },
  { "name": "<say-as interpret-as='spell-out'>HIL</say-as>", "value": "13.5%" },
  { "name": "<say-as interpret-as='spell-out'>BFS</say-as> CITI", "value": "17%" }
];

const languageStrings = {
  'en': {
    translation: {
      SKILL_NAME: 'Virtusa <say-as interpret-as="spell-out">EAG</say-as> <say-as interpret-as="spell-out">BI</say-as>',
      GET_REVENUE_MESSAGE: "Your revenue forecast is ",
      GET_MARGIN_MESSAGE: "Your acount margin is ",
      GET_ATTRITION_MESSAGE: "Your attrition is ",
      LAUNCH_MESSAGE: 'Welcome to Virtusa <say-as interpret-as="spell-out">EAG</say-as> <say-as interpret-as="spell-out">BI</say-as>.  I can give you your revenue forecast, account margin and attrition information... What can I help you with?',
      ANYMORE_MESSAGE: '.  Would like to know more?',
      OTHER_MESSAGE_REVENUE: '.  You can also say whats my margin, whats my attrition, or, you can say exit',
      OTHER_MESSAGE_MARGIN: '.  You can also say whats my revenue, whats my attrition, or, you can say exit',
      OTHER_MESSAGE_ATTRITION: '.  You can also say whats my revenue, whats my margin, or, you can say exit',
      DONTUNDERSTAND_MESSAGE: 'Sorry, I dont understand. ',
      HELP_MESSAGE: 'You can say whats my revenue, whats my margin, whats my attrition, or, you can say exit... What can I help you with?',
      HELP_REPROMPT: 'What can I help you with?',
      STOP_MESSAGE: 'Goodbye, have a nice day!',
    },
  },
  'en-US': {
    translation: {
      SKILL_NAME: 'Virtusa <say-as interpret-as="spell-out">EAG</say-as> <say-as interpret-as="spell-out">BI</say-as>',
    },
  },
  'en-GB': {
    translation: {
      SKILL_NAME: 'Virtusa <say-as interpret-as="spell-out">EAG</say-as> <say-as interpret-as="spell-out">BI</say-as>',
    },
  },
};

// HelpIntentHandler re-written following v2 request handler interface
//const LaunchRequestHandler = {
//  canHandle(handlerInput) {
//    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
//  },
//  handle(handlerInput) {
//    return handlerInput.responseBuilder
//      .speak(this.t('LAUNCH_MESSAGE'))
//      .reprompt(this.t('LAUNCH_MESSAGE'))
//      .withSimpleCard(this.t('SKILL_NAME'), this.t('LAUNCH_MESSAGE'))
//      .getResponse();
//  },
//};

// HelpIntentHandler re-written following v2 request handler interface
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return true; //requestEnvelope.request.type === 'IntentRequest'
//      && requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(this.t('HELP_MESSAGE'))
      .reprompt(this.t('HELP_MESSAGE'))
      .withSimpleCard(this.t('SKILL_NAME'), this.t('HELP_MESSAGE'))
      .getResponse();
  },
};


//const CancelAndStopIntentHandler = {

//  canHandle(handlerInput) {
//    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
//        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
//  },
//  handle(handlerInput) {
//    return handlerInput.responseBuilder
//      .speak(this.t('STOP_MESSAGE'))
//      .reprompt(this.t('STOP_MESSAGE'))
//      .withSimpleCard(this.t('SKILL_NAME'), this.t('STOP_MESSAGE'))
//      .getResponse();
//  },
//};



//const SessionEndedRequestHandler = {
//  canHandle(handlerInput) {
//    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
//  },

//  handle(handlerInput) {
//    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
//    return handlerInput.responseBuilder.getResponse();
//  },
//};

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

  const skill = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
  //    LaunchRequestHandler,
      HelpIntentHandler)
    .create();

  skill.invoke(req, context).then(function (responseEnvelope) {
    context.log(responseEnvelope);
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: responseEnvelope
    };
    context.done();
  });

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
};