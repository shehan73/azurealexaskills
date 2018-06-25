'use strict';

const Alexa = require('alexa-skill-sdk-for-azure-function');

let skill;

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const SKILL_NAME = 'Virtusa <say-as interpret-as="spell-out">EAG</say-as> <say-as interpret-as="spell-out">BI</say-as>';
const GET_REVENUE_MESSAGE = "Your revenue forecast is ";
const GET_MARGIN_MESSAGE = "Your acount margin is ";
const GET_ATTRITION_MESSAGE = "Your attrition is ";
const LAUNCH_MESSAGE = 'Welcome to Virtusa <say-as interpret-as="spell-out">EAG</say-as> <say-as interpret-as="spell-out">BI</say-as>.  I can give you your revenue forecast, account margin and attrition information... What can I help you with?';
const ANYMORE_MESSAGE = '.  Would like to know more?';
const OTHER_MESSAGE_REVENUE = '.  You can also say whats my margin, whats my attrition, or, you can say exit';
const OTHER_MESSAGE_MARGIN = '.  You can also say whats my revenue, whats my attrition, or, you can say exit';
const OTHER_MESSAGE_ATTRITION = '.  You can also say whats my revenue, whats my margin, or, you can say exit';
const DONTUNDERSTAND_MESSAGE = 'Sorry, I dont understand. ';
const HELP_MESSAGE = 'You can say whats my revenue, whats my margin, whats my attrition, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye, have a nice day!';

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
//      .speak(LAUNCH_MESSAGE)
//      .reprompt(LAUNCH_MESSAGE)
//      .withSimpleCard(SKILL_NAME, LAUNCH_MESSAGE)
//      .getResponse();
//  },
//};

// HelpIntentHandler re-written following v2 request handler interface
//const HelpIntentHandler = {
//  canHandle(handlerInput) {
//    const request = handlerInput.requestEnvelope.request;
//    return request.type === 'IntentRequest'
//      && request.intent.name === 'AMAZON.HelpIntent';
//  },
//  handle(handlerInput) {
//    return handlerInput.responseBuilder
//      .speak(HELP_MESSAGE)
//      .reprompt(HELP_MESSAGE)
//      .withSimpleCard(SKILL_NAME, HELP_MESSAGE)
//      .getResponse();
//  },
//};


//const CancelAndStopIntentHandler = {
//  canHandle(handlerInput) {
//    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
//      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
//        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
//  },
//  handle(handlerInput) {
//    return handlerInput.responseBuilder
//      .speak(STOP_MESSAGE)
//      .reprompt(STOP_MESSAGE)
//      .withSimpleCard(SKILL_NAME, STOP_MESSAGE)
//      .getResponse();
//  },
//};



//const SessionEndedRequestHandler = {
//  canHandle(handlerInput) {
//    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
//  },

//  handle(handlerInput) {
//    context.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
//    return handlerInput.responseBuilder.getResponse();
//  },
//};


var handlerList = [{
  'LaunchRequest': function () {
    const speechOutput = this.t('LAUNCH_MESSAGE');
    this.emit(':ask', speechOutput);
  },
  'GetRevenueIntent': function () {
    this.attributes[STATE_PREV_METRIC] = METRIC_REVENUE;

    // Create speech output
    const speechOutput = this.t('GET_REVENUE_MESSAGE') + vrtuRevenue + this.t('ANYMORE_MESSAGE');
    this.emit(':askWithCard', speechOutput, this.t('SKILL_NAME'), vrtuRevenue);
  },
  'GetMarginIntent': function () {
    this.attributes[STATE_PREV_METRIC] = METRIC_MARGIN;

    // Create speech output
    const speechOutput = this.t('GET_MARGIN_MESSAGE') + vrtuMargin + this.t('ANYMORE_MESSAGE');
    this.emit(':askWithCard', speechOutput, this.t('SKILL_NAME'), vrtuMargin);
  },
  'GetAttritionIntent': function () {
    this.attributes[STATE_PREV_METRIC] = METRIC_ATTRITION;

    // Create speech output
    const speechOutput = this.t('GET_ATTRITION_MESSAGE') + vrtuAttrition + this.t('ANYMORE_MESSAGE');
    this.emit(':askWithCard', speechOutput, this.t('SKILL_NAME'), vrtuAttrition);
  },
  'AMAZON.YesIntent': function () {
    //this.attributes[STATE_PREV_METRIC] = METRIC_REVENUE;
    const prevMetric = this.attributes[STATE_PREV_METRIC];
    console.log("cancel " + STATE_PREV_METRIC + ": " + prevMetric);

    var speechOutput = this.t('DONTUNDERSTAND_MESSAGE') + this.t('HELP_MESSAGE');
    console.log("prevMetric: " + prevMetric);

    if (prevMetric != undefined && prevMetric != METRIC_RESET) {
      if (prevMetric == METRIC_REVENUE) {
        speechOutput = 'The revenue forecast for ';

        let i;
        for (i = 0; i < gsbuRevenue.length - 1; ++i) {
          console.log('revenue ' + gsbuRevenue[i]);
          speechOutput += gsbuRevenue[i].name + ' is ' + gsbuRevenue[i].value + ', ';
        }
        speechOutput += 'and ' + gsbuRevenue[gsbuRevenue.length - 1].name + ' is ' + gsbuRevenue[gsbuRevenue.length - 1].value + this.t('OTHER_MESSAGE_REVENUE');
      }
      else if (prevMetric == METRIC_MARGIN) {
        speechOutput = 'The account margin for ';

        let i;
        for (i = 0; i < gsbuMargin.length - 1; ++i) {
          console.log('margin ' + gsbuMargin[i]);
          speechOutput += gsbuMargin[i].name + ' is ' + gsbuMargin[i].value + ', ';
        }
        speechOutput += 'and ' + gsbuMargin[gsbuMargin.length - 1].name + ' is ' + gsbuMargin[gsbuMargin.length - 1].value + this.t('OTHER_MESSAGE_MARGIN');
      }
      else {
        speechOutput = 'The attrition for ';

        let i;
        for (i = 0; i < gsbuAttrition.length - 1; ++i) {
          console.log('margin ' + gsbuAttrition[i]);
          speechOutput += gsbuAttrition[i].name + ' is ' + gsbuAttrition[i].value + ', ';
        }
        speechOutput += 'and ' + gsbuAttrition[gsbuAttrition.length - 1].name + ' is ' + gsbuAttrition[gsbuAttrition.length - 1].value + this.t('OTHER_MESSAGE_ATTRITION');
      }
    }

    this.attributes[STATE_PREV_METRIC] = METRIC_RESET;

    this.emit(':askWithCard', speechOutput);
  },
  'AMAZON.HelpIntent': function () {
    const speechOutput = this.t('HELP_MESSAGE');
    const reprompt = this.t('HELP_MESSAGE');
    this.emit(':ask', speechOutput, reprompt);
  },
  'AMAZON.CancelIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'AMAZON.StopIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  'AMAZON.NoIntent': function () {
    this.emit(':tell', this.t('STOP_MESSAGE'));
  },
  "Unhandled": function () {
    console.log("unhandled");
    this.emit(':tell', this.t('STOP_MESSAGE'));
  }
}];


module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    var alexa = require('alexa-skill-sdk-for-azure-function');
    alexa.setup({
      azureCtx: context,
      azureReq: req,
      handlers: handlerList,
      locale: 'en',
      trackInvokedIntents: true,
      enforceVerifier: false
//      i18nSettings: { "languageStrings": languageStrings }
    });

    alexa.execute(avsCallback(context, req));

};

var avsCallback = function (azureCtx, req) {
  return function (err, obj) {

    if (err) {
      azureCtx.res = {
        status: 400,
        body: err
      };
    } else {
      azureCtx.res = {
        body: obj
      };
    }
    azureCtx.done();
  };
};
