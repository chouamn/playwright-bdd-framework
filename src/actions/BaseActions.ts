import { Page, Locator, BrowserContext } from '@playwright/test';
import { Logger } from '../utils/Logger';

/**
 * BaseActions is the lowest technical layer of the framework.
 * All page objects extend this class to gain access to standardised,
 * logged, and error-handled Playwright interaction methods.
 */
export class BaseActions {
    protected readonly page: Page;
    protected readonly logger: Logger;
    protected readonly defaultTimeout: number;

    constructor(page: Page, timeoutMs = 10_000) {
        this.page = page;
        this.logger = new Logger();
        this.defaultTimeout = timeoutMs;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Mouse Interactions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Click an element identified by a CSS selector or Locator.
     * @param selector - CSS selector string or Playwright Locator
     */
    async click(selector: string | Locator): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Clicking element: ${selector}`);
        try {
            await target.click({ timeout: this.defaultTimeout });
            this.logger.success(`Clicked element: ${selector}`);
        } catch (error) {
            this.logger.error(`Failed to click element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Double-click an element.
     * @param selector - CSS selector string or Playwright Locator
     */
    async doubleClick(selector: string | Locator): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Double-clicking element: ${selector}`);
        try {
            await target.dblclick({ timeout: this.defaultTimeout });
            this.logger.success(`Double-clicked element: ${selector}`);
        } catch (error) {
            this.logger.error(`Failed to double-click element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Right-click an element.
     * @param selector - CSS selector string or Playwright Locator
     */
    async rightClick(selector: string | Locator): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Right-clicking element: ${selector}`);
        try {
            await target.click({ button: 'right', timeout: this.defaultTimeout });
            this.logger.success(`Right-clicked element: ${selector}`);
        } catch (error) {
            this.logger.error(`Failed to right-click element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Hover the mouse over an element.
     * @param selector - CSS selector string or Playwright Locator
     */
    async hover(selector: string | Locator): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Hovering over element: ${selector}`);
        try {
            await target.hover({ timeout: this.defaultTimeout });
            this.logger.success(`Hovered over element: ${selector}`);
        } catch (error) {
            this.logger.error(`Failed to hover over element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Drag an element and drop it onto a target element.
     * @param source - Source element selector or Locator
     * @param target - Target element selector or Locator
     */
    async dragAndDrop(source: string | Locator, target: string | Locator): Promise<void> {
        const sourceLocator = this.resolve(source);
        const targetLocator = this.resolve(target);
        this.logger.log(`Dragging from ${source} to ${target}`);
        try {
            await sourceLocator.dragTo(targetLocator);
            this.logger.success(`Drag-and-drop completed from ${source} to ${target}`);
        } catch (error) {
            this.logger.error(`Failed to drag-and-drop from ${source} to ${target}`, error as Error);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Keyboard Interactions
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Clear an input and fill it with the provided text.
     * @param selector - CSS selector string or Playwright Locator
     * @param text - Text to enter
     */
    async fill(selector: string | Locator, text: string): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Filling element: ${selector} with text: "${text}"`);
        try {
            await target.fill(text, { timeout: this.defaultTimeout });
            this.logger.success(`Filled element: ${selector}`);
        } catch (error) {
            this.logger.error(`Failed to fill element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Type text into an element character by character (simulates real keypresses).
     * @param selector - CSS selector string or Playwright Locator
     * @param text - Text to type
     */
    async type(selector: string | Locator, text: string): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Typing into element: ${selector} — text: "${text}"`);
        try {
            await target.pressSequentially(text, { delay: 50 });
            this.logger.success(`Typed into element: ${selector}`);
        } catch (error) {
            this.logger.error(`Failed to type into element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Clear the value of an input field.
     * @param selector - CSS selector string or Playwright Locator
     */
    async clear(selector: string | Locator): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Clearing element: ${selector}`);
        try {
            await target.clear({ timeout: this.defaultTimeout });
            this.logger.success(`Cleared element: ${selector}`);
        } catch (error) {
            this.logger.error(`Failed to clear element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Press a single keyboard key.
     * @param key - Key name (e.g. 'Enter', 'Escape', 'Tab', 'ArrowDown')
     */
    async pressKey(key: string): Promise<void> {
        this.logger.log(`Pressing key: ${key}`);
        try {
            await this.page.keyboard.press(key);
            this.logger.success(`Pressed key: ${key}`);
        } catch (error) {
            this.logger.error(`Failed to press key: ${key}`, error as Error);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Element State Checks
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Check if an element is visible on the page.
     * @param selector - CSS selector string or Playwright Locator
     * @returns true if the element is visible
     */
    async isVisible(selector: string | Locator): Promise<boolean> {
        const target = this.resolve(selector);
        this.logger.log(`Checking visibility of element: ${selector}`);
        try {
            const visible = await target.isVisible();
            this.logger.log(`Element ${selector} is${visible ? '' : ' not'} visible`);
            return visible;
        } catch (error) {
            this.logger.error(`Failed to check visibility of element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Check if an element is enabled (not disabled).
     * @param selector - CSS selector string or Playwright Locator
     * @returns true if the element is enabled
     */
    async isEnabled(selector: string | Locator): Promise<boolean> {
        const target = this.resolve(selector);
        this.logger.log(`Checking if element is enabled: ${selector}`);
        try {
            const enabled = await target.isEnabled();
            this.logger.log(`Element ${selector} is${enabled ? '' : ' not'} enabled`);
            return enabled;
        } catch (error) {
            this.logger.error(`Failed to check enabled state of element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Check if a checkbox or radio button is checked.
     * @param selector - CSS selector string or Playwright Locator
     * @returns true if the element is checked
     */
    async isChecked(selector: string | Locator): Promise<boolean> {
        const target = this.resolve(selector);
        this.logger.log(`Checking if element is checked: ${selector}`);
        try {
            const checked = await target.isChecked();
            this.logger.log(`Element ${selector} is${checked ? '' : ' not'} checked`);
            return checked;
        } catch (error) {
            this.logger.error(`Failed to check checked state of element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Check if an element exists in the DOM (regardless of visibility).
     * @param selector - CSS selector string
     * @returns true if at least one matching element exists
     */
    async exists(selector: string): Promise<boolean> {
        this.logger.log(`Checking existence of element: ${selector}`);
        try {
            const count = await this.page.locator(selector).count();
            const found = count > 0;
            this.logger.log(`Element ${selector} ${found ? 'exists' : 'does not exist'} in DOM`);
            return found;
        } catch (error) {
            this.logger.error(`Failed to check existence of element: ${selector}`, error as Error);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Text & Attributes
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Get the visible text content of an element.
     * @param selector - CSS selector string or Playwright Locator
     * @returns The element's text content
     */
    async getText(selector: string | Locator): Promise<string> {
        const target = this.resolve(selector);
        this.logger.log(`Getting text content of element: ${selector}`);
        try {
            const text = (await target.textContent({ timeout: this.defaultTimeout })) ?? '';
            this.logger.success(`Got text from element ${selector}: "${text}"`);
            return text.trim();
        } catch (error) {
            this.logger.error(`Failed to get text of element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Get the value of a specific HTML attribute.
     * @param selector - CSS selector string or Playwright Locator
     * @param name - Attribute name (e.g. 'href', 'data-id')
     * @returns The attribute value, or null if not present
     */
    async getAttribute(selector: string | Locator, name: string): Promise<string | null> {
        const target = this.resolve(selector);
        this.logger.log(`Getting attribute "${name}" of element: ${selector}`);
        try {
            const value = await target.getAttribute(name, { timeout: this.defaultTimeout });
            this.logger.success(`Attribute "${name}" of element ${selector}: "${value}"`);
            return value;
        } catch (error) {
            this.logger.error(
                `Failed to get attribute "${name}" of element: ${selector}`,
                error as Error,
            );
            throw error;
        }
    }

    /**
     * Get the current value of an input, textarea, or select element.
     * @param selector - CSS selector string or Playwright Locator
     * @returns The input value
     */
    async getValue(selector: string | Locator): Promise<string> {
        const target = this.resolve(selector);
        this.logger.log(`Getting input value of element: ${selector}`);
        try {
            const value = await target.inputValue({ timeout: this.defaultTimeout });
            this.logger.success(`Input value of element ${selector}: "${value}"`);
            return value;
        } catch (error) {
            this.logger.error(`Failed to get value of element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Get a computed CSS property value for an element.
     * @param selector - CSS selector string or Playwright Locator
     * @param property - CSS property name (e.g. 'color', 'background-color')
     * @returns The computed CSS property value
     */
    async getCssValue(selector: string | Locator, property: string): Promise<string> {
        const target = this.resolve(selector);
        this.logger.log(`Getting CSS property "${property}" of element: ${selector}`);
        try {
            const value = await target.evaluate(
                (el, prop) => window.getComputedStyle(el).getPropertyValue(prop),
                property,
            );
            this.logger.success(`CSS property "${property}" of element ${selector}: "${value}"`);
            return value;
        } catch (error) {
            this.logger.error(
                `Failed to get CSS property "${property}" of element: ${selector}`,
                error as Error,
            );
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Waits (with timeout)
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Wait for an element to appear in the DOM.
     * @param selector - CSS selector string
     * @param timeout - Maximum wait time in milliseconds
     */
    async waitForElement(selector: string, timeout = this.defaultTimeout): Promise<void> {
        this.logger.log(`Waiting for element to appear: ${selector} (timeout: ${timeout}ms)`);
        try {
            await this.page.waitForSelector(selector, { state: 'attached', timeout });
            this.logger.success(`Element appeared: ${selector}`);
        } catch (error) {
            this.logger.error(
                `Timed out waiting for element to appear: ${selector}`,
                error as Error,
            );
            throw error;
        }
    }

    /**
     * Wait for an element to become visible.
     * @param selector - CSS selector string
     * @param timeout - Maximum wait time in milliseconds
     */
    async waitForVisible(selector: string, timeout = this.defaultTimeout): Promise<void> {
        this.logger.log(`Waiting for element to be visible: ${selector} (timeout: ${timeout}ms)`);
        try {
            await this.page.waitForSelector(selector, { state: 'visible', timeout });
            this.logger.success(`Element is visible: ${selector}`);
        } catch (error) {
            this.logger.error(
                `Timed out waiting for element to be visible: ${selector}`,
                error as Error,
            );
            throw error;
        }
    }

    /**
     * Wait for an element to disappear (hidden or detached).
     * @param selector - CSS selector string
     * @param timeout - Maximum wait time in milliseconds
     */
    async waitForHidden(selector: string, timeout = this.defaultTimeout): Promise<void> {
        this.logger.log(`Waiting for element to be hidden: ${selector} (timeout: ${timeout}ms)`);
        try {
            await this.page.waitForSelector(selector, { state: 'hidden', timeout });
            this.logger.success(`Element is hidden: ${selector}`);
        } catch (error) {
            this.logger.error(
                `Timed out waiting for element to be hidden: ${selector}`,
                error as Error,
            );
            throw error;
        }
    }

    /**
     * Wait for an element to become enabled.
     * @param selector - CSS selector string or Playwright Locator
     * @param timeout - Maximum wait time in milliseconds
     */
    async waitForEnabled(selector: string | Locator, timeout = this.defaultTimeout): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Waiting for element to be enabled: ${selector} (timeout: ${timeout}ms)`);
        try {
            await target.waitFor({ state: 'visible', timeout });
            await expect_enabled(target, timeout);
            this.logger.success(`Element is enabled: ${selector}`);
        } catch (error) {
            this.logger.error(
                `Timed out waiting for element to be enabled: ${selector}`,
                error as Error,
            );
            throw error;
        }
    }

    /**
     * Wait for an element to become disabled.
     * @param selector - CSS selector string or Playwright Locator
     * @param timeout - Maximum wait time in milliseconds
     */
    async waitForDisabled(
        selector: string | Locator,
        timeout = this.defaultTimeout,
    ): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Waiting for element to be disabled: ${selector} (timeout: ${timeout}ms)`);
        try {
            await target.waitFor({ state: 'visible', timeout });
            await expect_disabled(target, timeout);
            this.logger.success(`Element is disabled: ${selector}`);
        } catch (error) {
            this.logger.error(
                `Timed out waiting for element to be disabled: ${selector}`,
                error as Error,
            );
            throw error;
        }
    }

    /**
     * Wait until an element contains the expected text.
     * @param selector - CSS selector string or Playwright Locator
     * @param text - Expected text
     * @param timeout - Maximum wait time in milliseconds
     */
    async waitForText(
        selector: string | Locator,
        text: string,
        timeout = this.defaultTimeout,
    ): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(
            `Waiting for text "${text}" in element: ${selector} (timeout: ${timeout}ms)`,
        );
        try {
            await target.filter({ hasText: text }).waitFor({ state: 'visible', timeout });
            this.logger.success(`Text "${text}" found in element: ${selector}`);
        } catch (error) {
            this.logger.error(
                `Timed out waiting for text "${text}" in element: ${selector}`,
                error as Error,
            );
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Navigation
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Navigate the browser to a URL.
     * @param url - Absolute or relative URL to navigate to
     */
    async navigateTo(url: string): Promise<void> {
        this.logger.log(`Navigating to URL: ${url}`);
        try {
            await this.page.goto(url, { waitUntil: 'domcontentloaded' });
            this.logger.success(`Navigated to URL: ${url}`);
        } catch (error) {
            this.logger.error(`Failed to navigate to URL: ${url}`, error as Error);
            throw error;
        }
    }

    /**
     * Reload the current page.
     */
    async refresh(): Promise<void> {
        this.logger.log('Refreshing current page');
        try {
            await this.page.reload({ waitUntil: 'domcontentloaded' });
            this.logger.success('Page refreshed');
        } catch (error) {
            this.logger.error('Failed to refresh page', error as Error);
            throw error;
        }
    }

    /**
     * Navigate to the previous page in browser history.
     */
    async goBack(): Promise<void> {
        this.logger.log('Navigating back in browser history');
        try {
            await this.page.goBack({ waitUntil: 'domcontentloaded' });
            this.logger.success('Navigated back');
        } catch (error) {
            this.logger.error('Failed to navigate back', error as Error);
            throw error;
        }
    }

    /**
     * Navigate to the next page in browser history.
     */
    async goForward(): Promise<void> {
        this.logger.log('Navigating forward in browser history');
        try {
            await this.page.goForward({ waitUntil: 'domcontentloaded' });
            this.logger.success('Navigated forward');
        } catch (error) {
            this.logger.error('Failed to navigate forward', error as Error);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Frame Handling
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Get a FrameLocator to interact with elements inside an iframe.
     * @param selector - CSS selector for the iframe element
     * @returns A FrameLocator scoped to the iframe
     */
    switchToFrame(selector: string) {
        this.logger.log(`Switching to frame: ${selector}`);
        return this.page.frameLocator(selector);
    }

    /**
     * Return to the main frame (effectively removes iframe scoping).
     * @returns The main Page object
     */
    switchToMainFrame(): Page {
        this.logger.log('Switching back to main frame');
        return this.page;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Tab Management
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Open a new browser tab and return it.
     * @returns The new Page (tab)
     */
    async openNewTab(): Promise<Page> {
        this.logger.log('Opening new browser tab');
        try {
            const context: BrowserContext = this.page.context();
            const newPage = await context.newPage();
            this.logger.success('Opened new browser tab');
            return newPage;
        } catch (error) {
            this.logger.error('Failed to open new browser tab', error as Error);
            throw error;
        }
    }

    /**
     * Switch to an existing browser tab by its zero-based index.
     * @param index - Zero-based tab index
     * @returns The Page at the given index
     */
    async switchTab(index: number): Promise<Page> {
        this.logger.log(`Switching to tab at index: ${index}`);
        try {
            const context: BrowserContext = this.page.context();
            const pages = context.pages();
            if (index >= pages.length) {
                throw new Error(
                    `Tab index ${index} out of range. Only ${pages.length} tab(s) open.`,
                );
            }
            const targetPage = pages[index];
            await targetPage.bringToFront();
            this.logger.success(`Switched to tab at index: ${index}`);
            return targetPage;
        } catch (error) {
            this.logger.error(`Failed to switch to tab at index: ${index}`, error as Error);
            throw error;
        }
    }

    /**
     * Close a browser tab by its zero-based index.
     * @param index - Zero-based tab index
     */
    async closeTab(index: number): Promise<void> {
        this.logger.log(`Closing tab at index: ${index}`);
        try {
            const context: BrowserContext = this.page.context();
            const pages = context.pages();
            if (index >= pages.length) {
                throw new Error(
                    `Tab index ${index} out of range. Only ${pages.length} tab(s) open.`,
                );
            }
            await pages[index].close();
            this.logger.success(`Closed tab at index: ${index}`);
        } catch (error) {
            this.logger.error(`Failed to close tab at index: ${index}`, error as Error);
            throw error;
        }
    }

    /**
     * Get the zero-based index of the current page within its browser context.
     * @returns Current tab index
     */
    async getCurrentTab(): Promise<number> {
        const context: BrowserContext = this.page.context();
        const pages = context.pages();
        const index = pages.indexOf(this.page);
        this.logger.log(`Current tab index: ${index}`);
        return index;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Alerts
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Accept (OK) the next browser alert dialog.
     */
    async acceptAlert(): Promise<void> {
        this.logger.log('Setting up handler to accept next alert');
        this.page.once('dialog', async (dialog) => {
            this.logger.log(`Accepting alert: "${dialog.message()}"`);
            await dialog.accept();
        });
    }

    /**
     * Dismiss (Cancel) the next browser alert dialog.
     */
    async dismissAlert(): Promise<void> {
        this.logger.log('Setting up handler to dismiss next alert');
        this.page.once('dialog', async (dialog) => {
            this.logger.log(`Dismissing alert: "${dialog.message()}"`);
            await dialog.dismiss();
        });
    }

    /**
     * Capture the message from the next browser alert dialog without closing it.
     * Resolves once the dialog appears and its text has been captured.
     * @returns The alert message text
     */
    async getAlertText(): Promise<string> {
        this.logger.log('Waiting to capture alert text');
        return new Promise<string>((resolve, reject) => {
            this.page.once('dialog', async (dialog) => {
                const message = dialog.message();
                this.logger.success(`Captured alert text: "${message}"`);
                await dialog.dismiss();
                resolve(message);
            });
            setTimeout(() => reject(new Error('Timed out waiting for alert dialog')), this.defaultTimeout);
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Screenshots & Debugging
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Take a timestamped screenshot and save it to test-results/screenshots/.
     * @param name - Base name for the screenshot file
     * @returns The resolved file path of the saved screenshot
     */
    async takeScreenshot(name: string): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `test-results/screenshots/${name}-${timestamp}.png`;
        this.logger.log(`Taking screenshot: ${filename}`);
        try {
            await this.page.screenshot({ path: filename, fullPage: true });
            this.logger.success(`Screenshot saved: ${filename}`);
            return filename;
        } catch (error) {
            this.logger.error(`Failed to take screenshot: ${name}`, error as Error);
            throw error;
        }
    }

    /**
     * Get the current page URL.
     * @returns The current URL string
     */
    async getPageUrl(): Promise<string> {
        const url = this.page.url();
        this.logger.log(`Current page URL: ${url}`);
        return url;
    }

    /**
     * Get the current page title.
     * @returns The page title string
     */
    async getPageTitle(): Promise<string> {
        const title = await this.page.title();
        this.logger.log(`Current page title: "${title}"`);
        return title;
    }

    /**
     * Collect all console error messages logged on the current page.
     * Call this method before navigating away from the page.
     * @returns Array of console error message strings
     */
    async getConsoleErrors(): Promise<string[]> {
        const errors: string[] = [];
        this.page.on('console', (msg) => {
            if (msg.type() === 'error') {
                errors.push(msg.text());
            }
        });
        this.logger.log('Console error listener registered');
        return errors;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Advanced
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Execute an action that triggers navigation, and wait for the page to stabilise.
     * @param action - Async callback that triggers navigation (e.g. form submit, link click)
     */
    async waitForNavigation(action: () => Promise<void>): Promise<void> {
        this.logger.log('Waiting for navigation after action');
        try {
            await action();
            await this.page.waitForLoadState('domcontentloaded', { timeout: 30_000 });
            this.logger.success('Navigation completed');
        } catch (error) {
            this.logger.error('Navigation after action failed', error as Error);
            throw error;
        }
    }

    /**
     * Scroll an element into the viewport.
     * @param selector - CSS selector string or Playwright Locator
     */
    async scrollIntoView(selector: string | Locator): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Scrolling element into view: ${selector}`);
        try {
            await target.scrollIntoViewIfNeeded();
            this.logger.success(`Element scrolled into view: ${selector}`);
        } catch (error) {
            this.logger.error(`Failed to scroll element into view: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Scroll the page to the very top.
     */
    async scrollToTop(): Promise<void> {
        this.logger.log('Scrolling page to top');
        await this.page.evaluate(() => window.scrollTo(0, 0));
        this.logger.success('Scrolled to top of page');
    }

    /**
     * Scroll the page to the very bottom.
     */
    async scrollToBottom(): Promise<void> {
        this.logger.log('Scrolling page to bottom');
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        this.logger.success('Scrolled to bottom of page');
    }

    /**
     * Select an option from a <select> dropdown by its value, label, or index.
     * @param selector - CSS selector string or Playwright Locator targeting the <select>
     * @param value - Option value, label text, or { index: number }
     */
    async selectDropdown(
        selector: string | Locator,
        value: string | { label: string } | { index: number },
    ): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Selecting dropdown option "${JSON.stringify(value)}" in: ${selector}`);
        try {
            if (typeof value === 'string') {
                await target.selectOption({ value }, { timeout: this.defaultTimeout });
            } else if ('label' in value) {
                await target.selectOption({ label: value.label }, { timeout: this.defaultTimeout });
            } else {
                await target.selectOption({ index: value.index }, { timeout: this.defaultTimeout });
            }
            this.logger.success(
                `Selected dropdown option "${JSON.stringify(value)}" in: ${selector}`,
            );
        } catch (error) {
            this.logger.error(
                `Failed to select dropdown option in: ${selector}`,
                error as Error,
            );
            throw error;
        }
    }

    /**
     * Upload one or more files to a file input element.
     * @param selector - CSS selector string or Playwright Locator targeting the file input
     * @param filepath - Absolute path(s) to the file(s) to upload
     */
    async uploadFile(selector: string | Locator, filepath: string | string[]): Promise<void> {
        const target = this.resolve(selector);
        this.logger.log(`Uploading file(s) "${filepath}" to element: ${selector}`);
        try {
            await target.setInputFiles(filepath);
            this.logger.success(`File(s) uploaded to element: ${selector}`);
        } catch (error) {
            this.logger.error(`Failed to upload file to element: ${selector}`, error as Error);
            throw error;
        }
    }

    /**
     * Trigger an action and wait for the resulting new browser tab to open, then switch to it.
     * @param action - Async callback that opens a new tab (e.g. clicking a link with target="_blank")
     * @returns The new Page (tab)
     */
    async switchToNewTab(action: () => Promise<void>): Promise<Page> {
        this.logger.log('Waiting for new tab to open after action');
        try {
            const context: BrowserContext = this.page.context();
            const [newPage] = await Promise.all([
                context.waitForEvent('page'),
                action(),
            ]);
            await newPage.waitForLoadState('domcontentloaded');
            this.logger.success('Switched to new tab');
            return newPage;
        } catch (error) {
            this.logger.error('Failed to switch to new tab', error as Error);
            throw error;
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Private helpers
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Resolve a string selector or a Locator to a Playwright Locator.
     */
    private resolve(selector: string | Locator): Locator {
        if (typeof selector === 'string') {
            return this.page.locator(selector);
        }
        return selector;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// Module-private helpers for polling enabled/disabled states
// ─────────────────────────────────────────────────────────────────────────────

async function expect_enabled(locator: Locator, timeout: number): Promise<void> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        if (await locator.isEnabled()) return;
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error(`Element did not become enabled within ${timeout}ms`);
}

async function expect_disabled(locator: Locator, timeout: number): Promise<void> {
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
        if (!(await locator.isEnabled())) return;
        await new Promise((r) => setTimeout(r, 200));
    }
    throw new Error(`Element did not become disabled within ${timeout}ms`);
}

