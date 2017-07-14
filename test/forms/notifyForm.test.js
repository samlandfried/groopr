const assert = require('chai').assert;
const { Builder, By, until } = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');
const Notify = require('../../src/Poodr/Notify/Notify')

test.describe('Options select form', function() {
  this.timeout(50000);

  const addr = 'http://localhost:3000';
  let driver;

  test.beforeEach(() => {
    driver = new Builder()
      .forBrowser('chrome')
      .build();
  });

  test.afterEach(() => {
    driver.quit();
  });

  test.it('Has an attractive UI', () => {
    driver.get(addr + '/test-notify');
    driver.findElement(By.id('message-to-groups'))
      .getText()
      .then(message => {
        assert.include(message, 'You have been assigned to this group from the');
      });
    driver.findElement(By.id('skip-history-checkbox'));
    driver.findElement(By.id('groups'));
    driver.findElement(By.id('notify-button'))
      .getText()
      .then(text => {
        assert.equal(text, 'Notify groups');
      });
  });

  test.describe('After choosing grouping options', () => {
    test.beforeEach(() => {
      login(driver);
      driver.findElement(By.css('#channels tr:last')).click()
      driver.wait(until.elementLocated(By.id('notify-form')))
    });
  });
});
