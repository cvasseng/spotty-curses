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

const rp = require('request-promise');
const config = require('./../config');

let activatedDevice = false;

module.exports = spotifyApi => {
  const headers = () => {
    return {
      Authorization: `Bearer ${spotifyApi.getAccessToken()}`
    };
  };

  return {
    /*
     * Get a list of available playback devices
     */
    getDevices: () =>
      rp({
        method: 'GET',
        uri: 'https://api.spotify.com/v1/me/player/devices',
        json: true,
        headers: headers()
      }),

    /**
     * Activate a given playback device
     */
    activateDevice: (id, autoPlay) =>
      rp({
        method: 'PUT',
        uri: 'https://api.spotify.com/v1/me/player',
        json: true,
        headers: headers(),
        body: {
          device_ids: [id || activatedDevice || config.defaultDevice],
          play: autoPlay
        }
      }),

    /**
     * Start playback
     */
    play: context =>
      rp({
        method: 'PUT',
        uri: 'https://api.spotify.com/v1/me/player/play',
        json: true,
        headers: headers(),
        body: {
          uris: [context]
        }
      }),

    /**
     * Get currently playing track
     */
    getPlaying: () =>
      rp({
        method: 'GET',
        uri: 'https://api.spotify.com/v1/me/player/currently-playing',
        json: true,
        headers: headers()
      })
  };
};
