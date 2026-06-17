import * as path from 'path';
import * as dotenv from 'dotenv';

type BrowserType = 'chromium' | 'firefox' | 'webkit';
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * ConfigReader is a singleton that loads environment-specific configuration from
 * .env files located in resources/env/.
 *
 * The active environment is selected via the ENV environment variable:
 *   ENV=dev npm test      → loads resources/env/.env.dev
 *   ENV=stage npm test    → loads resources/env/.env.stage
 *
 * Falls back to .env.test if ENV is not set.
 */
export class ConfigReader {
    private static instance: ConfigReader;

    private constructor() {
        const env = process.env['ENV'] ?? 'test';
        const envFilePath = path.resolve(process.cwd(), 'resources', 'env', `.env.${env}`);
        dotenv.config({ path: envFilePath });
    }

    /** Returns the singleton instance, creating it on first call. */
    static getInstance(): ConfigReader {
        if (!ConfigReader.instance) {
            ConfigReader.instance = new ConfigReader();
        }
        return ConfigReader.instance;
    }

    /**
     * Application base URL.
     * @returns BASE_URL from environment, or 'http://localhost:3000' as default
     */
    getBaseUrl(): string {
        return process.env['BASE_URL'] ?? 'http://localhost:3000';
    }

    /**
     * Browser to use for test execution.
     * @returns BrowserType — one of 'chromium' | 'firefox' | 'webkit'
     */
    getBrowserType(): BrowserType {
        const browser = process.env['BROWSER'] ?? 'chromium';
        const valid: BrowserType[] = ['chromium', 'firefox', 'webkit'];
        if (!valid.includes(browser as BrowserType)) {
            return 'chromium';
        }
        return browser as BrowserType;
    }

    /**
     * Whether to run the browser in headless mode.
     * @returns true in CI / when HEADLESS=true; false otherwise
     */
    isHeadless(): boolean {
        const headless = process.env['HEADLESS'];
        if (headless === undefined) return true;
        return headless.toLowerCase() !== 'false';
    }

    /**
     * Default element interaction timeout in milliseconds.
     * @returns TIMEOUT from environment, or 30000
     */
    getTimeout(): number {
        const timeout = parseInt(process.env['TIMEOUT'] ?? '30000', 10);
        return isNaN(timeout) ? 30_000 : timeout;
    }

    /**
     * Number of test retries on failure.
     * @returns RETRIES from environment, or 0
     */
    getRetries(): number {
        const retries = parseInt(process.env['RETRIES'] ?? '0', 10);
        return isNaN(retries) ? 0 : retries;
    }

    /**
     * Logging verbosity level.
     * @returns LogLevel — one of 'debug' | 'info' | 'warn' | 'error'
     */
    getLogLevel(): LogLevel {
        const level = process.env['LOG_LEVEL'] ?? 'info';
        const valid: LogLevel[] = ['debug', 'info', 'warn', 'error'];
        if (!valid.includes(level as LogLevel)) {
            return 'info';
        }
        return level as LogLevel;
    }

    /**
     * Active environment name.
     * @returns ENVIRONMENT from .env file, or the ENV variable, or 'test'
     */
    getEnvironment(): string {
        return process.env['ENVIRONMENT'] ?? process.env['ENV'] ?? 'test';
    }
}
