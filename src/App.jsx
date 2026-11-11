import { useEffect, useRef, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import AccountDrawer from './components/AccountDrawer';
import AccountModals, { Toast } from './components/AccountModals';
import AppBanner from './components/AppBanner';
import { MatchedBets } from './components/BetSlip';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import Marquee from './components/Marquee';
import NavMenu from './components/NavMenu';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import { CASINOS, SPORTS } from './config';
import { useAuth } from './context/AuthContext';
import Casino from './pages/Casino';
import Event from './pages/Event';
import Home from './pages/Home';
import InPlay from './pages/InPlay';
import Landing from './pages/Landing';
import MultiMarket from './pages/MultiMarket';
import Reports from './pages/Reports';
import Sport from './pages/Sport';

/** Inner pages: left sidebar + content (+ matched bet panel for sports). */
function InnerLayout({ children, rightPanel, eventId, sidebarOpen, closeSidebar }) {
  return (
    <div className="inner">
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <main className="inner-content">{children}</main>
      {rightPanel && <MatchedBets eventId={eventId} />}
    </div>
  );
}

function CasinoRoute() {
  const { provider } = useParams();
  if (!CASINOS[provider] || provider === 'wbbl') return <Navigate to="/home" replace />;
  return <Casino key={provider} provider={provider} />;
}

/** /game/:id — 4 Cricket, 1 Soccer, 2 Tennis (same ids as the original). */
function SportRoute() {
  const { id } = useParams();
  const sport = SPORTS.find((s) => String(s.id) === id);
  if (!sport) return <Navigate to="/home" replace />;
  return <Sport key={sport.key} sport={sport.key} />;
}

function EventRoute(props) {
  const { id } = useParams();
  return (
    <InnerLayout {...props} rightPanel eventId={id}>
      <Event />
    </InnerLayout>
  );
}

export default function App() {
  const { isLoggedIn } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // The header is position:fixed from 768px up (like the original); a spacer keeps the content below it.
  const headerRef = useRef(null);
  const [headerH, setHeaderH] = useState(0);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(() => setHeaderH(el.offsetHeight));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const loc = useLocation();
  const isLanding = !isLoggedIn && (loc.pathname === '/home' || loc.pathname === '/auth');

  useEffect(() => {
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }, [loc.pathname]);

  const layout = { sidebarOpen, closeSidebar: () => setSidebarOpen(false) };
  const inner = (el, rightPanel = false) => (
    <InnerLayout {...layout} rightPanel={rightPanel}>
      {el}
    </InnerLayout>
  );

  return (
    <div className={`app ${isLoggedIn ? 'is-logged-in' : ''}`}>
      <AppBanner />
      {/* Pinned to the top from 768px up, like the original's .header-fix */}
      <div className="header-fix" ref={headerRef}>
        {!isLoggedIn && <TopBar />}
        <Header onMenu={() => setSidebarOpen(true)} />
        {isLoggedIn && <Marquee />}
        <NavMenu />
      </div>
      <div className="header-spacer" style={{ height: headerH }} />

      {/* On the landing page the sidebar is only used as the mobile/tablet drawer */}
      {isLanding && (
        <div className="upto-tablet">
          <Sidebar open={sidebarOpen} onClose={layout.closeSidebar} />
        </div>
      )}

      <Routes>
        <Route path="/" element={<Navigate to={isLoggedIn ? '/home' : '/auth'} replace />} />
        <Route path="/auth" element={isLoggedIn ? <Navigate to="/home" replace /> : <Landing />} />
        <Route path="/home" element={isLoggedIn ? inner(<Home />) : <Landing />} />
        <Route path="/inplay" element={inner(<InPlay />, true)} />
        <Route
          path="/multimarket"
          element={isLoggedIn ? inner(<MultiMarket />, true) : <Navigate to="/auth" replace />}
        />
        <Route path="/game/:id" element={inner(<SportRoute />)} />
        <Route path="/cricket" element={<Navigate to="/game/4" replace />} />
        <Route path="/soccer" element={<Navigate to="/game/1" replace />} />
        <Route path="/tennis" element={<Navigate to="/game/2" replace />} />
        <Route path="/wbbl" element={inner(<Sport key="wbbl" sport="wbbl" />, true)} />
        <Route path="/event/:id" element={<EventRoute {...layout} />} />
        <Route path="/account-statement" element={inner(<Reports type="statement" />)} />
        <Route path="/profit-loss" element={inner(<Reports type="pl" />)} />
        <Route path="/bet-history" element={inner(<Reports type="history" />)} />
        <Route path="/unsettled-bets" element={inner(<Reports type="unsettled" />)} />
        <Route path="/:provider" element={inner(<CasinoRoute />)} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      {isLanding && <Footer />}
      <BottomNav onMenu={() => setSidebarOpen(true)} />

      <LoginModal />
      <AccountDrawer />
      <AccountModals />
      <Toast />
    </div>
  );
}
