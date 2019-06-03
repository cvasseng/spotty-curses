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

const blessed = require('neo-blessed');

module.exports = (parent, items, bottom) => {
  let label = '';

  items.forEach((item, i) => {
    label +=
      (i ? ', ' : '') + `({yellow-fg}${item.key}{/yellow-fg}) ${item.title}`;
  });

  blessed.Text({
    parent: parent,
    bottom: bottom || 0,
    left: 0,
    height: 1,
    tags: true,
    content: label
  });
};
