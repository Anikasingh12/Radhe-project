import { useState } from 'react';
import * as api from '../api';
import { useAuth } from '../context/AuthContext';

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-box" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function StakeModal({ onClose }) {
  const { stakes, saveStakes, notify } = useAuth();
  const [vals, setVals] = useState(stakes.map(String));
  const save = () => {
    const n = vals.map(Number);
    if (n.some((v) => !v || v < 1)) return notify('Stake values must be positive numbers', 'error');
    saveStakes(n);
    notify('Stake values updated');
    onClose();
  };
  return (
    <Modal title="Set Button Value" onClose={onClose}>
      <div className="stake-grid">
        {vals.map((v, i) => (
          <input
            key={i}
            value={v}
            inputMode="numeric"
            onChange={(e) => setVals((a) => a.map((x, j) => (j === i ? e.target.value.replace(/\D/g, '') : x)))}
          />
        ))}
      </div>
      <button className="btn-grad" onClick={save}>Update</button>
    </Modal>
  );
}

function PasswordModal({ onClose }) {
  const { notify } = useAuth();
  const [f, setF] = useState({ oldPassword: '', newPassword: '', confirm: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.changePassword(f);
      notify('Password changed successfully');
      onClose();
    } catch (x) {
      setErr(x.message);
    }
  };
  return (
    <Modal title="Change Password" onClose={onClose}>
      <form className="form-stack" onSubmit={submit}>
        <label>Current Password</label>
        <input type="password" value={f.oldPassword} onChange={set('oldPassword')} />
        <label>New Password</label>
        <input type="password" value={f.newPassword} onChange={set('newPassword')} />
        <label>Confirm Password</label>
        <input type="password" value={f.confirm} onChange={set('confirm')} />
        {err && <div className="form-error">{err}</div>}
        <button className="btn-grad" type="submit">Change Password</button>
      </form>
    </Modal>
  );
}

const RULES = [
  ['General', [
    'All bets are subject to the rules of the respective market.',
    'If a market is suspended, bets cannot be placed until it reopens.',
    'In case of any technical error, the company reserves the right to void bets.',
  ]],
  ['Match Odds', [
    'Back means you bet on a selection to win; Lay means you bet on it not to win.',
    'Bets are settled on the official result at the end of the match.',
  ]],
  ['Bookmaker', [
    'Bookmaker rates are shown in paise (e.g. 56 = 1.56 decimal).',
    'Bets placed during a ball-running state may be voided.',
  ]],
  ['Fancy', [
    'Fancy bets are settled on the runs/wickets recorded at the end of the specified over.',
    'NO wins if the result is below the line; YES wins if the result is at or above the line.',
  ]],
];

function RulesModal({ onClose }) {
  const [tab, setTab] = useState(0);
  return (
    <Modal title="Rules" onClose={onClose}>
      <div className="rules">
        <div className="rules-tabs">
          {RULES.map(([t], i) => (
            <button key={t} className={i === tab ? 'active' : ''} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>
        <ol>
          {RULES[tab][1].map((r) => <li key={r}>{r}</li>)}
        </ol>
      </div>
    </Modal>
  );
}

export default function AccountModals() {
  const { modal, setModal } = useAuth();
  const close = () => setModal(null);
  if (modal === 'stake') return <StakeModal onClose={close} />;
  if (modal === 'password') return <PasswordModal onClose={close} />;
  if (modal === 'rules') return <RulesModal onClose={close} />;
  return null;
}

export function Toast() {
  const { toast } = useAuth();
  if (!toast) return null;
  return (
    <div key={toast.id} className={`toast toast-${toast.type}`}>
      <i className={`fas fa-${toast.type === 'error' ? 'exclamation-circle' : 'check-circle'}`} /> {toast.msg}
    </div>
  );
}
