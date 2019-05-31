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
screen.key(['C-q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

module.exports = {
  playlist: require('./playlist')(screen),
  playlistSidebar: require('./playlistSidebar')(screen),
  albumArt: require('./albumart')(screen),
  player: require('./playerControls')(screen),
  devices: require('./devices')(screen),
  albums: require('./albums')(screen),
  hints: require('./hints')(screen)
};

// Album context
screen.key(['a'], () =>
  module.exports.hints.show('Albums', [
    {
      title: 'Show albums for playing artist',
      key: 'p',
      command: 'Albums.FetchForPlaying'
    },
    {
      title: 'Show albums for highlighted track',
      key: 's',
      command: 'Albums.ShowForHighlighted'
    },
    { title: 'Search for albums', key: '/', command: 'Albums.Search' },
    { title: 'My saved albums', key: 's', command: 'Albums.ShowMySaved' }
  ])
);

// Render the screen.
screen.render();
