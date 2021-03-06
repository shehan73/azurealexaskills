'use strict';

const Alexa = require('alexa-skill-sdk-for-azure-function');
const Aad = require('azure-ad-jwt');
//const Jwt = require('jsonwebtoken');

let skill;

const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).
const AZURE_SKILLAPI_APP_ID_URI = 'https://virtusaonline.onmicrosoft.com/2f3963c2-c85b-473f-ab7e-bf0359edbecf';

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
      ACCOUNT_LINK_MESSAGE: 'Please link your Virtusa account to use this skill.',
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
  "AccountLinkNeeded": function () {
    console.log("account linking needed");

    this.emit(':tellWithLinkAccountCard', this.t('ACCOUNT_LINK_MESSAGE'));
  },
  "Unhandled": function () {
    console.log("unhandled");
    this.emit(':tell', this.t('STOP_MESSAGE'));
  }
}];


module.exports = function (context, req) {
  context.log('JavaScript HTTP trigger function processed a request.');
//  context.log(req);

  Alexa.setup({
    azureCtx: context,
    azureReq: req,
    handlers: handlerList,
    trackInvokedIntents: true,
    enforceVerifier: false,
    i18nSettings: { "languageStrings": languageStrings }
  });

  // Get the OAuth 2.0 Bearer Token from the linked account
  var token = req.body.session.user.accessToken;

  // validate the Auth Token
  if (token) {

    //var decoded = Jwt.decode(token, { complete: true });
    //context.log(decoded.header);
    //context.log(decoded.payload)

    Aad.verify(token, { audience: AZURE_SKILLAPI_APP_ID_URI }, function (err, result) {
      if (result) {
        context.log("JWT is valid");

      } else {
        context.log("JWT is invalid: " + err);
        req.body.request.type = 'AccountLinkNeeded';

      }

      // Handle the intent
      Alexa.execute(avsCallback(context, req));

    });



  } else {
    // no token! display card and let user know they need to sign in
    context.log("No Auth Token");
    req.body.request.type = 'AccountLinkNeeded';

    // Handle the intent
    Alexa.execute(avsCallback(context, req));

  }

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
