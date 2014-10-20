/**
 * Copyright 2012 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var readline = require('readline');

var google = require('../node_modules/googleapis/lib/googleapis.js');
var OAuth2Client = google.auth.OAuth2;
var calendar = google.calendar('v3');

// Client ID and client secret are available at
// https://code.google.com/apis/console
var CLIENT_ID = '189204722138-i3a7g0vib7bavpr4v9qtp6ihtna99pqf.apps.googleusercontent.com';
var CLIENT_SECRET = 'sRAHIkC5DTr3VteBAI5A_Y4I';
var REDIRECT_URL = 'http://mooon.rocks/oauth2callback';

var oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getAccessToken(oauth2Client, callback) {
  // generate consent page url
  var url = oauth2Client.generateAuthUrl({ //maybe export this URL?
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/calendar'
  });

  console.log('Visit the url: ', url);
  rl.question('Enter the code here:', function(code) {
    // request access token
    oauth2Client.getToken(code, function(err, tokens) {
      // set tokens to the client
      // TODO: tokens should be set by OAuth2 client.
      oauth2Client.setCredentials(tokens);
      callback();
    });
  });
}

// retrieve an access token
getAccessToken(oauth2Client, function() {
  // retrieve user profile
  calendar.calendarList.list({ auth: oauth2Client }, function(err, profile) {
    if (err) {
      console.log('An error occured', err);
      return;
    }
    console.log(profile.displayName, ':', profile.tagline);
  });
});

module.exports = oauth2Client;