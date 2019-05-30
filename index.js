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

const config = require('./lib/config');
const spotify = require('./lib/spotify-api');
const command = require('./lib/commands');

config()
  .then(() =>
    spotify.authenticate().then(() => {
      spotify.player
        .activateDevice()
        .then(data => console.log(data))
        .catch(e => console.log(e));

      // Start the UI
      const ui = require('./lib/ui');
      ui.playlistSidebar.reloadFromSpotify();
    })
  )
  .catch(e => console.error(e));
