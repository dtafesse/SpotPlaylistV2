const functions = require('firebase-functions');

module.exports = {
  CLIENT_ID: functions.config().spotify.id,
  CLIENT_SECRET: functions.config().spotify.secret
};
