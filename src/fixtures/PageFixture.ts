import { Page } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

/**
 * PageFixture centralises the instantiation of all page objects.
 * Add a new page class here to make it available everywhere fixtures are used.
 */
export class PageFixture {
    private readonly _home: HomePage;

    constructor(page: Page) {
        this._home = new HomePage(page);
    }

    /** Census application Home Page. */
    get home(): HomePage {
        return this._home;
    }
}
