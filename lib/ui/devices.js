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
    top: 'center',
    left: 'center',
    width: '300',
    height: '200',
    border: 'line',
    input: true,
    visible: false,
    shadow: true,
    hidden: true,
    style: Object.assign({}, config.theme)
  });

  const title = blessed.Text({
    parent: box,
    top: 1,
    left: 1,
    // width: '100%',
    height: 1,
    content: 'Playback Devices',
    align: 'center',
    style: Object.assign({}, config.theme)
  });

  const deviceList = blessed.ListTable({
    parent: box,
    top: 3,
    left: 0,
    input: true,
    width: '100%',
    height: '100%-5',
    style: Object.assign({}, config.theme),
    content: ''
  });

  let foundDevices = [];

  // Activate the selected device
  deviceList.key(
    ['space'],
    () =>
      box.hide() ||
      screen.render() ||
      spotify.player.activateDevice(foundDevices[deviceList.selected - 1].id)
  );

  // Toggle the window
  screen.key(['d'], () => box.toggle() || screen.render());

  // List navigation
  deviceList.key(['j'], () => deviceList.down(1) || screen.render());
  deviceList.key(['k'], () => deviceList.up(1) || screen.render());

  box.on('show', () =>
    spotify.player
      .getDevices()
      .then(data => {
        foundDevices = data.devices;
        deviceList.setData(
          [['Name', 'Type']].concat(
            data.devices.map(item => [item.name, item.type])
          )
        );
      })
      .then(() => deviceList.focus() || screen.render())
  );

  return {};
};
