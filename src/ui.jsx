import { createContext, useContext } from 'react';
import { I, LOGO_D, LMLD, SUBB } from './paths.js';
import { PK } from './data.js';

/* App-wide API: state, translations, navigation and actions. */
export const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);
/* The form store for whatever is rendering: the view's (S.vf) or the open sheet's (S.sf). */
export const FormCtx = createContext({});
export const useForm = () => useContext(FormCtx);

export const Ic = ({ n, c }) => <svg className={'ic' + (c ? ' ' + c : '')} viewBox="0 0 24 24" aria-hidden="true"><path d={I[n] || I.grid} /></svg>;
export const Fnd = ({ k }) => <svg className={`fnd ${k || 'solid'}`} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.5L21.5 9.5V21.5H2.5V9.5Z" /></svg>;
export const Logo = () => <svg className="logo" viewBox="0 0 534 212" role="img" aria-label="LML"><path fillRule="evenodd" d={LOGO_D} /></svg>;
export const Lockup = ({ k }) => <svg className="lockup" viewBox={`308 182 ${SUBB[k][1]} 426`} role="img" aria-label={`LML ${SUBB[k][0]}`}><path d={LMLD + SUBB[k][2]} /></svg>;

export const Pill = ({ s }) => <span className={`pill ${PK[s] || 'open'}`}>{PK[s] === 'act' && <b aria-hidden="true">!</b>}{s}</span>;
export const Empty = ({ children }) => <p className="empty">{children}</p>;
export const Sec = ({ title, id, children }) => <section className="pad" id={id}>{title && <h2 className="eye">{title}</h2>}{children}</section>;
export const Ms = ({ a, b, k }) => <div className="ms"><Fnd k={k} /><div className="ms-t"><b>{a}</b>{b && <span>{b}</span>}</div></div>;

/* A list row. go/sheet/act make it a button; p is passed along. */
export function Row({ i, ti, s, r, go, sheet, act, p, chev = true }) {
  const { trigger } = useApp();
  const live = go || sheet || act;
  const Tag = live ? 'button' : 'div';
  return (
    <Tag className="row" onClick={live ? () => trigger({ go, sheet, act, p }) : undefined}>
      {i && <span className="row-i">{typeof i === 'string' ? <Ic n={i} /> : i}</span>}
      <span className="row-t"><b>{ti}</b>{s && <span>{s}</span>}</span>
      {r && <span className="row-r">{r}</span>}
      {live && chev !== false && <Ic n="chev" c="chev" />}
    </Tag>
  );
}

/* Chip group. m: multi-select. st: writes to app state instead of the form. cur: current value override. */
export function Chips({ g, opts, m, st, cur }) {
  const { chip } = useApp();
  const F = useForm();
  const current = cur !== undefined ? cur : F[g];
  return (
    <div className="chips" role="group">
      {opts.map(x => {
        const v = typeof x === 'string' ? x : x.v;
        const l = typeof x === 'string' ? x : (x.l || x.v);
        const off = typeof x === 'object' && x.off;
        const on = m ? (F[g] || []).includes(v) : current === v;
        return <button key={v} className={'chip' + (on ? ' on' : '')} aria-pressed={on} disabled={off} onClick={() => chip(F, g, v, { m, st })}>{l}</button>;
      })}
    </div>
  );
}

export function Fld({ k, label, area, type = 'text', ph = '' }) {
  const { update } = useApp();
  const F = useForm();
  const onChange = e => { F[k] = e.target.value; update(); };
  return (
    <label className="fld"><span>{label}</span>
      {area ? <textarea rows={3} placeholder={ph} value={F[k] || ''} onChange={onChange} />
            : <input type={type} placeholder={ph} value={F[k] || ''} onChange={onChange} />}
    </label>
  );
}

export function Toggle({ k, label }) {
  const { S, run } = useApp();
  return <button className={'tg' + (S[k] ? ' on' : '')} role="switch" aria-checked={!!S[k]} aria-label={label} onClick={() => run('toggle', k)}><span /></button>;
}

export function SheetHead({ title, sub }) {
  const { closeSheet } = useApp();
  return <>
    <div className="sh-h"><h2>{title}</h2><button className="icon-btn" aria-label="Close" onClick={closeSheet}><Ic n="x" /></button></div>
    {sub && <p className="sh-s">{sub}</p>}
  </>;
}

export function ElecChart() {
  const v = [14200, 15100, 16800, 17350, 18420, 12060], m = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
  const W = 320, bw = 32, gap = (W - 6 * bw) / 6;
  return (
    <svg className="chart" viewBox={`0 0 ${W} 142`} role="img" aria-label="Electricity use from June to November, in kWh. November is so far this month.">
      {v.map((x, i) => {
        const h = Math.round(x / 20000 * 96), X = gap / 2 + i * (bw + gap), Y = 116 - h;
        return <g key={i}>
          <rect x={X} y={Y} width={bw} height={h} className={i === 5 ? 'bar-o' : 'bar'} />
          <text x={X + bw / 2} y={Y - 6} textAnchor="middle" className="cv">{(x / 1000).toFixed(1)}k</text>
          <text x={X + bw / 2} y="134" textAnchor="middle">{m[i]}</text>
        </g>;
      })}
      <line x1="0" x2={W} y1="116.5" y2="116.5" className="axis" />
    </svg>
  );
}

export function Frames({ n }) {
  return (
    <svg viewBox="0 0 314 60" role="img" aria-label={`${n} of 24 frames erected`}>
      {Array.from({ length: 24 }, (_, i) => { const x = 2 + i * 13; return <path key={i} className={`frame ${i < n ? 'done' : 'todo'}`} d={`M${x} 54V26L${x + 4.5} 18L${x + 9} 26V54`} />; })}
      <line className="ground" x1="0" x2="314" y1="54.5" y2="54.5" />
    </svg>
  );
}

/* Decorative QR-style code, deterministic per seed. */
export function QR({ seed }) {
  let h = 2166136261 >>> 0;
  for (const c of seed) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; }
  const rnd = () => { h ^= h << 13; h >>>= 0; h ^= h >>> 17; h ^= h << 5; h >>>= 0; return h / 4294967296; };
  const N = 25; let r = '';
  const inF = (x, y) => (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { if (!inF(x, y) && rnd() < 0.5) r += `M${x} ${y}h1v1h-1z`; }
  const f = (x, y) => `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  return (
    <svg className="qr" viewBox="-2 -2 29 29" role="img" aria-label="Visitor pass QR code">
      <rect x="-2" y="-2" width="29" height="29" className="qr-bg" />
      <path d={r + f(0, 0) + f(N - 7, 0) + f(0, N - 7)} fillRule="evenodd" className="qr-fg" />
    </svg>
  );
}
