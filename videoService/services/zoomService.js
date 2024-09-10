const axios = require('axios');
const config = require('../config');

exports.createMeeting = async (date, time, participants) => {
  try {
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      {
        topic: 'Job Interview',
        type: 2, // Geplantes Meeting
        start_time: `${date}T${time}:00`,
        duration: 60,
        settings: {
          host_video: true,
          participant_video: true,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${generateZoomJWT()}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    throw new Error('Error creating Zoom meeting: ' + error.message);
  }
};

const generateZoomJWT = () => {
  // Funktion zum Generieren eines JWT-Tokens für Zoom-API-Aufrufe
  // Implementiere Zoom OAuth oder JWT-Authentifizierung
};

