/*******************************************************************************
 * spotty-curses
 *
 * Copyright (c) 2019
 *
 * Licensed under the Simplified BSD License.
 * See LICENSE file in root for details.
 *
 ******************************************************************************/

// @format

const fs = require('fs');
const path = require('path');
const log = require('./../logger')('spotify-api');
const config = require('./../config');

// Spotify related thngs.
const scopes = [
  'user-read-private',
  'user-library-read',
  'user-top-read',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'app-remote-control'
]; // required permissions
const SpotifyWebApi = require('spotify-web-api-node');
const authTokenPath = path.join(__dirname, '/../', '/../', '.stoken');

/*
 * Express is used to serve up the OAUTH2 callback.
 * Yes, this is overkill, but there might be other usecases
 * also for having it here. Will be converted to the http module
 * later if there isn't.
 */
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// We need express to accept the login route
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

module.exports = {
  authenticate: () => {
    return new Promise((resolve, reject) => {
      log.notice('starting authentication');

      const state = Math.random(); // used for oauth callback integrity check

      const clientID = config.authentication.clientID;
      const clientSecret = config.authentication.clientSecret;

      if (!clientID || !clientSecret) {
        return console.log(`
==========================================
spotty curses is not configured correctly!
==========================================

You need to specify a clientID and clientSecret, attained by registering an
app with Spotify. These should be put in the authentication object in you
config at ~/.config/spotty-curses/config.json. See default config in
lib/config.default.js for reference.

For more information on how to do this, visit:
https://developer.spotify.com/documentation/general/guides/app-settings/

IMPORTANT:
After registering the app, add the following URL to the callback whitelist:
http://127.0.0.1:2341/authenticate
        `);
      }

      // credentials are optional
      const spotifyApi = new SpotifyWebApi({
        clientId: clientID,
        clientSecret: clientSecret,
        redirectUri: 'http://127.0.0.1:2341/authenticate'
      });

      // This is a bit hacky, but this whole thing needs refactoring anyway.
      module.exports.playlists = require('./playlists')(spotifyApi);
      module.exports.player = require('./player')(spotifyApi);
      module.exports.albums = require('./albums')(spotifyApi);
      module.exports.tracks = require('./tracks')(spotifyApi);

      // Handle Oauth2 authentication
      app.get('/authenticate', (req, res) => {
        if (req.query.code && req.query.state == state) {
          // Retrieve an access token and a refresh token
          spotifyApi.authorizationCodeGrant(req.query.code).then(
            data => {
              // Set the access token on the API object to use it in later calls
              spotifyApi.setAccessToken(data.body['access_token']);
              spotifyApi.setRefreshToken(data.body['refresh_token']);

              // Write the token to file so we can reuse it.
              fs.writeFile(
                authTokenPath,
                JSON.stringify(
                  {
                    access_token: data.body['access_token'],
                    refresh_token: data.body['refresh_token'],
                    expires_in: data.body['expires_in']
                  },
                  0,
                  '  '
                ),
                err => {
                  if (err) log.warn('unable to store access tokens');
                  resolve();
                }
              );
            },
            err => {
              log.error('Authenticating:', err);
            }
          );

          res.send('You are now authenticated, and can close this tab.');
        } else {
          res.sendStatus(400);
        }
      });

      app.listen(2341);

      const askForToken = () => {
        const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
        console.log(
          'Please visit the following URL in your browser to authenticate:'
        );
        console.log(authorizeURL.bold.yellow);
      };

      // Try to load a token file
      fs.readFile(authTokenPath, 'utf8', (err, data) => {
        if (err) {
          // There's no authentication "on file".
          log.silly('no stored token found, asking for re-authentication');
          askForToken();
        } else {
          // Try to parse the token file
          log.silly('using tokens from token file', authTokenPath);

          let tokens;

          try {
            tokens = JSON.parse(data);
          } catch (e) {
            log.silly('tokens file is corrupt, asking for new token');
            return askForToken();
          }

          if (!tokens.access_token || !tokens.refresh_token) {
            log.silly('token file does not contain tokens');
            return askForToken();
          }

          spotifyApi.setAccessToken(tokens.access_token);
          spotifyApi.setRefreshToken(tokens.refresh_token);

          // Refresh the token

          spotifyApi.refreshAccessToken().then(
            data => {
              log.silly('the access token has been refreshed');
              // Save the access token so that it's used in future calls
              spotifyApi.setAccessToken(data.body['access_token']);

              resolve();

              fs.writeFile(
                authTokenPath,
                JSON.stringify(tokens, 0, '  '),
                err => {
                  if (err) return log.warn('unable to store tokens');
                }
              );
            },
            err => {
              log.error('could not refresh access token:', err);
              return askForToken();
            }
          );
        }
      });
    });
  }
};
