import { inr, hm, fmtD, SPACES, CFC, SVC, PROS, AMC, TEAM_FOR } from './data.js';

/* Every action gets the app API ({S, toast, openSheet, closeSheet, go, back, notify, can}) and its parameter.
   Actions mutate S; the app re-renders after each one. */
const inAppr = (S, id) => S.approvals.some(a => a.ids.includes(id));

function payBills(S, ids) {
  S.bills.forEach(b => { if (ids.includes(b.id) && b.st === 'due') { b.st = 'paid'; S.paid.unshift({ name: b.name, period: b.period, amt: b.amt, date: '22 Nov' }); } });
  S.approvals = S.approvals.filter(a => !a.ids.some(i => ids.includes(i)));
}

export const A = {
  toastMsg({ closeSheet, toast }, p) { closeSheet(); toast(p); },

  toggle({ S, toast }, k) {
    S[k] = !S[k];
    if (k === 'autopay') toast(S.autopay ? 'Autopay on. Bills pay on their due date.' : 'Autopay off');
  },

  payAll({ S, openSheet }) { const ids = S.bills.filter(b => b.st === 'due').map(b => b.id); if (ids.length) openSheet('pay', ids.join(',')); },
  payOne({ openSheet }, p) { openSheet('pay', p); },
  confirmPay({ S, closeSheet, toast, notify }) {
    const f = S.sf, ids = f.ids, amt = f.amt, method = f.method;
    closeSheet();
    if (f.needs) {
      if (ids.some(id => inAppr(S, id))) { toast('Already waiting for the owner’s approval.'); return; }
      const names = S.bills.filter(b => ids.includes(b.id)).map(b => b.name).join(', ');
      S.approvals.push({ id: 'a' + Date.now(), ids, by: 'Sunil Yadav', label: names, amt });
      notify(`Sunil Yadav asked to pay ${inr(amt)}`, 'team');
      toast('Sent to Rajiv for approval.'); return;
    }
    payBills(S, ids); toast(`Paid ${inr(amt)} by ${method}. GST invoice sent to accounts.`);
  },
  approve({ S, toast }, p) { const a = S.approvals.find(x => x.id === p); if (!a) return; payBills(S, a.ids); toast(`Approved. ${inr(a.amt)} paid and Sunil has been told.`); },
  decline({ S, toast }, p) { S.approvals = S.approvals.filter(x => x.id !== p); toast('Declined. Sunil has been told.'); },
  invoice({ toast }, p) { toast(`GST invoice for ${p} emailed to accounts@aroraprecision.in`); },

  photo({ S }) { S.sf.photo = !S.sf.photo; },
  raise({ S, closeSheet, go, can, toast }) {
    const f = S.sf, d = (f.desc || '').trim();
    if (!d) { toast('Describe the issue so the right team can fix it.'); return; }
    const id = 'T-' + (S.tseq++), who = TEAM_FOR[f.cat];
    S.tickets.unshift({ id, cat: f.cat, ti: d.length > 70 ? d.slice(0, 68) + '…' : d, st: 'Assigned', sla: f.pri === 'Urgent' ? '4h left' : '24h left', who, at: 'Just now' });
    closeSheet();
    if (S.view !== 'desk' && can('desk')) go('desk');
    toast(`Request ${id} raised. ${who} is on it.`);
  },
  escalate({ closeSheet, toast }) { closeSheet(); toast('Escalated. The park manager will call you shortly.'); },
  rate({ closeSheet, toast }) { closeSheet(); toast('Thanks. Your rating goes to the park team.'); },

  uploadPermit({ S, closeSheet, toast }, p) {
    const x = S.permits.find(z => z.id === p);
    x.st = 'In review'; x.s = 'Drawing uploaded today. In review'; x.note = 'Your fire layout drawing is in. LML’s compliance desk is filing your application with the fire department.';
    closeSheet(); toast('Uploaded. Your Fire NOC is now in review.');
  },
  applyPermit({ S, closeSheet, toast }) {
    const f = S.sf, dates = f.from && f.to ? `${fmtD(f.from)} to ${fmtD(f.to)}. ` : f.from ? `From ${fmtD(f.from)}. ` : '';
    S.permits.unshift({ id: 'p' + Date.now(), ti: f.type, st: 'Submitted', s: `${dates}Submitted today`, note: 'The estate office reviews new applications within 2 working days. You’ll hear back here and on WhatsApp.' });
    closeSheet(); toast('Application submitted. You’ll hear back within 2 working days.');
  },

  createPass({ S, openSheet, toast }) {
    const f = S.sf, n = (f.name || '').trim();
    if (!n) { toast('Add the visitor’s name to create the pass.'); return; }
    const id = 'g' + Date.now();
    S.passes.unshift({ id, name: n, purpose: f.purpose, when: f.when, veh: (f.veh || '').trim().toUpperCase() });
    openSheet('passQR', id);
  },
  bookTruck({ S, closeSheet, toast }) {
    const f = S.sf, v = (f.veh || '').trim();
    if (!v) { toast('Add the vehicle number so the gate can let it in.'); return; }
    S.trucks.unshift({ when: `${f.day}, ${f.slot}`, size: f.size, veh: v.toUpperCase(), load: (f.load || '').trim() });
    closeSheet(); toast(`Truck slot booked for ${f.day}, ${f.slot}.`);
  },

  svcBook({ S, openSheet }, p) {
    const [c, i] = p.split('|'), x = SVC[c].list[+i], f = S.sf, pro = PROS[Math.floor(Math.random() * PROS.length)], id = 's' + Date.now();
    S.svcB.unshift({ id, svc: x[0], pro: pro[0], rating: pro[1], jobs: pro[2], when: `${f.day}, ${f.slot}`, where: f.where, st: 'Confirmed' });
    S.passes.unshift({ id: 'g' + Date.now(), name: pro[0], purpose: 'Service', when: `${f.day}, ${f.slot}`, veh: '' });
    openSheet('svcDone', id);
  },
  svcQuote({ closeSheet, toast }, p) { closeSheet(); toast(`Quote request sent for ${p}. Three partners reply within a working day.`); },
  svcUrgent({ S, openSheet, toast }) {
    const f = S.sf, pro = PROS[Math.floor(Math.random() * PROS.length)], id = 's' + Date.now();
    S.svcB.unshift({ id, svc: f.what, pro: pro[0], rating: pro[1], jobs: pro[2], when: 'Today, within 60 minutes', where: 'Shop floor', st: 'On the way' });
    S.passes.unshift({ id: 'g' + Date.now(), name: pro[0], purpose: 'Urgent service', when: 'Today, now', veh: '' });
    openSheet('svcDone', id); toast(`${pro[0]} is on the way. Gate security has their pass.`);
  },
  svcRate({ S, closeSheet, toast }, p) { const b = S.svcB.find(z => z.id === p); if (b) b.rated = true; closeSheet(); toast('Thanks. Your rating helps other park owners choose.'); },
  amc({ S, closeSheet, toast }, p) { const f = S.sf; closeSheet(); toast(`${AMC[+p][0]} starts in ${f.start}. The LML services desk will call you to schedule the first visit.`); },

  gApprove({ S, toast }, p) {
    const w = S.waiting.find(x => x.id === p); if (!w) return;
    S.waiting = S.waiting.filter(x => x !== w);
    S.inside.unshift({ id: 'i' + Date.now(), name: w.name, s: `${w.type}. In since ${hm()} at ${w.gate}` });
    S.glog.unshift([hm(), `${w.name} entered at ${w.gate}`, 'Approved by you']);
    toast(`${w.name} can go in. Security at ${w.gate} has been told.`);
  },
  gDeny({ S, toast }, p) {
    const w = S.waiting.find(x => x.id === p); if (!w) return;
    S.waiting = S.waiting.filter(x => x !== w);
    S.glog.unshift([hm(), `${w.name} turned away at ${w.gate}`, 'Denied']);
    toast(`${w.name} has been turned away.`);
  },
  gLeave({ S, toast }, p) {
    const w = S.waiting.find(x => x.id === p); if (!w) return;
    S.waiting = S.waiting.filter(x => x !== w);
    S.parcels.unshift({ id: 'k' + Date.now(), from: w.name, s: `${w.why}. Left at the security desk at ${hm()}` });
    S.glog.unshift([hm(), `${w.name} left parcels at the security desk`, 'Delivery']);
    toast('Left at the security desk. Collect it any time, or have it sent to your unit.');
  },
  gOut({ S, toast }, p) {
    const x = S.inside.find(z => z.id === p); if (!x) return;
    S.inside = S.inside.filter(z => z !== x);
    S.glog.unshift([hm(), `${x.name} checked out`, 'Checked out']);
    toast(`${x.name} is checked out. Gate security has been told.`);
  },
  gParcel({ S, toast }, p) { S.parcels = S.parcels.filter(k => k.id !== p); toast('A gate runner is bringing it to your unit.'); },
  freqPass({ S, closeSheet, toast }) {
    const f = S.sf, n = (f.name || '').trim();
    if (!n) { toast('Add a name or company for the pass.'); return; }
    if (!(f.days || []).length) { toast('Pick at least one day.'); return; }
    const code = String(100000 + Math.floor(Math.random() * 900000)).replace(/(\d{3})(\d{3})/, '$1 $2');
    const days = f.days.length === 7 ? 'Every day' : f.days.join(', ');
    S.frequent.unshift({ id: 'f' + Date.now(), name: n, s: `${days}, ${f.win}. Valid for ${f.valid}`, code });
    closeSheet(); toast(`Frequent pass created. Gate code ${code} sent to ${n} on WhatsApp.`);
  },
  groupPass({ S, closeSheet, toast }) {
    const f = S.sf, n = (f.name || '').trim();
    if (!n) { toast('Say what the group pass is for.'); return; }
    S.groups.unshift({ id: 'gp' + Date.now(), name: n, s: `${f.day}. ${f.size} guests. ${f.venue}` });
    S.glog.unshift([hm(), `Group pass created: ${n}`, 'Group pass']);
    closeSheet(); toast('Group pass created. Share one link and each guest gets their own QR code.');
  },
  blockPerson({ S, closeSheet, toast }) {
    const f = S.sf, n = (f.name || '').trim();
    if (!n) { toast('Add the name or vehicle number to block.'); return; }
    S.blocked.unshift({ id: 'b' + Date.now(), name: n, s: `Blocked today${(f.why || '').trim() ? '. ' + f.why.trim() : ''}` });
    closeSheet(); toast(`${n} is blocked at every gate.`);
  },
  goodsPass({ S, closeSheet, toast }) {
    const f = S.sf, w = (f.what || '').trim();
    if (!w) { toast('Say what’s moving so security can check the load.'); return; }
    const back = f.kind === 'Returnable' && f.back ? `, due back ${f.back}` : '';
    S.goods.unshift({ id: 'm' + Date.now(), ti: w, s: `${f.dir}, ${f.kind.toLowerCase()}${back}${(f.veh || '').trim() ? '. ' + f.veh.trim().toUpperCase() : ''}`, st: 'Expected' });
    closeSheet(); toast('Goods pass created. Security checks the load against it at the gate.');
  },
  addWorker({ S, closeSheet, toast }) {
    const f = S.sf, n = (f.name || '').trim();
    if (!n) { toast('Add the worker’s name.'); return; }
    closeSheet(); toast(`${n} is added to ${f.shift}. Their gate code is on its way by SMS.`);
  },
  addVehicle({ S, closeSheet, toast }) {
    const f = S.sf, n = (f.no || '').trim().toUpperCase();
    if (!n) { toast('Add the vehicle number.'); return; }
    S.vehicles.unshift({ id: 'v' + Date.now(), no: n, s: `${f.type}. Sticker ready at the gate office` });
    closeSheet(); toast(`${n} is registered. Collect the sticker from the gate office.`);
  },
  saveIcom({ S, closeSheet, toast }) { const v = (S.sf.icom || '').trim(); if (!v) { toast('Add a number for the gate to call.'); return; } S.icom = v; closeSheet(); toast('Gate intercom number saved.'); },
  sos({ closeSheet, notify, toast }) { closeSheet(); notify('SOS sent to park security from Plot B-14', 'gate'); toast('Security alerted. The response team is on its way to Plot B-14.'); },
  emergency({ toast }) { toast('Apollo Clinic alerted. An ambulance is on its way to Plot B-14.'); },
  siteVisit({ S, closeSheet, toast }) { const f = S.sf; closeSheet(); toast(`Site visit booked for ${f.day}, ${f.time}.`); },

  bookChamber({ S, back, toast }) {
    const sp = SPACES[S.param], c = S.calc;
    if (!c || !c.ok) return;
    S.bookings.unshift({ id: 'c' + Date.now(), sp: S.param, when: c.when, free: c.free, add: (S.vf.add || []).slice(), req: sp.unit !== 'hr' });
    S.credits -= c.free;
    back();
    toast(sp.unit === 'hr' ? `Booked: ${sp.n}, ${c.when}.` : 'Request sent. The events team will call you today.');
  },
  cancelBooking({ S, toast }, p) {
    const b = S.bookings.find(x => x.id === p); if (!b) return;
    S.credits += b.free; S.bookings = S.bookings.filter(x => x.id !== p);
    toast(b.free ? 'Booking cancelled. Your free hours are back.' : 'Booking cancelled.');
  },
  bookCfc({ S, closeSheet, toast }, k) {
    const c = CFC[k], f = S.sf, cost = +f.hrs * c.rate;
    S.cfcB.unshift({ ti: c.n, s: `${f.day}, from ${f.slot}, ${f.hrs === '8' ? 'full day' : f.hrs + ' hours'}` });
    closeSheet(); toast(`Booked. ${inr(cost)} goes on your monthly bill.`);
  },
  checkIn({ S, closeSheet, toast }) {
    const f = S.sf, n = (f.who || '').trim(), r = S.quarters.rooms.find(x => x.n === f.room);
    if (!n) { toast('Add the team member’s name to check them in.'); return; }
    if (!r || r.used >= r.beds) { toast('Pick a room with a free bed.'); return; }
    r.used++; S.quarters.log.unshift({ ti: `${n} checked in`, s: `${r.n}. From ${f.when}` });
    closeSheet(); toast(`${n} is checked in to ${r.n}.`);
  },
  ecoSubmit({ S, closeSheet, toast }, p) {
    const f = S.sf; let it;
    if (p === 'hotel') {
      const g = (f.guest || '').trim(); if (!g) { toast('Add the guest’s name to request rooms.'); return; }
      it = { i: 'hotel', ti: `Hampton by Hilton for ${g}`, s: `${f.rooms} ${f.rooms === '1' ? 'room' : 'rooms'} from ${f.day}, ${f.nights} ${f.nights === '1' ? 'night' : 'nights'}`, st: 'Requested', m: 'Rooms requested. Confirmation comes on WhatsApp.' };
    } else if (p === 'clinic') {
      const n = (f.pat || '').trim(); if (!n) { toast('Add the patient’s name to book.'); return; }
      it = { i: 'health', ti: `Apollo Clinic for ${n}`, s: `${f.type}, ${f.slot}`, st: 'Confirmed', m: 'Appointment confirmed.' };
    } else if (p === 'food') {
      it = { i: 'food', ti: `${f.outlet} for ${f.n} people`, s: `To ${f.to} at ${f.time}`, st: 'Ordered', m: 'Order placed. It goes on your monthly bill.' };
    } else {
      it = { i: 'bed', ti: `${f.n} more beds in the ${f.type.toLowerCase()}`, s: `From ${f.from}`, st: 'Requested', m: 'Request sent to the LML Staff Quarters desk.' };
    }
    S.eco.unshift(it); closeSheet(); toast(it.m);
  },

  quote({ S, toast }, p) { S.sent[`quote:${p}`] = true; toast(`Quote requested from ${p}. Replies come to your inbox here.`); },
  finSubmit({ S, closeSheet, toast }) { const f = S.sf; closeSheet(); toast(`Request for ${f.amt} sent to partner lenders. An LML finance manager will call you within a day.`); },
  connect({ S, toast }, p) { S.sent[`connect:${p}`] = true; toast(`Intro request sent to ${p}.`); },
  growSubmit({ S, closeSheet, toast }, k) {
    const f = S.sf;
    if (k === 'refer' && !(f.rn || '').trim()) { toast('Add their name so we know who to reach.'); return; }
    const m = { expand: 'Request sent. Phase 2 plans reach you before launch.', lease: 'Request sent. The allocation team will share factories that fit.', refer: `Thanks. We’ll reach out to ${(f.rn || '').trim()}. You earn maintenance credit if they join.`, list: 'Request sent. LML’s resale desk will call you.' };
    closeSheet(); toast(m[k]);
  },
  rsvp({ S, toast }, p) { S.rsvp[p] = !S.rsvp[p]; toast(S.rsvp[p] ? 'Done. You’re on the list.' : 'RSVP withdrawn.'); },
  saveMember({ S, closeSheet, toast }, p) { const m = S.team.find(z => z.id === p); m.r = S.sf.r; closeSheet(); toast(`${m.n} is now ${m.r}.`); },
  removeMember({ S, closeSheet, toast }, p) { const m = S.team.find(z => z.id === p); S.team = S.team.filter(z => z.id !== p); closeSheet(); toast(`${m.n} removed from the team.`); },
  addMember({ S, closeSheet, toast }) {
    const f = S.sf, n = (f.n || '').trim();
    if (!n) { toast('Add their name to send the invite.'); return; }
    S.team.push({ id: 'm' + Date.now(), n, r: f.r, ph: (f.ph || '').trim() });
    closeSheet(); toast(`Invite sent to ${n} on WhatsApp.`);
  },
  uploadSubsidy({ S, toast }, p) {
    const c = S.subsidy.find(z => z.id === p); c.st = 'Filed'; c.s = 'Documents uploaded today. Filed with the department';
    toast('Uploaded. Your subsidy manager files it next.');
  },
  readAll({ S }) { S.notifs.forEach(n => { n.read = true; }); },
  openNotif({ S, closeSheet, go, can, toast }, p) {
    const n = S.notifs[+p]; n.read = true; closeSheet();
    if (can(n.go)) go(n.go); else toast('Your role doesn’t include this. Ask the owner for access.');
  }
};
