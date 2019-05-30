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

const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

const defaultConfig = require('./config.default.js');
const log = require('./logger')('config');

const homedir = require('os').homedir();
const configPath = path.join(homedir, '.config', 'spotty-curses');

module.exports = () =>
  new Promise((resolve, reject) => {
    log.silly('looking for config in', configPath);

    // Load default config
    Object.assign(module.exports, defaultConfig);

    mkdirp(configPath, err => {
      if (err) return log.silly('unable to create config path');

      // Load the config
      fs.readFile(path.join(configPath, 'config.json'), 'utf8', (err, data) => {
        if (!err) {
          try {
            Object.assign(module.exports, JSON.parse(data));
            log.silly('loaded config from', configPath);
          } catch (e) {
            log.error(`There's an error in your config file: ${e}`);
          }
        } else {
          log.notice('no config found, continuing with defaults');
        }
        resolve();
      });
    });
  });
