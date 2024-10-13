import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';

test.describe('Tractive Registration Tests', () => {

  let registrationPage: RegistrationPage;

  test.beforeEach(async ({ page }) => {
    registrationPage = new RegistrationPage(page);
    await registrationPage.navigateToSignUpPage();
  });

  test('should register successfully with valid inputs', async ({ page }) => {
    await registrationPage.register('John', 'Doe', 'john.doe@test.com', 'password123');
    const isRegistered = await registrationPage.isRegistered();
    expect(isRegistered).toBe(true);
  });

  test('Create Account button is disable for empty fields', async ({ page }) => {
    await registrationPage.fillUserInformation('', '', '', '');
    const isCreateAccountButtonDisable = await registrationPage.isCreateAccountButtonDisable();
    expect(isCreateAccountButtonDisable).toBe(true);
  });

  test('should show error message for invalid email', async ({ page }) => {
    await registrationPage.fillUserInformation('John', 'Doe', 'invalid-email', 'password123');
    const isEmailErrorMessageVisible = await registrationPage.isEmailErrorMessageVisible();
    expect(isEmailErrorMessageVisible).toBe(true);
  });

  test('should show error message for missing required first name', async ({ page }) => {
    await registrationPage.fillUserInformation('', 'Doe', 'invalid-email', 'password123');
    const isFieldRequired = await registrationPage.isFieldRequired();
    expect(isFieldRequired).toBe(true);
  });

  test('should show error message for missing required last name', async ({ page }) => {
    await registrationPage.fillUserInformation('John', '', 'invalid-email', 'password123');
    const isFieldRequired = await registrationPage.isFieldRequired();
    expect(isFieldRequired).toBe(true);
  });

  test('should show error message for missing required password', async ({ page }) => {
    await registrationPage.fillUserInformation('John', 'Doe', 'john.doe@test.com', '');
    await registrationPage.moveOutFromPasswordInput();
    const isFieldRequired = await registrationPage.isFieldRequired();
    expect(isFieldRequired).toBe(true);
  });

  test('should redirect to terms and conditions page when the corresponding link is clicked', async ({ page }) => {
    const termsAndConditionsLink = await registrationPage.termsAndConditionsDocumentLink();
    expect(termsAndConditionsLink).toBe('https://assets.tractive.com/static/legal/en/terms-of-service.pdf');
  });
});