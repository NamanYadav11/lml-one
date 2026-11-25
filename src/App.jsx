import { useEffect, useLayoutEffect, useReducer, useRef, useState } from 'react';
import { AppCtx, FormCtx, Ic, Logo } from './ui.jsx';
import { V } from './views.jsx';
import { SH } from './sheets.jsx';
import { A } from './actions.js';
import { initialState } from './state.js';
import { MODS, ROLES, SPACES, SVC, HI } from './data.js';

const NAVL = { bills: ['Bills', 'receipt'], chambers: ['Book', 'cal'], desk: ['Requests', 'wrench'], gate: ['Gate', 'shield'], dash: ['Dashboard', 'chart'], permits: ['Permits', 'permit'] };
const NO_ACCESS = 'Your role doesn’t include this. Ask the owner for access.';

export default function App() {
  /* S is one mutable store, as in the original; update() re-renders after a change. */
  const S = useRef(null);
  if (!S.current) S.current = initialState();
  const s = S.current;
  const [, update] = useReducer(x => x + 1, 0);

  const [sheet, setSheet] = useState(null);           // { name, p, seq }
  const [scrim, setScrim] = useState('hidden');       // hidden | shown | open | closing
  const [frozen, setFrozen] = useState(null);         // sheet HTML shown while closing
  const [toastState, setToast] = useState({ msg: '', show: false });
  const sheetRef = useRef(null), scrimRef = useRef(null), sheetLive = useRef(null), toastTimer = useRef(), scrollTo = useRef(null);

  const can = k => k === 'home' || k === 'menu' || ROLES[s.role].includes(k === 'chamberBook' ? 'chambers' : k === 'svcCat' ? 'services' : k);
  const t = str => s.lang === 'hi' ? (HI[str] || str) : str;

  const toast = m => {
    setToast({ msg: m, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(x => ({ ...x, show: false })), 3000);
  };
  const notify = (text, go) => { s.notifs.unshift({ t: text, at: 'Just now', go }); };

  const openSheet = (name, p) => {
    s.sf = {};
    sheetLive.current = { name, p, seq: Date.now() };
    setSheet(sheetLive.current);
    setFrozen(null);
    setScrim(x => (x === 'hidden' || x === 'closing') ? (x === 'hidden' ? 'shown' : 'open') : x);
  };
  /* While it slides away, the sheet shows a snapshot of its last markup, so actions that
     delete the thing it was showing can't break it. */
  const closeSheet = () => {
    if (!sheetLive.current) return;
    sheetLive.current = null;
    setFrozen(sheetRef.current ? sheetRef.current.innerHTML : '');
    setScrim('closing');
    setTimeout(() => { if (!sheetLive.current) { setScrim('hidden'); setSheet(null); setFrozen(null); } }, 220);
  };

  const go = (v, p, root) => {
    if (!can(v)) { toast(NO_ACCESS); return; }
    if (root) s.stack = []; else s.stack.push({ v: s.view, p: s.param, y: window.scrollY, f: s.vf });
    s.view = v; s.param = p == null ? null : p; s.vf = {};
    scrollTo.current = 0;
  };
  const back = () => {
    const st = s.stack.pop();
    if (!st) { go('home', null, true); return; }
    s.view = st.v; s.param = st.p; s.vf = st.f || {};
    scrollTo.current = st.y || 0;
  };

  const api = { S: s, toast, openSheet, closeSheet, go, back, notify, can };
  const run = (name, p) => { A[name](api, p); update(); };
  const trigger = ({ go: g, sheet: sh, act, p, root }) => {
    if (g) { closeSheet(); go(g, p, root); update(); }
    else if (sh) openSheet(sh, p);
    else if (act) run(act, p);
  };
  const on = {
    go: (v, p, root) => () => trigger({ go: v, p, root }),
    sheet: (n, p) => () => trigger({ sheet: n, p }),
    act: (a, p) => () => trigger({ act: a, p })
  };
  const chip = (store, g, v, { m, st }) => {
    if (m) {
      const a = store[g] || (store[g] = []), i = a.indexOf(v);
      if (i >= 0) a.splice(i, 1); else a.push(v);
    } else if (st) {
      if (g === 'limit') s.limit = +v || Infinity; else s[g] = v;
    } else store[g] = v;
    update();
    if (g === 'role') toast(`Viewing as ${v}`);
  };

  const ctx = { S: s, t, can, toast, update, run, trigger, on, chip, openSheet, closeSheet };

  /* Scroll after navigation: top for a new screen, the saved position on back. */
  useLayoutEffect(() => {
    if (scrollTo.current != null) { window.scrollTo(0, scrollTo.current); scrollTo.current = null; }
  });

  /* Sheet open/close animation, body scroll lock and focus. */
  useLayoutEffect(() => {
    if (scrim === 'shown') { void scrimRef.current.offsetWidth; setScrim('open'); }
    document.body.classList.toggle('lock', scrim === 'shown' || scrim === 'open');
  }, [scrim]);
  useEffect(() => {
    if (!sheet || !sheetRef.current) return;
    sheetRef.current.scrollTop = 0;
    sheetRef.current.focus({ preventScroll: true });
  }, [sheet?.seq]);
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape' && sheetLive.current) closeSheet(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const title = () => {
    if (s.view === 'chamberBook') return SPACES[s.param].n;
    if (s.view === 'svcCat') return SVC[s.param].n;
    if (s.view === 'menu') return t('Menu');
    return MODS[s.view] ? MODS[s.view][0] : 'LML One';
  };
  useEffect(() => { document.title = s.view === 'home' ? 'LML One' : `${title()} | LML One`; });

  const unread = s.notifs.filter(n => !n.read).length;
  const bell = <button className="icon-btn" aria-label={`Notifications${unread ? `, ${unread} new` : ''}`} onClick={on.sheet('notifs')}>
    <Ic n="bell" />{unread > 0 && <span className="dot">{unread}</span>}
  </button>;

  const root = s.stack.length ? s.stack[0].v : s.view;
  const navItems = [['home', 'Home', 'home'], ...Object.keys(NAVL).filter(can).slice(0, 3).map(k => [k, NAVL[k][0], NAVL[k][1]]), ['menu', 'Menu', 'grid']];

  const View = V[s.view];
  const Sheet = sheet && SH[sheet.name];

  return (
    <AppCtx.Provider value={ctx}>
      <div className="app">
        <header className="top">
          {s.view === 'home'
            ? <><div className="brand"><Logo /></div>{bell}</>
            : <>{s.stack.length > 0 && <button className="icon-btn back" aria-label="Back" onClick={() => { back(); update(); }}><Ic n="back" /></button>}<h1 className="ttl">{title()}</h1>{bell}</>}
        </header>
        <main><FormCtx.Provider value={s.vf}><View key={`${s.view}|${s.param}`} /></FormCtx.Provider></main>
      </div>
      <nav className="nav" aria-label="Main">
        <div className="nav-in">
          {navItems.map(([k, l, i]) => <button key={k} className={root === k ? 'on' : ''} aria-current={root === k ? 'page' : undefined} onClick={on.go(k, null, true)}><Ic n={i} /><span>{t(l)}</span></button>)}
        </div>
      </nav>
      <div className={'scrim' + (scrim === 'open' ? ' open' : '')} hidden={scrim === 'hidden'} ref={scrimRef} onClick={e => { if (e.target === scrimRef.current) closeSheet(); }}>
        <div className="sheet" ref={sheetRef} role="dialog" aria-modal="true" tabIndex={-1}>
          {frozen != null
            ? <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: frozen }} />
            : Sheet && <FormCtx.Provider value={s.sf}><Sheet key={sheet.seq} p={sheet.p} /></FormCtx.Provider>}
        </div>
      </div>
      <div className={'toast' + (toastState.show ? ' show' : '')} role="status" aria-live="polite">{toastState.msg}</div>
    </AppCtx.Provider>
  );
}
