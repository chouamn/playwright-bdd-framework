import { test as base, createBdd } from 'playwright-bdd';
import { FixtureManager } from './FixtureManager';

/**
 * CensusFixtures extends playwright-bdd's base test object with the FixtureManager,
 * making all page objects and action classes available in every step definition
 * and playwright-bdd hook via destructuring:
 *
 *   Given('...', async ({ fixtures }) => {
 *       await fixtures.pages.home.navigateToHomePage(url);
 *       await fixtures.actions.login.loginWithCensusID(id, url);
 *   });
 *
 * IMPORTANT: base must come from 'playwright-bdd', not '@playwright/test',
 * so that playwright-bdd can track the fixture chain for code generation.
 */
type CensusFixtures = {
    fixtures: FixtureManager;
};

export const test = base.extend<CensusFixtures>({
    fixtures: async ({ page }, use) => {
        await use(new FixtureManager(page));
    },
});

/**
 * All BDD primitives (steps + hooks) bound to our custom fixture.
 * Import from this file in every step-definition and hook file.
 */
export const { Given, When, Then, Before, After, BeforeAll, AfterAll } = createBdd(test);
