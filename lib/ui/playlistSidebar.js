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

const config = require('./../config.js');
const blessed = require('neo-blessed');
const spotify = require('./../spotify-api');
const command = require('./../commands');

module.exports = screen => {
  const box = blessed.Box({
    parent: screen,
    width: '80%',
    height: '80%',
    shadow: true,
    input: true,
    top: 'center',
    left: 'center',
    hidden: true,
    style: Object.assign({}, config.theme)
  });

  const playlists = blessed.ListTable({
    parent: box,
    dockBorders: true,
    input: true,
    top: 'top',
    width: '100%',
    height: '100%',
    border: {
      type: 'line'
    },
    pad: 5,
    content: '',
    mouse: true,
    align: 'left',
    invertSelection: false,
    conent: '',
    label: '',
    style: Object.assign({}, config.theme)
  });

  let loadedPlaylists = [];

  const loadPlaylist = () => {
    const index = playlists.selected - 1;
    const playlistUI = require('./index.js').playlist;
    const playlist = loadedPlaylists[index];

    playlistUI.loadFromSpotify(playlist.id, playlist.name);
  };

  screen.key(['C-p'], () => box.toggle() || screen.render());

  playlists.key(['j'], (ch, key) => {
    playlists.down(1);
    // loadPlaylist();
  });

  playlists.key(['k'], (ch, key) => {
    playlists.up(1);
    screen.render();
    // loadPlaylist();
  });

  playlists.on('select', loadPlaylist);

  box.on('show', () => {
    playlists.focus();
  });

  playlists.key(
    ['q'],
    () => box.hide() || screen.render() || command.Tracks.FocusQueue()
  );

  return {
    load: items => {
      playlists.setData([['Playlist']].concat(items));
      screen.render();
    },
    reloadFromSpotify: () => {
      spotify.playlists
        .getUserPlaylists()
        .then(data => {
          loadedPlaylists = data.items;
          playlists.setData(
            [['Playlists']].concat(data.items.map(item => [item.name]))
          );
          screen.render();
        })
        .catch(e => {
          console.log(e);
        });
    }
  };
};
