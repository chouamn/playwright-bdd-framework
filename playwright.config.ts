import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * playwright-bdd generates Playwright spec files from Gherkin feature files.
 * defineBddConfig() returns the directory where generated specs are placed (.features-gen/).
 * Run `npx bddgen` before `npx playwright test` to (re-)generate the specs.
 */
const testDir = defineBddConfig({
    features: 'resources/features/**/*.feature',
    steps: [
        'src/fixtures/test.ts',         // custom fixture definition (must be first)
        'src/step-definitions/**/*.steps.ts',
        'src/hooks/hooks.ts',
    ],
});

export default defineConfig({
    testDir,

    fullyParallel: true,

    // Prevent .only from being committed in CI
    forbidOnly: !!process.env['CI'],

    // Retry failed tests twice in CI; no retries locally
    retries: process.env['CI'] ? 2 : 0,

    // Limit parallelism in CI; use all CPU cores locally
    workers: process.env['CI'] ? 1 : undefined,

    reporter: [
        ['html', { open: 'never', outputFolder: 'test-results/html-report' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['list'],
    ],

    use: {
        baseURL: process.env['BASE_URL'] ?? 'https://census.gov',

        // Traces captured on first retry for post-mortem debugging
        trace: 'on-first-retry',

        // Capture screenshot / video only on failure to save storage
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',

        actionTimeout: 10_000,
        navigationTimeout: 30_000,
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],

    outputDir: 'test-results',
});
