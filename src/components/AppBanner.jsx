import { useState } from 'react';
import { ASSETS } from '../config';

/** "Download Android Application" strip shown on mobile only. */
export default function AppBanner() {
  const [open, setOpen] = useState(() => sessionStorage.getItem('diamondx_apk_closed') !== '1');
  if (!open) return null;
  const close = () => {
    sessionStorage.setItem('diamondx_apk_closed', '1');
    setOpen(false);
  };
  return (
    <div className="app-banner mobile-only">
      <img src={ASSETS.apkIcon} alt="" className="app-banner-icon" />
      <div className="app-banner-text">
        <strong>Download Android Application</strong>
        <small>Instant Download on your device</small>
      </div>
      <a className="app-banner-install" href="#" onClick={(e) => e.preventDefault()}>
        Install
      </a>
      <button className="app-banner-close" onClick={close} aria-label="close">
        X
      </button>
    </div>
  );
}
