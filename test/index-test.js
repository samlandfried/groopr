const assert = require('chai').assert;
const webdriver = require('selenium-webdriver');
const until = webdriver.until;
const test = require('selenium-webdriver/testing');

test.describe('Poodr', function() {
  this.timeout(10000);

  const addr = 'http://localhost:3000';
  let driver;

  test.beforeEach(() => {
    driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build()
  });

  test.afterEach(() => {
    driver.quit();
  });

  test.it('Loads', () => {
    driver.get(addr);
    driver.wait(until.elementLocated({ css: '#App' }));
    driver.findElement({ css: '.navbar-brand' })
      .getText()
      .then(header => {
        assert.equal(header, 'Poodr');
      });
  });
});
