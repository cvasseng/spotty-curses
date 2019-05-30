module.exports = {

  defaultDevice: '',
  authentication: {
    // These must be created at https://developer.spotify.com
    // as described here:
    // https://developer.spotify.com/documentation/general/guides/app-settings/#register-your-app
    clientID: '',
    clientSecret: ''
  },

  hotkeys: {

    // Navigation
    'Navigate.Left': 'l',
    'Navigate.Right': 'h',
    'Navigate.Up': 'k',
    'Navigate.Down': 'j',

    // Playlist Sidebar
    'Playlist.Activate': 'p + a',
    'Playlist.Toggle': 'p + t',
    'Playlist.Search': 'p + s',
    'Playlist.Play': 'p + space',

    // Active Playlist
    'Active.Select': 'return',

    // Searching
    'Search.All': '/',

    // Playback
    'Playback.PlayPause': 'space',
    'Playback.Next': 'n',
    'Playback.Prev': 'p'

  },

  theme: {
    fg: '#fafafa',
    bg: '#000000',
    border: {
      fg: '#222222'
      // bg: '#999999'
    },
    focus: {
      border: {
        fg: 'blue'
      }
    },
    hover: {
      bg: '#00000'
    },
    selected: {
      bg: 'red',
      fg: 'red',
      border: {
        fg: 'red'
      }
    },
    unselected: {
      bg: '#000000',
      fg: '#fafafa'
    },
    bar: {
      fg: '#fafafa',
      bg: '#000000'
    },
    header: {
      fg: 'yellow',
      bg: 'black',
      bold: true
    }
  },

  popupTheme: {
    fg: '#fafafa',
    bg: '#333333',
    header: {
      fg: 'yellow',
      bg: '#333333',
      bold: true
    }
  }
}
