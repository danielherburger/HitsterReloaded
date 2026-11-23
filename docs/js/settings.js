// Shared settings dialog (Client ID, redirect URI, login/logout).
(function () {
  const dlg = document.createElement('dialog');
  dlg.innerHTML = `
    <h2>Settings</h2>
    <div class="stack">
      <div>
        <label for="cid">Spotify Client ID</label>
        <input id="cid" autocomplete="off" spellcheck="false" placeholder="32 characters from the Spotify dashboard">
      </div>
      <p class="small muted">In your Spotify app's settings, add this exact Redirect URI:<br>
        <code id="ruri"></code></p>
      <p class="small muted" id="loginState"></p>
      <div class="row">
        <button id="saveCid">Save &amp; log in</button>
        <button class="secondary" id="logout">Log out</button>
        <button class="ghost" id="closeDlg">Close</button>
      </div>
    </div>`;
  document.body.appendChild(dlg);
  const $ = (s) => dlg.querySelector(s);

  function open() {
    $('#cid').value = SP.clientId();
    $('#ruri').textContent = SP.redirectUri();
    $('#loginState').textContent = SP.loggedIn() ? '✅ Logged in to Spotify.' : 'Not logged in.';
    dlg.showModal();
  }
  $('#saveCid').onclick = async () => {
    SP.setClientId($('#cid').value);
    try { await SP.login(); } catch (e) { alert(e.message); }
  };
  $('#logout').onclick = () => { SP.logout(); location.reload(); };
  $('#closeDlg').onclick = () => dlg.close();

  window.Settings = { open };
})();
