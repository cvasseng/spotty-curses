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

const blessed = require('neo-blessed');

const screen = blessed.screen({
  smartCSR: true,
  // useBCE: true,
  debug: true,
  autoPadding: true,
  dockBorders: true
});

screen.title = 'Spotty Curses';

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

module.exports = {
  playlist: require('./playlist')(screen),
  playlistSidebar: require('./playlistSidebar')(screen),
  albumArt: require('./albumart')(screen),
  player: require('./playerControls')(screen),
  devices: require('./devices')(screen)
};

// Render the screen.
screen.render();
