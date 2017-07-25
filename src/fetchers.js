const fetchManagementToken = () => {
    const options = {
        method: 'POST',
        url: 'https://samlandfried.auth0.com/oauth/token',
        headers: { 'content-type': 'application/json' },
        body: `{"client_id":"${AUTH_CONFIG.managementId}","client_secret":"${AUTH_CONFIG.managementSecret}","audience":"https://samlandfried.auth0.com/api/v2/","grant_type":"client_credentials"}`
    };

    // Get user ID string from localStorage.access_token JWT
    request(options, function(error, response, body) {
        if (error) throw new Error(error);

        const parsed = JSON.parse(body);
        localStorage.setItem('managementToken', parsed.access_token);
    });
}

const fetchCurrentUser = () => {
    const parser = require('jwt-decode');
    const u_id = parser(localStorage.id_token)['sub'];

    const options = {
        method: 'GET',
        url: 'https://samlandfried.auth0.com/api/v2/users/' + u_id,
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.managementToken
        },
    };

    // get user profile by parsing the localStorage.id_token JWT
    // extract Slack token
    request(options, (error, response, body) => {
        if (error) throw new Error(error);

        const payload = JSON.parse(body);
        const token = payload.identities[0].access_token
        localStorage.setItem('slackId', token)
    });
}