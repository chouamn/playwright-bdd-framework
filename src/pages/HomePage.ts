import { Page, Locator } from '@playwright/test';
import { BaseActions } from '../actions/BaseActions';

/**
 * HomePage encapsulates all locators and interactions specific to the
 * Census Special Census application's Home Page.
 *
 * Layout:
 *   - Header: "Welcome to the Special Census"
 *   - Instruction: "Please enter the 12-digit Census ID"
 *   - Three input fields: Q7M | FRVR | DTCQ
 *   - Purple "LOG IN" button
 *   - Help section (right panel)
 *   - Session timeout warning
 */
export class HomePage extends BaseActions {
    // ─────────────────────────────────────────────────────────────────────────
    // Locators
    // ─────────────────────────────────────────────────────────────────────────

    readonly q7mInput: Locator;
    readonly frvrInput: Locator;
    readonly dtcqInput: Locator;
    readonly loginButton: Locator;
    readonly welcomeHeading: Locator;
    readonly censusIdInstruction: Locator;
    readonly helpSection: Locator;
    readonly sessionTimeoutWarning: Locator;

    constructor(page: Page) {
        super(page);
        this.q7mInput = page.locator('input[id="q7m"]');
        this.frvrInput = page.locator('input[id="frvr"]');
        this.dtcqInput = page.locator('input[id="dtcq"]');
        this.loginButton = page.locator('button:has-text("LOG IN"), input[type="submit"][value="LOG IN"]');
        this.welcomeHeading = page.locator(
            'h1:has-text("Welcome"), h1:has-text("Special Census"), [class*="welcome"] h1',
        );
        this.censusIdInstruction = page.locator(
            'text=12-digit Census ID, text=enter the 12-digit, [class*="instruction"]',
        );
        this.helpSection = page.locator('[class*="help"], [id*="help"], aside');
        this.sessionTimeoutWarning = page.locator(
            'text=session, [class*="timeout"], [class*="warning"]',
        );
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Navigation Methods
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Navigate to the Census HomePage and verify it has loaded.
     * @param baseUrl - Base URL of the application (e.g. 'https://census.gov')
     */
    async navigateToHomePage(baseUrl: string): Promise<void> {
        this.logger.log(`Navigating to Census HomePage: ${baseUrl}`);
        try {
            await this.navigateTo(baseUrl);
            const loaded = await this.isPageFullyLoaded();
            if (!loaded) {
                throw new Error('Census HomePage did not load correctly — key elements missing');
            }
            this.logger.success('Census HomePage loaded successfully');
        } catch (error) {
            await this.takeScreenshot('navigate-to-homepage-failure');
            this.logger.error('Failed to navigate to Census HomePage', error as Error);
            throw error;
        }
    }

    /**
     * Verify that all critical page elements are present and visible.
     * @returns true if the page is fully loaded
     */
    async isPageFullyLoaded(): Promise<boolean> {
        this.logger.log('Verifying Census HomePage is fully loaded');
        try {
            const [q7mVisible, frvrVisible, dtcqVisible, loginVisible] = await Promise.all([
                this.isVisible(this.q7mInput),
                this.isVisible(this.frvrInput),
                this.isVisible(this.dtcqInput),
                this.isVisible(this.loginButton),
            ]);
            const loaded = q7mVisible && frvrVisible && dtcqVisible && loginVisible;
            this.logger.log(`Page fully loaded: ${loaded}`);
            return loaded;
        } catch (error) {
            this.logger.error('Error checking if page is fully loaded', error as Error);
            return false;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Input Methods
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Enter the first Census ID segment (Q7M field).
     * @param value - Value to enter into the Q7M field
     */
    async enterQ7M(value: string): Promise<void> {
        this.logger.log(`Entering Q7M value: "${value}"`);
        await this.fill(this.q7mInput, value);
    }

    /**
     * Enter the second Census ID segment (FRVR field).
     * @param value - Value to enter into the FRVR field
     */
    async enterFRVR(value: string): Promise<void> {
        this.logger.log(`Entering FRVR value: "${value}"`);
        await this.fill(this.frvrInput, value);
    }

    /**
     * Enter the third Census ID segment (DTCQ field).
     * @param value - Value to enter into the DTCQ field
     */
    async enterDTCQ(value: string): Promise<void> {
        this.logger.log(`Entering DTCQ value: "${value}"`);
        await this.fill(this.dtcqInput, value);
    }

    /**
     * Enter all three Census ID segments at once.
     * @param q7m - First Census ID part
     * @param frvr - Second Census ID part
     * @param dtcq - Third Census ID part
     */
    async enterCensusID(q7m: string, frvr: string, dtcq: string): Promise<void> {
        this.logger.log(`Entering full Census ID: ${q7m}-${frvr}-${dtcq}`);
        await this.enterQ7M(q7m);
        await this.enterFRVR(frvr);
        await this.enterDTCQ(dtcq);
        this.logger.success('Census ID entered successfully');
    }

    /**
     * Clear all three Census ID input fields.
     */
    async clearAllInputs(): Promise<void> {
        this.logger.log('Clearing all Census ID input fields');
        await this.clear(this.q7mInput);
        await this.clear(this.frvrInput);
        await this.clear(this.dtcqInput);
        this.logger.success('All Census ID inputs cleared');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Action Methods
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Click the LOG IN button.
     */
    async clickLogin(): Promise<void> {
        this.logger.log('Clicking LOG IN button');
        await this.click(this.loginButton);
    }

    /**
     * Clear the Q7M input field.
     */
    async clearQ7M(): Promise<void> {
        await this.clear(this.q7mInput);
    }

    /**
     * Clear the FRVR input field.
     */
    async clearFRVR(): Promise<void> {
        await this.clear(this.frvrInput);
    }

    /**
     * Clear the DTCQ input field.
     */
    async clearDTCQ(): Promise<void> {
        await this.clear(this.dtcqInput);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Verification Methods
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Verify that the welcome heading is visible on the page.
     * @returns true if the heading is visible
     */
    async isWelcomeHeadingVisible(): Promise<boolean> {
        return this.isVisible(this.welcomeHeading);
    }

    /**
     * Verify that the Census ID instruction text is visible.
     * @returns true if the instruction text is visible
     */
    async isCensusIdInstructionVisible(): Promise<boolean> {
        return this.isVisible(this.censusIdInstruction);
    }

    /**
     * Verify that the help section panel is visible.
     * @returns true if the help section is visible
     */
    async isHelpSectionVisible(): Promise<boolean> {
        return this.isVisible(this.helpSection);
    }

    /**
     * Verify that the LOG IN button is enabled and ready to click.
     * @returns true if the button is enabled
     */
    async isLoginButtonEnabled(): Promise<boolean> {
        return this.isEnabled(this.loginButton);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Getter Methods
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Get the text content of the welcome heading.
     * @returns Heading text
     */
    async getWelcomeHeadingText(): Promise<string> {
        return this.getText(this.welcomeHeading);
    }

    /**
     * Get the current value of the Q7M input field.
     * @returns Q7M field value
     */
    async getQ7MValue(): Promise<string> {
        return this.getValue(this.q7mInput);
    }

    /**
     * Get the current value of the FRVR input field.
     * @returns FRVR field value
     */
    async getFRVRValue(): Promise<string> {
        return this.getValue(this.frvrInput);
    }

    /**
     * Get the current value of the DTCQ input field.
     * @returns DTCQ field value
     */
    async getDTCQValue(): Promise<string> {
        return this.getValue(this.dtcqInput);
    }
}
