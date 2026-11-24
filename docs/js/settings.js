// Shared bits for every page: app name, edition texts and the settings dialog.
(function () {
  const cfg = window.APP_CONFIG || {};
  const name = cfg.appName || 'Hitster Reloaded';

  // Name with the last word in pink, e.g. "Hitster <span>Reloaded</span>".
  // data-appname="big" puts the last word on its own line.
  document.querySelectorAll('[data-appname]').forEach((el) => {
    const words = name.trim().split(/\s+/);
    const last = words.length > 1 ? words.pop() : '';
    el.textContent = words.join(' ');
    if (last) {
      el.appendChild(el.dataset.appname === 'big' ? document.createElement('br') : document.createTextNode(' '));
      const span = document.createElement('span');
      span.textContent = last;
      el.appendChild(span);
    }
  });
  const fill = (sel, text) => document.querySelectorAll(sel).forEach((el) => {
    el.textContent = text || '';
    el.hidden = !text;
  });
  fill('[data-edition]', cfg.edition);
  fill('[data-tagline]', cfg.tagline);
  document.title = document.title === 'Card Maker' ? `${name} · Karten-Maker` : name;

  const configured = !!cfg.clientId;
  const dlg = document.createElement('dialog');
  dlg.innerHTML = `
    <h2>Einstellungen</h2>
    <div class="stack">
      <p id="loginState" style="margin:0"></p>
      <div class="row">
        <button class="small" id="loginNow">Mit Spotify anmelden</button>
        <button class="secondary small" id="logout">Abmelden</button>
      </div>
      <a class="btn secondary small" href="cards.html" style="width:100%">Karten-Maker öffnen</a>
      <details ${configured ? '' : 'open'}>
        <summary>Spotify-App einrichten</summary>
        <div class="stack" style="margin-top:8px">
          <div>
            <label for="cid">Spotify Client ID</label>
            <input id="cid" autocomplete="off" spellcheck="false" placeholder="32 Zeichen aus dem Spotify-Dashboard">
          </div>
          <p class="small muted" style="margin:0">Redirect URI für das Spotify-Dashboard:<br><code id="ruri"></code></p>
        </div>
      </details>
      <div class="row" style="justify-content:flex-end"><button class="ghost small" id="closeDlg" style="flex:0 0 auto">Schließen</button></div>
    </div>`;
  document.body.appendChild(dlg);
  const $ = (s) => dlg.querySelector(s);

  function open() {
    $('#cid').value = SP.clientId();
    $('#ruri').textContent = SP.redirectUri();
    $('#loginState').textContent = SP.loggedIn() ? 'Bei Spotify angemeldet.' : 'Nicht bei Spotify angemeldet.';
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
