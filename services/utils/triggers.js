import {sendMail} from '../../plugins/email/handleEmail';
export default {
    runMailTrigger: (username, graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue, notifList) => {
        let tmp, appName, appLink, etext, ehtml;
        switch (propertyURI) {
        case 'http://rdf.risis.eu/application/decisionDSO':
            tmp = resourceURI.split('/');
            appName = tmp[tmp.length - 1];
            appLink = 'http://datasets.risis.eu/dataset/'+  encodeURIComponent(graphName)+'/resource/' + encodeURIComponent(resourceURI);
            notifList.forEach(function(el) {
                //send notifications to FCB & PRB
                if(el.type !== 'USER' && el.type !== 'DSO'){
                    etext = 'Dear '+ el.firstName +',\n The decision for visit request application #' + appName + ' has changed by dataset coordinator (' + username +') to "'+newObjectValue+'": \n \n '+ appLink +' \n \n Please sign in to RISIS Datasets Portal with your username ('+el.username+'): \n \n http://datasets.risis.eu/ \n \n and check the applications list for further information. \n \n -- on behalf of RISIS Datasets Portal';
                    ehtml = 'Dear '+ el.firstName +',<br/> The decision for visit request application #' + appName + ' has changed by dataset coordinator (' + username +') to "'+newObjectValue+'": <br/><br/> <a href="'+ appLink +'">'+ appLink +'</a> <br/><br/> Please sign in to RISIS Datasets Portal with your username ('+el.username+'): <br/><br/> <a href="http://datasets.risis.eu/">http://datasets.risis.eu/</a> \n \n and check the applications list for further information. <br/><br/> -- on behalf of RISIS Datasets Portal';
                    //send email
                    sendMail('applicationDecisionChange', 'datasets@risis.eu', el.mbox, 'RISIS ['+el.type +'] Decision Update for Visit Request Application #' + appName + ' by DSO: ' + newObjectValue, etext, ehtml);
                }
            });
            break;
        case 'http://rdf.risis.eu/application/decisionPRB':
            tmp = resourceURI.split('/');
            appName = tmp[tmp.length - 1];
            appLink = 'http://datasets.risis.eu/dataset/'+  encodeURIComponent(graphName)+'/resource/' + encodeURIComponent(resourceURI);
            notifList.forEach(function(el) {
                //send only to FCB
                if(el.type === 'FCB'){
                    etext = 'Dear '+ el.firstName +',\n The decision for visit request application #' + appName + ' has changed by PRB (' + username +') to "'+newObjectValue+'": \n \n '+ appLink +' \n \n Please sign in to RISIS Datasets Portal with your username ('+el.username+'): \n \n http://datasets.risis.eu/ \n \n and check the applications list for further information. \n \n -- on behalf of RISIS Datasets Portal';
                    ehtml = 'Dear '+ el.firstName +',<br/> The decision for visit request application #' + appName + ' has changed by PRB (' + username +') to "'+newObjectValue+'": <br/><br/> <a href="'+ appLink +'">'+ appLink +'</a> <br/><br/> Please sign in to RISIS Datasets Portal with your username ('+el.username+'): <br/><br/> <a href="http://datasets.risis.eu/">http://datasets.risis.eu/</a> <br/><br/> and check the applications list for further information. <br/><br/> -- on behalf of RISIS Datasets Portal';
                    sendMail('applicationDecisionChange', 'datasets@risis.eu', el.mbox, 'RISIS ['+el.type +'] Decision Update for Visit Request Application #' + appName + ' by PRB: '+ newObjectValue, etext, ehtml);
                }
            });
            break;
        case 'http://rdf.risis.eu/application/decisionFCB':
            tmp = resourceURI.split('/');
            appName = tmp[tmp.length - 1];
            appLink = 'http://datasets.risis.eu/dataset/'+  encodeURIComponent(graphName)+'/resource/' + encodeURIComponent(resourceURI);
            notifList.forEach(function(el) {
                //send to USER, DSO, FCB and PRB
                if(el.type !== 'USER'){
                    etext = 'Dear '+ el.firstName +',\n Final decision for visit request application #' + appName + ' decided by "' + username +'" is "'+newObjectValue+'": \n \n '+ appLink +' \n \n Please sign in to RISIS Datasets Portal with your username ('+el.username+'): \n \n http://datasets.risis.eu/ \n \n and check the applications list for further information. \n \n -- on behalf of RISIS Datasets Portal';
                    ehtml = 'Dear '+ el.firstName +',<br/> Final decision for visit request application #' + appName + ' decided by "' + username +'" is "'+newObjectValue+'": <br/><br/> <a href="'+ appLink +'">'+ appLink +'</a> <br/><br/> Please sign in to RISIS Datasets Portal with your username ('+el.username+'): <br/><br/> <a href="http://datasets.risis.eu/">http://datasets.risis.eu/</a> <br/><br/> and check the applications list for further information. <br/><br/> -- on behalf of RISIS Datasets Portal';
                    sendMail('applicationDecisionChange', 'datasets@risis.eu', el.mbox, 'RISIS ['+el.type +'] Final Decision for Visit Request Application #' + appName + ' by FCB:', etext, ehtml);
                }else{
                    etext = 'Dear '+ el.firstName +',\n Final decision for your visit request application #' + appName + ' is "'+newObjectValue+'": \n \n '+ appLink +' \n \n Please sign in to RISIS Datasets Portal with your username ('+el.username+'): \n \n http://datasets.risis.eu/ \n \n and check the your application details. \n \n -- on behalf of RISIS Datasets Portal';
                    ehtml = 'Dear '+ el.firstName +',<br/> Final decision for your visit request application #' + appName + ' is "'+newObjectValue+'": <br/><br/> <a href="'+ appLink +'">'+ appLink +'</a> <br/><br/> Please sign in to RISIS Datasets Portal with your username ('+el.username+'): <br/><br/> <a href="http://datasets.risis.eu/">http://datasets.risis.eu/</a> <br/><br/> and check the your application details. <br/><br/> -- on behalf of RISIS Datasets Portal';
                    sendMail('applicationDecisionChange', 'datasets@risis.eu', el.mbox, 'RISIS ['+el.type +'] Final Decision for your Visit Request Application #' + appName , etext, ehtml);
                }
            });
            break;
        default:

        }
    },
    shouldTrigger: (username, graphName, resourceURI, propertyURI, oldObjectValue, newObjectValue) => {
        let list = ['http://rdf.risis.eu/application/decisionDSO', 'http://rdf.risis.eu/application/decisionPRB', 'http://rdf.risis.eu/application/decisionFCB'];
        if(list.indexOf(propertyURI) === -1){
            return 0;
        }else{
            return 1;
        }
    }
}
