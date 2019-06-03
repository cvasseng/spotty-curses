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

/**
 * Dispatcher function
 */
module.exports = (command, ...args) => {
  if (Array.isArray(command)) {
    return command.forEach(c => module.exports(c, args));
  }

  let it = module.exports;
  let fn = false;
  const parsedCommand = command.split('.');

  parsedCommand.some((p, i) => {
    if (i === parsedCommand.length - 1) {
      fn = it[p];
    } else if (typeof it[p] !== 'undefined') {
      it = it[p];
    } else {
      return true;
    }
    return false;
  });

  return fn ? fn.apply(false, args) : false;
};

Object.assign(module.exports, {
  Playlist: require('./playlist.js'),
  Albums: require('./albums.js'),
  Tracks: require('./tracks.js')
});
