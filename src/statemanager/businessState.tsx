import {action, makeAutoObservable, observable} from 'mobx';

class BusinessState {
    @observable
    businessList = [];

    constructor() {
        makeAutoObservable(this);
    }

    @action
    setBusinessList(businessList: []) {
        this.businessList = businessList;
    }
}

export function createBusinessState() {
    return new BusinessState();
}
