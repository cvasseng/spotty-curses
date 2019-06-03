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

const path = require('path');
const fs = require('fs');
const homedir = require('os').homedir();
const configPath = path.join(homedir, '.config', 'spotty-curses');

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

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const saveQueue = () => {
    fs.writeFile(
      path.join(configPath, 'queue.json'),
      JSON.stringify(loadedTracks),
      err => {
        if (err) {
          // We don't care if it fails that much.
        }
      }
    );
  };

  const loadQueue = () => {
    fs.readFile(path.join(configPath, 'queue.json'), 'utf8', (err, data) => {
      if (!err) {
        try {
          loadTracks(JSON.parse(data));
        } catch (e) {
          // Ignore.
        }
      }
    });
  };

  const ts = t => {
    if (!t) return '';
    const d = new Date(t);
    return monthNames[d.getMonth()] + ' ' + d.getFullYear();
  };

  let loadedTracks = [];
  let playingIndex = 0;

  const playSelected = () => {
    const ui = require('./index.js');
    const index = playlist.selected - 1;
    let track = loadedTracks[index];

    if (!track) return;

    track = track.track || track;

    // Play the track
    ui.player.update(
      track.artists.map(a => a.name).join(', ') + ' - ' + track.name,
      parseFloat(track.duration_ms)
    );

    // ui.albumArt.load(track.album.images[0].url);

    playingIndex = index;

    // Start playback
    return spotify.player.play(track.uri);
  };

  const playNext = () => {
    if (playingIndex + 1 < loadedTracks.length) {
      playlist.select(++playingIndex + 1);
      return playSelected();
    }
    return Promise.resolve();
  };

  const playPrev = () => {
    if (playingIndex - 1 >= 0) {
      playlist.select(--playingIndex + 1);
      return playSelected();
    }
    return Promise.resolve();
  };

  const playLast = () => {
    if (loadedTracks.length) {
      playlist.select(loadedTracks.length + 1);
      playSelected();
    }
  };

  const clear = () => {
    playlist.setLabel('Empty play queue');
    playlist.clearItems();
    loadedTracks = [];
    saveQueue();

    screen.render();
  };

  screen.key(['n'], playNext);
  screen.key(['b'], playPrev);

  // Hot keys for the widget
  playlist.key(['space'], playSelected);
  playlist.key(['j'], () => playlist.down(1) || screen.render());
  playlist.key(['k'], () => playlist.up(1) || screen.render());
  playlist.key(['c'], clear);

  playlist.on('select', playSelected);

  const arrayifyTracks = (tracks, album) => {
    return tracks.map(item => {
      item.album = item.album || album || {};

      return [
        item.name,
        (item.artists || []).map(artist => artist.name).join(', '),
        item.album.name,
        ts(item.added_at || '')
      ];
    });
  };

  const header = [['Title', 'Artist', 'Album', 'Added', 'Length']];

  const loadTracks = (tracks, title, album) => {
    playlist.select(0);
    playlist.setLabel(title || '');
    playlist.setData(header.concat(arrayifyTracks(tracks, album)));
    loadedTracks = tracks;
    playlist.focus();
    screen.render();
    saveQueue();
  };

  loadQueue();

  return {
    playSelected,
    playNext,
    playPrev,
    playLast,
    loadTracks,

    giveFocus: () => {
      playlist.focus();
    },

    getPlaying: () => {
      return loadedTracks[playingIndex] || false;
    },

    appendTracks: (tracks, title, album) => {
      playlist.setLabel(title || '');

      tracks.forEach(track => {
        loadedTracks.push(track);
      });

      playlist.setData(header.concat(arrayifyTracks(loadedTracks, album)));
      playlist.selected = 0;
      screen.render();
      saveQueue();
    },

    loadFromSpotify: (id, title) => {
      playlist.setLabel(title);
      spotify.playlists.getTracksInPlaylist(id).then(data => {
        playlist.setData(
          [['Title', 'Artist', 'Album', 'Added', 'Length']].concat(
            data.items.map(item => [
              item.track.name,
              item.track.artists.map(artist => artist.name).join(', '),
              item.track.album.name,
              ts(item.added_at)
            ])
          )
        );
        loadedTracks = data.items;
        screen.render();
      });
    }
  };
};
