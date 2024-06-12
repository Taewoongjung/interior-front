const { makeAutoObservable } = require('mobx');

class MainNavState {
    _navState = {state: ''};

    constructor() {
        makeAutoObservable(this);
    }

    setNavState(state:string) {
        this._navState.state = state;
    }

    getNavState = () => {
        return this._navState.state;
    }
}

const mainNavStateInstance = new MainNavState();
export default mainNavStateInstance;