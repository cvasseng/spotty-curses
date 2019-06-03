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
const log = require('./../logger')('Command.Tracks.*');

module.exports = {
  /**
   * Search for track
   */
  Search: () => {
    const ui = require('./../ui');

    ui.search
      .search('Search Tracks')
      .then(
        searchString =>
          searchString
            ? spotify.tracks
                .search(searchString)
                .then(tracks => {
                  // Figure out if we should append or clear & add
                  const ui = require('./../ui');
                  ui.trackPopup.loadTracks(
                    tracks.body.tracks.items,
                    `"${searchString}" Search Results`
                  );
                })
                .catch(e => {
                  throw e;
                })
            : Promise.resolve()
      )
      .catch(e => log.error('Search', e));
  },

  /**
   * Play next track
   */
  PlayNext: () => {
    const ui = require('./../ui');
    return ui.playlist.playNext();
  },

  /**
   * Play previous track
   */
  PlayPrevious: () => {
    const ui = require('./../ui');
    return ui.playlist.playPrev();
  },

  /**
   * Focus track queue
   */
  FocusQueue: () => {
    const ui = require('./../ui');
    return ui.playlist.giveFocus();
  }
};
