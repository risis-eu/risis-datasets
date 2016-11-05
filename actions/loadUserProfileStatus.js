export default function loadUserProfileStatus(context, payload, done) {
    context.service.read('resource.userProfileStatus', payload, {timeout: 5 * 1000}, function (err, res) {
        if (err) {
            context.dispatch('LOAD_USER_PROFILE_STATUS_FAILURE', err);
        } else {
            let requiredFields = [];
            if(res.requiredFields){
                if(res.requiredFields.birthYear === '0000' || res.requiredFields.birthYear === '0000-00-00' || res.requiredFields.birthYear === '000-00-00'){
                    requiredFields.push('Birth Year');
                }
                if(res.requiredFields.gender === 'Unknown'){
                    requiredFields.push('Gender');
                }
                if(res.requiredFields.nationality === 'Unknown'){
                    requiredFields.push('Nationality');
                }
                if(res.requiredFields.organizationType === 'Unknown'){
                    requiredFields.push('Organization Type');
                }
                if(res.requiredFields.city === 'Unknown'){
                    requiredFields.push('City');
                }
                if(res.requiredFields.country === 'Unknown'){
                    requiredFields.push('Country');
                }
            }
            //console.log(requiredFields);
            context.dispatch('LOAD_USER_PROFILE_STATUS_SUCCESS', {res: res, requiredFields: requiredFields});
        }
        done();
    });
}
