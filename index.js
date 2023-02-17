const { Builder, By, Key, until } = require('selenium-webdriver');
const assert = require('assert');
const mocha = require('mocha');

describe('Garmin.com Test Suite', () => {
  let driver;

  before(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().setTimeouts( { implicit: 10000 } );
    await driver.manage().window().maximize();
    await driver.get('https://www.garmin.com/en-US/');
    await driver.findElement(By.id('truste-consent-button')).click();
  });

  after(async () => {
    await driver.quit();
  });

  it('Test Case 1: Verify homepage title', async function() {
    const title = await driver.getTitle();
    assert.equal(title,'Garmin International | Home');
  });

  it('Test Case 2: Verify presence of main navigation menu', async function() {
    const menu = await driver.findElement(By.id('js__gh__header'));
    const hasNavigationMenu = await menu.isDisplayed();
    assert.equal(hasNavigationMenu, true);
  });

  it('Test Case 3: Verify Garmin logo on click redirects to homepage', async function() {
    await driver.findElement(By.className('gh__logo-container__logo')).click();
    const title = await driver.getTitle();
    assert.equal(title, 'Garmin International | Home');
  });


  it('Test Case 4 - Navigate to a product page', async () => {
    await driver.findElement(By.className('product-cards__slide')).click();
    const pageTitle = await driver.getTitle();
    assert(pageTitle.includes('Smartwatch'));
  });

  it('Test Case 5 - Added to cart message is shown', async () => {
    await driver.actions()
        .scroll(0, 0, 0, 500)
        .perform();
    await driver.wait(until.elementLocated(By.id('js__cta__buy')),10000);
    await driver.findElement(By.id('js__cta__buy')).click();
    await driver.wait(until.elementLocated(By.className('app__product__interstitial__details__title')),10000);
    const orderDetail = await driver.findElement(By.className('app__product__interstitial__details__title')).getText();
    assert.equal(orderDetail, 'Added To Cart');
  });

  it('Test Case 6 - Cart items number updates correctly', async () => {
     const cartCount = await driver.findElement(By.id('js__cart-number')).getText();
     assert.equal(cartCount, '1');
  });

  it('Test Case 7 - Cart button redirects to the cart page', async () => {
    await driver.actions()
    .scroll(0, 0, 0, -500)
    .perform();
    await driver.wait(until.elementLocated(By.id('app__product__interstitial__view_cart')),10000);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await driver.findElement(By.id('app__product__interstitial__view_cart')).click();
    const pageTitle = await driver.getTitle();
    assert.equal(pageTitle, 'Garmin | Cart');
  });

  it('Test Case 8 - Remove button removes renders the empty cart text', async () => {
    await driver.findElement(By.className('ec__cart-card__icon-image')).click();
    await driver.wait(until.elementLocated(By.className('cart-empty')),10000);
    const emptyCartMessage = await driver.findElement(By.css('.cart-empty > h2')).getText();
    assert.equal(emptyCartMessage, 'Your Cart is Empty');
  });

  it('Test Case 9 - Cart items number updates correctly on removal', async () => {
    const cartCount = await driver.findElement(By.id('js__cart-number')).getText();
    assert.equal(cartCount, '0');
 });

  it('Test Case 10 - Search for a product', async () => {
    await driver.findElement(By.id('js__search-icon')).click();
    await driver.findElement(By.name('q')).sendKeys('Garmin Venu 2', Key.RETURN);
    const title = await driver.getTitle();
    assert.equal(title, 'Garmin | Search');
  });
});
