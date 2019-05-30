/*******************************************************************************
 * spotty-curses
 *
 * Copyright (c) 2019 Chris Vasseng
 *
 * Licensed under the Simplified BSD License.
 * See LICENSE file in root for details.
 *
 ******************************************************************************/

// @format

const spotify = require('./../spotify-api');

module.exports = {
  /**
   * Fetch albums for the currently playing artist
   */
  FetchForPlaying: () => {
    const ui = require('./../ui');
    ui.albums.clear();

    spotify.player
      .getPlaying()
      .then(playing => {
        return spotify.albums.getByArtist(playing.item.artists[0].id);
      })
      .then(albums => {
        // console.log(albums.body.items[0]);
        ui.albums.load(albums.body.items);
      });
  }

  /**
   * Fetch the tracks for a given album
   */
};
