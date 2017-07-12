const assert = require('chai').assert;
const { Builder, By, until } = require('selenium-webdriver');
const test = require('selenium-webdriver/testing');

test.describe('Options select form', function() {
  this.timeout(50000);

  const addr = 'http://localhost:3000';
  let driver;

  test.beforeEach(() => {
    driver = new Builder()
      .forBrowser('chrome')
      .build()

    login(driver);

  });

  test.afterEach(() => {
    driver.quit();
  });

  test.it('Loads', () => {
    driver.findElement(By.id('logout')).getText()
      .then(text => {
        assert.equal(text, 'Log Out');
      });
  });
});

const login = driver => {
  driver.get('http://localhost:3000');
  driver.wait(until.elementLocated({ css: '#App' }))
  driver.findElement(By.id('login')).click();
  driver.wait(until.elementLocated(By.xpath("//button[div='Log in with slack']")));
  driver.sleep(1000).then(() => {
    driver.findElement(By.xpath("//button[div='Log in with slack']")).click();
    driver.wait(until.titleIs('Sign in | Slack'));
    driver.findElement(By.css('.team_name_input')).sendKeys('luncherrollers');
    driver.findElement(By.id('submit_team_domain')).click();
    driver.findElement(By.id('email')).sendKeys('ebassity@gmail.com');
    driver.findElement(By.id('password')).sendKeys('ilovedogs');
    driver.findElement(By.id('signin_btn')).click();
    driver.wait(until.titleIs('Authorize access to your account | lunchers Slack'));
    driver.findElement(By.id('oauth_authorizify')).click();
    driver.wait(until.elementLocated(By.id('logout')));
  });
}
