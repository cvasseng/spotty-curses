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

  const albums = blessed.ListTable({
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

  let loadedAlbums = false;

  screen.key(
    ['a'],
    () => box.toggle() || screen.render() || command.Albums.FetchForPlaying()
  );

  box.on('show', () => albums.focus() || command.Albums.FetchForPlaying());

  albums.key(['+'], () => {
    // Add tracks in the selected album to the play queue
    const album = loadedAlbums[albums.selected - 1];
    spotify.albums.getTracksInAlbum(album.id).then(data => {
      const ui = require('./index.js');
      ui.playlist.appendTracks(data.body.items, album.name, album);
    });
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
            a.name,
            a.artists.map(i => i.name).join(', '),
            '' + a.total_tracks,
            a.release_date
          ])
        )
      );
    }
  };
};
