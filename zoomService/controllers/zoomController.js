const axios = require('axios');
const qs = require('querystring');

// Leitet zur Zoom OAuth-Autorisierungsseite weiter
exports.redirectToZoomAuth = (req, res) => {
    const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.ZOOM_REDIRECT_URI)}`;
    res.redirect(zoomAuthUrl);
};

// Callback-Route zur Verarbeitung des Autorisierungscodes und Abrufen eines Access Tokens
exports.handleZoomCallback = async (req, res) => {
    const authorizationCode = req.query.code;

    if (!authorizationCode) {
        return res.status(400).json({ error: 'Authorization code is missing' });
    }

    try {
        // Tauscht den Autorisierungscode gegen ein Access-Token
        const tokenResponse = await axios.post(
            process.env.ZOOM_ACCESS_TOKEN_URL,
            qs.stringify({
                grant_type: 'authorization_code',
                code: authorizationCode,
                redirect_uri: process.env.ZOOM_REDIRECT_URI
            }),
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        );

        // Zugriffstoken und andere relevante Daten
        const { access_token, refresh_token, expires_in } = tokenResponse.data;

        // Weiterverarbeitung oder Speichern des Tokens
        res.status(200).json({ access_token, refresh_token, expires_in });
    } catch (error) {
        console.error('Error exchanging authorization code:', error);
        res.status(500).json({ error: 'Error exchanging authorization code' });
    }
};

// Beispiel für das Erstellen eines Zoom-Meetings
exports.createMeeting = async (req, res) => {
    const { accessToken, topic, startTime, duration } = req.body;

    try {
        const response = await axios.post(
            `${process.env.ZOOM_API_BASE_URL}/users/me/meetings`,
            {
                topic,
                type: 2, // Geplantes Meeting
                start_time: startTime,
                duration, // Dauer in Minuten
                settings: {
                    host_video: true,
                    participant_video: true,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        res.status(201).json({ meetingLink: response.data.join_url });
    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({ error: 'Error creating meeting' });
    }
};
