import { test } from '@playwright/test';
import testCases from './data/testCases.json';
import { LoginPage } from './pages/LoginPage';
import { BoardPage } from './pages/BoardPage';

const credentials = {
  email: 'admin',
  password: 'password123'
};

test.describe('Data Driven Tests', () => {
  for (const tc of testCases) {
    test(tc.name, async ({ page }) => {
      const loginPage = new LoginPage(page);
      const boardPage = new BoardPage(page);

      // Login
      await loginPage.login(credentials.email, credentials.password);

      // Navigate to app
      await boardPage.navigateToApplication(tc.app);

      // Verify task, column, and tags
      await boardPage.verifyTaskInColumn(
        tc.column,
        tc.task,
        tc.tags
      );
    });
  }
});