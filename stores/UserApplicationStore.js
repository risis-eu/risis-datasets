import {BaseStore} from 'fluxible/addons';

class UserApplicationStore extends BaseStore {
    constructor(dispatcher) {
        super(dispatcher);
        this.user = '';
        this.requiredFields = [];
        this.applications = [];
    }
    updateUserApplications(payload) {
        this.user = payload.user;
        this.applications = payload.applications;
        this.emitChange();
    }
    updateRequiredFieldsStatus(payload) {
        this.requiredFields = payload.requiredFields;
        this.emitChange();
    }
    getState() {
        return {
            user: this.user,
            applications: this.applications,
            requiredFields: this.requiredFields
        };
    }
    dehydrate() {
        return this.getState();
    }
    rehydrate(state) {
        this.user = state.user;
        this.applications = state.applications;
        this.requiredFields = state.requiredFields;
    }
}

UserApplicationStore.storeName = 'UserApplicationStore'; // PR open in dispatchr to remove this need
UserApplicationStore.handlers = {
    'LOAD_USER_APPS_SUCCESS': 'updateUserApplications',
    'LOAD_USER_PROFILE_STATUS_SUCCESS': 'updateRequiredFieldsStatus'
};

export default UserApplicationStore;
