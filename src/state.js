/* Sample data the app starts with. Everything resets on reload. */
export const initialState = () => ({
  view:'home', param:null, stack:[], vf:{}, sf:{},
  role:'Owner', lang:'en', autopay:false, limit:100000,
  wa:true, waBills:true, waGate:true, waOutage:true, waClub:false,
  tseq:2047, credits:6,
  bills:[
    {id:'b1', name:'Electricity', period:'October 2026', due:'28 Nov', dn:28, amt:151200, icon:'bolt', st:'due'},
    {id:'b2', name:'Maintenance (CAM)', period:'November 2026', due:'30 Nov', dn:30, amt:48600, icon:'home', st:'due'},
    {id:'b3', name:'Water', period:'October 2026', due:'28 Nov', dn:28, amt:9880, icon:'drop', st:'due'},
    {id:'b4', name:'STP and ETP treatment', period:'October 2026', due:'5 Dec', dn:35, amt:14300, icon:'leaf', st:'due'}
  ],
  paid:[
    {name:'Maintenance (CAM)', period:'October 2026', amt:48600, date:'29 Oct'},
    {name:'Electricity', period:'September 2026', amt:142860, date:'26 Oct'},
    {name:'Water', period:'September 2026', amt:9240, date:'26 Oct'}
  ],
  approvals:[{id:'a1', ids:['b1'], by:'Sunil Yadav', label:'Electricity for October', amt:151200}],
  tickets:[
    {id:'T-2041', cat:'Streetlight', ti:'Streetlight out near Gate 2', st:'In progress', sla:'5h 40m left', who:'Park electrical team', at:'Today, 07:10'},
    {id:'T-2039', cat:'Roads', ti:'Pothole on Road 3 near Plot B-12', st:'Assigned', sla:'1 day left', who:'Civil maintenance', at:'Yesterday, 16:45'},
    {id:'T-2036', cat:'Water', ti:'Low water pressure at Plot B-14', st:'Resolved', sla:'Fixed in 3h 20m', who:'Water and drainage team', at:'19 Nov'}
  ],
  permits:[
    {id:'p1', ti:'Building plan approval', st:'Approved', s:'Approved 12 Sep 2026', note:'Approved by the LML estate office. The approval letter is in your document vault.'},
    {id:'p2', ti:'Fit-out permission', st:'In review', s:'Submitted 18 Nov. Site inspection Tue 24 Nov', note:'An estate officer inspects the site on Tue 24 Nov. You’ll get the decision here and on WhatsApp.'},
    {id:'p3', ti:'Fire NOC', st:'Action needed', s:'Upload your fire layout drawing', note:'The fire layout drawing is missing. Upload it and LML’s compliance desk files your application with the fire department.', need:'Upload fire layout drawing'},
    {id:'p4', ti:'Pollution consent to establish', st:'Approved', s:'Approved 2 Oct 2026', note:'Issued by the state pollution control board. LML’s compliance desk tracks the renewal date for you.'},
    {id:'p5', ti:'Crane entry, 50 tonne', st:'Approved', s:'24 to 26 Nov, Gate 1, 06:00 to 18:00', note:'Gate 1 security has the vehicle details. Show this permit at entry.'}
  ],
  passes:[
    {id:'g1', name:'Vikram Sethi', purpose:'Audit', when:'Today, 11:00', veh:'HR 26 DK 4410'},
    {id:'g2', name:'Anita Rao', purpose:'Meeting', when:'Today, 15:30', veh:''},
    {id:'g3', name:'Ravi Electricals', purpose:'Contractor', when:'Today, all day', veh:'HR 55 AB 1022'}
  ],
  trucks:[{when:'Tue 24 Nov, 08:00 to 10:00', size:'25 to 40 tonne', veh:'RJ 14 GC 7781', load:'Steel coils'}],
  waiting:[
    {id:'w1', name:'Rohit Verma', org:'Bharat Packaging', type:'Visitor', why:'Packaging samples for the purchase team', gate:'Gate 1', at:'2 min ago'},
    {id:'w2', name:'Blue Dart courier', org:'', type:'Delivery', why:'2 parcels for Arora Precision', gate:'Gate 1', at:'Just now'}
  ],
  inside:[
    {id:'i1', name:'Vikram Sethi', s:'Audit. In since 11:02 at Gate 1'},
    {id:'i2', name:'Ravi Electricals, crew of 4', s:'Contractor. In since 08:40 at Gate 2'},
    {id:'i3', name:'RJ 14 GC 7781, steel coils', s:'Truck at your loading bay since 08:15. Slot ended 10:00', truck:true, over:true}
  ],
  parcels:[{id:'k1', from:'Amazon Business', s:'1 box. Received 09:40 at the security desk'}],
  frequent:[
    {id:'f1', name:'Ravi Electricals', s:'Mon to Sat, 08:00 to 18:00. Valid till 31 Dec', code:'482 915'},
    {id:'f2', name:'Shree Ganesh Transport', s:'Every day, 06:00 to 20:00. Valid till 31 Mar 2027', code:'730 264'},
    {id:'f3', name:'Mewat Skills Co-op', s:'Contract staff for Shift A and General. Valid till 31 Jan 2027', code:'615 088'}
  ],
  groups:[{id:'gp1', name:'Buyer delegation from Dubai', s:'Thu 26 Nov, 10:00. 8 guests. Chambers boardroom'}],
  blocked:[{id:'b1', name:'Quick Scrap Traders', s:'Blocked 10 Nov. Tried an unauthorised scrap pickup'}],
  goods:[
    {id:'m1', ti:'2 injection moulds to Kaveri Castings', s:'Outward, returnable. For repair, due back Wed 2 Dec', st:'Out'},
    {id:'m2', ti:'12 tonne PP granules', s:'Inward. Truck HR 55 AB 7719, arriving 14:00', st:'Expected'},
    {id:'m3', ti:'1,200 brake housings to Northline Auto Parts', s:'Outward. Invoice INV-2611, left 09:15', st:'Done'}
  ],
  vehicles:[{id:'v1', no:'HR 26 EK 2210', s:'Company car. Sticker 0142'}, {id:'v2', no:'HR 55 AF 9081', s:'Dispatch tempo. Sticker 0143'}],
  glog:[
    ['11:02', 'Vikram Sethi entered at Gate 1', 'Visitor pass'],
    ['10:48', 'Blue Dart dropped 2 parcels at the security desk', 'Delivery'],
    ['10:15', 'RJ 14 GC 7781 entered at Gate 2', 'Truck slot'],
    ['09:52', 'Unknown scrap vendor turned away at Gate 1', 'Denied'],
    ['09:40', 'Amazon Business parcel received at the security desk', 'Delivery'],
    ['09:15', 'HR 55 AF 9081 left with 1,200 brake housings', 'Goods pass'],
    ['08:40', 'Ravi Electricals, crew of 4, entered at Gate 2', 'Frequent pass'],
    ['06:05', 'Shift A: 68 staff checked in', 'Attendance']
  ],
  icom:'+91 98110 42210', gAuto:true, gLeave:true, gId:true,
  svcB:[
    {id:'s1', svc:'Air compressor service', pro:'Imran Khan', when:'Wed 25 Nov, 10:00 to 12:00', st:'Confirmed'},
    {id:'s2', svc:'Pest and rodent control', pro:'SafeHome Pest Care', when:'Done on 12 Nov', st:'Completed'}
  ],
  bookings:[{id:'c1', sp:'board', when:'Thu 26 Nov, 11:00 to 13:00', free:2, add:['Catering from park F&B'], req:false}],
  cfcB:[], eco:[], rsvp:{}, sent:{},
  quarters:{
    rooms:[
      {id:'q1', n:'Block A, Room 112', type:'Labour hostel, 6 beds', beds:6, used:6},
      {id:'q2', n:'Block A, Room 114', type:'Labour hostel, 6 beds', beds:6, used:5},
      {id:'q3', n:'Block A, Room 116', type:'Labour hostel, 6 beds', beds:6, used:4},
      {id:'q4', n:'Block C, Room 204', type:'Staff quarters, twin room', beds:2, used:2},
      {id:'q5', n:'Block C, Room 207', type:'Staff quarters, twin room', beds:2, used:1},
      {id:'q6', n:'Block C, Room 310', type:'Staff quarters, studio', beds:1, used:1}
    ],
    log:[
      {ti:'Mohit Kumar checked in', s:'Block A, Room 116. Today, 08:40'},
      {ti:'Imran Ali checked out', s:'Block A, Room 114. Yesterday, 19:15'}
    ]
  },
  subsidy:[
    {id:'s1', ti:'Stamp duty refund', st:'Sanctioned', s:'₹18.4 lakh, to be credited by 15 Dec'},
    {id:'s2', ti:'Electricity duty exemption', st:'Active', s:'Applied on every power bill'},
    {id:'s3', ti:'Capital investment subsidy', st:'Filed', s:'Department verification in progress'},
    {id:'s4', ti:'Interest subvention', st:'Action needed', s:'Upload 2 documents: term loan sanction letter and bank interest certificate'},
    {id:'s5', ti:'SGST reimbursement', st:'Not started', s:'Starts once commercial production begins'}
  ],
  team:[
    {id:'m1', n:'Rajiv Arora', r:'Owner', ph:'+91 98110 22314'},
    {id:'m2', n:'Meera Arora', r:'CXO', ph:'+91 98110 22315'},
    {id:'m3', n:'Sunil Yadav', r:'Accounts', ph:'+91 99582 10441'},
    {id:'m4', n:'Pradeep Kumar', r:'Admin', ph:'+91 97170 55302'},
    {id:'m5', n:'Gate desk, Plot B-14', r:'Security', ph:'+91 97170 55300'}
  ],
  notifs:[
    {t:'Electricity bill for October is ready: ₹1,51,200, due 28 Nov', at:'Today, 08:00', go:'bills'},
    {t:'Crane entry approved for 24 to 26 Nov at Gate 1', at:'Yesterday', go:'permits'},
    {t:'Planned power shutdown on Sun 29 Nov, 10:00 to 13:00', at:'Yesterday', go:'desk'},
    {t:'Stamp duty refund sanctioned: ₹18.4 lakh', at:'6 Nov', go:'subsidy'},
    {t:'Owners’ Retreat in Rishikesh: RSVPs are open', at:'5 Nov', go:'club'}
  ]
});
