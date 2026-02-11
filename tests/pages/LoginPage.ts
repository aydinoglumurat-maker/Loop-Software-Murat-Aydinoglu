import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.goto('/');
    await this.page.getByRole('textbox', { name: /username/i }).fill(email);
    await this.page.getByRole('textbox', { name: /password/i }).fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();

    // Wait for dashboard to appear
    await expect(
      this.page.getByRole('button', { name: /Web Application/ }).first()
    ).toBeVisible();
  }
}