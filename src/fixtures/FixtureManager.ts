import { Page } from '@playwright/test';
import { PageFixture } from './PageFixture';
import { ActionFixture } from './ActionFixture';

/**
 * FixtureManager is the single entry point for accessing all fixtures in test hooks
 * and step definitions. It orchestrates the creation of PageFixture and ActionFixture,
 * ensuring a consistent dependency chain:
 *
 *   Page → PageFixture → ActionFixture
 *
 * Usage in hooks:
 *   this.fixtures = new FixtureManager(page);
 *
 * Usage in steps:
 *   await this.fixtures.pages.home.navigateToHomePage(baseUrl);
 *   await this.fixtures.actions.login.loginWithCensusID(id, baseUrl);
 */
export class FixtureManager {
    private readonly _pages: PageFixture;
    private readonly _actions: ActionFixture;

    constructor(page: Page) {
        this._pages = new PageFixture(page);
        this._actions = new ActionFixture(this._pages);
    }

    /** All page object instances. */
    get pages(): PageFixture {
        return this._pages;
    }

    /** All business action (workflow) instances. */
    get actions(): ActionFixture {
        return this._actions;
    }
}
