import { useApp, Ic, Fnd, Lockup, Pill, Row, Chips, Fld, Ms, SheetHead, QR } from './ui.jsx';
import { QuoteBtn } from './views.jsx';
import { inr, sum, DAYS, dl, MODS, ROLES, BDC, CFC, DOCS, VENDORS, FIN, GROW, CATI, PERMIT_TYPES, SVC, AMC, svcPrice } from './data.js';

/* Bottom sheets. Each reads and writes its own form store, S.sf, which resets when a sheet opens. */
export const SH = {};

SH.pay = function Pay({ p }) {
  const { S, on } = useApp();
  const f = S.sf, ids = p.split(','), list = S.bills.filter(b => ids.includes(b.id)), amt = sum(list);
  f.ids = ids; f.amt = amt; if (f.method === undefined) f.method = 'UPI';
  f.needs = S.role === 'Accounts' && amt > S.limit;
  return <>
    <SheetHead title={`Pay ${inr(amt)}`} sub="Plot B-14, Arora Precision Components" />
    {list.map(b => <div key={b.id} className="kv"><span>{b.name}, {b.period}</span><b className="num">{inr(b.amt)}</b></div>)}
    <p className="lbl">Pay with</p><Chips g="method" opts={['UPI', 'Net banking', 'NEFT or RTGS']} />
    {f.needs && <p className="callout">Payments above {inr(S.limit)} need the owner’s approval. Rajiv gets the request in the app and on WhatsApp.</p>}
    <button className="btn wide" onClick={on.act('confirmPay')}>{f.needs ? 'Send for approval' : `Pay ${inr(amt)}`}</button>
  </>;
};

SH.notifs = function Notifs() {
  const { S, on } = useApp();
  return <>
    <SheetHead title="Notifications" />
    {S.notifs.map((n, i) => <button key={i} className="row" onClick={on.act('openNotif', i)}>
      <span className="row-i">{n.read ? <Ic n="bell" /> : <Fnd k="solid" />}</span>
      <span className="row-t"><b>{n.t}</b><span>{n.at}{n.read ? '' : '. New'}</span></span>
    </button>)}
    <button className="btn ghost wide" onClick={on.act('readAll')}>Mark all as read</button>
  </>;
};

SH.park = function Park() {
  return <>
    <SheetHead title="Your parks" sub="One login works across every LML park you own in." />
    <Row i={<Fnd k="solid" />} ti="LML Industrial Park, Jhirka Valley" s="Plot B-14. You’re here" r={<Ic n="check" />} />
    <Row i={<Fnd k="line" />} ti="LML World City, Gurugram" s="Coming soon" />
    <Row i={<Fnd k="line" />} ti="LML Industrial Township, Karnal" s="Coming soon" />
  </>;
};

SH.newTicket = function NewTicket() {
  const { S, on } = useApp();
  const f = S.sf; if (f.cat === undefined) f.cat = 'Power'; if (f.pri === undefined) f.pri = 'Normal'; if (f.loc === undefined) f.loc = 'Plot B-14';
  return <>
    <SheetHead title="Raise a request" />
    <p className="lbl">What’s the issue?</p><Chips g="cat" opts={Object.keys(CATI)} />
    <Fld k="desc" label="Describe it" area ph="For example: no power to the east wall sockets since 9 am" />
    <Fld k="loc" label="Where" />
    <p className="lbl">Priority</p><Chips g="pri" opts={['Normal', 'Urgent']} />
    <button className="btn ghost wide" onClick={on.act('photo')}><Ic n="camera" />{f.photo ? '1 photo attached. Tap to remove' : 'Add a photo'}</button>
    <button className="btn wide" onClick={on.act('raise')}>Raise request</button>
  </>;
};

SH.ticket = function Ticket({ p }) {
  const { S, on } = useApp();
  const x = S.tickets.find(z => z.id === p);
  if (!x) return <SheetHead title="Request not found" />;
  const upto = ['Assigned', 'In progress', 'Resolved'].indexOf(x.st) + 1;
  const steps = [['Raised', x.at], ['Assigned to ' + x.who, ''], ['In progress', ''], ['Resolved', x.st === 'Resolved' ? x.sla : '']];
  return <>
    <SheetHead title={x.id} sub={x.cat} />
    <p className="h3">{x.ti}</p>
    {steps.map((s, i) => <Ms key={i} a={s[0]} b={s[1]} k={i <= upto ? 'solid' : 'line'} />)}
    {x.st === 'Resolved' ? <>
      <p className="lbl">How was the fix?</p><Chips g="rate" opts={['Good', 'Okay', 'Poor']} />
      <button className="btn wide" onClick={on.act('rate')}>Send rating</button>
    </> : <>
      <p className="note">SLA: {x.sla}</p>
      <button className="btn wide" onClick={on.act('escalate')}>Escalate to park manager</button>
    </>}
  </>;
};

SH.permit = function Permit({ p: id }) {
  const { S, on } = useApp();
  const p = S.permits.find(z => z.id === id);
  return <>
    <SheetHead title={p.ti} />
    <div className="mt"><Pill s={p.st} /></div>
    <p className="mt">{p.note}</p>
    {p.st === 'Action needed' ? <button className="btn wide" onClick={on.act('uploadPermit', p.id)}><Ic n="doc" />{p.need}</button>
      : p.st === 'Approved' ? <button className="btn ghost wide" onClick={on.act('toastMsg', `${p.ti} letter shared on WhatsApp`)}><Ic n="msg" />Share approval letter</button> : null}
  </>;
};

SH.newPermit = function NewPermit() {
  const { S, on } = useApp();
  const f = S.sf; if (f.type === undefined) f.type = 'Fit-out';
  return <>
    <SheetHead title="Apply for a permission" />
    <p className="lbl">Type</p><Chips g="type" opts={PERMIT_TYPES} />
    <div className="two"><Fld k="from" label="From" type="date" /><Fld k="to" label="To" type="date" /></div>
    <Fld k="det" label="Details" area ph="Scope of work, contractor, vehicles or timings" />
    <button className="btn wide" onClick={on.act('applyPermit')}>Submit application</button>
  </>;
};

SH.newPass = function NewPass() {
  const { S, on } = useApp();
  const f = S.sf; if (f.purpose === undefined) f.purpose = 'Meeting'; if (f.when === undefined) f.when = 'Today';
  return <>
    <SheetHead title="Create a visitor pass" sub="The visitor gets a QR code on WhatsApp. Gate security sees it instantly." />
    <Fld k="name" label="Visitor name" ph="Full name" />
    <Fld k="phone" label="Mobile number" type="tel" ph="+91" />
    <p className="lbl">Purpose</p><Chips g="purpose" opts={['Meeting', 'Delivery', 'Contractor', 'Audit', 'Interview']} />
    <p className="lbl">When</p><Chips g="when" opts={['Today', 'Tomorrow', dl(DAYS[2])]} />
    <Fld k="veh" label="Vehicle number (optional)" ph="HR 26 AB 1234" />
    <button className="btn wide" onClick={on.act('createPass')}>Create pass</button>
  </>;
};

const KV = ({ k, children }) => <div className="kv"><span>{k}</span><b>{children}</b></div>;

SH.passQR = function PassQR({ p: id }) {
  const { S, on } = useApp();
  const p = S.passes.find(z => z.id === id);
  return <>
    <SheetHead title="Visitor pass" />
    <div className="qr-wrap"><QR seed={p.id + p.name} /></div>
    <KV k="Visitor">{p.name}</KV><KV k="Purpose">{p.purpose}</KV><KV k="When">{p.when}</KV>
    {p.veh && <KV k="Vehicle">{p.veh}</KV>}
    <KV k="Host">Arora Precision, Plot B-14</KV>
    <button className="btn wide" onClick={on.act('toastMsg', `Pass sent to ${p.name} on WhatsApp`)}><Ic n="msg" />Share on WhatsApp</button>
  </>;
};

SH.truck = function Truck() {
  const { S, on } = useApp();
  const f = S.sf; if (f.day === undefined) f.day = dl(DAYS[0]); if (f.slot === undefined) f.slot = '08:00 to 10:00'; if (f.size === undefined) f.size = '10 to 25 tonne';
  const slots = [{ v: '06:00 to 08:00' }, { v: '08:00 to 10:00' }, { v: '10:00 to 12:00', l: '10:00 to 12:00, full', off: true }, { v: '14:00 to 16:00' }, { v: '16:00 to 18:00' }];
  return <>
    <SheetHead title="Book a truck slot" sub="Slots keep Gate 1 clear and your loading bay ready." />
    <p className="lbl">Date</p><Chips g="day" opts={DAYS.slice(0, 4).map(dl)} />
    <p className="lbl">Slot</p><Chips g="slot" opts={slots} />
    <p className="lbl">Truck size</p><Chips g="size" opts={['Up to 10 tonne', '10 to 25 tonne', '25 to 40 tonne']} />
    <Fld k="veh" label="Vehicle number" ph="RJ 14 GC 7781" />
    <Fld k="load" label="What’s it carrying?" ph="Steel coils" />
    <button className="btn wide" onClick={on.act('bookTruck')}>Book slot</button>
  </>;
};

SH.svcBook = function SvcBook({ p }) {
  const { S, on } = useApp();
  const [c, i] = p.split('|'), x = SVC[c].list[+i], f = S.sf;
  if (f.day === undefined) f.day = dl(DAYS[1]); if (f.slot === undefined) f.slot = '10:00 to 12:00'; if (f.where === undefined) f.where = 'Shop floor';
  const gst = Math.round(x[2] * 0.18);
  return <>
    <SheetHead title={x[0]} sub={x[1]} />
    <KV k="Price">{svcPrice(x)}</KV><KV k="GST, 18%">{inr(gst)}</KV>
    <p className="lbl">Date</p><Chips g="day" opts={DAYS.slice(0, 5).map(dl)} />
    <p className="lbl">Time</p><Chips g="slot" opts={['08:00 to 10:00', '10:00 to 12:00', { v: '12:00 to 14:00', l: '12:00 to 14:00, full', off: true }, '14:00 to 16:00', '16:00 to 18:00']} />
    <p className="lbl">Where in your unit</p><Chips g="where" opts={['Shop floor', 'Utility room', 'Office', 'Loading bay']} />
    <Fld k="note" label="What needs doing?" area ph="For example, the compressor trips after 10 minutes" />
    <button className="btn ghost wide" onClick={on.act('toastMsg', 'Photo added')}><Ic n="camera" />Add a photo</button>
    <p className="callout">Pay after the job, or add it to your monthly park bill. The work has a 30-day warranty.</p>
    <button className="btn wide" onClick={on.act('svcBook', p)}>Book now</button>
  </>;
};

SH.svcQuote = function SvcQuote({ p }) {
  const { on } = useApp();
  const [c, i] = p.split('|'), x = SVC[c].list[+i];
  return <>
    <SheetHead title={x[0]} sub={x[1]} />
    <Fld k="note" label="Tell us what you need" area ph="Type, quantity and when you need it" />
    <p className="note">Three verified partners send quotes here within a working day.</p>
    <button className="btn wide" onClick={on.act('svcQuote', x[0])}>Get quotes</button>
  </>;
};

SH.svcDone = function SvcDone({ p: id }) {
  const { S, on } = useApp();
  const b = S.svcB.find(z => z.id === id);
  return <>
    <SheetHead title="Booked" />
    <div className="card"><div className="svc-h"><span className="svc-av" aria-hidden="true">{b.pro[0]}</span><span className="row-t"><b>{b.pro}</b><span>Rated {b.rating} from {b.jobs} jobs. ID and skills verified</span></span></div></div>
    <KV k="Service">{b.svc}</KV><KV k="When">{b.when}</KV><KV k="Where">{b.where}, Plot B-14</KV>
    <p className="callout">A gate pass for {b.pro} is ready, so security lets them straight in.</p>
    <div className="row-b mt">
      <button className="btn" onClick={on.act('toastMsg', `Calling ${b.pro}`)}><Ic n="phone" />Call</button>
      <button className="btn ghost" onClick={on.act('toastMsg', `WhatsApp chat with ${b.pro} opened`)}><Ic n="msg" />WhatsApp</button>
    </div>
  </>;
};

SH.svcUrgent = function SvcUrgent() {
  const { S, on } = useApp();
  const f = S.sf; if (f.what === undefined) f.what = 'Machine breakdown';
  return <>
    <SheetHead title="Get help in 60 minutes" sub="The nearest verified technician comes to your unit. A call-out fee of ₹1,000 applies, adjusted in the final bill." />
    <p className="lbl">What’s wrong?</p><Chips g="what" opts={['Machine breakdown', 'Power failure', 'Compressor down', 'Leak or flooding', 'Fire system fault']} />
    <Fld k="note" label="Anything the technician should know?" area ph="Machine, model and what happened" />
    <button className="btn wide" onClick={on.act('svcUrgent')}><Ic n="bolt" />Send a technician now</button>
  </>;
};

SH.svcRate = function SvcRate({ p: id }) {
  const { S, on } = useApp();
  const b = S.svcB.find(z => z.id === id), f = S.sf; if (f.stars === undefined) f.stars = '5';
  return <>
    <SheetHead title={`Rate ${b.pro}`} sub={b.svc} />
    <p className="lbl">Stars</p><Chips g="stars" opts={['1', '2', '3', '4', '5']} />
    <Fld k="note" label="Anything to add?" area ph="Your review helps other park owners" />
    <button className="btn wide" onClick={on.act('svcRate', id)}>Send rating</button>
  </>;
};

SH.amc = function Amc({ p }) {
  const { S, on } = useApp();
  const a = AMC[+p], f = S.sf; if (f.start === undefined) f.start = 'December';
  return <>
    <SheetHead title={a[0]} sub={a[1]} />
    <KV k="Price">{a[2]}</KV><KV k="Visits">Priority, within 24 hours</KV><KV k="Certificates">Saved to your document vault</KV>
    <p className="lbl">Start in</p><Chips g="start" opts={['December', 'January', 'February']} />
    <button className="btn wide" onClick={on.act('amc', p)}>Start plan</button>
  </>;
};

SH.freqPass = function FreqPass() {
  const { S, on } = useApp();
  const f = S.sf; if (f.days === undefined) f.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; if (f.win === undefined) f.win = '08:00 to 18:00'; if (f.valid === undefined) f.valid = '1 month';
  return <>
    <SheetHead title="Add a frequent pass" sub="For contractors, vendors and drivers who come often. They get a 6-digit gate code." />
    <Fld k="name" label="Name or company" ph="For example, Ravi Electricals" />
    <Fld k="phone" label="Mobile number" type="tel" ph="+91" />
    <p className="lbl">Days</p><Chips g="days" opts={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} m />
    <p className="lbl">Hours</p><Chips g="win" opts={['06:00 to 14:00', '08:00 to 18:00', '14:00 to 22:00', 'All day']} />
    <p className="lbl">Valid for</p><Chips g="valid" opts={['1 week', '1 month', '3 months']} />
    <button className="btn wide" onClick={on.act('freqPass')}>Create frequent pass</button>
  </>;
};

SH.groupPass = function GroupPass() {
  const { S, on } = useApp();
  const f = S.sf; if (f.day === undefined) f.day = dl(DAYS[3]); if (f.size === undefined) f.size = '6 to 10'; if (f.venue === undefined) f.venue = 'Chambers boardroom';
  return <>
    <SheetHead title="Create a group pass" sub="One link for every guest at a buyer visit, audit or event. Each guest gets their own QR code." />
    <Fld k="name" label="What’s it for?" ph="For example, buyer delegation from Dubai" />
    <p className="lbl">Date</p><Chips g="day" opts={DAYS.slice(0, 5).map(dl)} />
    <p className="lbl">Guests</p><Chips g="size" opts={['Up to 5', '6 to 10', '11 to 25', '26 to 50']} />
    <p className="lbl">Where</p><Chips g="venue" opts={['My unit, Plot B-14', 'Chambers boardroom', 'Chambers convention hall']} />
    <button className="btn wide" onClick={on.act('groupPass')}>Create group pass</button>
  </>;
};

SH.blockPerson = function BlockPerson() {
  const { on } = useApp();
  return <>
    <SheetHead title="Block a person or vehicle" sub="The gate turns them away and tells you if they try again." />
    <Fld k="name" label="Name, company or vehicle number" ph="For example, HR 26 AB 1234" />
    <Fld k="why" label="Reason" ph="For example, unauthorised scrap pickup" />
    <button className="btn wide" onClick={on.act('blockPerson')}>Block</button>
  </>;
};

SH.goodsPass = function GoodsPass() {
  const { S, on } = useApp();
  const f = S.sf; if (f.dir === undefined) f.dir = 'Outward'; if (f.kind === undefined) f.kind = 'Non-returnable';
  return <>
    <SheetHead title="Create a goods pass" sub="Security checks every load against its pass at the gate." />
    <p className="lbl">Direction</p><Chips g="dir" opts={['Inward', 'Outward']} />
    <p className="lbl">Type</p><Chips g="kind" opts={['Returnable', 'Non-returnable']} />
    <Fld k="what" label="What’s moving?" ph="For example, 2 injection moulds for repair" />
    <Fld k="veh" label="Vehicle number" ph="HR 55 AF 9081" />
    {f.kind === 'Returnable' && <><p className="lbl">Due back</p><Chips g="back" opts={DAYS.slice(2, 7).map(dl)} /></>}
    <button className="btn wide" onClick={on.act('goodsPass')}>Create goods pass</button>
  </>;
};

SH.addWorker = function AddWorker() {
  const { S, on } = useApp();
  const f = S.sf; if (f.org === undefined) f.org = 'Own staff'; if (f.shift === undefined) f.shift = 'General';
  return <>
    <SheetHead title="Add a worker" sub="They get a 6-digit gate code by SMS. Their ID is checked once at the gate office." />
    <Fld k="name" label="Full name" ph="Full name" />
    <Fld k="phone" label="Mobile number" type="tel" ph="+91" />
    <p className="lbl">Employed by</p><Chips g="org" opts={['Own staff', 'Mewat Skills Co-op', 'ProStaff Services']} />
    <p className="lbl">Shift</p><Chips g="shift" opts={['Shift A', 'General', 'Shift B']} />
    <button className="btn wide" onClick={on.act('addWorker')}>Add worker</button>
  </>;
};

SH.addVehicle = function AddVehicle() {
  const { S, on } = useApp();
  const f = S.sf; if (f.type === undefined) f.type = 'Company car';
  return <>
    <SheetHead title="Add a vehicle" sub="Registered vehicles enter without a pass. Collect the windscreen sticker from the gate office." />
    <Fld k="no" label="Vehicle number" ph="HR 26 AB 1234" />
    <p className="lbl">Type</p><Chips g="type" opts={['Company car', 'Dispatch tempo', 'Truck', 'Two-wheeler']} />
    <button className="btn wide" onClick={on.act('addVehicle')}>Add vehicle</button>
  </>;
};

SH.icom = function Icom() {
  const { S, on } = useApp();
  const f = S.sf; if (f.icom === undefined) f.icom = S.icom;
  return <>
    <SheetHead title="Gate intercom number" sub="If no one answers a gate approval in 60 seconds, the gate calls this number." />
    <Fld k="icom" label="Number to call" type="tel" ph="+91" />
    <button className="btn wide" onClick={on.act('saveIcom')}>Save</button>
  </>;
};

SH.sos = function Sos() {
  const { on, closeSheet } = useApp();
  return <>
    <SheetHead title="Alert park security?" sub="The response team and the gate control room get your location, Plot B-14, right away." />
    <button className="btn wide" onClick={on.act('sos')}><Ic n="sos" />Alert security now</button>
    <button className="btn ghost wide" onClick={closeSheet}>Cancel</button>
  </>;
};

SH.siteVisit = function SiteVisit() {
  const { S, on } = useApp();
  const f = S.sf; if (f.day === undefined) f.day = dl(DAYS[0]); if (f.time === undefined) f.time = '11:00';
  return <>
    <SheetHead title="Book a site visit" sub="Your project manager walks you through the build." />
    <p className="lbl">Date</p><Chips g="day" opts={DAYS.slice(0, 5).map(dl)} />
    <p className="lbl">Time</p><Chips g="time" opts={['10:00', '11:00', '15:00', '16:00']} />
    <button className="btn wide" onClick={on.act('siteVisit')}>Book visit</button>
  </>;
};

SH.doc = function Doc({ p }) {
  const { on } = useApp();
  const [g, i] = p.split('-').map(Number), d = DOCS[g].items[i];
  return <>
    <SheetHead title={d[0]} sub={d[1]} />
    <div className="docprev"><Ic n="doc" /><span>PDF</span></div>
    <div className="row-b mt">
      <button className="btn" onClick={on.act('toastMsg', `${d[0]} shared on WhatsApp`)}><Ic n="msg" />Share</button>
      <button className="btn ghost" onClick={on.act('toastMsg', `${d[0]} emailed to rajiv@aroraprecision.in`)}><Ic n="mail" />Email to me</button>
    </div>
  </>;
};

SH.bdc = function Bdc({ p }) {
  const { on } = useApp();
  const b = BDC[+p];
  return <>
    <SheetHead title={b[0]} sub={b[1]} />
    <p className="mt">{b[3]}</p>
    <button className="btn wide" onClick={on.act('toastMsg', 'Request sent to the Business Development Centre')}>{b[4]}</button>
  </>;
};

SH.cfcBook = function CfcBook({ p: k }) {
  const { S, on } = useApp();
  const c = CFC[k], f = S.sf; if (f.day === undefined) f.day = dl(DAYS[0]); if (f.hrs === undefined) f.hrs = '4'; if (f.slot === undefined) f.slot = '09:00';
  return <>
    <SheetHead title={c.n} sub={c.s} />
    <p className="lbl">Date</p><Chips g="day" opts={DAYS.slice(0, 5).map(dl)} />
    <p className="lbl">Start</p><Chips g="slot" opts={['09:00', '11:00', '14:00']} />
    <p className="lbl">Hours</p><Chips g="hrs" opts={[{ v: '2', l: '2 hours' }, { v: '4', l: '4 hours' }, { v: '8', l: 'Full day' }]} />
    <div className="kv mt"><span>Added to your monthly bill</span><b className="num">{inr(+f.hrs * c.rate)}</b></div>
    <button className="btn wide" onClick={on.act('bookCfc', k)}>Book facility</button>
  </>;
};

SH.hotel = function Hotel() {
  const { S, on } = useApp();
  const f = S.sf; if (f.day === undefined) f.day = dl(DAYS[0]); if (f.nights === undefined) f.nights = '1'; if (f.rooms === undefined) f.rooms = '1';
  return <>
    <SheetHead title="Hampton by Hilton" sub="Inside the park. Billed to your monthly statement." />
    <Fld k="guest" label="Guest name" ph="Who’s staying?" />
    <p className="lbl">Check-in</p><Chips g="day" opts={DAYS.slice(0, 4).map(dl)} />
    <p className="lbl">Nights</p><Chips g="nights" opts={['1', '2', '3', '4']} />
    <p className="lbl">Rooms</p><Chips g="rooms" opts={['1', '2', '3', '4']} />
    <button className="btn wide" onClick={on.act('ecoSubmit', 'hotel')}>Request rooms</button>
  </>;
};

SH.clinic = function Clinic() {
  const { S, on } = useApp();
  const f = S.sf; if (f.type === undefined) f.type = 'General physician'; if (f.slot === undefined) f.slot = 'Today, 16:30';
  return <>
    <SheetHead title="Apollo Clinic" sub="For your staff and workers, inside the park." />
    <Fld k="pat" label="Patient name" ph="Full name" />
    <p className="lbl">Visit for</p><Chips g="type" opts={['General physician', 'Physiotherapy', 'Health check-up']} />
    <p className="lbl">Time</p><Chips g="slot" opts={['Today, 15:00', 'Today, 16:30', 'Tomorrow, 10:00', 'Tomorrow, 12:00']} />
    <button className="btn wide" onClick={on.act('ecoSubmit', 'clinic')}>Book appointment</button>
  </>;
};

SH.food = function Food() {
  const { S, on } = useApp();
  const f = S.sf; if (f.outlet === undefined) f.outlet = 'Haldiram’s'; if (f.n === undefined) f.n = '20'; if (f.to === undefined) f.to = 'Gate 1'; if (f.time === undefined) f.time = '13:00';
  return <>
    <SheetHead title="Food for your team" sub="Delivered from the park’s outlets." />
    <p className="lbl">From</p><Chips g="outlet" opts={['McDonald’s', 'KFC', 'Haldiram’s']} />
    <p className="lbl">For how many people?</p><Chips g="n" opts={['10', '20', '40', '80']} />
    <p className="lbl">Deliver to</p><Chips g="to" opts={['Gate 1', 'Plot B-14 canteen', 'LML Chambers']} />
    <p className="lbl">Time</p><Chips g="time" opts={['12:30', '13:00', '13:30']} />
    <button className="btn wide" onClick={on.act('ecoSubmit', 'food')}>Place order</button>
  </>;
};

SH.checkIn = function CheckIn() {
  const { S, on } = useApp();
  const f = S.sf, open = S.quarters.rooms.filter(r => r.used < r.beds);
  if (f.room === undefined && open.length) f.room = open[0].n;
  if (f.when === undefined) f.when = 'Today';
  return <>
    <SheetHead title="Check someone in" sub="They get their room number and mess timings on WhatsApp." />
    <Fld k="who" label="Team member’s name" ph="Full name" />
    {open.length ? <><p className="lbl">Room</p><Chips g="room" opts={open.map(r => r.n)} /></> : <p className="callout">Every bed is taken. Add beds to check someone in.</p>}
    <p className="lbl">From</p><Chips g="when" opts={['Today', 'Tomorrow', dl(DAYS[2])]} />
    <button className="btn wide" onClick={on.act('checkIn')} disabled={!open.length}>Check in</button>
  </>;
};

SH.hostel = function Hostel() {
  const { S, on } = useApp();
  const f = S.sf; if (f.type === undefined) f.type = 'Labour hostel'; if (f.n === undefined) f.n = '10'; if (f.from === undefined) f.from = 'December';
  return <>
    <SheetHead title="Add beds" sub="At LML Staff Quarters, so shifts start on time." />
    <p className="lbl">Type</p><Chips g="type" opts={['Labour hostel', 'Staff quarters']} />
    <p className="lbl">Beds</p><Chips g="n" opts={['5', '10', '25', '50']} />
    <p className="lbl">From</p><Chips g="from" opts={['December', 'January', 'February']} />
    <button className="btn wide" onClick={on.act('ecoSubmit', 'hostel')}>Request beds</button>
  </>;
};

SH.vendors = function Vendors({ p: c }) {
  return <>
    <SheetHead title={c} sub="Verified by LML and rated by park owners." />
    {VENDORS[c].list.map(([n, r, j]) => <div key={n} className="row"><span className="row-t"><b>{n}</b><span>Rated {r} by {j} park owners</span></span><QuoteBtn p={n} /></div>)}
  </>;
};

SH.fin = function Fin({ p }) {
  const { S, on } = useApp();
  const x = FIN[+p], f = S.sf; if (f.amt === undefined) f.amt = x[2][1]; if (f.ten === undefined) f.ten = x[3][1];
  return <>
    <SheetHead title={x[0]} sub={x[1]} />
    <p className="lbl">Amount</p><Chips g="amt" opts={x[2]} />
    <p className="lbl">Tenure</p><Chips g="ten" opts={x[3]} />
    <p className="note">With your consent, your park payment history is shared with lenders to speed up approval.</p>
    <button className="btn wide" onClick={on.act('finSubmit')}>Check eligibility</button>
  </>;
};

SH.growForm = function GrowForm({ p: k }) {
  const { S, on } = useApp();
  const f = S.sf, g = GROW.find(x => x[0] === k);
  let b = null;
  if (k === 'expand') {
    if (f.size === undefined) f.size = '1,000 sq yd';
    b = <><p className="lbl">Plot size you need</p><Chips g="size" opts={['500 sq yd', '1,000 sq yd', '2,000 sq yd', '1 acre or more']} /><p className="note">Owners get Phase 2 plans before public launch.</p></>;
  }
  if (k === 'lease') {
    if (f.size === undefined) f.size = '10,000 sq ft'; if (f.from === undefined) f.from = 'Within 3 months';
    b = <><p className="lbl">Factory size</p><Chips g="size" opts={['5,000 sq ft', '10,000 sq ft', '25,000 sq ft or more']} /><p className="lbl">Move in</p><Chips g="from" opts={['Within 3 months', '3 to 6 months', 'Later']} /></>;
  }
  if (k === 'refer') b = <><Fld k="rn" label="Their name" ph="Full name" /><Fld k="rc" label="Company" ph="Company name" /><Fld k="rp" label="Mobile number" type="tel" ph="+91" /></>;
  if (k === 'list') {
    if (f.mode === undefined) f.mode = 'Lease out';
    b = <><p className="lbl">I want to</p><Chips g="mode" opts={['Lease out', 'Sell']} /><Fld k="price" label="Expected price (optional)" ph="For example: ₹45 per sq ft a month" /></>;
  }
  return <>
    <SheetHead title={g[2]} sub={g[3]} />
    {k === 'lease' && <div className="lk-wrap mt"><Lockup k="plug" /></div>}
    {b}
    <button className="btn wide" onClick={on.act('growSubmit', k)}>Send request</button>
  </>;
};

SH.member = function Member({ p: id }) {
  const { S, on } = useApp();
  const m = S.team.find(z => z.id === id), f = S.sf; if (f.r === undefined) f.r = m.r;
  const mods = ROLES[f.r].map(k => MODS[k][0]).join(', ');
  return <>
    <SheetHead title={m.n} sub={m.ph} />
    {m.r === 'Owner' ? <p className="mt">Owner. Full access to every module.</p> : <>
      <p className="lbl">Role</p><Chips g="r" opts={['CXO', 'Accounts', 'Admin', 'Security']} />
      <p className="lbl">Can use</p><p>{mods}</p>
      <button className="btn wide" onClick={on.act('saveMember', m.id)}>Save changes</button>
      <button className="btn ghost wide" onClick={on.act('removeMember', m.id)}>Remove from team</button>
    </>}
  </>;
};

SH.addMember = function AddMember() {
  const { S, on } = useApp();
  const f = S.sf; if (f.r === undefined) f.r = 'Admin';
  return <>
    <SheetHead title="Add a team member" sub="They get an invite on WhatsApp." />
    <Fld k="n" label="Name" ph="Full name" />
    <Fld k="ph" label="Mobile number" type="tel" ph="+91" />
    <p className="lbl">Role</p><Chips g="r" opts={['CXO', 'Accounts', 'Admin', 'Security']} />
    <button className="btn wide" onClick={on.act('addMember')}>Send invite</button>
  </>;
};

const Bub = ({ t, at }) => <div className="bub"><b>LML One</b><p>{t}</p><small>{at}</small></div>;
SH.waPreview = function WaPreview() {
  return <>
    <SheetHead title="On WhatsApp" sub="Your team gets alerts like these and can reply to act on them." />
    <div className="chat">
      <Bub t="Electricity bill for October is ready: ₹1,51,200, due 28 Nov. Reply PAY to pay by UPI." at="08:00" />
      <Bub t="Visitor at Gate 1: Vikram Sethi, supplier audit. Reply ALLOW or DENY." at="10:52" />
      <Bub t="Planned power shutdown on Sun 29 Nov, 10:00 to 13:00. Backup DG will run." at="12:15" />
    </div>
  </>;
};
