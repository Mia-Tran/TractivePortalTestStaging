import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly emailInput = this.page.locator('input[type="email"]');
  readonly passwordInput = this.page.locator('input[type="password"]');
  readonly loginButton = this.page.locator('button[type="submit"]');
  readonly forgotPasswordLink = this.page.locator('a.forgot');
  readonly createAccountLink = this.page.locator('a[href="#/signup"]');
  readonly demoModeLink = this.page.locator('span', { hasText: 'Try Demo Mode' });

  readonly dropdownLanguageList = this.page.locator('tcommon-language-selector');


  // language-dependent texts (we only test the headers for 3 languages for now)
  readonly header1ByLanguage: { [key: string]: string } = {
    'English (US)': 'GPS and Health Tracking',
    'Deutsch': 'GPS und Health Tracking',
    'Français': 'GPS et moniteur de santé',
    // Add more languages and their corresponding headers here
  };

  readonly header2ByLanguage: { [key: string]: string } = {
    'English (US)': 'for Cats and Dogs',
    'Deutsch': 'für Hunde und Katzen',
    'Français': 'pour chiens et chats',
    // Add more languages and their corresponding headers here
  };
  

  constructor(page: Page) {
    super(page);
  }

  async navigateToHomePage()
  {
    await this.navigateTo('https://my-stage.tractive.com/'); // redirected to login page
    await this.setCookies();
    await this.reload();
    await this.page.$$('button:has-text("About cookies")')
    await this.page.getByRole('button', {name: 'OK'}).click();
  }

  async navigateToDemoPage()
  {
    await this.demoModeLink.waitFor({ state: 'visible' });
    await this.demoModeLink.click();
  }

  async selectLanguage(languageToSelect: string)
  {
    await this.dropdownLanguageList.click();
    const dropdownItems = this.page.locator('.tcommon-menu-selector__item');
    await dropdownItems.first().waitFor();
    const selectedLanguage = dropdownItems.locator(`text=${languageToSelect}`);
    await selectedLanguage.click();
  }

  async header1HasExpectedText(languageToSelect: string)
  {
    await this.selectLanguage(languageToSelect);
    const expectedHeaderText = this.header1ByLanguage[languageToSelect];
    const headingLocator = await this.page.locator('h1.typography__headline-jumbo.ng-scope');
    await headingLocator.waitFor({ state: 'visible' }); // Wait until the heading is visible
    
    const headingText = await headingLocator.textContent();
    return headingText === expectedHeaderText;
  }

  async header2HasExpectedText(languageToSelect: string)
  {
    await this.selectLanguage(languageToSelect);
    const expectedHeaderText = this.header2ByLanguage[languageToSelect];
    const headingLocator = this.page.locator('h2.typography__headline-jumbo.ng-scope', { hasText: expectedHeaderText });
    return await headingLocator.isVisible();
  }

  async fillCredentials(email: string, password: string)
  {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
}

  async login(email: string, password: string) {
    await this.fillCredentials(email, password);
    await this.loginButton.click();
  }

  async isErrorVisible() {
    const errorMessageSelector = '.toast-top-right';
    await this.page.waitForSelector(errorMessageSelector, { state: 'visible', timeout: 5000 });
    return await this.page.isVisible(errorMessageSelector);
  }

  async isSubmitButtonDisable()
  {
    return await this.isButtonInExpectedState(this.loginButton, true);
  }

  async isSubmitButtonEnabled()
  {
    // the button needs to be fully render as its disabled/enabled state is managed by Angular dynamically
    return await this.isButtonInExpectedState(this.loginButton, false);
  }

  async isForgotPasswordRedirectedToCorrectPage(redirectedUrl: string)
  {  
    await this.forgotPasswordLink.click();
    
    return await this.isRedirectedPageVisible(redirectedUrl);
  }

  async createAccountRedirectedLink(redirectedUrl: string)
  {
    await this.createAccountLink.click();
    return await this.isRedirectedPageVisible(redirectedUrl);
  }

  async isLoggedIn() {
    return await this.isRedirectedPageVisible('https://my-stage.tractive.com/#/settings/');
  }
}