import { HomePage } from '../pages/HomePage';
import { Logger } from '../utils/Logger';

/** Census ID split across its three input segments. */
export interface CensusID {
    q7m: string;
    frvr: string;
    dtcq: string;
}

/**
 * LoginActions orchestrates high-level business workflows related to authentication
 * on the Census Special Census application.
 *
 * This class operates at the business level — it expresses *what* the user is trying
 * to achieve, not *how* the page is implemented. All page-level details stay in HomePage.
 */
export class LoginActions {
    private readonly logger: Logger;

    constructor(private readonly homePage: HomePage) {
        this.logger = new Logger();
    }

    /**
     * Complete the full login workflow: navigate to the home page, enter the Census ID,
     * and click LOG IN.
     * @param censusId - The three Census ID segments
     * @param baseUrl - Base URL of the application
     */
    async loginWithCensusID(censusId: CensusID, baseUrl: string): Promise<void> {
        this.logger.log(
            `Starting login workflow for Census ID: ${censusId.q7m}-${censusId.frvr}-${censusId.dtcq}`,
        );
        try {
            await this.homePage.navigateToHomePage(baseUrl);

            const isLoaded = await this.homePage.isPageFullyLoaded();
            if (!isLoaded) {
                throw new Error('Census HomePage is not fully loaded — cannot proceed with login');
            }

            await this.homePage.enterCensusID(censusId.q7m, censusId.frvr, censusId.dtcq);
            this.logger.log('Census ID entered — clicking LOG IN');

            await this.homePage.clickLogin();
            this.logger.success(
                `Login workflow completed for Census ID: ${censusId.q7m}-${censusId.frvr}-${censusId.dtcq}`,
            );
        } catch (error) {
            await this.homePage.takeScreenshot('login-workflow-failure');
            this.logger.error('Login workflow failed', error as Error);
            throw error;
        }
    }

    /**
     * Check whether the Census HomePage is currently displayed.
     * @returns true if the welcome heading is visible
     */
    async verifyHomePageDisplayed(): Promise<boolean> {
        this.logger.log('Verifying Census HomePage is displayed');
        const isDisplayed = await this.homePage.isWelcomeHeadingVisible();
        this.logger.log(`Census HomePage displayed: ${isDisplayed}`);
        return isDisplayed;
    }

    /**
     * Verify that all three Census ID input fields are empty.
     * @returns true if all fields are empty
     */
    async verifyInputsAreEmpty(): Promise<boolean> {
        this.logger.log('Verifying all Census ID inputs are empty');
        try {
            const [q7m, frvr, dtcq] = await Promise.all([
                this.homePage.getQ7MValue(),
                this.homePage.getFRVRValue(),
                this.homePage.getDTCQValue(),
            ]);
            const allEmpty = q7m === '' && frvr === '' && dtcq === '';
            this.logger.log(
                `Census ID inputs state — Q7M: "${q7m}", FRVR: "${frvr}", DTCQ: "${dtcq}" — all empty: ${allEmpty}`,
            );
            return allEmpty;
        } catch (error) {
            this.logger.error('Failed to verify Census ID input state', error as Error);
            throw error;
        }
    }

    /**
     * Attempt login with a deliberately invalid Census ID to trigger validation errors.
     * @param censusId - The (invalid) three Census ID segments
     * @param baseUrl - Base URL of the application
     */
    async loginWithInvalidCensusID(censusId: CensusID, baseUrl: string): Promise<void> {
        this.logger.log(
            `Attempting login with invalid Census ID: ${censusId.q7m}-${censusId.frvr}-${censusId.dtcq}`,
        );
        try {
            await this.homePage.navigateToHomePage(baseUrl);
            await this.homePage.enterCensusID(censusId.q7m, censusId.frvr, censusId.dtcq);
            await this.homePage.clickLogin();
            this.logger.log('Submitted invalid Census ID — awaiting validation error response');
        } catch (error) {
            await this.homePage.takeScreenshot('invalid-login-workflow-failure');
            this.logger.error('Invalid login workflow encountered an unexpected error', error as Error);
            throw error;
        }
    }
}
