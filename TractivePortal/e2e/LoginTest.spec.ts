import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Tractive Login Tests', () => {

  let loginPage: LoginPage;
 
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateTo('https://my-stage.tractive.com/'); // redirected to login page
    await loginPage.setCookies();
    await loginPage.reload();
    await page.$$('button:has-text("About cookies")')
    await page.getByRole('button', {name: 'OK'}).click();
   });
   
  test('should redirect to demo page when Try Demo Mode is selected', async ({ page }) => {
    await loginPage.navigateToDemoPage();
    const demoLink = 'https://my-stage.tractive.com/#/map';
    const isDemoPageVisible = await loginPage.isRedirectedPageVisible(demoLink);
    expect(isDemoPageVisible).toBe(true);
  });


  test('should log in successfully with valid credentials', async ({ page }) => {
    await loginPage.login('nguyenbaonam121@gmail.com', 'nguyenbaonam');
    const isLoggedIn = await loginPage.isLoggedIn();
    expect(isLoggedIn).toBe(true);
  });


  test('Signin button is enabled with valid input', async ({ page }) => {
    await loginPage.login('valid-email@domain.com', 'validpassword');
    const isSubmitButtonEnabled = await loginPage.isSubmitButtonEnabled();
    expect(isSubmitButtonEnabled).toBe(true);
  });


  test('should show error message for invalid credentials', async ({ page }) => {
    await loginPage.login('invalid-email@domain.com', 'invalidpassword');
    const isErrorVisible = await loginPage.isErrorVisible();
    expect(isErrorVisible).toBe(true);
  });

  test('should not allow login with empty credentials', async ({ page }) => {
    await loginPage.fillCredentials('', '');
    const isSubmitDisable = await loginPage.isSubmitButtonDisable();
    expect(isSubmitDisable).toBe(true);
  });

  test('should not allow login with empty email', async ({ page }) => {
    await loginPage.fillCredentials('', 'validpassword');
    const isSubmitDisable = await loginPage.isSubmitButtonDisable();
    expect(isSubmitDisable).toBe(true);
  });

  test('should not allow login with invalid email (missing "@")', async ({ page }) => {
    await loginPage.fillCredentials('invalid-email-address', '');
    const isSubmitDisable = await loginPage.isSubmitButtonDisable();
    expect(isSubmitDisable).toBe(true);
  });

  test('should not allow login with invalid email (missing part after "@")', async ({ page }) => {
    await loginPage.fillCredentials('invalid-email-address@', '');
    const isSubmitDisable = await loginPage.isSubmitButtonDisable();
    expect(isSubmitDisable).toBe(true);
  });

  test('should not allow login with invalid email (missing dot after "@")', async ({ page }) => {
    await loginPage.fillCredentials('invalid-email-address@domain', '');
    const isSubmitDisable = await loginPage.isSubmitButtonDisable();
    expect(isSubmitDisable).toBe(true);
  });

  test('should not allow login with invalid email (missing part after ".")', async ({ page }) => {
    await loginPage.fillCredentials('invalid-email-address@domain.', '');
    const isSubmitDisable = await loginPage.isSubmitButtonDisable();
    expect(isSubmitDisable).toBe(true);
  });

  test('should not allow login with invalid email (part after "." has only one character)', async ({ page }) => {
    await loginPage.fillCredentials('invalid-email-address@domain.a', '');
    const isSubmitDisable = await loginPage.isSubmitButtonDisable();
    expect(isSubmitDisable).toBe(true);
  });

  test('should not allow login with invalid email (part after "." contains digits)', async ({ page }) => {
    await loginPage.fillCredentials('invalid-email-address@domain.a12bc', '');
    const isSubmitDisable = await loginPage.isSubmitButtonDisable();
    expect(isSubmitDisable).toBe(true);
  });

  test('should not allow login with empty password', async ({ page }) => {
    await loginPage.fillCredentials('valid-email@domain.com', '');
    const isSubmitDisable = await loginPage.isSubmitButtonDisable();
    expect(isSubmitDisable).toBe(true);
  });

  test('should redirect to forgot password page when the corresponding link is clicked', async ({ page }) => {
    const forgotPasswordRedirectedLink = await loginPage.isForgotPasswordRedirectedToCorrectPage('https://my-stage.tractive.com/#/forgot');
    expect(forgotPasswordRedirectedLink).toBe(true);
  });

  test('should redirect to create account page when the corresponding link is clicked', async ({ page }) => {
    const createAccountRedirectedLink = await loginPage.createAccountRedirectedLink('https://my-stage.tractive.com/#/signup');
    expect(createAccountRedirectedLink).toBe(true);
  });

  // testing header 1
  test('Header 1 text should be in English (US) when this language is selected', async ({ page }) => {
    const languageForHeader1 = await loginPage.header1HasExpectedText('English (US)');
    expect(languageForHeader1).toBe(true);
  });

  test('Header 1 text should be in German when this language is selected', async ({ page }) => {
    const languageForHeader1 = await loginPage.header1HasExpectedText('Deutsch');
    expect(languageForHeader1).toBe(true);
  });

  test('Header 1 text should be in French when this language is selected', async ({ page }) => {
    const languageForHeader1 = await loginPage.header1HasExpectedText('Français');
    expect(languageForHeader1).toBe(true);
  });

  // testing header 2
  test('Header 2 text should be in English (US) when this language is selected', async ({ page }) => {
    const languageForHeader2 = await loginPage.header2HasExpectedText('English (US)');
    expect(languageForHeader2).toBe(true);
  });

  test('Header 2 text should be in German when this language is selected', async ({ page }) => {
    const languageForHeader2 = await loginPage.header2HasExpectedText('Deutsch');
    expect(languageForHeader2).toBe(true);
  });

  test('Header 2 text should be in French when this language is selected', async ({ page }) => {
    const languageForHeader2 = await loginPage.header2HasExpectedText('Français');
    expect(languageForHeader2).toBe(true);
  });
});