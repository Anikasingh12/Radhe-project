import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const newCaptcha = () => {
  const a = Math.floor(Math.random() * 90) + 10;
  const b = Math.floor(Math.random() * 9) + 1;
  return { a, b, answer: a + b };
};

/** Draws the captcha onto a noisy canvas, like the original. */
function CaptchaCanvas({ text }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#f1f1f1';
    ctx.fillRect(0, 0, c.width, c.height);
    for (let i = 0; i < 180; i++) {
      ctx.fillStyle = `hsl(${Math.random() * 360},60%,70%)`;
      ctx.fillRect(Math.random() * c.width, Math.random() * c.height, 2, 2);
    }
    ctx.font = '22px Arial';
    ctx.fillStyle = '#111';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 8, c.height / 2 + 1);
  }, [text]);
  return <canvas ref={ref} width={125} height={34} className="captcha-canvas" />;
}

export default function LoginModal() {
  const { loginOpen, setLoginOpen, login, demoLogin, rememberedId } = useAuth();
  const [form, setForm] = useState({ userId: '', password: '', captcha: '' });
  const [remember, setRemember] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [cap, setCap] = useState(newCaptcha);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();
  // Like the original: logging in from the landing page lands on the logged-in /home.
  const afterLogin = () => {
    if (loc.pathname === '/auth' || loc.pathname === '/') nav('/home');
  };

  useEffect(() => {
    if (loginOpen) {
      setForm({ userId: rememberedId, password: '', captcha: '' });
      setRemember(!!rememberedId);
      setCap(newCaptcha());
      setError('');
    }
  }, [loginOpen, rememberedId]);

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setLoginOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [setLoginOpen]);

  if (!loginOpen) return null;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.userId.trim()) return setError('Please enter User ID');
    if (!form.password) return setError('Please enter Password');
    if (Number(form.captcha) !== cap.answer) {
      setCap(newCaptcha());
      setForm((f) => ({ ...f, captcha: '' }));
      return setError('Invalid captcha');
    }
    setBusy(true);
    try {
      await login({ userId: form.userId, password: form.password }, remember);
      afterLogin();
    } catch (err) {
      setError(err.message);
      setCap(newCaptcha());
    } finally {
      setBusy(false);
    }
  };

  const demo = async () => {
    setBusy(true);
    try {
      await demoLogin();
      afterLogin();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={() => setLoginOpen(false)}>
      <form className="login-box" onMouseDown={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>Login</h2>
        <button type="button" className="modal-x" onClick={() => setLoginOpen(false)}>
          ×
        </button>

        <label>User ID</label>
        <input value={form.userId} onChange={set('userId')} placeholder="user id" autoFocus autoComplete="username" />
        <label className="remember">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me
        </label>

        <label>Password</label>
        <div className="pw-wrap">
          <input
            type={showPw ? 'text' : 'password'}
            value={form.password}
            onChange={set('password')}
            placeholder="Password"
            autoComplete="current-password"
          />
          <button type="button" className="pw-eye" onClick={() => setShowPw((s) => !s)} aria-label="toggle password">
            <i className={`fas fa-eye${showPw ? '' : '-slash'}`} />
          </button>
        </div>

        <div className="captcha-row">
          <CaptchaCanvas text={`${cap.a} + ${cap.b} = ?`} />
          <input
            value={form.captcha}
            onChange={set('captcha')}
            placeholder="Solve captcha"
            inputMode="numeric"
          />
          <button type="button" className="captcha-refresh" onClick={() => setCap(newCaptcha())} aria-label="refresh">
            <i className="fas fa-sync-alt" />
          </button>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn-grad" disabled={busy}>
          {busy ? <i className="fas fa-spinner fa-spin" /> : 'Login'}
        </button>
        <button type="button" className="btn-grad" onClick={demo} disabled={busy}>
          Demo ID
        </button>
      </form>
    </div>
  );
}
