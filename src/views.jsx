import { useApp, useForm, Ic, Fnd, Lockup, Pill, Empty, Sec, Row, Chips, Toggle, Ms, ElecChart, Frames } from './ui.jsx';
import {
  inr, sum, pad2, DAYS, dl, MODS, ALL, ROLES, SPACES, BDC, CFC, MILES, UPDATES, DOCS, UNITS, VENDORS, FIN, GROW, EVENTS, MEMBERS,
  CATI, QTYPES, SVC, SVC_HOME, AMC, svcPrice, takenFor
} from './data.js';

const inAppr = (S, id) => S.approvals.some(a => a.ids.includes(id));
const qStats = S => S.quarters.rooms.reduce((a, r) => ({ beds: a.beds + r.beds, used: a.used + r.used }), { beds: 0, used: 0 });
const Note = ({ children }) => <p className="note">{children}</p>;
const Proto = () => <section className="pad"><Note>LML One prototype with sample data.</Note></section>;

function ApprCard({ a }) {
  const { on } = useApp();
  return (
    <div className="card" style={{ marginBottom: 8 }}>
      <p><b>{a.by}</b> from Accounts wants to pay {a.label}: <b className="num">{inr(a.amt)}</b>.</p>
      <div className="row-b mt"><button className="btn" onClick={on.act('approve', a.id)}>Approve and pay</button><button className="btn ghost" onClick={on.act('decline', a.id)}>Decline</button></div>
    </div>
  );
}

export const V = {};

V.home = function Home() {
  const { S, t, can, on } = useApp();
  const due = S.bills.filter(b => b.st === 'due').sort((a, b) => a.dn - b.dn);
  const total = sum(due);
  const hr = new Date().getHours();
  const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';

  const QA = [
    { k: 'bills', i: 'receipt', l: 'Pay bills', go: 'bills' }, { k: 'desk', i: 'wrench', l: 'Raise request', sheet: 'newTicket' },
    { k: 'gate', i: 'qr', l: 'Visitor pass', sheet: 'newPass' }, { k: 'chambers', i: 'cal', l: 'Book Chambers', go: 'chambers' },
    { k: 'permits', i: 'permit', l: 'Permits', go: 'permits' }, { k: 'subsidy', i: 'rupee', l: 'Subsidy', go: 'subsidy' },
    { k: 'build', i: 'hat', l: 'Build tracker', go: 'build' }, { k: 'quarters', i: 'bed', l: 'Staff quarters', go: 'quarters' }
  ].filter(q => can(q.k));

  const att = [];
  const fire = S.permits.find(x => x.st === 'Action needed');
  if (can('permits') && fire) att.push(<Row key="fire" i="permit" ti={fire.ti} s={fire.s} r={<Pill s="Action needed" />} go="permits" />);
  const sub = S.subsidy.find(x => x.st === 'Action needed');
  if (can('subsidy') && sub) att.push(<Row key="sub" i="rupee" ti={sub.ti} s="2 documents needed for your subsidy claim" r={<Pill s="Action needed" />} go="subsidy" />);
  if (can('desk')) att.push(<Row key="power" i="bolt" ti="Planned power shutdown" s="Sun 29 Nov, 10:00 to 13:00. Backup DG will run" go="desk" />);
  if (can('gate') && S.waiting.length) att.unshift(<Row key="wait" i="shield" ti={`${S.waiting.length} waiting at the gate`} s={S.waiting.map(w => w.name).join(' and ')} r={<Pill s="Action needed" />} go="gate" />);
  if (can('gate')) att.push(<Row key="crane" i="truck" ti="Crane entry approved" s="24 to 26 Nov at Gate 1" go="gate" />);

  const b = S.bookings[0];
  const qb = qStats(S);

  return <>
    <section className="pad">
      <button className="park" onClick={on.sheet('park')}><Ic n="pin" /><span>LML Industrial Park, Jhirka Valley</span><Ic n="down" /></button>
      <p className="greet">{t(greet)}, <b>Rajiv</b></p>
    </section>

    {can('bills') ? (
      <section className="pad"><div className="unit">
        <div className="unit-top"><span>Plot B-14</span><span>Arora Precision Components</span></div>
        {due.length ? <>
          <p className="unit-l">{t('Due this month')}</p><p className="unit-n num">{inr(total)}</p>
          <p className="unit-s">{due.length} {due.length > 1 ? 'bills' : 'bill'}. Next due {due[0].due}</p>
          <div className="unit-b"><button className="btn inv" onClick={on.act('payAll')}>{t('Pay all')}</button><button className="btn ghost-inv" onClick={on.go('bills')}>{t('View bills')}</button></div>
        </> : <>
          <p className="unit-l">All bills paid</p><p className="unit-n num">₹0</p>
          <p className="unit-s">{S.autopay ? 'Autopay is on for upcoming bills.' : 'Turn on autopay so bills pay on their due date.'}</p>
          <div className="unit-b"><button className="btn inv" onClick={on.go('bills')}>{t('View bills')}</button></div>
        </>}
      </div></section>
    ) : (
      <section className="pad"><div className="unit">
        <div className="unit-top"><span>Plot B-14</span><span>Gate today</span></div>
        <p className="unit-l">Visitors expected</p><p className="unit-n num">{S.passes.length}</p>
        <p className="unit-s">142 staff in. {S.trucks.length + 5} truck entries.</p>
        <div className="unit-b"><button className="btn inv" onClick={on.sheet('newPass')}>{t('Visitor pass')}</button><button className="btn ghost-inv" onClick={on.go('gate')}>Open gate</button></div>
      </div></section>
    )}

    {['Owner', 'CXO'].includes(S.role) && S.approvals.length > 0 && <Sec title={t('Waiting for your approval')}>{S.approvals.map(a => <ApprCard key={a.id} a={a} />)}</Sec>}

    <section className="pad"><div className="qa-grid">
      {QA.map(q => <button key={q.k} className="qa" onClick={q.go ? on.go(q.go) : on.sheet(q.sheet)}><Ic n={q.i} /><span>{t(q.l)}</span></button>)}
    </div></section>

    {att.length > 0 && <Sec title={t('Needs your attention')}>{att}</Sec>}

    {can('services') && <Sec title={t('Book a service')}>
      <div className="qa-grid">{SVC_HOME.map(k => <button key={k} className="qa" onClick={on.go('svcCat', k)}><Ic n={SVC[k].i} /><span>{SVC[k].n}</span></button>)}</div>
      <button className="btn ghost wide mt" onClick={on.go('services')}>See all factory services</button>
    </Sec>}

    {can('build') && <Sec title={t('Your factory build')}>
      <button className="card buildc" onClick={on.go('build')}><div className="prog">{MILES.map((m, i) => <Fnd key={i} k={m[2]} />)}</div><b>Day 74 of 180</b><span>Steel structure going up. 14 of 24 frames done.</span></button>
    </Sec>}

    {can('chambers') && <Sec title={t('Next at LML Chambers')}>
      {b ? <Row i="cal" ti={SPACES[b.sp].n} s={b.when} go="chambers" /> : <Row i="cal" ti="Book a room" s={`You have ${S.credits} free hours this month`} go="chambers" />}
    </Sec>}
    {can('quarters') && <Sec title={t('Your team at LML Staff Quarters')}>
      <Row i="bed" ti={`${qb.used} of ${qb.beds} beds in use`} s={`${qb.beds - qb.used} free across ${S.quarters.rooms.length} rooms`} go="quarters" />
    </Sec>}
    {can('club') && <section className="pad"><button className="club-t" onClick={on.go('club')}><p className="eye">The Club</p><p className="ct">Owners’ Retreat, Rishikesh</p><p>15 to 17 Jan 2027. RSVPs are open.</p></button></section>}
    <Proto />
  </>;
};

V.menu = function Menu() {
  const { S, can } = useApp();
  const groups = ['Money', 'Operations', 'Book', 'Grow', 'Community', 'Account'];
  return <>
    <section className="pad">
      <div className="card"><div className="prof-t"><b>Rajiv Arora</b><span>Arora Precision Components Pvt. Ltd.</span><span>Plot B-14, LML Industrial Park, Jhirka Valley</span></div></div>
      <p className="lbl">View the app as</p>
      <Chips g="role" opts={Object.keys(ROLES)} st cur={S.role} />
      <Note>Each team role sees only its own modules. Switch roles to preview what your team sees.</Note>
    </section>
    {groups.map(g => {
      const ks = ALL.filter(k => MODS[k][2] === g && can(k));
      return ks.length ? <Sec key={g} title={g}>{ks.map(k => <Row key={k} i={MODS[k][1]} ti={MODS[k][0]} s={MODS[k][3]} go={k} />)}</Sec> : null;
    })}
    <Proto />
  </>;
};

V.bills = function Bills() {
  const { S, on } = useApp();
  const due = S.bills.filter(b => b.st === 'due'), total = sum(due);
  return <>
    <section className="pad"><div className="card">
      <p className="eye">Total due</p><p className="big num">{inr(total)}</p>
      <p className="mt0">{due.length ? `${due.length} ${due.length > 1 ? 'bills' : 'bill'} for Plot B-14` : 'You’re all paid up.'}</p>
      {due.length > 0 && <button className="btn wide mt" onClick={on.act('payAll')}>Pay {inr(total)}</button>}
      <div className="toggle-row"><span><b>Autopay</b><span>Pay each bill on its due date from your linked account</span></span><Toggle k="autopay" label="Autopay" /></div>
    </div></section>
    <Sec title="Due">
      {due.length ? due.map(b => <Row key={b.id} i={b.icon} ti={b.name} s={`${b.period}. Due ${b.due}`}
        r={<><span className="amt num">{inr(b.amt)}</span>{inAppr(S, b.id) ? <Pill s="Awaiting owner" /> : <button className="btn sm" onClick={on.act('payOne', b.id)}>Pay</button>}</>} />)
        : <Empty>No bills due. New bills appear here on the 1st of each month.</Empty>}
    </Sec>
    <Sec title="Electricity use, kWh"><ElecChart /><Note>November so far: 12,060 kWh. Backup DG ran 3.2 hours this month.</Note></Sec>
    <Sec title="Paid">
      {S.paid.map((p, i) => <Row key={i} i="check" ti={p.name} s={`${p.period}. Paid ${p.date}`} r={<span className="amt num">{inr(p.amt)}</span>} act="invoice" p={`${p.name}, ${p.period}`} chev={false} />)}
      <Note>Tap a paid bill to email its GST invoice to your accounts team.</Note>
    </Sec>
  </>;
};

const TRow = ({ x }) => <Row i={CATI[x.cat] || 'wrench'} ti={x.ti} s={`${x.id}. ${x.st === 'Resolved' ? x.sla : 'SLA ' + x.sla}`} r={<Pill s={x.st} />} sheet="ticket" p={x.id} />;
V.desk = function Desk() {
  const { S, on } = useApp();
  const open = S.tickets.filter(x => x.st !== 'Resolved'), done = S.tickets.filter(x => x.st === 'Resolved');
  return <>
    <section className="pad">
      <div className="card notice"><Ic n="bolt" /><div><b>Planned power shutdown</b><p>Sun 29 Nov, 10:00 to 13:00 on Feeder 2. Backup DG will run.</p></div></div>
      <button className="btn wide mt" onClick={on.sheet('newTicket')}><Ic n="plus" />Raise a request</button>
    </section>
    <Sec title="Open">{open.length ? open.map(x => <TRow key={x.id} x={x} />) : <Empty>No open requests. Raise one and track it here until it’s fixed.</Empty>}</Sec>
    {done.length > 0 && <Sec title="Resolved">{done.map(x => <TRow key={x.id} x={x} />)}</Sec>}
  </>;
};

V.permits = function Permits() {
  const { S, on } = useApp();
  return <>
    <section className="pad"><button className="btn wide" onClick={on.sheet('newPermit')}><Ic n="plus" />Apply for a permission</button><Note>LML’s compliance desk files with the right authority and tracks each step for you.</Note></section>
    <Sec title="Your applications">{S.permits.map(p => <Row key={p.id} i="permit" ti={p.ti} s={p.s} r={<Pill s={p.st} />} sheet="permit" p={p.id} />)}</Sec>
  </>;
};

const glogIcon = k => ({ 'Visitor pass': 'qr', 'Delivery': 'box', 'Truck slot': 'truck', 'Denied': 'ban', 'Goods pass': 'box', 'Frequent pass': 'repeat', 'Attendance': 'users', 'Approved by you': 'check', 'Group pass': 'users', 'Checked out': 'log' }[k] || 'log');
const GTABS = ['Today', 'Passes', 'Attendance', 'Goods and vehicles', 'Log'];
const Stats3 = ({ items }) => <div className="stats3">{items.map(([n, l]) => <div key={l}><b className="num">{n}</b><span>{l}</span></div>)}</div>;

V.gate = function Gate() {
  const { S, on } = useApp();
  const F = useForm();
  const tab = F.gtab || 'Today';
  const head = <section className="pad">
    <Stats3 items={[[S.inside.length + 139, 'People inside'], [S.passes.length, 'Visitors expected'], [S.trucks.length + 5, 'Truck entries']]} />
    <div className="gtabs mt"><Chips g="gtab" opts={GTABS} cur={tab} /></div>
  </section>;

  if (tab === 'Today') return <>{head}
    <Sec title="At the gate now">
      {S.waiting.length ? <>
        {S.waiting.map(w => <div key={w.id} className="card gw">
          <div className="gw-top"><span className="gw-av" aria-hidden="true">{w.name[0]}</span><span className="row-t"><b>{w.name}</b><span>{w.org ? w.org + '. ' : ''}{w.why}</span><span>{w.type} at {w.gate}, {w.at}</span></span></div>
          <div className="row-b mt">
            <button className="btn sm" onClick={on.act('gApprove', w.id)}>Approve</button>
            {w.type === 'Delivery' && <button className="btn sm ghost" onClick={on.act('gLeave', w.id)}>Leave at gate</button>}
            <button className="btn sm ghost" onClick={on.act('gDeny', w.id)}>Deny</button>
          </div>
        </div>)}
        <Note>No answer in 60 seconds? The gate calls {S.icom}.</Note>
      </> : <Empty>No one is waiting at the gate.</Empty>}
    </Sec>
    <section className="pad">
      <div className="row-b"><button className="btn" onClick={on.sheet('newPass')}><Ic n="plus" />Visitor pass</button><button className="btn ghost" onClick={on.sheet('truck')}><Ic n="truck" />Truck slot</button></div>
      <div className="row-b mt"><button className="btn ghost" onClick={on.sheet('groupPass')}><Ic n="users" />Group pass</button><button className="btn ghost" onClick={on.sheet('goodsPass')}><Ic n="box" />Goods pass</button></div>
      <button className="sos" onClick={on.sheet('sos')}><Ic n="sos" /><span><b>SOS</b><span>Alert park security to Plot B-14</span></span></button>
    </section>
    <Sec title="Inside now">
      {S.inside.length ? S.inside.map(x => <Row key={x.id} i={x.truck ? 'truck' : 'users'} ti={x.name} s={x.s}
        r={x.over ? <><Pill s="Overdue" /><button className="btn sm" onClick={on.act('gOut', x.id)}>Check out</button></> : <Pill s="Inside" />} />)
        : <Empty>No visitors inside right now.</Empty>}
    </Sec>
    <Sec title="Parcels at the security desk">
      {S.parcels.length ? S.parcels.map(k => <Row key={k.id} i="box" ti={k.from} s={k.s} r={<button className="btn sm ghost" onClick={on.act('gParcel', k.id)}>Send to unit</button>} />)
        : <Empty>No parcels waiting.</Empty>}
    </Sec>
    <Sec title="Emergency contacts">
      {[['Gate control room', '24 hours, Gate 1', 'Calling the gate control room'], ['Park fire tender', 'On site, 24 hours', 'Calling the park fire station'], ['Ambulance, Apollo Clinic', 'In the park, 24 hours', 'Calling the Apollo Clinic ambulance desk'], ['Police', '112', 'Calling 112']]
        .map(c => <Row key={c[0]} i="phone" ti={c[0]} s={c[1]} act="toastMsg" p={c[2]} />)}
    </Sec>
    <Sec title="Gate settings">
      <div className="toggle-row" style={{ borderTop: 0 }}><span><b>Let frequent passes in automatically</b><span>No approval needed inside their allowed days and hours</span></span><Toggle k="gAuto" label="Let frequent passes in automatically" /></div>
      <div className="toggle-row"><span><b>Leave deliveries at the security desk</b><span>Couriers don’t need to wait for you</span></span><Toggle k="gLeave" label="Leave deliveries at the security desk" /></div>
      <div className="toggle-row"><span><b>Ask contractors for photo ID</b><span>Checked at the gate office before entry</span></span><Toggle k="gId" label="Ask contractors for photo ID" /></div>
      <Row i="phone" ti="Gate intercom number" s={`${S.icom}. Called if no one answers an approval in 60 seconds`} sheet="icom" />
    </Sec>
  </>;

  if (tab === 'Passes') return <>{head}
    <Sec title="Expected visitors">
      {S.passes.length ? S.passes.map(p => <Row key={p.id} i="qr" ti={p.name} s={`${p.purpose}. ${p.when}${p.veh ? '. ' + p.veh : ''}`} sheet="passQR" p={p.id} />)
        : <Empty>No visitors expected. Create a pass and share it on WhatsApp.</Empty>}
    </Sec>
    <Sec title="Truck slots">
      {S.trucks.length ? S.trucks.map((k, i) => <Row key={i} i="truck" ti={k.veh} s={`${k.when}. ${k.size}${k.load ? '. ' + k.load : ''}`} r={<Pill s="Confirmed" />} />)
        : <Empty>No truck slots booked.</Empty>}
    </Sec>
    <Sec title="Frequent passes">
      {S.frequent.map(f => <Row key={f.id} i="repeat" ti={f.name} s={`${f.s}. Gate code ${f.code}`} />)}
      <button className="btn ghost wide mt" onClick={on.sheet('freqPass')}><Ic n="plus" />Add a frequent pass</button>
    </Sec>
    <Sec title="Group passes">
      {S.groups.map(g => <Row key={g.id} i="users" ti={g.name} s={g.s} />)}
      <button className="btn ghost wide mt" onClick={on.sheet('groupPass')}><Ic n="plus" />Create a group pass</button>
    </Sec>
    <Sec title="Blocked">
      {S.blocked.map(b => <Row key={b.id} i="ban" ti={b.name} s={b.s} r={<Pill s="Blocked" />} />)}
      <button className="btn ghost wide mt" onClick={on.sheet('blockPerson')}><Ic n="ban" />Block a person or vehicle</button>
    </Sec>
  </>;

  if (tab === 'Attendance') return <>{head}
    <section className="pad"><Stats3 items={[[142, 'Staff in now'], [156, 'Expected today'], [9, 'Late today']]} /><Note>Staff check in at the gate with their ID card or 6-digit gate code.</Note></section>
    <Sec title="By shift">{[['Shift A, 06:00 to 14:00', '68 of 72 in. 4 absent'], ['General, 09:00 to 18:00', '54 of 58 in. 9 came in late'], ['Shift B, 14:00 to 22:00', 'Starts at 14:00. 26 expected']].map(x => <Row key={x[0]} i="clock" ti={x[0]} s={x[1]} />)}</Sec>
    <Sec title="Contract staff">{[['Mewat Skills Co-op', '24 of 26 in today'], ['ProStaff Services', '12 of 12 in today']].map(x => <Row key={x[0]} i="users" ti={x[0]} s={x[1]} />)}</Sec>
    <section className="pad"><div className="row-b">
      <button className="btn" onClick={on.sheet('addWorker')}><Ic n="plus" />Add a worker</button>
      <button className="btn ghost" onClick={on.act('toastMsg', 'November attendance sent to accounts on email')}><Ic n="mail" />Send attendance</button>
    </div></section>
  </>;

  if (tab === 'Goods and vehicles') return <>{head}
    <Sec title="Goods passes">
      {S.goods.map(g => <Row key={g.id} i="box" ti={g.ti} s={g.s} r={<Pill s={g.st} />} />)}
      <button className="btn ghost wide mt" onClick={on.sheet('goodsPass')}><Ic n="plus" />Create a goods pass</button>
    </Sec>
    <Sec title="Company vehicles">
      {S.vehicles.map(v => <Row key={v.id} i="truck" ti={v.no} s={v.s} />)}
      <button className="btn ghost wide mt" onClick={on.sheet('addVehicle')}><Ic n="plus" />Add a vehicle</button>
    </Sec>
  </>;

  return <>{head}
    <Sec title="Today at your gate">{S.glog.map((l, i) => <Row key={i} i={glogIcon(l[2])} ti={l[1]} s={`${l[0]}. ${l[2]}`} r={l[2] === 'Denied' ? <Pill s="Denied" /> : null} />)}</Sec>
    <Sec title="Park patrol"><Row i="shield" ti="12 night rounds, every checkpoint covered" s="Last round at 05:40. Nothing reported" /></Sec>
    <section className="pad"><button className="btn ghost wide" onClick={on.act('toastMsg', 'Today’s gate log sent to your email')}><Ic n="mail" />Email today’s gate log</button></section>
  </>;
};

V.build = function Build() {
  const { on } = useApp();
  const day = 74, pct = Math.round(day / 180 * 100);
  return <>
    <section className="pad"><div className="hero-b">
      <p className="eye">The Finished Factory by LML</p>
      <p className="big num">Day {day} <span>of 180</span></p>
      <div className="bar-t inv"><i style={{ width: `${pct}%` }} /></div>
      <p className="mt">Plot B-14, 24,000 sq ft. Handover on 8 Mar 2027. On schedule.</p>
    </div></section>
    <Sec title="Milestones">{MILES.map(m => <Ms key={m[0]} a={m[0]} b={m[1]} k={m[2]} />)}</Sec>
    <Sec title="Site updates">
      {UPDATES.map(u => <div key={u.w} className="upd"><Frames n={u.f} /><p><b>{u.w}, {u.d}</b></p><p>{u.t}</p></div>)}
      <button className="btn ghost wide mt" onClick={on.sheet('siteVisit')}>Book a site visit</button>
    </Sec>
  </>;
};

V.docs = function Docs() {
  return <>{DOCS.map((g, gi) => <Sec key={g.g} title={g.g}>{g.items.map((d, ii) => <Row key={d[0]} i="doc" ti={d[0]} s={d[1]} sheet="doc" p={`${gi}-${ii}`} />)}</Sec>)}</>;
};

V.chambers = function Chambers() {
  const { S, on } = useApp();
  return <>
    <section className="pad"><div className="hero-b">
      <h2><Lockup k="chambers" /></h2>
      <p className="mt">30,000 sq ft in the park: the Business Development Centre, a column-free exhibition floor and convention halls under one roof.</p>
      <div className="mt"><div className="kv-inv"><span>Free hours this month</span><b>{S.credits} of 8 left</b></div><div className="bar-t inv"><i style={{ width: `${S.credits / 8 * 100}%` }} /></div></div>
    </div></section>
    <Sec title="Book a space">
      {Object.entries(SPACES).map(([k, s]) => <Row key={k} i={s.unit === 'hr' ? 'cal' : 'store'} ti={s.n} s={`${s.cap}. ${inr(s.rate)} per ${s.unit === 'hr' ? 'hour' : 'day'}${s.credit ? '. Free hours apply' : ''}`} go="chamberBook" p={k} />)}
    </Sec>
    <Sec title="Your bookings">
      {S.bookings.length ? S.bookings.map(b => <Row key={b.id} i="check" ti={SPACES[b.sp].n} s={`${b.when}${b.add.length ? '. ' + b.add.join(', ') : ''}`}
        r={<><Pill s={b.req ? 'Requested' : 'Confirmed'} /><button className="btn sm ghost" onClick={on.act('cancelBooking', b.id)} aria-label={`Cancel ${SPACES[b.sp].n} booking`}>Cancel</button></>} />)
        : <Empty>No bookings yet. Your free hours reset on the 1st of each month.</Empty>}
    </Sec>
    <Sec title="Business Development Centre">{BDC.map((b, i) => <Row key={i} i={b[2]} ti={b[0]} s={b[1]} sheet="bdc" p={i} />)}</Sec>
  </>;
};

V.chamberBook = function ChamberBook() {
  const { S, on } = useApp();
  const k = S.param, sp = SPACES[k], f = S.vf;
  if (f.day === undefined) f.day = dl(DAYS[1]);
  if (f.add === undefined) f.add = [];
  let body = null, pay = 0, free = 0, ok = true, when = '';
  if (sp.unit === 'hr') {
    const taken = takenFor(f.day);
    if (f.dur === undefined) f.dur = '2';
    if (f.start === undefined) { for (let h = 9; h <= 16; h++) { if (!taken.includes(h) && !taken.includes(h + 1)) { f.start = pad2(h) + ':00'; break; } } }
    const st = +f.start.slice(0, 2), dur = +f.dur, end = st + dur;
    ok = end <= 18 && !Array.from({ length: dur }, (_, i) => st + i).some(h => taken.includes(h));
    free = sp.credit ? Math.min(dur, S.credits) : 0;
    pay = (dur - free) * sp.rate;
    when = `${f.day}, ${f.start} to ${pad2(end)}:00`;
    body = <>
      <p className="lbl">Start time</p><Chips g="start" opts={Array.from({ length: 9 }, (_, i) => ({ v: pad2(9 + i) + ':00', off: taken.includes(9 + i) }))} />
      <p className="lbl">Duration</p><Chips g="dur" opts={[{ v: '1', l: '1 hour' }, { v: '2', l: '2 hours' }, { v: '3', l: '3 hours' }, { v: '4', l: '4 hours' }]} />
      {!ok && <p className="callout">That time overlaps another booking or runs past 18:00. Pick a shorter duration or another start time.</p>}
    </>;
  } else {
    if (f.days === undefined) f.days = '1';
    pay = +f.days * sp.rate;
    when = `${f.day}, ${f.days === '1' ? '1 day' : f.days + ' days'}`;
    body = <>
      <p className="lbl">Number of days</p><Chips g="days" opts={[{ v: '1', l: '1 day' }, { v: '2', l: '2 days' }, { v: '3', l: '3 days' }]} />
      <Note>The events team calls you to plan the layout, power and logistics.</Note>
    </>;
  }
  S.calc = { ok, free, pay, when };
  return (
    <section className="pad">
      <div className="card"><p className="eye">LML Chambers</p><h2 className="h2">{sp.n}</h2><p>{sp.cap}. {inr(sp.rate)} per {sp.unit === 'hr' ? 'hour' : 'day'}{sp.credit ? '. Your free hours apply' : ''}.</p></div>
      <p className="lbl">Date</p><Chips g="day" opts={DAYS.map(dl)} />
      {body}
      <p className="lbl">Add to your booking</p><Chips g="add" opts={['Catering from park F&B', 'AV and recording', 'Reception and signage', 'Buyer delegation hosting']} m />
      <div className="card mt">
        <div className="kv"><span>When</span><b>{when}</b></div>
        {sp.credit && <div className="kv"><span>Free hours used</span><b>{free} of {S.credits} left</b></div>}
        <div className="kv"><span>{sp.unit === 'hr' ? 'To pay now' : 'Estimated cost'}</span><b className="num">{inr(pay)}</b></div>
        <button className="btn wide mt" onClick={on.act('bookChamber')} disabled={!ok}>{sp.unit === 'hr' ? 'Confirm booking' : 'Request booking'}</button>
      </div>
    </section>
  );
};

V.cfc = function Cfc() {
  const { S } = useApp();
  return <>
    <section className="pad"><p className="lead">Shared facilities for testing, design and production. Book by the hour and pay with your monthly bill.</p></section>
    <Sec title="Facilities">{Object.entries(CFC).map(([k, c]) => <Row key={k} i="lab" ti={c.n} s={`${c.s}. ${inr(c.rate)} per hour`} sheet="cfcBook" p={k} />)}</Sec>
    <Sec title="Your bookings">{S.cfcB.length ? S.cfcB.map((b, i) => <Row key={i} i="check" ti={b.ti} s={b.s} r={<Pill s="Confirmed" />} />) : <Empty>No bookings yet. Pick a facility above to book it.</Empty>}</Sec>
  </>;
};

V.quarters = function Quarters() {
  const { S, on } = useApp();
  const q = qStats(S), req = S.eco.filter(e => e.i === 'bed');
  return <>
    <section className="pad">
      <div className="hero-b">
        <h2><Lockup k="quarters" /></h2>
        <p className="mt">Furnished rooms and beds inside the park, a short walk from your shop floor. Meals, laundry and security included.</p>
        <div className="mt"><div className="kv-inv"><span>Your beds in use</span><b>{q.used} of {q.beds}</b></div><div className="bar-t inv"><i style={{ width: `${q.used / q.beds * 100}%` }} /></div></div>
      </div>
      <div className="row-b mt"><button className="btn" onClick={on.sheet('checkIn')}><Ic n="plus" />Check in</button><button className="btn ghost" onClick={on.sheet('hostel')}>Add beds</button></div>
    </section>
    <Sec title="Your rooms">{S.quarters.rooms.map(r => <Row key={r.id} i="bed" ti={r.n} s={`${r.type}. ${r.used} of ${r.beds} in use`} r={<Pill s={r.used >= r.beds ? 'Full' : `${r.beds - r.used} free`} />} />)}</Sec>
    {req.length > 0 && <Sec title="Your requests">{req.map((e, i) => <Row key={i} i="bed" ti={e.ti} s={e.s} r={<Pill s={e.st} />} />)}</Sec>}
    <Sec title="Recent">{S.quarters.log.slice(0, 4).map((l, i) => <Row key={i} i="users" ti={l.ti} s={l.s} />)}</Sec>
    <Sec title="Rooms and rates">{QTYPES.map(x => <Row key={x[0]} i="bed" ti={x[0]} s={`${x[1]}. ${x[2]}`} />)}</Sec>
    <Sec title="Included"><div className="card">
      <div className="kv"><span>Meals</span><b>Mess, three times a day</b></div>
      <div className="kv"><span>Housekeeping</span><b>Daily, with laundry</b></div>
      <div className="kv"><span>Security</span><b>24 hours, ID check at entry</b></div>
      <div className="kv" style={{ border: 0 }}><span>Billing</span><b>On your monthly statement</b></div>
    </div></Sec>
  </>;
};

V.services = function Services() {
  const { S, on } = useApp();
  return <>
    <section className="pad">
      <div className="hero-b">
        <h2 className="hh">Verified pros at <b>your factory gate</b></h2>
        <p className="mt">Background-checked technicians and firms for every job in your unit. Fixed prices, a GST invoice and a 30-day warranty on the work.</p>
        <button className="btn inv wide" onClick={on.sheet('svcUrgent')}><Ic n="bolt" />Machine down? Get help in 60 minutes</button>
      </div>
      <div className="promise"><div><b>Verified</b>ID and skill checks on every pro</div><div><b>Fixed price</b>Know the cost before you book</div><div><b>Gate-ready</b>Their gate pass is made for you</div></div>
    </section>
    <Sec title="All services"><div className="qa-grid">{Object.keys(SVC).map(k => <button key={k} className="qa" onClick={on.go('svcCat', k)}><Ic n={SVC[k].i} /><span>{SVC[k].n}</span></button>)}</div></Sec>
    <Sec title="Your bookings">
      {S.svcB.length ? S.svcB.map(b => <Row key={b.id} i="cog" ti={b.svc} s={`${b.pro}. ${b.when}`}
        r={b.st === 'Completed' ? (b.rated ? <Pill s="Rated" /> : <button className="btn sm ghost" onClick={on.sheet('svcRate', b.id)}>Rate</button>) : <Pill s={b.st} />} />)
        : <Empty>No bookings yet. Pick a service to get started.</Empty>}
    </Sec>
    <Sec title="Annual maintenance plans">
      {AMC.map((a, i) => <Row key={i} i="repeat" ti={a[0]} s={`${a[1]}. ${a[2]}`} sheet="amc" p={i} />)}
      <Note>One fixed yearly price, priority visits and every compliance certificate in your document vault.</Note>
    </Sec>
  </>;
};

V.svcCat = function SvcCat() {
  const { S, on } = useApp();
  const c = SVC[S.param];
  return (
    <Sec>
      {c.list.map((x, i) => <div key={i} className="row">
        <span className="row-t"><b>{x[0]}</b><span>{x[1]}</span><span>{svcPrice(x)}</span></span>
        <button className="btn sm" onClick={on.sheet(x[2] ? 'svcBook' : 'svcQuote', `${S.param}|${i}`)}>{x[2] ? 'Book' : 'Get quote'}</button>
      </div>)}
      <Note>Pay after the job is done, or add it to your monthly park bill.</Note>
    </Sec>
  );
};

V.eco = function Eco() {
  const { S, on } = useApp();
  return <>
    <section className="pad"><p className="lead">Everything your team and visitors need, inside the park.</p></section>
    <Sec>
      {[['hotel', 'Hampton by Hilton', 'Rooms for visiting clients and auditors at park rates', 'hotel'],
        ['health', 'Apollo Clinic', 'Appointments and health check-ups for your staff', 'clinic'],
        ['food', 'Food for your team', 'McDonald’s, KFC and Haldiram’s, delivered to your gate', 'food']].map(e => <Row key={e[3]} i={e[0]} ti={e[1]} s={e[2]} sheet={e[3]} />)}
      <Row i="bed" ti="LML Staff Quarters" s="Rooms and beds for your team" go="quarters" />
      <Row i="store" ti="High street, factory outlets and cinema" s="Opening with Phase 2" />
      <button className="btn ghost wide mt" onClick={on.act('emergency')}><Ic n="health" />Medical emergency</button>
    </Sec>
    <Sec title="Your requests">{S.eco.length ? S.eco.map((e, i) => <Row key={i} i={e.i} ti={e.ti} s={e.s} r={<Pill s={e.st} />} />) : <Empty>Nothing booked yet.</Empty>}</Sec>
  </>;
};

V.market = function Market() {
  const { on } = useApp();
  return <>
    <section className="pad">
      <h2 className="eye">Verified vendors</h2>
      <div className="qa-grid">{Object.keys(VENDORS).map(c => <button key={c} className="qa" onClick={on.sheet('vendors', c)}><Ic n={VENDORS[c].i} /><span>{c}</span></button>)}</div>
      <Note>Every vendor is checked by LML and rated by park owners.</Note>
    </section>
    <Sec title="Business finance">
      {FIN.map((x, i) => <Row key={i} i="rupee" ti={x[0]} s={x[1]} sheet="fin" p={i} />)}
      <Note>Offers from partner banks and NBFCs. Your park payment history strengthens your application.</Note>
    </Sec>
  </>;
};

function SentButton({ k, p, label, done }) {
  const { S, on } = useApp();
  const sent = S.sent[`${k}:${p}`];
  return <button className={k === 'quote' ? 'btn sm' : 'btn sm ghost'} disabled={!!sent} onClick={on.act(k, p)}>{sent ? done : label}</button>;
}
export const ConnectBtn = ({ p }) => <SentButton k="connect" p={p} label="Connect" done="Sent" />;
export const QuoteBtn = ({ p }) => <SentButton k="quote" p={p} label="Request quote" done="Requested" />;

V.directory = function Directory() {
  const { S, update } = useApp();
  const q = (S.vf.q || '').trim().toLowerCase();
  const list = UNITS.filter(u => (u[0] + ' ' + u[1]).toLowerCase().includes(q));
  return <>
    <section className="pad"><label className="search"><Ic n="search" />
      <input type="search" placeholder="Search by product or company" value={S.vf.q || ''} aria-label="Search the park directory" onChange={e => { S.vf.q = e.target.value; update(); }} />
    </label></section>
    <section className="pad" id="dirlist">
      {list.length ? <>
        <h2 className="eye">{list.length} {list.length > 1 ? 'units' : 'unit'}</h2>
        {list.map(u => <Row key={u[2]} i="store" ti={u[0] + (u[3] ? ' (you)' : '')} s={`${u[1]}. Plot ${u[2]}`} r={u[3] ? null : <ConnectBtn p={u[0]} />} />)}
      </> : <Empty>No units match. Try a product, like “cartons” or “cables”.</Empty>}
    </section>
  </>;
};

V.grow = function Grow() {
  return <Sec>{GROW.map(g => <Row key={g[0]} i={g[1]} ti={g[2]} s={g[3]} sheet="growForm" p={g[0]} />)}</Sec>;
};

V.club = function Club() {
  const { S, on } = useApp();
  return <>
    <section className="pad">
      <div className="mcard">
        <svg className="dim" viewBox="0 0 100 100" aria-hidden="true">
          {[0, 1, 2, 3, 4].map(i => { const s = 1 - i * 0.17; return <path key={i} d={`M50 ${58 - 40 * s}L${50 + 40 * s} ${58 - 12 * s}V${58 + 36 * s}H${50 - 40 * s}V${58 - 12 * s}Z`} />; })}
        </svg>
        <div><p className="eye">The Club</p><p className="mc-n">Rajiv Arora</p></div>
        <div className="mc-b"><span>Founding member</span><span>No. 0014</span></div>
      </div>
      <Note>Membership comes with ownership in an LML park. There’s no fee.</Note>
    </section>
    <Sec title="Upcoming">
      {EVENTS.map(e => <Row key={e.id} i={e.i} ti={e.t} s={e.s} r={<button className={'btn sm' + (S.rsvp[e.id] ? '' : ' ghost')} aria-pressed={!!S.rsvp[e.id]} onClick={on.act('rsvp', e.id)}>{S.rsvp[e.id] ? e.on : e.cta}</button>} />)}
    </Sec>
    <Sec title="Partner clubs">
      <Row i="crown" ti="Quorum Club, Gurugram" s="Member access for you and one guest" />
      <Row i="plus" ti="More partner clubs" s="Being added across Delhi NCR" />
    </Sec>
    <Sec title="Members">{MEMBERS.map(m => <Row key={m[0]} i="users" ti={m[0]} s={m[1]} r={<ConnectBtn p={m[0]} />} />)}</Sec>
  </>;
};

V.team = function Team() {
  const { S, on } = useApp();
  return <>
    <section className="pad"><div className="card">
      <b>Payment approvals</b><p className="mt0">Payments above this amount need the owner’s approval.</p>
      <div className="mt"><Chips g="limit" opts={[{ v: '50000', l: '₹50,000' }, { v: '100000', l: '₹1,00,000' }, { v: '200000', l: '₹2,00,000' }, { v: '0', l: 'No approval' }]} st cur={S.limit === Infinity ? '0' : String(S.limit)} /></div>
    </div></section>
    {S.approvals.length > 0 && <Sec title="Waiting for you">{S.approvals.map(a => <ApprCard key={a.id} a={a} />)}</Sec>}
    <Sec title="Members">
      {S.team.map(m => <Row key={m.id} i="users" ti={m.n} s={m.r} sheet="member" p={m.id} />)}
      <button className="btn wide mt" onClick={on.sheet('addMember')}><Ic n="plus" />Add a team member</button>
    </Sec>
  </>;
};

V.settings = function Settings() {
  const { S, on } = useApp();
  return <>
    <section className="pad">
      <div className="toggle-row" style={{ borderTop: 0 }}><span><b>WhatsApp alerts</b><span>Get alerts and act on them without opening the app</span></span><Toggle k="wa" label="WhatsApp alerts" /></div>
      {S.wa && [['waBills', 'Bills and payments'], ['waGate', 'Visitor approvals at the gate'], ['waOutage', 'Power and water notices'], ['waClub', 'Club invitations']].map(([k, l]) =>
        <div key={k} className="toggle-row"><span><b>{l}</b></span><Toggle k={k} label={l} /></div>)}
      <button className="btn ghost wide mt" onClick={on.sheet('waPreview')}><Ic n="msg" />See a sample WhatsApp alert</button>
    </section>
    <Sec title="Language">
      <Chips g="lang" opts={[{ v: 'en', l: 'English' }, { v: 'hi', l: 'हिंदी' }]} st cur={S.lang} />
      <Note>In this prototype, Hindi covers the home screen and navigation.</Note>
    </Sec>
  </>;
};

V.subsidy = function Subsidy() {
  const { S, on } = useApp();
  const steps = [['Eligibility confirmed', '2 Sep', 'solid'], ['Documents compiled', '28 Sep', 'solid'], ['Application filed', '12 Oct', 'solid'], ['Department verification', 'In progress', 'half'], ['Sanction', 'Expected Jan 2027', 'line'], ['Disbursal', 'After sanction', 'line']];
  return <>
    <section className="pad"><div className="hero-b">
      <p className="eye">Notified Prime/Focus Area</p>
      <h2 className="hh">Up to <b>₹10 crore</b></h2>
      <p className="mt">In state incentives under Haryana’s Progressive MSME and Export Promotion Policy 2026.*</p>
      <div className="kv-inv mt"><span>Estimated for your unit</span><b>₹3.4 crore</b></div>
    </div></section>
    <Sec title="Your claim">{steps.map(s => <Ms key={s[0]} a={s[0]} b={s[1]} k={s[2]} />)}</Sec>
    <Sec title="Incentives">{S.subsidy.map(c => <Row key={c.id} i="rupee" ti={c.ti} s={c.s} r={<Pill s={c.st} />} act={c.st === 'Action needed' ? 'uploadSubsidy' : null} p={c.id} />)}</Sec>
    <section className="pad">
      <div className="card">
        <b>Neha Kapoor, LML Subsidy Desk</b>
        <p className="mt0">Your subsidy manager files every claim and follows up with the department.</p>
        <div className="row-b mt">
          <button className="btn" onClick={on.act('toastMsg', 'Calling Neha Kapoor')}><Ic n="phone" />Call</button>
          <button className="btn ghost" onClick={on.act('toastMsg', 'WhatsApp chat with Neha opened')}><Ic n="msg" />WhatsApp</button>
        </div>
      </div>
      <Note>*Conditions apply. Amounts in this prototype are sample data.</Note>
    </section>
  </>;
};

V.dash = function Dash() {
  const { S, can, on } = useApp();
  const items = [['Electricity', 151200], ['Maintenance (CAM)', 48600], ['Chambers and services', 18500], ['STP and ETP treatment', 14300], ['Water', 9880]];
  const tot = items.reduce((a, b) => a + b[1], 0), mx = items[0][1];
  const fire = S.permits.find(p => p.id === 'p3');
  const comp = [['PF and ESI deposit', 'Due 15 Dec', 'Upcoming'], ['GSTR-3B for November', 'Due 20 Dec', 'Upcoming'], ['Fire NOC', fire.st === 'Action needed' ? 'Fire layout drawing needed' : 'With the fire department', fire.st, 'permits'], ['Consent to operate', 'Apply before production starts', 'Not started'], ['Factory licence', 'Apply before handover in Mar 2027', 'Not started']];
  const esg = [['68%', 'Water treated and reused on site'], ['100%', 'Effluent treated at the park ETP'], ['99.6%', 'Power uptime with backup'], ['1.2 ML', 'Rainwater harvested this monsoon']];
  return <>
    <section className="pad"><div className="card">
      <p className="eye">November spend</p><p className="big num">{inr(tot)}</p>
      <p className="mt0">Mostly electricity. Your second shift added 1,070 kWh over September.</p>
      {items.map(([l, v]) => <div key={l} className="hb"><div className="hb-l"><span>{l}</span><b className="num">{inr(v)}</b></div><div className="hb-t"><i style={{ width: `${v / mx * 100}%` }} /></div></div>)}
    </div></section>
    <Sec title="Electricity use, kWh"><ElecChart /><Note>Average cost ₹8.21 per kWh, including fixed charges.</Note></Sec>
    <Sec title="Compliance calendar">{comp.map(c => <Row key={c[0]} i="clock" ti={c[0]} s={c[1]} r={<Pill s={c[2]} />} go={c[3] && can(c[3]) ? c[3] : null} />)}</Sec>
    <Sec title="ESG"><div className="stats">{esg.map(e => <div key={e[1]} className="stat"><b className="num">{e[0]}</b><span>{e[1]}</span></div>)}</div></Sec>
    <section className="pad">
      <div className="stat"><b className="num">138</b><span>People through your gate on an average day this month</span></div>
      <button className="btn wide mt" onClick={on.act('toastMsg', 'Report emailed to rajiv@aroraprecision.in')}><Ic n="mail" />Email this report as PDF</button>
    </section>
  </>;
};
