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

module.exports = screen => {
  const progress = blessed.ProgressBar({
    parent: screen,
    dockBorders: true,
    bottom: 1,
    left: 'center',
    width: '98%',
    height: '20',
    content: '',
    vi: true,
    mouse: true,
    filled: 50,
    pch: '#',
    // autoPadding: true,
    style: config.theme
  });

  const songTitle = blessed.Text({
    parent: screen,
    dockBorders: true,
    width: '100%',
    left: 0,
    height: 1,
    bottom: 3,

    autoPadding: true,
    content: 'Nirvana - Smells like teen spirit'
  });

  const countUp = blessed.Text({
    parent: screen,
    dockBorders: true,
    width: 10,
    left: 0,
    height: 1,
    bottom: 1,
    // border: 'line',
    align: 'right',
    valign: 'center',
    autoPadding: true,
    content: '2:00'
  });

  const countDown = blessed.Text({
    parent: screen,
    dockBorders: true,
    width: 10,
    right: 0,
    height: 1,
    bottom: 1,
    align: 'left',
    content: '4:00'
  });

  const msToTime = ms => {
    const seconds = Math.round(ms / 1000) % 60;
    const minutes = Math.round(ms / 60000) % 60;

    return (
      (minutes < 10 ? '0' + minutes : '' + minutes) +
      ':' +
      (seconds < 10 ? '0' + seconds : '' + seconds)
    );
  };

  return {
    setProgress: p => {
      progress.setFill(p);
    },

    update: (playing, duration) => {
      songTitle.setContent(playing);
      countUp.setContent('0:00');
      countDown.setContent('-' + msToTime(duration));
      screen.render();
    }
  };
};
