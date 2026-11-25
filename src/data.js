/* Reference data and helpers, carried over verbatim from the original prototype. */
export const inr = n => '₹' + Math.round(n).toLocaleString('en-IN');
export const sum = a => a.reduce((x, b) => x + b.amt, 0);
export const pad2 = n => String(n).padStart(2, '0');

export const WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
export const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
export const DAYS = Array.from({length:7}, (_, i) => new Date(2026, 10, 23 + i));
export const dl = d => `${WD[d.getDay()]} ${d.getDate()} ${MO[d.getMonth()]}`;
export const fmtD = s => { if (!s) return ''; const [, m, d] = s.split('-').map(Number); return `${d} ${MO[m - 1]}`; };

/* ---------- modules and roles ---------- */
export const MODS = {
  bills:['Bills and payments','receipt','Money','Utilities, maintenance and GST invoices'],
  dash:['CXO dashboard','chart','Money','Spend, usage, compliance and ESG'],
  subsidy:['Subsidy desk','rupee','Money','Track your Prime/Focus Area incentives'],
  desk:['Service desk','wrench','Operations','Raise and track park requests'],
  permits:['Permissions','permit','Operations','Apply for and track approvals'],
  gate:['Gate and security','shield','Operations','Gate approvals, passes, attendance, goods and SOS'],
  build:['Factory build tracker','hat','Operations','Your Built-to-Suit factory, week by week'],
  docs:['Document vault','doc','Operations','Deeds, approvals and invoices'],
  chambers:['LML Chambers','cal','Book','Meeting rooms, halls and the exhibition floor'],
  quarters:['LML Staff Quarters','bed','Book','Rooms and beds for your team, inside the park'],
  services:['Factory services','cog','Book','Verified pros for machines, utilities, safety and more'],
  cfc:['Common Facility Centre','lab','Book','Testing lab, design studio and R&D bay'],
  eco:['Park ecosystem','hotel','Book','Hotel, clinic, food and staff housing'],
  market:['Marketplace and finance','store','Grow','Verified vendors and business loans'],
  directory:['Park directory','trade','Grow','Find and work with your neighbours'],
  grow:['Grow with LML','trend','Grow','Expand, lease, refer or list your unit'],
  club:['The Club','crown','Community','Events, partner clubs and members'],
  team:['Team and roles','users','Account','Who can see and pay for what'],
  settings:['WhatsApp and language','msg','Account','Alerts on WhatsApp, Hindi or English']
};
export const ALL = Object.keys(MODS);
export const ROLES = {
  Owner: ALL,
  CXO: ALL.filter(k => k !== 'team'),
  Accounts: ['bills','dash','subsidy','docs','market','settings'],
  Admin: ['desk','permits','gate','build','docs','chambers','quarters','services','cfc','eco','directory','settings'],
  Security: ['gate','desk','settings']
};

/* ---------- reference data ---------- */
export const SPACES = {
  meet:{n:'Meeting room', cap:'Up to 6 people', rate:1500, unit:'hr', credit:true},
  board:{n:'Boardroom', cap:'Up to 14 people', rate:3000, unit:'hr', credit:true},
  conf:{n:'Conference hall', cap:'Up to 80 people', rate:12000, unit:'hr'},
  expo:{n:'Exhibition and display floor', cap:'Column-free floor', rate:90000, unit:'day'},
  conv:{n:'Convention hall', cap:'Up to 400 people', rate:250000, unit:'day'}
};
export const BDC = [
  ['Business address and mail','Use LML Chambers as your business address','store','Get a professional address at LML Chambers. We receive your mail and couriers and tell you on WhatsApp.','Request business address'],
  ['Reception for visiting buyers','Meet buyers at the Chambers lounge','users','Our front desk welcomes your buyers, serves refreshments and walks them to your unit.','Request reception'],
  ['Showcase on the display floor','Put your products in front of park visitors','star','Rent a display bay on the column-free exhibition floor, seen by buyers and delegations visiting the park.','Request a display bay']
];
export const CFC = {
  lab:{n:'Testing and calibration lab', s:'Material testing, CMM and calibration', rate:2000},
  design:{n:'Design and development studio', s:'CAD workstations and 3D printing', rate:1200},
  rnd:{n:'R&D bay', s:'Bench space with power and compressed air', rate:1500},
  line:{n:'Shared processing line', s:'Cutting, bending and finishing', rate:4000}
};
export const MILES = [
  ['Site handover and survey','Done 10 Sep','solid'],
  ['Excavation and foundation','Done 14 Oct','solid'],
  ['Steel structure','In progress. 14 of 24 frames up','half'],
  ['Roof sheeting and cladding','December','line'],
  ['Industrial flooring','January','line'],
  ['Power, water, fire-fighting and utilities','January to February','line'],
  ['Finishing and snag list','February','line'],
  ['Handover','8 Mar 2027','line']
];
export const UPDATES = [
  {w:'Week 11', d:'19 Nov', t:'14 of 24 steel portal frames erected. The crane is on site 24 to 26 Nov for the rest.', f:14},
  {w:'Week 10', d:'12 Nov', t:'Anchor bolts and base plates done for all 24 frames. Steel delivered to site.', f:6},
  {w:'Week 9', d:'5 Nov', t:'Foundation curing complete. Plinth beams cast.', f:0}
];
export const DOCS = [
  {g:'Property', items:[['Allotment letter','Issued 4 Aug 2026, 2 pages'],['Sale deed','Registered 21 Aug 2026, 18 pages'],['Possession letter','Issued 9 Sep 2026, 1 page'],['Approved site plan','Plot B-14, 1 page']]},
  {g:'Approvals', items:[['Building plan approval','Approved 12 Sep 2026'],['Pollution consent to establish','Approved 2 Oct 2026'],['Crane entry permit','24 to 26 Nov 2026']]},
  {g:'Subsidy', items:[['Prime/Focus Area eligibility certificate','Issued 2 Sep 2026'],['Stamp duty refund sanction','Issued 6 Nov 2026']]},
  {g:'Bills and tax', items:[['GST invoices, FY 2026–27','8 invoices'],['Maintenance agreement','Signed 9 Sep 2026']]}
];
export const UNITS = [
  ['Hindustan Rasayan','Chemicals','A-02'],
  ['Kaveri Packaging','Corrugated boxes and cartons','A-07'],
  ['Mewat Polymers','Injection-moulded parts','B-03'],
  ['Shree Fasteners','Industrial fasteners','B-09'],
  ['NovaCable','Wires and cables','B-11'],
  ['Arora Precision Components','CNC-machined parts','B-14',1],
  ['Aravalli Foods','Packaged snacks','C-04'],
  ['Delta Steel Fab','Steel fabrication','C-08']
];
export const VENDORS = {
  'Contractors':{i:'hat', list:[['Sharma Infra Builders','4.8',23],['Mewat Civil Works','4.6',17],['Kaushik Constructions','4.5',11]]},
  'Manpower':{i:'users', list:[['Nuh Skill Staffing','4.7',31],['ProShift Manpower','4.5',19],['Aravalli Workforce','4.4',12]]},
  'Transport':{i:'truck', list:[['Expressway Logistics','4.8',42],['Jhirka Roadlines','4.6',27],['NCR Freight Movers','4.4',15]]},
  'Machinery':{i:'wrench', list:[['Delhi Machine Tools','4.7',14],['Precision Tooling House','4.6',9],['Gurugram Industrial Supplies','4.5',21]]},
  'CA and tax':{i:'rupee', list:[['Mittal and Associates','4.9',26],['Goyal Tax Advisors','4.6',13],['RKG and Co.','4.5',8]]},
  'Legal':{i:'doc', list:[['Verma Legal','4.7',10],['Compliance Desk LLP','4.6',18],['Saxena and Partners','4.4',6]]},
  'Insurance':{i:'shield', list:[['Industrial Shield Brokers','4.7',20],['SafeCover Insurance','4.5',14],['Prime Risk Advisors','4.4',9]]},
  'Facility services':{i:'leaf', list:[['CleanCore Facility','4.6',22],['Guardwell Security','4.5',16],['Sentinel Facility Services','4.4',10]]},
  'Raw materials':{i:'box', list:[['NCR Polymers Depot','4.7',28],['Haryana Steel Traders','4.6',19],['Aravalli Metals','4.5',12]]},
  'Packaging':{i:'box', list:[['Bharat Packaging','4.8',35],['Corrupack Industries','4.6',21],['FlexiWrap Solutions','4.4',9]]},
  'Equipment on rent':{i:'truck', list:[['Mewat Crane and Hydra','4.7',24],['ForkLift Rentals India','4.6',16],['GenSet Hire Co.','4.5',11]]},
  'Hiring and HR':{i:'users', list:[['TalentBridge Industrial','4.6',17],['Payroll Pro Services','4.5',14],['Skill India Partner Centre','4.4',8]]},
  'IT and software':{i:'monitor', list:[['FactoryERP Solutions','4.7',13],['SecureNet Systems','4.6',18],['Tally Partner Gurugram','4.5',22]]},
  'Exports':{i:'trend', list:[['Global Trade Desk','4.7',9],['ExIm Docs and Customs','4.6',15],['Freight Forwarders NCR','4.5',12]]}
};
export const FIN = [
  ['Working capital loan','For raw material and payroll',['₹25 lakh','₹50 lakh','₹1 crore','₹2 crore'],['6 months','12 months','24 months']],
  ['Machinery loan','For new or used machines',['₹50 lakh','₹1 crore','₹3 crore'],['3 years','5 years','7 years']],
  ['Invoice discounting','Get paid early on buyer invoices',['₹10 lakh','₹25 lakh','₹50 lakh'],['30 days','60 days','90 days']],
  ['Equipment lease','Use new machines now, pay monthly',['₹25 lakh','₹50 lakh','₹1 crore'],['3 years','5 years']],
  ['Bank guarantee','For tenders and large buyer orders',['₹10 lakh','₹50 lakh','₹1 crore'],['1 year','2 years']]
];
export const GROW = [
  ['expand','trend','Expand in Phase 2','Get first look at plots before launch'],
  ['lease','store','Lease a ready factory','LML Plug & Play sheds, operational from day one'],
  ['refer','users','Refer a business','Earn maintenance credit when they join'],
  ['list','doc','List your unit','Lease it out or sell through LML’s resale desk']
];
export const EVENTS = [
  {id:'e1', i:'pin', t:'Owners’ Retreat, Rishikesh', s:'15 to 17 Jan 2027. Two nights with park owners', cta:'RSVP', on:'Going'},
  {id:'e2', i:'leaf', t:'Golf morning', s:'Sat 12 Dec. Partner course in Gurugram', cta:'RSVP', on:'Going'},
  {id:'e3', i:'star', t:'F1 passes, 2027 season', s:'Limited passes for members', cta:'Request', on:'Requested'},
  {id:'e4', i:'cal', t:'CXO roundtable at LML Chambers', s:'Thu 3 Dec, 18:30. Exporting under the 2026 MSME policy', cta:'RSVP', on:'Going'}
];
export const MEMBERS = [['Sanjay Gupta','MD, Kaveri Packaging'],['Farhan Qureshi','Director, Mewat Polymers'],['Nidhi Bansal','CEO, NovaCable'],['Amit Jain','Owner, Shree Fasteners']];
export const CATI = {Power:'bolt', Water:'drop', Roads:'road', Drainage:'drop', Streetlight:'bolt', Security:'shield', Housekeeping:'leaf', Other:'wrench'};
export const TEAM_FOR = {Power:'Park electrical team', Streetlight:'Park electrical team', Water:'Water and drainage team', Drainage:'Water and drainage team', Roads:'Civil maintenance', Security:'Security control room', Housekeeping:'Housekeeping team', Other:'Park helpdesk'};
export const PERMIT_TYPES = ['Fit-out','Hot work','Night work','Heavy vehicle or crane entry','Fire NOC','Pollution consent','Signage','Power load increase'];
export const PK = {Rated:'done', Completed:'done', 'On the way':'act', Overdue:'act', Denied:'act', Inside:'done', Done:'done', Blocked:'act', Paid:'done', Approved:'done', Resolved:'done', Confirmed:'done', Active:'done', Sanctioned:'done', Going:'done', 'Action needed':'act', 'Not started':'idle'};

/* ---------- Hindi for home and navigation ---------- */
export const HI = {
  'Home':'होम', 'Bills':'बिल', 'Book':'बुकिंग', 'Requests':'शिकायतें', 'Gate':'गेट', 'Dashboard':'डैशबोर्ड', 'Permits':'अनुमतियाँ', 'Menu':'मेन्यू',
  'Pay bills':'बिल भरें', 'Raise request':'शिकायत दर्ज करें', 'Visitor pass':'विज़िटर पास', 'Book Chambers':'चैंबर्स बुक करें', 'Subsidy':'सब्सिडी',
  'Build tracker':'निर्माण प्रगति', 'Hotel and clinic':'होटल और क्लिनिक', 'Due this month':'इस महीने देय', 'Pay all':'सभी भरें', 'View bills':'बिल देखें',
  'Needs your attention':'ध्यान दें', 'Good morning':'सुप्रभात', 'Good afternoon':'नमस्कार', 'Good evening':'शुभ संध्या',
  'Your factory build':'आपकी फ़ैक्टरी का निर्माण', 'Next at LML Chambers':'LML चैंबर्स में अगली बुकिंग', 'Waiting for your approval':'आपकी मंज़ूरी बाकी', 'Book a service':'सेवा बुक करें', 'Staff quarters':'स्टाफ़ क्वार्टर्स', 'Your team at LML Staff Quarters':'LML स्टाफ़ क्वार्टर्स में आपकी टीम'
};

/* ---------- staff quarters ---------- */
export const QTYPES = [
  ['Bed in the labour hostel', 'Six to a room, with lockers and mess meals', '₹3,500 per bed a month'],
  ['Twin room, staff quarters', 'For supervisors and technicians. Attached bath', '₹9,000 per room a month'],
  ['Studio, staff quarters', 'For managers. Kitchenette and attached bath', '₹14,000 a month']
];

/* ---------- factory services ---------- */
export const SVC = {
  machines:{n:'Machine repair', i:'wrench', list:[['CNC and VMC breakdown', 'Diagnosis and repair on your floor', 2500, 'visit'], ['Injection moulding machine service', 'Hydraulics, heaters and screw check', 4500, 'visit'], ['Hydraulics and pneumatics', 'Leaks, cylinders, valves and hoses', 1800, 'visit'], ['PLC and drives', 'Faults, programming and VFD repair', 3000, 'visit']]},
  electrical:{n:'Electrical', i:'bolt', list:[['Electrician', 'Wiring, sockets, lights and DB faults', 499, 'visit'], ['Panel and MCC maintenance', 'Cleaning, tightening and testing', 3500, 'panel'], ['Earthing test and report', 'Pit resistance, with a signed report', 2500, 'test'], ['Thermal scan of panels', 'Find hot spots before they trip', 6000, 'visit']]},
  utilities:{n:'Utilities', i:'cog', list:[['Air compressor service', 'Filters, oil, belts and leak test', 3500, 'service'], ['DG set service', 'Oil, filters, battery and load test', 4000, 'service'], ['Chiller and cooling tower', 'Descaling, pumps and fans', 5000, 'service'], ['HVAC and ducting', 'AC service, ducts and exhaust fans', 2500, 'visit']]},
  fire:{n:'Fire and safety', i:'fire', list:[['Fire extinguisher refill', 'Pickup, refill, tag and return', 350, 'unit'], ['Fire alarm and hydrant check', 'Test, fix and certify', 4500, 'visit'], ['Fire and safety audit', 'Full audit with a report for your NOC', 15000, 'audit'], ['Safety training for staff', 'Fire drills, PPE and first aid', 8000, 'batch']]},
  cleaning:{n:'Cleaning and pest control', i:'spray', list:[['Deep cleaning of the shop floor', 'Machines, floors and high walls', 6, 'sq ft'], ['Pest and rodent control', 'Treatment with a compliance certificate', 3000, 'visit'], ['Water tank cleaning', 'Drain, scrub, disinfect and test', 2500, 'tank'], ['Washroom and canteen hygiene', 'Deep clean and sanitise', 1500, 'visit']]},
  civil:{n:'Civil and fabrication', i:'hat', list:[['Welding and fabrication', 'Racks, guards, platforms and repairs', 1200, 'visit'], ['Epoxy floor coating', 'Dust-free, chemical-resistant floors', 45, 'sq ft'], ['Roof leak repair', 'Sheets, gutters and sealing', 2000, 'visit'], ['Painting', 'Walls, structures and floor marking', 18, 'sq ft']]},
  it:{n:'IT and security systems', i:'monitor', list:[['CCTV install and repair', 'Cameras, recorders and remote view', 999, 'visit'], ['Networking and Wi-Fi', 'Cabling, routers and shop-floor coverage', 1500, 'visit'], ['Access control and biometrics', 'Attendance devices and door locks', 2500, 'visit'], ['Computer and printer repair', 'Desktops, laptops and printers', 499, 'visit']]},
  testing:{n:'Testing and calibration', i:'gauge', list:[['Instrument calibration, NABL', 'Gauges, meters and sensors', 800, 'instrument'], ['Weighbridge and scale calibration', 'With a legal metrology certificate', 5000, 'visit'], ['Water and effluent testing', 'Sampling and a lab report', 3500, 'sample'], ['Stack emission monitoring', 'For pollution board compliance', 12000, 'stack']]},
  handling:{n:'Material handling and logistics', i:'truck', list:[['Forklift repair', 'Engine, hydraulics and tyres', 1800, 'visit'], ['Forklift on rent', 'With an operator', 2500, 'day'], ['Crane or hydra on hire', '12 to 50 tonne, with an operator', 6000, 'day'], ['Tempo or truck booking', 'Local and intercity loads', 0, '']]},
  manpower:{n:'Manpower on demand', i:'users', list:[['Loaders and helpers', 'For unloading, shifting and packing', 700, 'person a day'], ['Machine operators', 'Trained and verified', 1100, 'person a day'], ['Security guards', 'Licensed, with a supervisor', 950, 'guard a shift'], ['Housekeeping staff', 'For offices, washrooms and canteens', 650, 'person a day']]},
  waste:{n:'Scrap and waste', i:'repeat', list:[['Scrap pickup at the best price', 'Metal, plastic and paper scrap', 0, ''], ['Hazardous waste disposal', 'By authorised recyclers, with manifests', 0, ''], ['E-waste recycling', 'With a recycling certificate', 0, '']]},
  compliance:{n:'Compliance and filings', i:'doc', list:[['GST and TDS filing', 'Monthly returns by a CA', 2500, 'month'], ['Factory licence renewal', 'Paperwork and follow-up', 5000, 'filing'], ['Labour law compliance', 'PF, ESI and registers', 3000, 'month'], ['Contracts and legal drafting', 'Vendor, buyer and lease agreements', 2000, 'document']]}
};
export const SVC_HOME = ['machines', 'electrical', 'utilities', 'fire', 'cleaning', 'it', 'manpower', 'handling'];
export const PROS = [['Mukesh Sharma', '4.8', '1,240'], ['Imran Khan', '4.9', '860'], ['Deepak Saini', '4.7', '2,105'], ['Harish Yadav', '4.8', '640']];
export const AMC = [['Utilities plan', 'Compressor, DG set and chiller. 4 visits a year', '₹48,000 a year'], ['Fire safety plan', 'Extinguishers, alarms and hydrants. Checked every quarter', '₹36,000 a year'], ['Electrical plan', 'Panels, earthing and thermal scans. 4 visits a year', '₹42,000 a year'], ['Pest control plan', 'Monthly treatment, with a compliance certificate', '₹30,000 a year']];
export const svcPrice = x => x[2] ? `From ${inr(x[2])} a${/^[aeiou]/.test(x[3]) ? 'n' : ''} ${x[3]}` : 'Price on quote';

export const takenFor = day => { const d = +day.split(' ')[1]; return [9 + (d * 3) % 9, 9 + (d * 5) % 9]; };
export const hm = () => { const d = new Date(); return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0'); };
