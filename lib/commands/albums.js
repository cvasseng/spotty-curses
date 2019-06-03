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
const log = require('./../logger')('Command.Albums.*');

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
        ui.albums.load(albums.body.items);
      })
      .catch(e => log.error('Fetch', e));
  },

  /**
   * Search for albums
   */
  Search: () => {
    const ui = require('./../ui');
    ui.albums.clear();

    ui.search
      .search('Search Albums')
      .then(
        searchString =>
          searchString
            ? spotify.albums
                .search(searchString, { limit: 40 })
                .then(albums => ui.albums.load(albums.body.albums.items))
                .catch(e => {
                  throw e;
                })
            : Promise.resolve()
      )
      .catch(e => log.error('Search', e));
  }

  /**
   * Fetch the tracks for a given album
   */
};
