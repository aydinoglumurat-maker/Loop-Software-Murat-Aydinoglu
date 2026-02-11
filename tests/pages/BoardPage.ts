import { Page, expect, Locator } from '@playwright/test';

export class BoardPage {
  constructor(private page: Page) {}

  async navigateToApplication(appName: string) {
    await this.page.getByRole('button', { name: new RegExp(appName) }).first().click();
  }

  private getColumn(columnName: string): Locator {
    // Find the column by its heading, then get the container div
    return this.page.getByRole('heading', { name: columnName }).locator('..').locator('..').first();
  }

  async verifyTaskInColumn(
    columnName: string,
    taskName: string,
    tags: string[]
  ) {
    const column = this.getColumn(columnName);
    try {
      await expect(column).toBeVisible();
    } catch (error) {
      console.error(`❌ ERROR: Column "${columnName}" is not visible`);
      throw error;
    }

    // Find the task card by looking for the task heading within the column
    const taskCard = column.getByRole('heading', { name: taskName }).locator('..').first();
    try {
      await expect(taskCard).toBeVisible();
    } catch (error) {
      console.error(`❌ ERROR: Task "${taskName}" is not visible in column "${columnName}"`);
      throw error;
    }

    // Verify each tag is present in the task card
    for (const tag of tags) {
      const tagLocator = taskCard.locator('div, generic').filter({ hasText: tag }).first();
      try {
        await expect(tagLocator).toBeVisible();
        console.log(`✓ Tag found: "${tag}"`);
      } catch (error) {
        console.error(`❌ ERROR: Tag "${tag}" not found in task "${taskName}"`);
        throw error;
      }
    }
    console.log(`✓ All tags verified for task "${taskName}" in column "${columnName}"`);
  }
}