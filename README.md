# Census Special Census — Playwright BDD Test Automation Framework

Enterprise-grade end-to-end test automation framework built with **Playwright**, **TypeScript**, and **Cucumber BDD** for the Census Special Census Application.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers (one-time)
npx playwright install --with-deps

# 3. Generate Playwright spec files from feature files
npx bddgen

# 4. Run smoke tests
npm run test:smoke

# 5. View the HTML report
npx playwright show-report test-results/html-report
```

> **How playwright-bdd works:** `bddgen` reads your `.feature` files and generates
> native Playwright spec files in `.features-gen/`. Those specs are then executed by
> `playwright test`. The generated files are gitignored — re-run `bddgen` any time
> you add or change a feature file.

---

## Project Structure

```
project-root/
├── src/
│   ├── pages/              # Page Objects — locators + page-specific methods
│   ├── actions/            # BaseActions (low-level Playwright) + business workflows
│   ├── step-definitions/   # Cucumber step definitions (thin wrappers)
│   ├── fixtures/           # Dependency injection (PageFixture, ActionFixture, FixtureManager)
│   ├── factories/          # Test data generation (DataFactory)
│   ├── hooks/              # Cucumber lifecycle hooks (Before/After/BeforeAll/AfterAll)
│   ├── utils/              # Logger, ConfigReader
│   ├── config/             # (reserved for future typed config objects)
│   ├── types/              # (reserved for shared TypeScript interfaces)
│   └── world/              # CustomWorld — attaches Page + fixtures to Cucumber context
│
├── resources/
│   ├── features/           # Gherkin feature files
│   ├── test-data/          # Static JSON test data
│   └── env/                # Environment-specific .env files
│
├── test-results/           # Generated: screenshots, videos, HTML & JSON reports
├── playwright.config.ts
├── cucumber.js
├── tsconfig.json
└── package.json
```

---

## Architecture

The framework follows a strict **4-layer architecture** to keep concerns separated:

```
Step Definitions  (WHAT the test does — business language)
       ↓
  Action Layer    (HOW the business goal is achieved — workflows)
       ↓
   Page Layer     (WHERE elements live — locators + page methods)
       ↓
  BaseActions     (Playwright API — reusable, logged, error-handled)
```

| Layer | Class | Responsibility |
|---|---|---|
| Technical | `BaseActions` | All raw Playwright calls — click, fill, wait, etc. |
| Page | `HomePage` | Census-specific locators and page methods |
| Business | `LoginActions` | Multi-step workflows like "login with Census ID" |
| Steps | `home.steps.ts` | Thin Cucumber steps — 1–3 lines each |

**Dependency injection** is handled by three fixture classes:

- `PageFixture` — creates all page objects
- `ActionFixture` — creates all action classes, receives `PageFixture`
- `FixtureManager` — single entry point used by hooks and steps

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Generate specs + run all tests headless (ENV=test) |
| `npm run test:headed` | Generate specs + run with browser visible |
| `npm run test:debug` | Generate specs + Playwright debug mode |
| `npm run test:ci` | Generate specs + run parallel (4 workers) |
| `npm run test:smoke` | Generate specs + run `@smoke` tagged tests |
| `npm run test:regression` | Generate specs + run `@regression` tagged tests |
| `npm run test:chromium` | Generate specs + run Chromium project only |
| `npm run report` | Open Playwright HTML report |
| `npm run bddgen` | Generate specs only (no test run) |

### Switching environments

```bash
# Windows PowerShell
$env:ENV = "stage"; npm test

# macOS / Linux / Git Bash
ENV=stage npm test
```

Available environments: `test` (default), `dev`, `stage`, `prod`.

---

## How to Add a New Page

1. Create `src/pages/MyPage.ts` extending `BaseActions`
2. Add locators as `readonly` fields in the constructor
3. Add page-specific methods using inherited `BaseActions` methods
4. Add an instance getter to `src/fixtures/PageFixture.ts`

```typescript
// src/pages/MyPage.ts
import { Page } from '@playwright/test';
import { BaseActions } from '../actions/BaseActions';

export class MyPage extends BaseActions {
    readonly myButton = this.page.locator('#my-button');

    constructor(page: Page) { super(page); }

    async clickMyButton(): Promise<void> {
        await this.click(this.myButton);
    }
}
```

```typescript
// src/fixtures/PageFixture.ts — add getter
get myPage(): MyPage { return this._myPage; }
```

---

## How to Add a New Business Action

1. Create `src/actions/MyActions.ts`
2. Accept the required page objects via the constructor
3. Implement workflow methods that orchestrate page interactions
4. Add a getter to `src/fixtures/ActionFixture.ts`

---

## How to Add a New Feature

1. Create `resources/features/My.Feature.feature`
2. Write Gherkin scenarios using business language only
3. Add matching step definitions to `src/step-definitions/my.steps.ts`
4. Register new steps in `cucumber.js` (already glob-matched — nothing to change)

---

## Debugging

### Screenshot on failure
Automatically saved to `test-results/screenshots/FAILED-<scenario>-<timestamp>.png`.

### Video recording
Saved to `test-results/videos/` for every scenario (trimmed by Playwright to failures only when `video: 'retain-on-failure'`).

### Playwright trace
Captured on first retry — open with:
```bash
npx playwright show-trace test-results/trace.zip
```

### Headed mode
```bash
npm run test:headed
```

---

## Best Practices

- **Page objects stay thin** — locators + atomic methods only, no business logic
- **Actions own workflows** — multi-step processes belong in action classes
- **Steps stay thin** — 1–3 lines per step, delegate to actions/pages
- **No hardcoded waits** — always use explicit Playwright waits via `BaseActions`
- **Log at every step** — every `BaseActions` method logs entry and exit
- **Error handling** — every method wraps in try/catch, screenshots on failure

---

## CI/CD Integration

### GitHub Actions

```yaml
- name: Install dependencies
  run: npm ci

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: npm run test:ci
  env:
    ENV: test
    CI: true

- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: test-results
    path: test-results/
```

### Jenkins

```groovy
stage('Test') {
    steps {
        sh 'npm ci'
        sh 'npx playwright install --with-deps'
        sh 'ENV=test npm run test:ci'
    }
    post {
        always {
            publishHTML(target: [reportDir: 'test-results/html-report', reportFiles: 'index.html'])
            junit 'test-results/junit.xml'
        }
    }
}
```

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `Cannot find module` error | Run `npm install` then `npx tsc --noEmit` to check for type errors |
| Browser not found | Run `npx playwright install --with-deps` |
| Timeout on element | Increase `TIMEOUT` in the active `.env` file |
| Step not found | Re-run `npx bddgen` to regenerate specs, then check step text matches exactly |
| `createBdd() should use test from playwright-bdd` | Make sure `src/fixtures/test.ts` imports `test` from `playwright-bdd`, not `@playwright/test` |
| `Cannot find module playwright/lib/...` | Ensure `playwright` and `@playwright/test` are pinned to the same version |
| Tests fail in CI but pass locally | Check `HEADLESS=true` and `BASE_URL` in `.env.test` |

---

## Reporting Bugs

Open an issue in your project tracker with:
- Scenario name that failed
- Screenshot from `test-results/screenshots/`
- The Cucumber HTML report entry
- Environment (`ENV`) used
