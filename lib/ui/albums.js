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
    width: '90%',
    height: '80%',
    shadow: true,
    input: true,
    top: 'center',
    left: 'center',
    hidden: true,
    border: 'line',
    style: Object.assign({}, config.theme)
  });

  const albums = blessed.ListTable({
    parent: box,
    dockBorders: true,
    input: true,
    top: 'top',
    width: '100%-2',
    height: '100%-2',
    pad: 5,
    content: '',
    mouse: true,
    align: 'left',
    invertSelection: false,
    conent: '',
    label: '',
    style: Object.assign({}, config.theme)
  });

  const ma = s => `({yellow-fg}${s}{/yellow-fg})`;

  const hintBar = blessed.Text({
    parent: box,
    bottom: 0,
    left: 1,
    height: 1,
    tags: true,
    content: `${ma('+')} append album, ${ma('!')} append all albums, ${ma(
      'space'
    )} load & play selected ${ma('q')} close`
  });

  let loadedAlbums = false;

  box.on(
    'show',
    () => box.setFront() || albums.focus() || command.Albums.FetchForPlaying()
  );

  albums.key(['+'], () => {
    // Add tracks in the selected album to the play queue
    const album = loadedAlbums[albums.selected - 1];
    spotify.albums.getTracksInAlbum(album.id).then(data => {
      const ui = require('./index.js');
      ui.playlist.appendTracks(data.body.items, album.name, album);
    });
  });

  albums.key(['space'], () => {
    const album = loadedAlbums[albums.selected - 1];
    spotify.albums.getTracksInAlbum(album.id).then(data => {
      const ui = require('./index.js');
      ui.playlist.loadTracks(data.body.items, album.name, album);
      ui.playlist.playSelected();
    });
    command.Tracks.FocusQueue();
    box.hide();
    screen.render();
  });

  albums.key(['!'], () => {
    const ui = require('./index.js');

    Promise.all(
      loadedAlbums.map(album =>
        spotify.albums
          .getTracksInAlbum(album.id)
          .then(data =>
            ui.playlist.appendTracks(
              data.body.items,
              'Albums by ' + album.artists[0].name,
              album
            )
          )
      )
    );
  });

  albums.key(['j'], () => albums.down(1) || screen.render());
  albums.key(['k'], () => albums.up(1) || screen.render());

  albums.key(
    ['q'],
    () => box.hide() || screen.render() || command.Tracks.FocusQueue()
  );

  const trim = (s, max) =>
    s.length > (max || 10) ? s.substr(0, max || 10) + '...' : s;

  return {
    clear: () => {
      albums.clearItems();
      screen.render();
    },
    load: albumList => {
      loadedAlbums = albumList;

      albums.setData(
        [['Album Name', 'Artist', 'Tracks', 'Release']].concat(
          albumList.map(a => [
            trim(a.name, 22),
            trim(a.artists.map(i => i.name).join(', '), 20),
            '' + a.total_tracks,
            a.release_date
          ])
        )
      );

      box.show();
      albums.focus();
      screen.render();
    }
  };
};
