# Asana Demo – Data-Driven Playwright Test Suite

## Overview

This project demonstrates a **JSON object-driven approach** to automated testing using Playwright. This methodology eliminates code duplication and improves test scalability by centralizing test case definitions in a JSON file, allowing the test logic to dynamically adapt to different scenarios without repeating code.

## What is the JSON Object-Driven Approach?

### The Problem with Traditional Testing

In traditional test automation, you often write individual test cases with repetitive code:

```typescript
// ❌ Not scalable - lots of duplication
test('Test 1: Login and verify task in column', async ({ page }) => {
  // Login code
  // Navigate code
  // Verification code
});

test('Test 2: Login and verify different task', async ({ page }) => {
  // Login code (repeated)
  // Navigate code (repeated)
  // Verification code (similar but different)
});

test('Test 3: Login and verify yet another task', async ({ page }) => {
  // Login code (repeated again)
  // Navigate code (repeated again)
  // Verification code (yet another variant)
});
```

### The Solution: JSON-Driven Testing

Instead, we define test cases as data in a JSON file and use a single parameterized test that adapts based on the data:

```typescript
// ✅ DRY Principle - Single test logic, multiple scenarios
test.describe('Asana Demo – Data Driven Tests', () => {
  for (const tc of testCases) {
    test(tc.name, async ({ page }) => {
      // Single test logic that adapts to any test case data
      await loginPage.login(credentials.email, credentials.password);
      await boardPage.navigateToApplication(tc.app);
      await boardPage.verifyTaskInColumn(tc.column, tc.task, tc.tags);
    });
  }
});
```

## Project Structure

```
.
├── tests/
│   ├── asana.spec.ts           # Main test file with parameterized logic
│   ├── pages/
│   │   ├── LoginPage.ts        # Page Object for login automation
│   │   └── BoardPage.ts        # Page Object for board navigation & verification
│   └── data/
│       └── testCases.json      # Test case definitions (JSON-driven data)
├── playwright.config.ts        # Playwright configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## The JSON Test Case Structure

### testCases.json

```json
[
  {
    "name": "Web App – Implement user authentication",  // Test name
    "app": "Web Application",                           // Application to navigate to
    "task": "Implement user authentication",            // Task to verify
    "column": "To Do",                                 // Expected column
    "tags": ["Feature", "High Priority"]              // Expected tags
  },
  {
    "name": "Web App – Fix navigation bug",
    "app": "Web Application",
    "task": "Fix navigation bug",
    "column": "To Do",
    "tags": ["Bug"]
  }
  // ... more test cases
]
```

### Key Properties

| Property | Type | Purpose |
|----------|------|---------|
| `name` | string | Descriptive test case name (appears in test reports) |
| `app` | string | The application to navigate to (Web Application, Mobile Application, etc.) |
| `task` | string | The task/card title to verify |
| `column` | string | The expected Kanban column (To Do, In Progress, Done, Review) |
| `tags` | array | List of expected tags on the task card |

## How It Works

### 1. Data-Driven Loop

The test file loops through all JSON test cases and creates a test for each:

```typescript
for (const tc of testCases) {
  test(tc.name, async ({ page }) => {
    // Test executes with tc data
  });
}
```

### 2. Reusable Test Logic

The same test steps run for all cases, but with different data:

```typescript
// These steps work for ANY test case data
await loginPage.login(credentials.email, credentials.password);
await boardPage.navigateToApplication(tc.app);
await boardPage.verifyTaskInColumn(tc.column, tc.task, tc.tags);
```

### 3. Page Objects Handle Automation

Page objects encapsulate the interaction logic:

- **LoginPage**: Handles login with username/password
- **BoardPage**: Navigates to applications and verifies tasks with tags

## Key Benefits

### ✅ Scalability
- Add new test cases by simply adding objects to the JSON array
- No code changes needed for new test scenarios

### ✅ Maintainability
- Single source of truth for test data
- If page selectors change, fix them once in the page object
- Easy to review all test cases at a glance

### ✅ Reduced Duplication
- Login logic written once, reused across all tests
- Navigation logic written once, reused across all tests
- Single verification method handles all tag checks

### ✅ Clear Separation of Concerns
- **Test Data** (JSON) → What to test
- **Page Objects** (TypeScript) → How to interact with the app
- **Test Spec** (TypeScript) → Orchestration/flow

### ✅ Easy to Extend
Adding a new test case requires only a JSON object:

```json
{
  "name": "New Test Case",
  "app": "Mobile Application",
  "task": "Some new task",
  "column": "In Progress",
  "tags": ["Feature"]
}
```

## Login Credentials

```
Email/Username: admin
Password: password123
URL: https://animated-gingersnap-8cf7f2.netlify.app/
```

## Running Tests

### Run All Tests
```bash
npm test
# or
npx playwright test
```

### Run Specific Test
```bash
npx playwright test --grep "Implement user authentication"
```

### Run with UI Mode
```bash
npx playwright test --ui
```

### Run with Headed Browser
```bash
npx playwright test --headed
```

## Error Handling

The BoardPage includes comprehensive error handling with detailed console output:

```
✓ Tag found: "Feature"
✓ Tag found: "High Priority"  
✓ All tags verified for task "Implement user authentication" in column "To Do"
```

Errors are logged with context:
```
❌ ERROR: Column "To Do" is not visible
❌ ERROR: Task "Implement user authentication" is not visible in column "To Do"
❌ ERROR: Tag "Feature" not found in task "Implement user authentication"
```

## Test Coverage

The test suite covers 6 data-driven scenarios:

1. **Web App – Implement user authentication** (To Do, Feature + High Priority)
2. **Web App – Fix navigation bug** (To Do, Bug)
3. **Web App – Design system updates** (In Progress, Design)
4. **Mobile App – Push notification system** (To Do, Feature)
5. **Mobile App – Offline mode** (In Progress, Feature + High Priority)
6. **Mobile App – App icon design** (Done, Design)

## Page Objects

### LoginPage.ts

Handles authentication:
- Navigates to the login page
- Fills username and password fields
- Clicks the "Sign In" button
- Waits for dashboard to appear

### BoardPage.ts

Handles navigation and verification:
- **navigateToApplication()** - Clicks the application button to navigate
- **getColumn()** - Locates a column by its heading
- **verifyTaskInColumn()** - Checks if task exists in column with correct tags

## Why This Approach Scales

### Problem: Adding 100 Tests Manually
```
❌ Would require ~300 lines of duplicated test code
❌ Hard to maintain and update
❌ Changes to page selectors require updates in many places
```

### Solution: JSON-Driven
```
✅ Add 100 test cases as 100 JSON objects
✅ Test logic remains the same (no code changes)
✅ Updates to page selectors made once in page objects
```

## Configuration

See [playwright.config.ts](playwright.config.ts) for:
- Base URL
- Browser options
- Viewport size
- Screenshot/video capture settings

## Best Practices

1. **Keep JSON clean** - Use consistent naming and structure
2. **Update test data slowly** - Modify one property at a time when debugging
3. **Use meaningful names** - Test names should describe what's being tested
4. **Document variations** - Comment complex test scenarios in JSON
5. **Leverage page objects** - Keep selectors and logic in page classes, not tests

## Future Enhancements

- Add more test cases to testCases.json
- Create additional page objects for other workflows
- Add test result reporting
- Implement parallel test execution
- Add performance benchmarking

## Conclusion

This JSON object-driven approach demonstrates how to build scalable, maintainable test automation with minimal code duplication. By separating test data from test logic, you can easily expand your test coverage without writing redundant code.
