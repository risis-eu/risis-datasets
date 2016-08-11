export default {
    //full page title
    appFullTitle: ['RISIS Datasets Portal'],
    //short page title
    appShortTitle: ['RISIS'],
    //Default Named Graph under observation, if not set , will consider all existing graph names
    defaultGraphName: ['http://rdf.risis.eu/dataset/risis/1.0/void.ttl#'],
    //will prevent access if not logged in
    enableAuthentication: 1,
    //graph that stores users data, must be loaded beforehand
    authGraphName: ['http://rdf.risis.eu/sms/users.ttl#'],
    //graph that stores applications to access RISIS datasets
    applicationsGraphName: ['http://applications.risis.eu'],
    //the domain name under which basic dynamic resources and user resources will be defined
    baseResourceDomain: ['http://risis.eu'],
    //will allow super users to confirm and activate regiastered users
    enableUserConfirmation: 1,
    //will enable email notifications
    enableEmailNotifications: 1,
    //will put all update actions in log folder
    enableLogs: 1,
    //if provided will track the users on your LD-R instance
    googleAnalyticsID: 'UA-82317225-1'
};
