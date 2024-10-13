import { Locator, Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(url: string) {
    await this.page.goto(url);
  }

  async reload() {
    await this.page.reload();
  }

  async setCookies() {
    await this.page.context().addCookies([
      {
        name: 'interview',
        value: '7lBPV9iik6r9MNE5dKw9nzF9CstdlEJl',
        domain: '.tractive.com',
        path: '/',
      },
    ]);
  }

  async isRedirectedPageVisible(redirectedUrl: string)
  {
    await this.page.waitForURL(redirectedUrl); 
    const currentUrl = await this.page.url();

    return currentUrl === redirectedUrl;
  }

  async isButtonInExpectedState(buttonLocator: Locator, isDisabledExpected: boolean, timeout: number = 30000): Promise<boolean> {
    await buttonLocator.waitFor({state: 'visible'});
    const startTime = Date.now();

    while (true) {
        if (isDisabledExpected) {
          if (await buttonLocator.isDisabled())
          {
            return true;
          }
        }
        else
        {
          if (await buttonLocator.isEnabled())
            {
              return true;
            }
        } 

        // Check if the timeout has been reached
        if (Date.now() - startTime > timeout) {
            throw new Error('Timeout waiting for button to be get expected state');
        }

        // Wait for a short period before retrying
        await new Promise(resolve => setTimeout(resolve, 100)); // Wait 100 ms
    }
  }
}