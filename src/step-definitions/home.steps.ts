import { expect } from '@playwright/test';
import { Given, When, Then } from '../fixtures/test';
import { ConfigReader } from '../utils/ConfigReader';

const config = ConfigReader.getInstance();

// ─────────────────────────────────────────────────────────────────────────────
// Given — preconditions
// ─────────────────────────────────────────────────────────────────────────────

Given('User navigates to Census HomePage', async ({ fixtures }) => {
    await fixtures.pages.home.navigateToHomePage(config.getBaseUrl());
});

Given('Census HomePage is displayed', async ({ fixtures }) => {
    const isDisplayed = await fixtures.pages.home.isWelcomeHeadingVisible();
    expect(isDisplayed).toBe(true);
});

// ─────────────────────────────────────────────────────────────────────────────
// When — actions
// ─────────────────────────────────────────────────────────────────────────────

When('User enters Census ID {string}', async ({ fixtures }, censusId: string) => {
    const parts = censusId.split('-');
    if (parts.length !== 3) {
        throw new Error(
            `Census ID must be in format "XXXX-XXXX-XXXX", received: "${censusId}"`,
        );
    }
    const [q7m, frvr, dtcq] = parts;
    await fixtures.pages.home.enterCensusID(q7m, frvr, dtcq);
});

When('User clicks LOGIN button', async ({ fixtures }) => {
    await fixtures.pages.home.clickLogin();
});

When('User clears all Census ID fields', async ({ fixtures }) => {
    await fixtures.pages.home.clearAllInputs();
});

When('User enters Q7M segment {string}', async ({ fixtures }, value: string) => {
    await fixtures.pages.home.enterQ7M(value);
});

When('User enters FRVR segment {string}', async ({ fixtures }, value: string) => {
    await fixtures.pages.home.enterFRVR(value);
});

When('User enters DTCQ segment {string}', async ({ fixtures }, value: string) => {
    await fixtures.pages.home.enterDTCQ(value);
});

// ─────────────────────────────────────────────────────────────────────────────
// Then — assertions
// ─────────────────────────────────────────────────────────────────────────────

Then('Welcome heading should be visible', async ({ fixtures }) => {
    const isVisible = await fixtures.pages.home.isWelcomeHeadingVisible();
    expect(isVisible).toBe(true);
});

Then('Census ID instructions should be visible', async ({ fixtures }) => {
    const isVisible = await fixtures.pages.home.isCensusIdInstructionVisible();
    expect(isVisible).toBe(true);
});

Then('Help section should be visible', async ({ fixtures }) => {
    const isVisible = await fixtures.pages.home.isHelpSectionVisible();
    expect(isVisible).toBe(true);
});

Then('LOGIN button should be enabled', async ({ fixtures }) => {
    const isEnabled = await fixtures.pages.home.isLoginButtonEnabled();
    expect(isEnabled).toBe(true);
});

Then('All Census ID inputs should be empty', async ({ fixtures }) => {
    const allEmpty = await fixtures.actions.login.verifyInputsAreEmpty();
    expect(allEmpty).toBe(true);
});

Then('User should be logged in successfully', async ({ fixtures }) => {
    const currentUrl = await fixtures.pages.home.getPageUrl();
    const baseUrl = config.getBaseUrl();
    expect(currentUrl).not.toBe(baseUrl);
});

Then('Submission should be successful', async ({ fixtures }) => {
    const currentUrl = await fixtures.pages.home.getPageUrl();
    const baseUrl = config.getBaseUrl();
    expect(currentUrl).not.toBe(baseUrl);
});

Then('Page title should contain {string}', async ({ fixtures }, expectedTitle: string) => {
    const title = await fixtures.pages.home.getPageTitle();
    expect(title).toContain(expectedTitle);
});

Then('Census HomePage should be fully loaded', async ({ fixtures }) => {
    const loaded = await fixtures.pages.home.isPageFullyLoaded();
    expect(loaded).toBe(true);
});
