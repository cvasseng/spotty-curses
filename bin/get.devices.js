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

const config = require('./../lib/config');
const spotify = require('./../lib/spotify-api');

config()
  .then(() => {
    spotify.authenticate().then(() => {
      spotify.player
        .getDevices()
        .then(data => console.log(data))
        .catch(e => console.log(e));
    });
  })
  .catch(e => console.error(e));
