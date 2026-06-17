import { faker } from '@faker-js/faker';

/** Shape of a generated user record. */
export interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
}

/** Census application ID split across its three input segments. */
export interface CensusIDData {
    q7m: string;
    frvr: string;
    dtcq: string;
}

/**
 * DataFactory provides static factory methods for generating random, valid test data
 * using @faker-js/faker. All methods are stateless and can be called anywhere.
 */
export class DataFactory {
    // ─────────────────────────────────────────────────────────────────────────
    // User Data
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Generate a random user record.
     * @param overrides - Optional partial overrides for specific fields
     * @returns A UserData object with randomised fields
     */
    static createUser(overrides: Partial<UserData> = {}): UserData {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: DataFactory.createPassword(),
            phone: DataFactory.createPhoneNumber(),
            ...overrides,
        };
    }

    /**
     * Generate a random valid email address.
     * @returns Email address string
     */
    static createEmail(): string {
        return faker.internet.email();
    }

    /**
     * Generate a secure random password meeting common complexity requirements.
     * @returns Password string (12-16 characters, mixed case, digits, symbols)
     */
    static createPassword(): string {
        const upper = faker.string.alpha({ length: 2, casing: 'upper' });
        const lower = faker.string.alpha({ length: 4, casing: 'lower' });
        const digits = faker.string.numeric(2);
        const symbols = faker.helpers.arrayElements(['!', '@', '#', '$', '%'], 2).join('');
        const rest = faker.string.alphanumeric(4);
        return faker.helpers.shuffle([...upper, ...lower, ...digits, ...symbols, ...rest]).join('');
    }

    /**
     * Generate a US-format phone number.
     * @returns Phone number string in format (XXX) XXX-XXXX
     */
    static createPhoneNumber(): string {
        return faker.phone.number('(###) ###-####');
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Census-Specific Data
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Generate a random 12-digit Census ID split across Q7M, FRVR, and DTCQ.
     * Each segment contains 4 alphanumeric characters.
     * @returns CensusIDData object with q7m, frvr, dtcq fields
     */
    static createCensusID(): CensusIDData {
        return {
            q7m: faker.string.alphanumeric(4).toUpperCase(),
            frvr: faker.string.alphanumeric(4).toUpperCase(),
            dtcq: faker.string.alphanumeric(4).toUpperCase(),
        };
    }

    /**
     * Return the known-valid Census ID used for regression tests.
     * This value corresponds to a test account in the Census test environment.
     * @returns A fixed, valid CensusIDData object
     */
    static getValidTestCensusID(): CensusIDData {
        return {
            q7m: 'TEST',
            frvr: '0001',
            dtcq: '0001',
        };
    }

    /**
     * Generate a random alphanumeric string of the specified length.
     * @param length - Number of characters to generate
     * @returns Random alphanumeric string
     */
    static createRandomString(length: number): string {
        return faker.string.alphanumeric(length);
    }

    /**
     * Generate a random integer within an inclusive range.
     * @param min - Minimum value (inclusive)
     * @param max - Maximum value (inclusive)
     * @returns Random integer
     */
    static createRandomNumber(min: number, max: number): number {
        return faker.number.int({ min, max });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Date Data
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Generate a random past date (within the last 10 years).
     * @returns Date object
     */
    static createDate(): Date {
        return faker.date.past({ years: 10 });
    }

    /**
     * Generate a future date N calendar days from today.
     * @param days - Number of days into the future
     * @returns Date object
     */
    static createFutureDate(days: number): Date {
        const date = new Date();
        date.setDate(date.getDate() + days);
        return date;
    }

    /**
     * Generate a past date N calendar days before today.
     * @param days - Number of days in the past
     * @returns Date object
     */
    static createPastDate(days: number): Date {
        const date = new Date();
        date.setDate(date.getDate() - days);
        return date;
    }
}
