const functions = require('firebase-functions');

module.exports = {
  CLIENT_ID: functions.config().spotify.id,
  CLIENT_SECRET: functions.config().spotify.secret,
  REDIRECT_URI:
    'http://localhost:5000/spotplaylist-dev/us-central1/server/api/auth/callback',
  FRONT_END_URI_CALLBACK: 'http://localhost:8080/oauth/callback'
};
