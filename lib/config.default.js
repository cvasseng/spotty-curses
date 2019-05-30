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
    fg: 255,
    // bg: 16,

    border: {
      fg: 235
      // bg: 233
    },

    selected: {
      bg: 22,
      fg: 22
    },

    item: {
      fg: 255,
      bg: 20,
      bold: true
    },

    // unselected: {
    //   bg: 16,
    //   fg: 'gray'
    // },

    bar: {
      fg: 255
    },

    header: {
      fg: 22,
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
