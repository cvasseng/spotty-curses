# spotty-curses
_Terminal-based UI for remote controlling Spotify(d) and other players_

## Why

FreeBSD has no native Spotify client, but has Spotifyd.
However, there are no UI's that can interact with players that work properly on FreeBSD either.

Also, terminal applications are cool.

## Installing

## Configuring

The main configuration file is stored in `~/.config/spotty-curses/config.json`.
Look at [lib/config.default.js](lib/config.default.js) for available options.

### App Registration

You need to specify a clientID and clientSecret, attained by registering an
app with Spotify. These should be put in the authentication object in you
config at ~/.config/spotty-curses/config.json. See default config in
lib/config.default.js for reference.

For more information on how to do this, visit:
https://developer.spotify.com/documentation/general/guides/app-settings/

### Logging in

The first time starting the application, a URL will be outputted in the terminal.
Click this to give the necessary access to your account (limited to read operations).

The token generated based on the authentication request is stored in 
`~/.config/spotty-curses/.token`, and perists between sessions.

## License

Licensed under the [Simplified BSD License](LICENSE).
