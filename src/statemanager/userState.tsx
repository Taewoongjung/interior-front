import {action, makeAutoObservable, observable} from 'mobx';

class UserState {
    @observable
    userFirstLogInState = "false";

    constructor() {
        makeAutoObservable(this);
    }

    @action
    setUserFirstLogInState(state: string) {
        this.userFirstLogInState = state;
    }
}

export function createUserState() {
    return new UserState();
}