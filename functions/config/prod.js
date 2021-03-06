const functions = require('firebase-functions');

module.exports = {
  CLIENT_ID: functions.config().spotify.id,
  CLIENT_SECRET: functions.config().spotify.secret,
  REDIRECT_URI:
    'https://us-central1-spotplaylist-dev.cloudfunctions.net/server/api/auth/callback',
  FRONT_END_URI_CALLBACK:
    'https://spotplaylist-dev.firebaseapp.com/oauth/callback'
};
