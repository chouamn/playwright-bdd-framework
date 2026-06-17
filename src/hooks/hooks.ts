import { Before, After, BeforeAll, AfterAll } from '../fixtures/test';
import { Logger } from '../utils/Logger';
import * as path from 'path';
import * as fs from 'fs';

const logger = new Logger();

// ─────────────────────────────────────────────────────────────────────────────
// Worker-scoped hooks — run once per Playwright worker process
// BeforeAll/AfterAll only receive worker fixtures ($workerInfo), NOT page.
// ─────────────────────────────────────────────────────────────────────────────

BeforeAll(async ({ $workerInfo }) => {
    ensureDir('test-results/screenshots');
    ensureDir('test-results/videos');
    logger.log(`Worker ${$workerInfo.workerIndex} starting`);
});

AfterAll(async ({ $workerInfo }) => {
    logger.success(`Worker ${$workerInfo.workerIndex} finished`);
});

// ─────────────────────────────────────────────────────────────────────────────
// Scenario-scoped hooks — run before / after each scenario
// Before/After receive all test fixtures (page, fixtures, $testInfo, $tags …)
// ─────────────────────────────────────────────────────────────────────────────

Before(async ({ page, $testInfo }) => {
    logger.log(`Scenario starting: "${$testInfo.title}"`);
    logger.log(`Page URL: ${page.url()}`);
});

After(async ({ page, $testInfo }) => {
    const { status, expectedStatus, title } = $testInfo;

    if (status !== expectedStatus) {
        logger.warn(`Scenario FAILED: "${title}" (status: ${status})`);

        const safeName = title.replace(/[^a-z0-9]/gi, '_').substring(0, 80);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = path.resolve(
            'test-results',
            'screenshots',
            `FAILED-${safeName}-${timestamp}.png`,
        );

        try {
            await page.screenshot({ path: screenshotPath, fullPage: true });
            logger.log(`Failure screenshot saved: ${screenshotPath}`);
        } catch {
            logger.warn('Could not capture failure screenshot — page may be closed');
        }
    } else {
        logger.success(`Scenario PASSED: "${title}"`);
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function ensureDir(dirPath: string): void {
    const resolved = path.resolve(dirPath);
    if (!fs.existsSync(resolved)) {
        fs.mkdirSync(resolved, { recursive: true });
    }
}
