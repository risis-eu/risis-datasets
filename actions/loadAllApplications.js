import {appFullTitle} from '../configs/general';
export default function loadAllApplications(context, payload, done) {
    context.service.read('resource.allApplications', payload, {timeout: 5 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('LOAD_USER_APPS_FAILURE', err);
        } else {
            context.dispatch('LOAD_USER_APPS_SUCCESS', res);
        }
        context.dispatch('UPDATE_PAGE_TITLE', {
            pageTitle: (appFullTitle + ' | All Applications') || ''
        });
        done();
    });
}
