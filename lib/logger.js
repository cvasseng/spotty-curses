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

const levels = [
  { name: 'error', color: 'red' },
  { name: 'warn', color: 'yellow' },
  { name: 'notice', color: 'blue' },
  { name: 'silly', color: 'gray' }
];

let activeLevel = 4;

require('colors');

const ts = () => {
  const d = new Date();
  return `${d.getDay()}/${d.getMonth() + 1} ${d.getHours()}:${d.getMinutes()}`;
};

module.exports = namespace => {
  const logOut = (level, index, ...args) => {
    console.log(
      `${ts()} [${namespace}] ${level.name}:`[level.color],
      args.join(' ').gray
    );
  };

  const exports = {};

  levels.map((level, i) => {
    exports[level.name] = (...args) => logOut(level, i, args);
  });

  return exports;
};

module.exports.setLogLevel = l => (activeLevel = l);
