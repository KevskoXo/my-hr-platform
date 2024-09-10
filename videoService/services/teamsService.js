const axios = require('axios');

// Microsoft Graph API Token abrufen
async function getAccessToken() {
    const response = await axios.post('https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token', {
        client_id: process.env.CLIENT_ID,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'client_credentials'
    });
    return response.data.access_token;
}

// Teams-Meeting erstellen
async function createTeamsMeeting(recruiterEmail, candidateEmail, startTime, endTime) {
    const token = await getAccessToken();
    
    const response = await axios.post('https://graph.microsoft.com/v1.0/me/events', {
        subject: 'Job Interview',
        body: {
            contentType: 'HTML',
            content: 'Interview invitation'
        },
        start: {
            dateTime: startTime,
            timeZone: 'UTC'
        },
        end: {
            dateTime: endTime,
            timeZone: 'UTC'
        },
        attendees: [
            {
                emailAddress: {
                    address: recruiterEmail,
                    name: 'Recruiter'
                },
                type: 'required'
            },
            {
                emailAddress: {
                    address: candidateEmail,
                    name: 'Candidate'
                },
                type: 'required'
            }
        ],
        isOnlineMeeting: true,
        onlineMeetingProvider: 'teamsForBusiness'
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    return response.data.onlineMeeting.joinUrl;
}

module.exports = {
    createTeamsMeeting
};
