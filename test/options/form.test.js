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
      .build();
  });

  test.afterEach(() => {
    driver.quit();
  });

  test.it('Has an attractive UI', () => {
    driver.get(addr + '/test');
    driver.findElement(By.id('grouping-strategy-select'))
    driver.findElements(By.css('#grouping-strategy-select option'))
      .then(options => {
        assert.lengthOf(options, 2);
      });

    driver.findElement(By.id('group-size-select'))
    driver.findElements(By.css('#group-size-select option'))
      .then(options => {
        assert.lengthOf(options, 6);
      });

    driver.findElement(By.css('input[name="odd-member-strategy"][value="bigger"]'))
    driver.findElement(By.css('input[name="odd-member-strategy"][value="smaller"]'))

    driver.findElement(By.id('channel-search-input'))
      .getText()
      .then(searchTerm => {
        assert.isEmpty(searchTerm);
      });

    driver.findElement(By.id('channels'))
    driver.findElement(By.id('groups'))
  });

  test.describe('After login', () => {
    test.beforeEach(() => {
      login(driver);
    });

    test.xit('Allows a user to login w/ Slack info', () => {
      driver.findElement(By.id('logout'))
        .getText()
        .then(text => {
          assert.equal(text, 'Log Out');
        });
    });

    test.it('Lets you know who is logged in', () => {
      driver.findElement(By.id('logged-in-user'))
        .getText()
        .then(text => {
          assert.includes(text, 'Welcome, Sam Landfried!');
        });
    });

    test.xit('Can load all Slack channels and groups a user has access to', () => {
      driver.findElements(By.css('#channels tr'))
        .then(channels => {
          assert.isAbove(channels.length, 200);
          assert.isBelow(channels.length, 400);
        });
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
};
