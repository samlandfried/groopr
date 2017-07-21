const pry = require('pryjs');
const request = require('request');
const authPath = 'https://slack.com/oauth/authorize';
const options = {
  client_id: '146403140194.210920080358',
  scope: 'identity.basic'
};

request.get({ url: authPath, qs: options }, (err, resp) => {
  eval(pry.it)
});

