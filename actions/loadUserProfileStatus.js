export default function loadUserProfileStatus(context, payload, done) {
    context.service.read('resource.userProfileStatus', payload, {timeout: 5 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('LOAD_USER_PROFILE_STATUS_FAILURE', err);
        } else {
            context.dispatch('LOAD_USER_PROFILE_STATUS_SUCCESS', res);
        }
        done();
    });
}
