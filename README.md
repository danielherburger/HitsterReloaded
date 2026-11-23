# Throwback – a homemade music timeline card game

A DIY music game for a birthday present: every card has a QR code on one side and the
artist, **year** and title on the other. Scan a card with the phone, the song plays in
Spotify **without showing what it is**, and players guess where it goes on their timeline.

Everything is plain HTML/JS in [`docs/`](docs). There's no server or build step, and it can be hosted for free on GitHub Pages.

| Page | What it does |
|---|---|
| `index.html` (player) | Scans a card with the camera and starts the song on the phone's Spotify app. It has buttons to pause, play from the start, reveal the answer and pick the speaker. |
| `cards.html` (card maker) | Loads a Spotify playlist (or a CSV), lets you fix the years, and prints double-sided cards on A4 paper. |

## What you need

* **Spotify Premium** for whoever plays the songs, because Spotify only lets apps control playback for Premium users.
* A free Spotify developer app, because that's how the web page is allowed to talk to Spotify.

## Setup (about 10 minutes)

1. **Host the site.** In GitHub, open *Settings → Pages* and choose *Deploy from a branch*, then pick your branch and the `/docs` folder.
   You get a URL like `https://<you>.github.io/HitsterReloaded/`. The camera and Spotify login both need https.
2. **Create a Spotify app** at <https://developer.spotify.com/dashboard>:
   * Redirect URI: your Pages URL exactly as shown, **with the trailing slash**,
     e.g. `https://<you>.github.io/HitsterReloaded/`.
     (The ⚙ settings dialog in the app shows the exact value to copy.)
   * APIs used: *Web API*.
   * Under *User Management*, add the Spotify account e-mail of **everyone who will log in**, for example your friend.
     A development-mode app allows up to 5 users.
3. **Put the Client ID in** [`docs/config.js`](docs/config.js) so nobody has to type it in on their phone, then commit and push.
   If you'd rather not, you can paste it into the ⚙ settings instead.

## Make the cards

1. Open `…/cards.html` and log in with Spotify.
2. Paste a playlist link and click **Load playlist**.
   Since Spotify's 2026 API changes, a small app can only read playlists that the logged-in user **owns or collaborates on**.
   For someone else's playlist, use Spotify's *Add to other playlist → New playlist* to make your own copy first.
   Another option is to export the playlist with [Exportify](https://exportify.app) and import the CSV.
3. **Check the years.** Spotify reports the *album's* release date, so remasters and greatest-hits albums
   often show the wrong year. Rows that look suspicious are highlighted in yellow. Every field can be edited,
   and the list is saved in your browser. **Download CSV** saves a backup.
4. Choose the text for the QR side (e.g. *Happy Birthday, Alex!*) and the card size, then click **Print**.
   Print double-sided at **100% / actual size** on thick paper (around 250–300 g/m²) with "flip on long edge".
   If your printer can't print double-sided, print the odd and even pages separately and glue them back to back.
   Then cut along the dashed lines.

The QR codes contain only the player link and a Spotify track ID, never the title. If someone scans one
with a normal camera app, it just opens the player, which plays the song without showing it.

## Playing

1. On the phone, open the Spotify app once and play and pause any song, so the phone shows up as a speaker.
2. Open the player page. Using *Add to Home Screen* makes it feel like an app. Log in once.
3. Tap **Scan a card**. The song plays on Spotify, and you can use **Reveal** to check the answer.
   You can also play through a Bluetooth speaker or another Spotify Connect device with **Speaker**.

> Tip: Spotify still shows the song on the lock screen and in the notification shade, so keep the phone face-down while the song plays 😉

## Local testing

```sh
cd docs && python3 -m http.server 8000 --bind 127.0.0.1
```
Then add `http://127.0.0.1:8000/` as an extra Redirect URI in the Spotify dashboard.
Spotify doesn't accept `localhost`, only `127.0.0.1`.

## Credits

* QR decoding: [jsQR](https://github.com/cozmo/jsQR) (Apache-2.0)
* QR generation: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT)
