const assert = require('chai').assert;
const SlackUser = require('../../models/SlackUser');
const { AUTH_CONFIG } =  require('../../src/Auth/auth0-variables');

describe('SlackUser', function() {
  let user;

  beforeEach(() => {
    user = new SlackUser(keys.slackId);
  });

  it('Has a real name', () => {
    assert.equal(user.realName, 'Sam Landfried');
  });

  it('Has a Slack name', () => {
    assert.equal(user.slackName, '@landfried');
  });

  it('Has an image url', () => {
    assert.equal(user.image, 'it will be something else');
  });
});
