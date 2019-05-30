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

module.exports = spotifyApi => {
  return {
    /**
     * Get the saved tracks for the logged in user
     */
    mySavedTracks: (limit, offset) =>
      new Promise((resolve, reject) => {
        spotifyApi
          .getMySavedTracks({
            limit: limit || 10,
            offset: offset || 1
          })
          .then(
            data => {
              resolve(data.body);
            },
            err => {
              reject(err);
            }
          );
      }),

    /**
     * Get a users playlsit
     */
    getUserPlaylists: username =>
      new Promise((resolve, reject) => {
        spotifyApi
          .getUserPlaylists(username || 'cmv', {
            limit: 50
          })
          .then(
            data => {
              resolve(data.body);
            },
            err => {
              reject(err);
            }
          );
      }),

    /**
     * Get a specific playlist
     */
    getPlaylist: id =>
      new Promise((resolve, reject) => {
        spotifyApi.getPlaylist(id).then(
          data => {
            resolve(data.body);
          },
          err => {
            reject(err);
          }
        );
      }),

    /**
     * Get tracks in a playlist
     */
    getTracksInPlaylist: id =>
      new Promise((resolve, reject) =>
        spotifyApi
          .getPlaylistTracks(id)
          .then(data => resolve(data.body), err => reject(err))
      )
  };
};
