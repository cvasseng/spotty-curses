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
  const box = blessed.Box({
    parent: screen,
    dockBorders: true,
    bottom: 0,
    left: 0,
    // border: {
    // type: 'line'
    // },
    width: '100%',
    height: 5,
    // label: 'Playback',
    style: {
      bg: 16
    }
  });

  const progress = blessed.ProgressBar({
    parent: box,
    bottom: 1,
    // border: 'line',
    left: 'center',
    width: '100%-22',
    height: 1,
    ch: '-',
    style: Object.assign({}, config.theme)
  });

  const songTitle = blessed.Text({
    parent: box,
    dockBorders: true,
    width: '100%-21',
    left: 'center',
    height: 1,
    bottom: 3,

    align: 'center',

    autoPadding: true,
    content: '',
    style: Object.assign({}, config.theme)
  });

  const countUp = blessed.Text({
    parent: box,
    dockBorders: true,
    width: 5,
    left: 5,
    height: 1,
    bottom: 1,
    align: 'right',
    valign: 'center',
    autoPadding: true,
    content: '0:00',
    style: Object.assign({}, config.theme)
  });

  const countDown = blessed.Text({
    parent: box,
    dockBorders: true,
    width: 10,
    right: 0,
    height: 1,
    bottom: 1,
    align: 'left',
    content: '0:00',
    style: Object.assign({}, config.theme)
  });

  const msToTime = ms => {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / 1000 / 60);

    return (
      (minutes < 10 ? '0' + minutes : '' + minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : '' + seconds)
    );
  };

  const getTitle = track => {
    return track.artists.map(a => a.name).join(', ') + ' - ' + track.name;
  };

  let playback = {
    last: new Date().getTime(),
    progress: 0,
    duration: 0,
    isPlaying: true
  };

  const tick = () => {
    const t = new Date().getTime();
    const op = Math.floor(playback.progress / 1000);

    progress.setProgress((playback.progress / playback.duration) * 100);
    countDown.setContent('-' + msToTime(playback.duration - playback.progress));
    countUp.setContent(msToTime(playback.progress));

    if (playback.isPlaying) {
      playback.progress += t - playback.last;
      playback.last = t;
    }

    if (op !== Math.floor(playback.progress / 1000)) {
      screen.render();
    }

    if (playback.progress > playback.duration) {
      playback.isPlaying = false;
      playback.progress = 0;
    }
  };

  const fetchCurrent = () => {
    spotify.player.getPlaying().then(data => {
      if (!data) return;

      songTitle.setContent(getTitle(data.item));

      playback.last = new Date().getTime();
      playback.progress = data.progress_ms;
      playback.duration = data.item.duration_ms;
      playback.isPlaying = data.is_playing;

      tick();

      screen.render();
    });
  };

  setInterval(tick, 100);

  fetchCurrent();

  return {
    setProgress: p => {
      progress.setFill(p);
    },

    update: (playing, duration) => {
      // box.updateLabel(playing);
      songTitle.setContent(playing);
      countUp.setContent('0:00');
      countDown.setContent('-' + msToTime(duration));

      playback.duration = duration;
      playback.progress = 0;
      playback.last = new Date().getTime();
      playback.isPlaying = true;

      screen.render();
    }
  };
};
