const { makeAutoObservable } = require('mobx');

class MainNavState {
    _navState = { state: '' };
    // _newBusinessUpdate = {};

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

export default MainNavState;