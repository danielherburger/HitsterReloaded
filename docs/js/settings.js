// Shared bits for every page: app name and the ⚙ settings dialog.
(function () {
  const name = (window.APP_CONFIG && window.APP_CONFIG.appName) || 'Throwback';
  document.querySelectorAll('[data-appname]').forEach((el) => { el.textContent = name; });
  document.title = document.title === 'Card Maker' ? `${name} · Card maker` : name;

  const configured = !!(window.APP_CONFIG && window.APP_CONFIG.clientId);
  const dlg = document.createElement('dialog');
  dlg.innerHTML = `
    <h2>Settings</h2>
    <div class="stack">
      <p id="loginState" style="margin:0"></p>
      <div class="row">
        <button id="loginNow">Log in with Spotify</button>
        <button class="secondary" id="logout">Log out</button>
      </div>
      <a class="btn secondary" href="cards.html" style="width:100%">🃏 Card maker (add songs, print cards)</a>
      <details ${configured ? '' : 'open'}>
        <summary class="small muted">Spotify app setup</summary>
        <div class="stack" style="margin-top:8px">
          <div>
            <label for="cid">Spotify Client ID</label>
            <input id="cid" autocomplete="off" spellcheck="false" placeholder="32 characters from the Spotify dashboard">
          </div>
          <p class="small muted" style="margin:0">Redirect URI to enter in the Spotify dashboard:<br><code id="ruri"></code></p>
        </div>
      </details>
      <div class="row"><button class="ghost" id="closeDlg">Close</button></div>
    </div>`;
  document.body.appendChild(dlg);
  const $ = (s) => dlg.querySelector(s);

  function open() {
    $('#cid').value = SP.clientId();
    $('#ruri').textContent = SP.redirectUri();
    $('#loginState').textContent = SP.loggedIn() ? '✅ Logged in to Spotify.' : 'Not logged in to Spotify.';
    $('#loginNow').hidden = SP.loggedIn();
    $('#logout').hidden = !SP.loggedIn();
    dlg.showModal();
  }
  $('#cid').addEventListener('change', () => SP.setClientId($('#cid').value));
  $('#loginNow').onclick = () => {
    SP.setClientId($('#cid').value);
    SP.login().catch((e) => alert(e.message));
  };
  $('#logout').onclick = () => { SP.logout(); location.reload(); };
  $('#closeDlg').onclick = () => dlg.close();

  window.Settings = { open };
})();
