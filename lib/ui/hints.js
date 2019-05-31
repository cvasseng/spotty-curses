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
    right: 2,
    bottom: 0,
    width: '200',
    height: '200',
    input: true,
    visible: false,
    shadow: true,
    // border: 'line',
    hidden: true,
    label: 'Hotkeys',
    style: config.hintTheme
  });

  let hideTimeout = false;

  box.on('show', () => box.setFront() || box.focus());

  const apply = items => {
    let width = 0;

    box.children.forEach(c => c.destroy() || box.remove(c));

    const keySwallow = blessed.Box({
      parent: box,
      input: true,
      width: 1,
      height: 1,
      style: config.hintTheme
    });

    items.forEach((item, i) => {
      const line = blessed.Box({
        parent: box,
        height: 1,
        width: '90%',
        top: i,
        left: 1,
        tags: true,
        content: `{yellow-fg}${item.key}{/yellow-fg} - ${item.title}`,
        style: config.hintTheme
      });

      keySwallow.key([item.key], () => {
        command(item.command);
        hide();
        return false;
      });

      width = item.title.length > width ? item.title.length : width;
    });

    keySwallow.key(['escape', 'q'], hide);

    box.height = items.length;
    box.width = width + 2;

    keySwallow.focus();
    screen.render();
  };

  const hide = () => {
    box.children.forEach(c => {
      c.destroy();
      box.remove(c);
    });
    box.hide();
    screen.render();
  };

  const show = (context, items) => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(hide, 2000);

    box.show();
    apply(items || []);
    box.setFront();
  };

  return {
    show,
    hide
  };
};
