// Minimal Spotify Web API client using the Authorization Code + PKCE flow.
// No server needed: the Client ID is public, no secret is used.
(function () {
  const SCOPES = [
    'user-modify-playback-state',
    'user-read-playback-state',
    'playlist-read-private',
    'playlist-read-collaborative',
  ].join(' ');

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };

  // The redirect URI is always the folder the app lives in (".../"),
  // so one entry in the Spotify dashboard covers every page.
  function redirectUri() {
    return location.origin + location.pathname.replace(/[^/]*$/, '');
  }

  function clientId() {
    return store.get('sp_client_id') || (window.APP_CONFIG && window.APP_CONFIG.clientId) || '';
  }
  function setClientId(id) { store.set('sp_client_id', (id || '').trim()); }

  function b64url(bytes) {
    return btoa(String.fromCharCode(...new Uint8Array(bytes)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  async function login() {
    if (!clientId()) throw new Error('Set your Spotify Client ID first (Settings).');
    const verifier = b64url(crypto.getRandomValues(new Uint8Array(64)));
    const challenge = b64url(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier)));
    sessionStorage.setItem('sp_verifier', verifier);
    sessionStorage.setItem('sp_return', location.href.split('#')[0]);
    const p = new URLSearchParams({
      client_id: clientId(),
      response_type: 'code',
      redirect_uri: redirectUri(),
      code_challenge_method: 'S256',
      code_challenge: challenge,
      scope: SCOPES,
    });
    location.href = 'https://accounts.spotify.com/authorize?' + p;
  }

  function saveTokens(t) {
    store.set('sp_access', t.access_token);
    store.set('sp_expires', String(Date.now() + (t.expires_in - 60) * 1000));
    if (t.refresh_token) store.set('sp_refresh', t.refresh_token);
  }

  async function tokenRequest(params) {
    const res = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: clientId(), ...params }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error_description || data.error || 'Login failed');
    saveTokens(data);
  }

  // Call on every page load. Returns true if we just came back from Spotify login.
  async function handleRedirect() {
    const q = new URLSearchParams(location.search);
    if (q.get('error')) {
      history.replaceState(null, '', location.pathname);
      throw new Error('Spotify login cancelled: ' + q.get('error'));
    }
    const code = q.get('code');
    if (!code) return false;
    const verifier = sessionStorage.getItem('sp_verifier');
    history.replaceState(null, '', location.pathname);
    if (!verifier) return false;
    await tokenRequest({ grant_type: 'authorization_code', code, redirect_uri: redirectUri(), code_verifier: verifier });
    sessionStorage.removeItem('sp_verifier');
    const ret = sessionStorage.getItem('sp_return');
    sessionStorage.removeItem('sp_return');
    if (ret && ret !== location.href.split('#')[0]) { location.replace(ret); }
    return true;
  }

  async function accessToken() {
    if (!store.get('sp_access')) return null;
    if (Date.now() > Number(store.get('sp_expires') || 0)) {
      const rt = store.get('sp_refresh');
      if (!rt) { logout(); return null; }
      try { await tokenRequest({ grant_type: 'refresh_token', refresh_token: rt }); }
      catch { logout(); return null; }
    }
    return store.get('sp_access');
  }

  function loggedIn() { return !!store.get('sp_refresh') || !!store.get('sp_access'); }
  function logout() { ['sp_access', 'sp_expires', 'sp_refresh'].forEach(store.del); }

  class ApiError extends Error {
    constructor(status, message, reason) { super(message); this.status = status; this.reason = reason; }
  }

  async function api(path, { method = 'GET', body, query } = {}, retried = false) {
    const token = await accessToken();
    if (!token) throw new ApiError(401, 'Not logged in to Spotify');
    let url = path.startsWith('http') ? path : 'https://api.spotify.com/v1' + path;
    if (query) url += (url.includes('?') ? '&' : '?') + new URLSearchParams(query);
    const res = await fetch(url, {
      method,
      headers: { Authorization: 'Bearer ' + token, ...(body ? { 'Content-Type': 'application/json' } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401 && !retried) {
      store.set('sp_expires', '0');
      return api(path, { method, body, query }, true);
    }
    if (res.status === 204 || res.status === 202) return null;
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = null; }
    if (!res.ok) {
      const e = data && data.error;
      throw new ApiError(res.status, (e && e.message) || res.statusText || 'Spotify error', e && e.reason);
    }
    return data;
  }

  // Accepts our card URLs (…#t=ID), open.spotify.com links, spotify:track:ID or a bare ID.
  function parseTrackId(text) {
    if (!text) return null;
    const s = String(text).trim();
    const m = s.match(/[#?&]t=([A-Za-z0-9]{22})/) || s.match(/track[/:]([A-Za-z0-9]{22})/) || s.match(/^([A-Za-z0-9]{22})$/);
    return m ? m[1] : null;
  }

  window.SP = { login, logout, handleRedirect, loggedIn, api, ApiError, clientId, setClientId, redirectUri, parseTrackId };
})();
