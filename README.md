# Playwright TypeScript QA Automation Core (`pw-ts-core`)

An industry-standard, enterprise-ready QA automation prototype utilizing Playwright, TypeScript, and Mock Service Worker (MSW).

## Overview

This framework demonstrates a scalable architecture for both UI and API testing, encompassing:
- **E2E UI Testing:** Emulating real user workflows (e.g., Automation Exercise checkout).
- **Edge-Case UI Testing:** Handling dynamic IDs, network delays, and hidden layers (UI Testing Playground).
- **API Testing:** CRUD validations against Restful-Booker.
- **API Mocking & Interception:** Utilizing Mock Service Worker (MSW) to mock HTTP endpoints and simulate server errors (4xx/5xx).
- **Automated Bug Logging:** A custom Playwright reporter that creates Jira tickets upon test failures.

## Setup Instructions

1. **Install Node.js (v20+)**
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Install Playwright Browsers:**
   ```bash
   npx playwright install --with-deps chromium
   ```

## Test Execution

The test suite is strictly separated into two paths, orchestratable via `package.json` scripts. Note that the scripts use `cross-env` to pass the appropriate `MOCK_API` flag dynamically, ensuring that the MSW layer gracefully engages only when intended, avoiding any collision with Node's native Fetch routines.

### 1. Happy Path Suite
Executes successful E2E UI checkouts, UI edge-case handling, and standard 200 OK API CRUD validations. Real endpoints are used.
```bash
npm run test:pass_suite
```
*Note:* Browser contexts are securely managed by standard Playwright fixture isolation, preventing state bleed between checkouts.

### 2. Negative Path Suite
Executes an intentional UI failure (designed to trigger the Jira mock bug logging) and API tests that intentionally hit mocked 4xx/5xx endpoints to demonstrate error handling. MSW API mocking is forcibly enabled (`MOCK_API=true`).
```bash
npm run test:demo_failure
```

## Reporting

The framework utilizes standard Playwright HTML reporting, Allure reporting, and the custom Jira bug-logging logic.

To view the HTML report after execution:
```bash
npx playwright show-report playwright-report
```

To generate and serve the Allure report:
```bash
npx allure serve allure-results
```

## Transitioning Jira Integration to Live

By default, test failures (in the Negative Path) log bug details to an MSW mock. The custom Jira reporter (`utils/jiraReporter.ts`) captures the stack trace directly via Playwright's `TestResult` object and integrates visually rich traces.

To transition this to a real Jira instance:

1. Locate the `.env` file in the project root.
2. Update the environment variables:
   ```env
   # Ensure MOCK_API=false is set for real endpoint Jira ingestion
   MOCK_API=false

   # Provide your live Jira credentials
   JIRA_URL=https://your-domain.atlassian.net
   JIRA_EMAIL=your.email@example.com
   JIRA_TOKEN=your_atlassian_api_token
   JIRA_PROJECT_KEY=BUG
   ```
3. The custom reporter will now utilize Basic Auth and POST directly to your live Jira instance on test failures.

## CI/CD (GitHub Actions)

Separate workflows are configured in `.github/workflows`:
- `pass-suite.yml`: Triggers on push/PR to main, executing the Happy Path.
- `negative-suite.yml`: Configured for manual dispatch to execute the Negative Path.

Reports and traces are archived as workflow artifacts.
