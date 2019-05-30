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
    getByArtist: artistID =>
      new Promise((resolve, reject) => {
        spotifyApi
          .getArtistAlbums(artistID)
          .then(data => resolve(data), err => reject(err));
      }),

    getTracksInAlbum: albumID =>
      new Promise((resolve, reject) => {
        spotifyApi
          .getAlbumTracks(albumID, { limit: 20, offset: 1 })
          .then(data => resolve(data), err => reject(err));
      })
  };
};
