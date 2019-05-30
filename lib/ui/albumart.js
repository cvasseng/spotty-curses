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
  const image = blessed.Image({
    parent: screen,
    dockBorders: true,
    bottom: 0,
    left: 0,
    // left: 0,
    width: '20%',
    height: '20%',
    content: '',
    vi: true,
    mouse: true,
    style: config.theme
  });

  return {
    load: uri => {
      image.setImage(uri);
    }
  };
};
