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
const hintBar = require('./hintBar');

module.exports = screen => {
  const box = blessed.Box({
    parent: screen,
    left: 'center',
    top: 'center',
    width: '90%',
    height: '80%',
    input: true,
    visible: false,
    shadow: true,
    border: 'line',
    hidden: true,
    style: Object.assign({}, config.theme)
  });

  const tracks = blessed.ListTable({
    parent: box,
    dockBorders: true,
    top: 0,
    left: 0,
    width: '100%-2',
    height: '100%-2',
    align: 'left',
    content: '',
    mouse: true,
    style: Object.assign({}, config.theme)
  });

  hintBar(box, [
    { key: '+', title: 'append selected' },
    { key: 'space', title: 'append & play selected' },
    { key: '/', title: 're-search' },
    { key: 'q', title: 'close window' }
  ]);

  let loadedTracks = [];

  const withLoaded = fn => {
    const loaded = loadedTracks[tracks.selected - 1];
    return loaded && fn(loaded);
  };

  const pad = (str, max) =>
    str.substr(0, max || 25) + (str.length < (max || 25) ? '' : '...');

  tracks.key(['q'], () => box.hide() || screen.render() || command.Tracks.FocusQueue());
  tracks.key(['j'], () => tracks.down(1) || screen.render());
  tracks.key(['k'], () => tracks.up(1) || screen.render());

  tracks.key(['/'], () => {
    box.hide();
    command.Tracks.Search();
  });

  tracks.key(['space'], () => {
    // Append + play
    withLoaded(track => {
      const ui = require('./index');
      ui.playlist.appendTracks([track]);
      ui.playlist.playLast();
    });
  });

  tracks.key(['+'], () => {
    // Only append
    withLoaded(track => {
      const ui = require('./index');
      ui.playlist.appendTracks([track]);
    });
  });

  tracks.key(['!'], () => {
    // Append all
  });

  const loadTracks = (trackList, title) => {
    box.show();

    loadedTracks = trackList;

    box.setLabel(title || '');
    tracks.setLabel(title || '');

    tracks.setData(
      [['Title', 'Artist', 'Album']].concat(
        trackList.map(item => [
          pad(item.name),
          pad((item.artists || []).map(artist => artist.name).join(', ')),
          pad(item.album.name)
        ])
      )
    );

    tracks.select(0);
    box.setFront();
    tracks.focus();
    screen.render();
  };

  return {
    loadTracks
  };
};
