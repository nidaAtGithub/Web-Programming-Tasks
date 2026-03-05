const BASE = 'http://localhost:3000';

  function switchTab(tab) {
    document.querySelectorAll('.tab').forEach((t, i) => {
      t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
    });
    document.getElementById('loginPanel').classList.toggle('active', tab === 'login');
    document.getElementById('registerPanel').classList.toggle('active', tab === 'register');
    document.getElementById('dashboardPanel').classList.remove('active');
    document.getElementById('tabs').style.display = 'flex';
  }

  function showDashboard(username) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('dashboardPanel').classList.add('active');
    document.getElementById('welcomeName').textContent = `Welcome, ${username}!`;
    document.getElementById('tabs').style.display = 'none';
  }

  function showToast(msg, type = 'success') {
    const t = document.getElementById('toast');
    document.getElementById('toastMsg').textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  function setLoading(btnId, loading) {
    const btn = document.getElementById(btnId);
    btn.disabled = loading;
    btn.innerHTML = loading
      ? `<span class="spinner"></span>Please wait...`
      : btn.id === 'loginBtn' ? 'Sign In' : 'Create Account';
  }

  async function handleRegister() {
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value.trim();
    if (!username || !password) return showToast('Please fill in all fields', 'error');

    setLoading('registerBtn', true);
    try {
      const res = await fetch(`${BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        document.getElementById('regUsername').value = '';
        document.getElementById('regPassword').value = '';
        setTimeout(() => switchTab('login'), 1200);
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('Cannot connect to server', 'error');
    }
    setLoading('registerBtn', false);
  }

  async function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    if (!username || !password) return showToast('Please fill in all fields', 'error');

    setLoading('loginBtn', true);
    try {
      const res = await fetch(`${BASE}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        setTimeout(() => showDashboard(username), 800);
      } else {
        showToast(data.message, 'error');
      }
    } catch {
      showToast('Cannot connect to server', 'error');
    }
    setLoading('loginBtn', false);
  }

  async function handleLogout() {
    try {
      const res = await fetch(`${BASE}/logout`, { credentials: 'include' });
      const data = await res.json();
      showToast(data.message, 'success');
      setTimeout(() => switchTab('login'), 800);
    } catch {
      showToast('Cannot connect to server', 'error');
    }
  }