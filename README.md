# HitsterReloaded

A homemade music timeline card game. Every card has a QR code on one side and the artist, **year** and title on the other.
Scan a card with the phone and the song plays on Spotify **without showing what it is**. Then guess where it belongs on your timeline.

The whole thing is a small website in [`docs/`](docs), hosted on GitHub Pages. There's no server and no build step.

* **Player** (`…/`): open it on the phone and tap *Scan a card*.
* **Card maker** (`…/cards.html`, or ⚙ → Card maker): turns your Spotify playlist into printable cards.

## Adding songs later

1. Add songs to the playlist in Spotify.
2. Open the card maker. It checks the playlist automatically (or press **⟳ Update from Spotify**).
   New songs are marked **NEW**.
3. Check their years, choose **Only new cards**, and press **Print**.
4. Once they've printed fine, press **✓ Mark as printed**.
   Next time, only songs added after that count as new.

Songs you delete from the playlist are marked *removed*, and one button cleans them out.
**Start new card set** clears the list for a completely new game.
The list is saved in the browser you use for the card maker, so use the same computer each time.
To be safe, keep a backup with **⬇ Download backup**; you can import it again under *Other ways to add songs*.

## Printing tips

* Print **double-sided at 100% / actual size** ("flip on long edge"), ideally on thick paper (250–300 g/m²), then cut along the dashed lines.
* No duplex printer? Print the odd pages, put the stack back in the printer, and print the even pages.
* Spotify gives the *album's* release date, so remasters and best-of albums can show the wrong year.
  Years that look suspicious are yellow, so fix them before printing.

## Playing tips

* Whoever plays the songs needs **Spotify Premium**, and their account must be added under *User Management* in the Spotify dashboard (up to 5 people).
* Before the first card, open the Spotify app and play and pause any song, so the phone shows up as a speaker.
  **🔈 Speaker** switches to a Bluetooth box or another Spotify Connect device.
* *Add to Home Screen* makes the player feel like an app.
* Spotify still shows the song on the lock screen, so keep the phone face-down 😉

## Configuration

[`docs/config.js`](docs/config.js) holds the Spotify Client ID and the name shown at the top of the pages.
The Spotify app's Redirect URI must be the Pages URL with the trailing slash.
The ⚙ dialog → *Spotify app setup* shows the exact value.

The playlist must be one you **own or collaborate on**, because Spotify doesn't let small apps read other people's playlists.
In Spotify, *Add to other playlist → New playlist* makes your own copy.

Local testing: run `cd docs && python3 -m http.server 8000 --bind 127.0.0.1`, and add `http://127.0.0.1:8000/` as an extra Redirect URI.

Libraries used: [jsQR](https://github.com/cozmo/jsQR) (Apache-2.0) and [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) (MIT).
