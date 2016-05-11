import {BaseStore} from 'fluxible/addons';

class UserApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.user = '';
        this.applications = [];
    }
    updateUserApplications(payload) {
        this.user = payload.user;
        this.applications = payload.applications;
        this.emitChange();
    }
    getState() {
        return {
            user: this.user,
            applications: this.applications
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.user = state.user;
        this.applications = state.applications;
    }
}

UserApplicationStore.storeName = 'UserApplicationStore'; // PR open in dispatchr to remove this need
UserApplicationStore.handlers = {
    'LOAD_USER_APPS_SUCCESS': 'updateUserApplications'
};

export default UserApplicationStore;
