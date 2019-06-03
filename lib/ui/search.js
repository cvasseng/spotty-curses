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
  const box = blessed.Form({
    parent: screen,
    width: '90%',
    height: 5,
    border: 'line',
    top: 'center',
    left: 'center',
    label: 'Search',
    hidden: true,
    style: Object.assign({}, config.theme)
  });

  const input = blessed.Textbox({
    parent: box,
    width: '100%-2',
    height: 1,
    top: 1,
    left: 0,
    // inputOnFocus: true,
    input: true,
    style: Object.assign({}, config.theme)
  });

  box.key(['q'], box.hide);
  input.on('cancel', () => box.hide() || screen.render());

  const search = title => {
    box.setLabel(title + ' - esc to cancel');
    box.show();

    input.setValue('');
    input.focus();

    screen.render();

    return new Promise((resolve, reject) => {
      input.readInput(() => {
        box.hide();
        screen.render();
        resolve(input.getValue());
      });
    });
  };

  return {
    search
  };
};
