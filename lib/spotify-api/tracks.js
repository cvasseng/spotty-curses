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
    search: searchString =>
      new Promise((resolve, reject) => {
        spotifyApi
          .searchTracks(searchString, { limit: 40 })
          .then(data => resolve(data), err => reject(err));
      })
  };
};
