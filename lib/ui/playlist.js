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

module.exports = screen => {
  const playlist = blessed.ListTable({
    parent: screen,
    dockBorders: true,
    top: 0,
    left: 0,
    border: {
      type: 'line'
    },
    width: '100%',
    height: '100%-5',
    align: 'left',
    content: '',
    input: true,
    vi: true,
    mouse: true,
    style: Object.assign({}, config.theme)
  });

  let loadedTracks = [];

  const playSelected = () => {
    const ui = require('./index.js');
    const index = playlist.selected - 1;
    const track = loadedTracks[index].track;

    // Play the track
    ui.player.update(
      track.artists.map(a => a.name).join(', ') + ' - ' + track.name,
      parseFloat(track.duration_ms)
    );

    // ui.albumArt.load(track.album.images[0].url);

    // Start playback
    spotify.player.play(track.uri);
  };

  // Hot keys for the widget
  playlist.key(['space'], playSelected);
  playlist.key(['j'], () => playlist.down(1) || screen.render());
  playlist.key(['k'], () => playlist.up(1) || screen.render());

  return {
    playSelected,
    loadFromSpotify: (id, title) => {
      playlist.setLabel(title);
      spotify.playlists.getTracksInPlaylist(id).then(data => {
        playlist.setData(
          [['Title', 'Artist', 'Album', 'Added', 'Length']].concat(
            data.items.map(item => [
              item.track.name,
              item.track.artists.map(artist => artist.name).join(', '),
              item.track.album.name,
              new Date(item.added_at).getFullYear()
            ])
          )
        );
        loadedTracks = data.items;
        screen.render();
      });
    }
  };
};
