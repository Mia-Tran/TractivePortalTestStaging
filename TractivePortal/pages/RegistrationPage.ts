import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegistrationPage extends BasePage {
  readonly firstNameInput = this.page.locator('input[name="firstName"]');
  readonly lastNameInput = this.page.locator('input[name="lastName"]');
  readonly emailInput = this.page.locator('input[name="email"]');
  readonly passwordInput = this.page.locator('input[name="password"]');
  readonly signUpButton = this.page.locator('button[type="submit"]');
  readonly termsAndConditionsLink = this.page.locator('a', { hasText: 'Terms & Conditions' });

  constructor(page: Page) {
    super(page);
  }

  async navigateToSignUpPage() {
    await this.navigateTo('https://my-stage.tractive.com/#/signup'); // redirected to login page
    await this.setCookies();
    await this.reload();
    await this.page.$$('button:has-text("About cookies")')
    await this.page.getByRole('button', { name: 'OK' }).click();
  }

  async fillUserInformation(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    await this.fillUserInformation(firstName, lastName, email, password);
    await this.signUpButton.click();
  }

  async isCreateAccountButtonDisable() {
    return await this.isButtonInExpectedState(this.signUpButton, true);
  }

  async isEmailErrorMessageVisible() {
    const errorMessage = await this.page.locator('em.tcommon-form-field__message.typography__paragraph-x-small.ng-binding:has-text("The email address is invalid.")');

    return await errorMessage.isVisible();
  }

  async isFieldRequired() {
    const errorMessage = await this.page.locator('em.tcommon-form-field__message.typography__paragraph-x-small.ng-binding:has-text("This field is required.")');

    return await errorMessage.isVisible();
  }

  async moveOutFromPasswordInput() {
    await this.passwordInput.blur();
  }

  async termsAndConditionsDocumentLink() {
    const [termsAndConditionsPdf] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.termsAndConditionsLink.click()
    ]);

    // Wait for the new page to fully load
    await termsAndConditionsPdf.waitForLoadState('load');

    return termsAndConditionsPdf.url();
  }

  async isRegistered() {
    return await this.page.locator('.welcome-message').isVisible();
  }
}