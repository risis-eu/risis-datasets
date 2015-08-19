export default function loadUserApplications(context, payload, done) {
    context.service.read('resource.userApplications', payload, {timeout: 5 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('LOAD_USER_APPS_FAILURE', err);
        } else {
            console.log(res);
            context.dispatch('LOAD_USER_APPS_SUCCESS', res);
        }
        done();
    });
}
