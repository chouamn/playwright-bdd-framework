import { PageFixture } from './PageFixture';
import { LoginActions } from '../actions/LoginActions';

/**
 * ActionFixture centralises the instantiation of all action (workflow) classes.
 * Each action receives the page fixtures it needs via constructor injection.
 * Add a new action class here to make it available everywhere fixtures are used.
 */
export class ActionFixture {
    private readonly _login: LoginActions;

    constructor(pageFixture: PageFixture) {
        this._login = new LoginActions(pageFixture.home);
    }

    /** Login and authentication workflows. */
    get login(): LoginActions {
        return this._login;
    }
}
