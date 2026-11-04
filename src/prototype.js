
/* ================= data ================= */
/* v6: a budget request is a list of category lines (category · notes · amount), as the CSC template prints it */
const CATS=["Food/Refreshments","Prizes/Incentives","Certifications","Printing","Supplies/Materials","Transportation","Venue","Other"];
const FUNDS=["Org funds","Student council subsidy","Sponsorship","Fundraising","Other"];
const SAMPLE=[
  {cat:"Food/Refreshments",note:"Packed snacks and bottled water for 60 participants",amt:4560},
  {cat:"Printing",note:"Tarpaulin, certificates and event IDs",amt:3270},
  {cat:"Prizes/Incentives",note:"Tokens for the top three teams",amt:2400},
  {cat:"Supplies/Materials",note:"Extension cords for the laboratory",amt:1140}
];
const SAMPLE_PROGRAM=[
  {seg:"Registration",desc:"Participants check in and settle at their stations."},
  {seg:"Opening and Mechanics",desc:"Organizers explain the theme, the rules, the time limit and the judging criteria."},
  {seg:"Hacking Round",desc:"Teams build a working prototype within the time limit."},
  {seg:"Demos and Judging",desc:"Each team presents to the panel of judges."},
  {seg:"Awarding",desc:"Winners receive their tokens; certificates go to all participants."},
  {seg:"Picture Taking",desc:"Group documentation photo."}
];
const SAMPLE_PURPOSE="The activity is a one-day coding competition where student teams build working prototypes around a given theme. The event aims to strengthen the problem-solving, teamwork and software development skills of CCS students.";
const blankD=()=>({name:"",date:"",venue:"",participants:"",fund:"Org funds",fundOther:"",allot:"",purpose:"",program:[],cohost:{on:false,partner:"",total:""}});
const S={items:[],uid:0,open:null,step:"details",stage:0,offline:false,submitted:null,shown:0,mode:"filled",d:blankD()};

/* who the documents come from and go to (from the CSC templates; Profile will own this later) */
const ORG={short:"ACM",name:"AUF-ACM Student Chapter",
  to:{name:"Wendel B. Lacson",role:"President",org:"CCS-CSC"},
  through:{name:"Alec Ezekiel M. Dela Peña",role:"Treasurer",org:"CCS-CSC"},
  president:"Lauren Kailey A. Francisco",treasurer:"Alexis Yumi M. Suzuki",adviser:"Melissa M. Pantig",
  officers:[["Ms. Melissa Pantig","ACM Adviser","BSCS Program Chair"],["Lauren Kailey A. Francisco","Chair","BSCS 3A"],["Alistaire Marc E. Espinosa","Vice Chair","BSCS 3A"],
    ["Trizy Gabriel N. Nicdao","Secretary","BSCS 3A"],["Alexis Yumi M. Suzuki","Treasurer","BSCS 3A"],["Paul Andrei S. Calma","P.R.O","BSCS 4A"]]};

/* ---- areas ---- */
let AREA="req";
const fundLabel=d=>d.fund==="Other"?((d.fundOther||"").trim()||"Other"):d.fund;
const L={items:[],budget:[],uid:0,open:null,step:"tracker",trk:null,stage:0,req:null,submitted:null,shown:0,mode:"filled",
  d:{name:"",date:"",venue:"",fund:"Org funds",allot:""}};
const D=()=>AREA==="liq"?L:S;
/* approved budget requests: lines are [category, notes, allotted amount] */
const REQS=[
  {id:"cid",name:"ACM × JPCS UI/UX “Code in the Dark” (Twist-Form Hackathon)",short:"Code in the Dark",date:"2026-09-28",venue:"EYA-CLI Laboratory",fund:"Student council subsidy",approved:"Sep 18",ok:true,
   items:[["Food/Refreshments/Materials","Refreshments and materials",1000],["Cash Prizes","1st, 2nd and 3rd place",1000]]},
  {id:"ga",name:"General Assembly",date:"",venue:"",fund:"",ok:true,items:[["All expenses","",1400]]},
  {id:"booth",name:"College Month Booth",date:"",venue:"",fund:"",ok:true,items:[["All expenses","",2000]]},
  {id:"lmcert",name:"Likha’t Mukha Certification",date:"",venue:"",fund:"",ok:true,items:[["All expenses","",5350]]},
  {id:"lmsem",name:"Likha’t Mukha Seminar",date:"",venue:"",fund:"",ok:true,items:[["All expenses","",4000]]},
  {id:"enroll",name:"Course Enrollment",date:"",venue:"",fund:"",ok:false,why:"No approved budget for this event in the tracker yet.",items:[]},
  {id:"tech",name:"TechHorizon",date:"",venue:"",fund:"",ok:false,why:"No approved budget for this event in the tracker yet.",items:[]}
];
/* first semester, from the Drive sheet “AUF-ACM Student Chapter Breakdown of Expenses A.Y. ’26–’27” */
const TRACK_RC={"cid": [[0, "CHEEZY RED", "Puregold", "140-010-000000003160", "Receipt #1", 10.0, 8.1], [0, "ONION RING", "Puregold", "140-010-000000003160", "Receipt #1", 10.0, 6.9], [0, "CRISPY PATATAS", "Puregold", "140-010-000000003160", "Receipt #1", 10.0, 6.9], [0, "CHOCO MUCHO MINIS", "Puregold", "140-010-000000003160", "Receipt #1", 1.0, 48.0], [0, "FUDGEE BAR MCPNO", "Puregold", "140-010-000000003160", "Receipt #1", 1.0, 85.5], [0, "FUDGEE BAR MLK", "Puregold", "140-010-000000003160", "Receipt #1", 1.0, 85.5], [0, "C2 APPLE", "Puregold", "140-010-000000003160", "Receipt #1", 1.0, 318.0], [0, "Short Vellum", "Calix", "5822881", "Receipt #2", 4.0, 50.0], [0, "Subre/Envelop", "Calix", "5822881", "Receipt #2", 3.0, 5.0], [1, "1st Place", "", "", "", 1.0, 500.0], [1, "2nd Place", "", "", "", 1.0, 300.0], [1, "3rd Place", "", "", "", 1.0, 200.0]], "ga": [[0, "CHOCO MCH CRML", "Johnny’s", "000379", "Receipt #1", 5.0, 10.0], [0, "CHOCO MCH MLK", "Johnny’s", "000379", "Receipt #1", 5.0, 10.0], [0, "CHOCO MCH PBUTTER", "Johnny’s", "000379", "Receipt #1", 5.0, 10.0], [0, "CHOCO MCH WHT CHC", "Johnny’s", "000379", "Receipt #1", 5.0, 10.0], [0, "CLOUD 9", "Johnny’s", "000379", "Receipt #1", 2.0, 101.75], [0, "DEWBERRY BBERRY", "Johnny’s", "000379", "Receipt #1", 1.0, 86.25], [0, "DEWBERRY SBERRY", "Johnny’s", "000379", "Receipt #1", 1.0, 86.25], [0, "FUDGEE BAR CHOCO", "Johnny’s", "000379", "Receipt #1", 2.0, 84.5], [0, "INIPIT ASSTD", "Johnny’s", "000379", "Receipt #1", 2.0, 60.25], [0, "WHATTA TOPS CHOCO", "Johnny’s", "000379", "Receipt #1", 1.0, 86.5], [0, "WHATTA TOPS VANILLA", "Johnny’s", "000379", "Receipt #1", 1.0, 86.5], [0, "NIPS MINI POLYBAG", "Johnny’s", "000379", "Receipt #1", 3.0, 31.0], [0, "REBISCO HANSEL CHOCO", "Johnny’s", "000379", "Receipt #1", 2.0, 62.25]], "booth": [[0, "Kolr Textile Paint", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 83.0], [0, "Kolr Multipurpose Paint", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 94.0], [0, "BBuy DBL Tape Tissue", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 21.0], [0, "BBuy DBL Tape Tissue", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 21.0], [0, "SKLR Nano Double-sided", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 94.0], [0, "BBuy DBL Tape Foam", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 242.0], [0, "BBuy DBL Tape Tissue", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 21.0], [0, "Fine Paper Biotop", "National Book Store", "10042026238900020021435", "Receipt #1", 3.0, 76.0], [0, "Fine Paper Biotop", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 76.0], [0, "BBuy Matte Sticker", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 39.0], [0, "BBuy Matte Sticker", "National Book Store", "10042026238900020021435", "Receipt #1", 1.0, 39.0], [0, "Styro 1 Whole Makapal", "Shwartz School and Office Supplies Trading", "000374", "Receipt #2", 3.0, 150.0], [0, "Styro 1 Whole Manipis", "Shwartz School and Office Supplies Trading", "000374", "Receipt #2", 2.0, 79.0], [0, "Cardboard", "Shwartz School and Office Supplies Trading", "000374", "Receipt #2", 4.0, 21.0], [0, "Acrylic Paint", "Shwartz School and Office Supplies Trading", "000374", "Receipt #2", 6.0, 65.0]], "lmcert": [[0, "HANSEL CHCO", "Puregold", "714-003-000000031080", "Receipt #1", 6.0, 64.0], [0, "OISHI OHEYA", "Puregold", "714-003-000000031080", "Receipt #1", 6.0, 6.9], [0, "ONION RING", "Puregold", "714-003-000000031080", "Receipt #1", 11.0, 6.9], [0, "RBEE CHZSTCK", "Puregold", "714-003-000000031080", "Receipt #1", 5.0, 6.9], [0, "CRISS CROSS CHZ", "Puregold", "714-003-000000031080", "Receipt #1", 6.0, 6.25], [0, "KIREI FLAKES", "Puregold", "714-003-000000031080", "Receipt #1", 5.0, 6.9], [0, "OISHCRISPCHEESE", "Puregold", "714-003-000000031080", "Receipt #1", 11.0, 6.9], [0, "OISHPOTFRIESCHEESE", "Puregold", "714-003-000000031080", "Receipt #1", 6.0, 6.9], [0, "CHEEZY SNACK", "Puregold", "714-003-000000031080", "Receipt #1", 10.0, 8.1], [0, "JNJ PCV-CUT BBQ", "Puregold", "714-003-000000031080", "Receipt #1", 6.0, 17.15], [0, "JNJ PTS S-CRMO", "Puregold", "714-003-000000031080", "Receipt #1", 5.0, 16.85], [0, "CHOCO MUCHO", "Puregold", "714-003-000000031080", "Receipt #1", 2.0, 88.5], [0, "CHCMUCHO WHT", "Puregold", "714-003-000000031080", "Receipt #1", 2.0, 91.5], [0, "BENGBENGCHCO", "Puregold", "714-003-000000031080", "Receipt #1", 3.0, 88.5], [0, "JNJC9 CLSCBR", "Puregold", "714-003-000000031080", "Receipt #1", 5.0, 100.0], [0, "NISSIN B-CCONUT", "Puregold", "714-003-000000031080", "Receipt #1", 3.0, 63.6], [0, "BNO CH", "Puregold", "714-003-000000031080", "Receipt #1", 2.0, 62.0], [0, "NISSIN CHOCO WAFER", "Puregold", "714-003-000000031080", "Receipt #1", 3.0, 56.85], [0, "FLAT TOPS", "Puregold", "714-003-000000031080", "Receipt #1", 6.0, 53.25], [0, "CURLY TOPS", "Puregold", "714-003-000000031080", "Receipt #1", 2.0, 53.25], [0, "Pins", "Acknowledgement Receipt", "", "Receipt #2", 100.0, 10.0], [0, "Styro", "Shwartz School and Office Supplies Trading", "000398", "Receipt #3", 1.0, 79.0], [0, "BBQ Stick", "Shwartz School and Office Supplies Trading", "000398", "Receipt #3", 1.0, 21.0], [0, "Acrylic", "Shwartz School and Office Supplies Trading", "000398", "Receipt #3", 1.0, 65.0], [0, "FLAT TOPS", "Puregold", "714-003-000000031081", "Receipt #4", 2.0, 172.0], [0, "SUMO COOKIES", "Puregold", "714-003-000000031081", "Receipt #4", 3.0, 63.2], [0, "KRM STX DUOPCK", "Puregold", "714-003-000000031081", "Receipt #4", 2.0, 62.3], [0, "JNJ CRMOVAN", "Puregold", "714-003-000000031081", "Receipt #4", 2.0, 69.75], [0, "JNJ MN NIPS", "Puregold", "714-003-000000031081", "Receipt #4", 3.0, 30.5], [0, "JNJMAXXCHWSFMNT", "Puregold", "714-003-000000031081", "Receipt #4", 1.0, 39.0], [0, "MENTOS MINT", "Puregold", "714-003-000000031081", "Receipt #4", 1.0, 43.75], [0, "FRES", "Puregold", "714-003-000000031081", "Receipt #4", 1.0, 41.9], [0, "CHCMUCHO WHT", "Puregold", "714-003-000000031081", "Receipt #4", 1.0, 91.5]], "lmsem": [[0, "BOXES WALNUT TART", "Tarts Deli Pastry Shop", "0207", "Receipt #1", 5.0, 320.0], [0, "BREADS", "L.A. Bakeshop", "0484", "Receipt #2", 1.0, 525.0], [0, "VELLUM BOARD", "Revue School Supplies", "", "Receipt #3", 21.0, 32.0], [0, "VELLUM BOARD", "Revue School Supplies", "", "Receipt #3", 9.0, 35.0], [0, "Styro 1 Whole", "Shwartz School and Office Supplies Trading", "000387", "Receipt #4", 3.0, 79.0], [0, "Cardboard", "Shwartz School and Office Supplies Trading", "000387", "Receipt #4", 3.0, 21.0], [0, "Cartolina", "Shwartz School and Office Supplies Trading", "000387", "Receipt #4", 8.0, 10.0], [0, "DBL CHB SE", "McDonald's", "00535419", "Receipt #5", 1.0, 214.0], [0, "DCknFil AkFSE", "McDonald's", "00535419", "Receipt #5", 2.0, 130.0], [0, "Med CokeFlt", "McDonald's", "00535419", "Receipt #5", 2.0, 29.0]], "enroll": [], "tech": []};
const TRACK_ALLOT={"cid": 2000.0, "ga": 1400.0, "booth": 2000.0, "lmcert": 5350.0, "lmsem": 4000.0, "enroll": null, "tech": null};

/* ================= helpers ================= */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const nf=new Intl.NumberFormat("en-PH",{minimumFractionDigits:2,maximumFractionDigits:2});
const peso=n=>"₱"+nf.format(Number(n)||0);
const amt=i=>Number(i.amt)||0;
const priced=i=>Number(i.amt)>0;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const total=()=>S.items.reduce((a,b)=>a+amt(b),0);
const reduced=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
const wide=()=>$("#device").clientWidth>=960;
const touch=()=>matchMedia("(pointer: coarse)").matches;
const dLong=d=>d?new Intl.DateTimeFormat("en-PH",{weekday:"short",month:"short",day:"numeric",year:"numeric"}).format(new Date(d+"T00:00")):"—";
const dDoc=d=>d?new Intl.DateTimeFormat("en-PH",{month:"long",day:"numeric",year:"numeric"}).format(new Date(d+"T00:00")):"—";
const ONES=["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"],TENS=["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
function w3(n){let s="";if(n>=100){s+=ONES[Math.floor(n/100)]+" Hundred";n%=100;if(n)s+=" ";}if(n>=20){s+=TENS[Math.floor(n/10)];if(n%10)s+="-"+ONES[n%10];}else if(n)s+=ONES[n];return s;}
function words(v){const c=Math.round(v*100);let n=Math.floor(c/100);const ct=c%100;if(!n&&!ct)return"Zero Pesos Only";const p=[];[[1e9,"Billion"],[1e6,"Million"],[1e3,"Thousand"],[1,""]].forEach(([d,l])=>{const q=Math.floor(n/d);if(q){p.push(w3(q)+(l?" "+l:""));n%=d;}});return(p.join(" ")||"Zero")+" Pesos"+(ct?" and "+String(ct).padStart(2,"0")+"/100":"")+" Only";}

/* ================= quick add: English + Taglish [Bea] =================
   "60 packs snacks at 65" · "60 snacks tig-65" · "3 kahon tubig 660" · "2 x tape @45" · "3 cases of water for 660" */
const UNIT_MAP={pc:"pc",pcs:"pcs",piece:"pc",pieces:"pcs",piraso:"pcs",pack:"pack",packs:"packs",pakete:"packs",box:"box",boxes:"boxes",kahon:"boxes",case:"case",cases:"cases",set:"set",sets:"sets",bottle:"bottle",bottles:"bottles",bote:"bottles",roll:"roll",rolls:"rolls",rolyo:"rolls",ream:"ream",reams:"reams",lot:"lot",kg:"kg",kilo:"kg",sheet:"sheet",sheets:"sheets",pax:"pax"};
const GUESS=[
  ["Printing",/print|tarp|certificate|poster|sticker|lanyard|\bids?\b|flyer|banner|brochure|program|xerox|photocop/i],
  ["Food & Drinks",/snack|food|lunch|dinner|breakfast|water|tubig|drink|juice|coffee|kape|meal|bread|tinapay|rice|kanin|merienda|meryenda|pagkain|ulam/i],
  ["Prizes & Tokens",/prize|premyo|token|trophy|medal|gift|regalo|plaque|souvenir/i],
  ["Transportation",/fare|pamasahe|gas|gasolina|fuel|transport|van|jeep|grab|tricycle|bus|toll/i],
  ["Supplies",/tape|marker|paper|papel|cord|battery|ballpen|\bpen\b|folder|glue|pandikit|scissors|gunting|supplies|extension|cartolina/i]
];
const guess=n=>{for(const[c,re]of GUESS)if(re.test(n))return c;return"Other";};
function parse(text){
  let t=" "+text.replace(/\s+/g," ").trim()+" ";if(!t.trim())return null;
  const num=s=>Number(String(s).replace(/,/g,""));let qty=null,unit=null,cost=null,tot=null,m,how="";
  if((m=t.match(/\s(?:tig-?|tig\s)\s*(?:₱|php|p)?\s*([\d,]+(?:\.\d+)?)\s/i))){cost=num(m[1]);how="each";t=t.replace(m[0]," ");}
  else if((m=t.match(/\s(?:at|@)\s*(?:₱|php|p)?\s*([\d,]+(?:\.\d+)?)(?:\s*each)?\s/i))){cost=num(m[1]);how="each";t=t.replace(m[0]," ");}
  else if((m=t.match(/\s(?:for|lahat)\s*(?:₱|php|p)?\s*([\d,]+(?:\.\d+)?)\s/i))){tot=num(m[1]);t=t.replace(m[0]," ");}
  else if((m=t.match(/\s(?:₱|php)\s*([\d,]+(?:\.\d+)?)\s/i))){cost=num(m[1]);how="each";t=t.replace(m[0]," ");}
  if((m=t.match(/^\s*([\d,]+)\s*(?:x\s|×\s)?/i))){qty=num(m[1]);t=t.slice(m[0].length);}
  if((m=t.match(/^\s*([a-z]+)\b/i))&&UNIT_MAP[m[1].toLowerCase()]){unit=UNIT_MAP[m[1].toLowerCase()];t=t.slice(m[0].length);}
  if(cost==null&&tot==null&&(m=t.match(/\s([\d,]+(?:\.\d+)?)\s*$/))){tot=num(m[1]);t=t.slice(0,m.index)+" ";}
  let name=t.trim().replace(/^(of|na|ng)\s+/i,"");
  if(tot!=null){if(!qty)qty=1;cost=Math.round(tot/qty*100)/100;how="total";}
  if(!qty)qty=1;if(!unit)unit=qty>1?"pcs":"pc";
  if(!name)return{qty,unit,cost:cost??"",name:"",cat:"Other",incomplete:true,how,tot};
  name=name.charAt(0).toUpperCase()+name.slice(1);
  return{qty,unit,cost:cost??"",name,cat:guess(name),how,tot};
}

/* ================= save state ================= */
let saveT;
function setSave(kind){$$("[data-save]").forEach(s=>{s.classList.remove("saving","offline");const t=s.querySelector(".t"),sr=s.querySelector("[data-save-sr]");
  const txt=kind==="saving"?"Saving…":kind==="offline"?"Saved on this device":"Saved";if(kind!=="saved")s.classList.add(kind);t.textContent=txt;if(sr)sr.textContent=txt;});}
function saved(){persist();if(S.offline){setSave("offline");return;}setSave("saving");clearTimeout(saveT);saveT=setTimeout(()=>setSave("saved"),650);}

/* ================= budget lines: quick add [Bea] =================
   "Food 450 light refreshments for guests" · "Prizes 500 para sa minigames" · "450 snacks for the guests" · "Cash prizes ₱1,000" */
const CAT_ALIAS=[
  ["Food/Refreshments",/^(food|foods|refreshments?|food\s*\/\s*refreshments|food and refreshments|pagkain|meryenda|merienda|snacks?)$/i,/snack|food|lunch|dinner|breakfast|water|tubig|drink|juice|coffee|kape|meal|bread|merienda|meryenda|pagkain|refreshment/i],
  ["Prizes/Incentives",/^(prizes?|incentives?|prizes?\s*\/\s*incentives?|premyo|tokens?)$/i,/prize|premyo|token|trophy|medal|gift|regalo|incentive|plaque|souvenir|minigame|icebreaker/i],
  ["Certifications",/^(certs?|certificates?|certifications?)$/i,/certificat/i],
  ["Printing",/^(print|printing|xerox)$/i,/print|tarp|poster|sticker|lanyard|\bids?\b|flyer|banner|program|xerox|photocop/i],
  ["Supplies/Materials",/^(supplies|supply|materials?|supplies\s*\/\s*materials)$/i,/tape|marker|paper|papel|cord|battery|ballpen|\bpen\b|folder|glue|scissors|supplies|extension|cartolina|vellum|envelop/i],
  ["Transportation",/^(transpo|transport|transportation|fare|pamasahe)$/i,/fare|pamasahe|gas|fuel|transport|van|jeep|grab|tricycle|bus|toll/i],
  ["Venue",/^(venue|place|rental)$/i,/venue|rent|hall|room/i],
  ["Other",/^(other|others|misc|miscellaneous)$/i,null]];
const titleCase=s=>s.replace(/\s+/g," ").trim().replace(/(^|[\s\/-])([a-z])/g,(m,a,b)=>a+b.toUpperCase());
const capFirst=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
function knownCat(t){t=t.trim();const hit=CAT_ALIAS.find(([,ex])=>ex.test(t));if(hit)return hit[0];
  const used=S.items.map(i=>i.cat).find(c=>c.toLowerCase()===t.toLowerCase());return used||null;}
const guessCat=t=>{const hit=CAT_ALIAS.find(([,,re])=>re&&re.test(t));return hit?hit[0]:"Other";};
function parseLine(text){
  const t=text.replace(/\s+/g," ").trim();if(!t)return null;
  const m=t.match(/(?:₱|php\s*|\bp\s*)?(\d[\d,]*(?:\.\d+)?)/i);
  let before=t,after="",amount="";
  if(m){amount=Number(m[1].replace(/,/g,""));before=t.slice(0,m.index).trim();after=t.slice(m.index+m[0].length).trim();}
  before=before.replace(/[:\-–—]+$/,"").trim();after=after.replace(/^(for|para sa|para|sa|-|–|:)\s+/i,"").trim();
  let cat=null,note="";
  if(before&&(cat=knownCat(before)))note=after;
  else if(before&&after&&before.split(" ").length<=3&&guessCat(before)==="Other"){cat=titleCase(before);note=after;}  /* a new category typed before the amount */
  else{const all=[before,after].filter(Boolean).join(" ");cat=guessCat(all);note=all;}
  return{cat,note:capFirst(note),amt:amount===""?"":amount};}

/* ================= rendering: the budget breakdown ledger ================= */
function catOpts(cur){const set=[...new Set([...CATS,...S.items.map(i=>i.cat),cur].filter(Boolean))];return set.map(c=>`<option${c===cur?" selected":""}>${esc(c)}</option>`).join("");}
function syncCatList(){$("#catList").innerHTML=[...new Set([...CATS,...S.items.map(i=>i.cat)])].map(c=>`<option value="${esc(c)}">`).join("");}
function rowHTML(it,inked){
  const open=S.open===it.id,pen=!priced(it),i=it.id;
  return `<div class="item${pen?" pencil":""}${inked?" inked":""}" data-id="${i}" data-open="${open}">
    <button class="rowbtn" type="button" aria-expanded="${open}" aria-controls="ed${i}">
      <span class="c-cat"><span class="nm">${esc(it.cat)}</span><span class="mt">${it.note?esc(it.note):'<span class="dim">no notes</span>'}${pen?' · <span class="need">needs an amount</span>':""}</span></span>
      <span class="c-note">${it.note?esc(it.note):'<span class="dim">no notes</span>'}</span>
      <span class="c-amt" data-am>${pen?'<span class="need">needs an amount</span>':nf.format(amt(it))}</span>
    </button>
    <div class="editor" id="ed${i}"><div><div class="ed">
      <div class="two">
        <div class="field"><label for="k${i}">Budget category</label><input class="line-in" id="k${i}" data-f="cat" list="catList" autocomplete="off" value="${esc(it.cat)}"></div>
        <div class="field"><label for="c${i}">Amount</label><div class="money"><span class="peso" aria-hidden="true">₱</span><input class="line-in num-only" id="c${i}" data-f="amt" inputmode="decimal" autocomplete="off" placeholder="0.00" value="${pen?"":nf.format(it.amt)}"></div></div>
      </div>
      <div class="field"><label for="n${i}">Notes</label><textarea class="line-in" rows="1" id="n${i}" data-f="note" placeholder="e.g. Light refreshments for attendees and guests">${esc(it.note)}</textarea></div>
      <details class="calc"><summary>Work it out from quantity × price</summary>
        <div class="calc-row"><label class="sr" for="wq${i}">Quantity</label><input class="line-in num-only" id="wq${i}" data-w="q" inputmode="decimal" placeholder="Qty"><span aria-hidden="true">×</span>
          <div class="money"><span class="peso" aria-hidden="true">₱</span><label class="sr" for="wc${i}">Price each</label><input class="line-in num-only" id="wc${i}" data-w="c" inputmode="decimal" placeholder="Price each"></div>
          <span class="calc-eq" data-w="out">= ₱0.00</span><button class="ghost sm" type="button" data-w="use">Use it</button></div></details>
      <div class="acts"><button class="textbtn danger" type="button" data-remove><svg class="i"><use href="#i-trash"/></svg>Remove</button><button class="ghost sm" type="button" data-done>Done</button></div>
    </div></div></div></div>`;
}
function renderLedger(inkedId){
  $("#emptyL").hidden=S.items.length>0;$("#brTotal").hidden=!S.items.length;
  $("#groups").innerHTML=S.items.map(it=>rowHTML(it,it.id===inkedId)).join("");
  $("#brTotV").textContent=nf.format(total())+(S.d.cohost.on?` ${ORG.short} share`:"");
  $$("#groups textarea").forEach(fit);syncCatList();
}
function fit(t){t.style.height="auto";t.style.height=t.scrollHeight+2+"px";}
function renderReads(){
  const p=parseLine($("#qa").value),r=$("#reads"),g=$('#entry [data-g="amt"]');
  if(!p){r.hidden=true;g.textContent="";return;}
  r.hidden=false;g.textContent=p.amt!==""?nf.format(p.amt):"";
  const amount=p.amt!==""?`<b>${peso(p.amt)}</b>`:`<span class="warn">no amount yet, you can add it later</span>`;
  r.innerHTML=`Reads as <label class="sr" for="qaCat">Budget category</label><select class="cat-select" id="qaCat">${catOpts(p.cat)}</select> · ${p.note?`<b>${esc(p.note)}</b>`:'<span class="warn">no notes</span>'} · ${amount}
   <span class="grow"></span><button class="ghost sm" type="submit" form="entry">Add</button>`;
}

/* ================= dock ================= */
function remainLine(){const a=Number(S.d.allot)||0,T=total(),n=S.items.length,co=S.d.cohost.on,ev=Number(S.d.cohost.total)||0;
  const cnt=`${n} ${n===1?"line":"lines"}`,pre=co?(ev?`of ${peso(ev)} event total`:"your share"):cnt;
  if(!a)return{t:pre,c:""};const left=a-T;if(!wide())return left>=0?{t:`${peso(left)} left of budget`,c:"left"}:{t:`${peso(-left)} over budget`,c:"over"};
  return left>=0?{t:`${pre} · ${peso(left)} left of ${peso(a)}`,c:"left"}:{t:`${pre} · ${peso(-left)} over the ${peso(a)} allotted`,c:"over"};}
function renderDock(){
  const d=$("#dock"),liq=AREA==="liq",Dd=D(),st=Dd.step,stg=Dd.stage;$("#dock").classList.toggle("lens-on",LENS&&!document.body.classList.contains("solid"));
  const printBtn=`<button class="ghost" type="button" data-act="print" aria-label="Print"><svg class="i"><use href="#i-print"/></svg><span class="desk-only">Print</span></button>`;
  if(st==="tracker"){const{T,A,over}=semTotals(),df=A-T;
    d.innerHTML=`<div class="tot"><div class="l">Semester ${df<0?"deficit":"excess"}</div><div class="v">${peso(Math.abs(df))}</div><div class="s ${over?"over":"left"}">${over?`${over} ${over===1?"event":"events"} over budget`:"No event over budget"}</div></div><button class="key" type="button" data-to="details">Liquidate an event<svg class="i"><use href="#i-arrow"/></svg></button>`;}
  else if(st==="details"||st==="program"){
    const nx=liq||st==="program"?"items":"program";
    const hint=liq?(L.req?"Add the receipts":"Choose an approved request"):st==="details"?"Program flow (optional)":"Budget lines";
    d.innerHTML=`<div class="tot"><div class="l">Next</div><div class="s" style="font-size:13px">${hint}</div></div><button class="key" type="button" data-to="${nx}">Continue<svg class="i"><use href="#i-arrow"/></svg></button>`;}
  else if(st==="items"){
    if(liq){const r=remainL();
      d.innerHTML=`<div class="tot" aria-live="polite"><div class="l">Actual expense</div><div class="v" id="totV">${peso(L.shown)}</div><div class="s ${r.c}">${r.t}</div></div><button class="key" type="button" data-to="review">Preview<svg class="i"><use href="#i-arrow"/></svg></button>`;
      countTo(lActual());}
    else{const r=remainLine();
      d.innerHTML=`<div class="tot" aria-live="polite"><div class="l">${S.d.cohost.on?ORG.short+" share":"Total"}</div><div class="v" id="totV">${peso(S.shown)}</div><div class="s ${r.c}">${r.t}</div></div><button class="key" type="button" data-to="review">Preview<svg class="i"><use href="#i-arrow"/></svg></button>`;
      countTo(total());}}
  else if(st==="review"){
    d.innerHTML=`<button class="ghost desk-only" type="button" data-act="copy"><svg class="i"><use href="#i-link"/></svg>Copy link</button>
      <button class="ghost" type="button" id="moreBtn" aria-haspopup="menu" aria-expanded="false"><svg class="i"><use href="#i-down"/></svg><span class="desk-only">Download</span><span class="phone-only">More</span></button>
      ${printBtn}<span style="flex:1"></span><button class="key" type="button" id="submitBtn">Send to President<svg class="i"><use href="#i-arrow"/></svg></button>`;}
  else if(stg===1){
    d.innerHTML=`<div class="msg"><b>Sent to the President</b><span class="desk-only">For signing. The status above updates as it moves.</span></div><button class="ghost" type="button" id="unsend">Undo send</button><button class="key" type="button" id="homeBtn">Home</button>`;}
  else if(stg<4){
    d.innerHTML=`<div class="msg"><b>${STAGE[stg].t}</b><span class="desk-only">${STAGE[stg].s}</span></div>${printBtn}<button class="key" type="button" id="homeBtn">Home</button>`;}
  else{
    d.innerHTML=`<div class="msg"><b>Approved by the CSC</b><span class="desk-only">${AREA==="liq"?"The liquidation is accepted.":"You can start buying."}</span></div>${printBtn}<button class="key" type="button" id="homeBtn">Home</button>`;}
  const cl=$("#copyLbl");if(cl)cl.textContent="Copy link for the President";
  sizeLens();
}
function remainL(){const A=lAllot(),T=lActual(),n=lPending();
  if(!L.req)return{t:"No request picked",c:""};
  if(n)return{t:`${n} ${n===1?"receipt needs":"receipts need"} a price`,c:"over"};
  const df=A-T,w=df>=0?"excess":"deficit",v=peso(Math.abs(df));
  return wide()?{t:`${v} ${w} · of ${peso(A)} allotted`,c:df>=0?"left":"over"}:{t:`${v} ${w}`,c:df>=0?"left":"over"};}
let raf;function countTo(v){const el=$("#totV");if(!el)return;cancelAnimationFrame(raf);const from=D().shown;if(reduced()||from===v){D().shown=v;el.textContent=peso(v);return;}
  const t0=performance.now();const f=t=>{const k=Math.min(1,(t-t0)/240),e=1-Math.pow(1-k,3);el.textContent=peso(from+(v-from)*e);if(k<1)raf=requestAnimationFrame(f);else{D().shown=v;el.textContent=peso(v);}};raf=requestAnimationFrame(f);}

/* ================= the documents: CSC template (letter + tables, Long 8.5 × 13 in) ================= */
const ORD=n=>{const s=["th","st","nd","rd"],v=n%100;return n+(s[(v-20)%10]||s[v]||s[0]);};
const dOrdinal=d=>{if(!d)return"—";const x=new Date(d+"T00:00");return `${ORD(x.getDate())} of ${new Intl.DateTimeFormat("en-PH",{month:"long"}).format(x)} ${x.getFullYear()}`;};
const dToday=dt=>new Intl.DateTimeFormat("en-PH",{month:"long",day:"numeric",year:"numeric"}).format(dt||new Date());
/* "TWO THOUSAND PESOS", "ONE THOUSAND NINE HUNDRED SEVENTY ONE PESOS", "… PESOS AND 50/100" (template style, no hyphens) */
function wordsCaps(v){const c=Math.round((Number(v)||0)*100);let n=Math.floor(c/100);const ct=c%100;const p=[];
  [[1e9,"Billion"],[1e6,"Million"],[1e3,"Thousand"],[1,""]].forEach(([dv,l])=>{const q=Math.floor(n/dv);if(q){p.push(w3(q)+(l?" "+l:""));n%=dv;}});
  return ((p.join(" ")||"Zero")+" Pesos"+(ct?" and "+String(ct).padStart(2,"0")+"/100":"")).replace(/-/g," ").toUpperCase();}
const pm=n=>"₱"+nf.format(Number(n)||0);
const listJoin=a=>a.length<2?a.join(""):a.slice(0,-1).join(", ")+(a.length>2?",":"")+" and "+a[a.length-1];
const catPhrase=c=>c.toLowerCase().replace(/\s*\/\s*/g," and ");

/* letterhead + officer footer, drawn in code; logo slots take the real images later */
function lhHTML(){return `<div class="lh" aria-hidden="false">
  <span class="lh-bar"></span><span class="lh-corner"></span><span class="lh-par"></span>
  <div class="lh-row"><span class="lh-logo">Logo</span><span class="lh-logo wide">Logo</span>
    <div class="lh-t"><b>AUF - ACM</b><b>Student Chapter</b><span>Angeles University Foundation • College of Computer Studies</span></div></div></div>`;}
function ftHTML(){return `<div class="ft"><div class="ft-names">${ORG.officers.map(([n,r,c])=>`<div><b>${esc(n)}</b><span>${esc(r)}</span><span>${esc(c)}</span></div>`).join("")}</div>
  <span class="ft-a"></span><span class="ft-b"></span><span class="ft-c"></span><span class="ft-bar"></span></div>`;}
const page=(body,cls="")=>`<section class="pg${cls?" "+cls:""}"><div class="pg-body">${body}</div></section>`;
const addressee=title=>`<div class="lt-date">${dToday(D().submitted||undefined)}<br><b>${title}</b></div>
  <div class="lt-to"><b>${esc(ORG.to.name)}</b><br><i>${esc(ORG.to.role)}</i><br>${esc(ORG.to.org)}</div>
  <div class="lt-thru"><span>Through:</span><div><b>${esc(ORG.through.name)}</b><br><i>${esc(ORG.through.role)}</i><br>${esc(ORG.through.org)}</div></div>
  <p class="lt-dear">Dear ${esc(ORG.to.org)},</p>`;
const sig=(name,role)=>`<div class="sg"><b>${esc(name)}</b><span>${esc(role)}, ${esc(ORG.name)}</span></div>`;

/* ---------- Budget Request: page 1 letter, page 2 program flow + budget breakdown ---------- */
function paperHTML(){const d=S.d,T=total(),co=d.cohost.on,ask=co&&Number(d.cohost.total)>0?Number(d.cohost.total):T;
  const act=d.name?`<b><i>${esc(d.name)}</i></b>`:`<span class="p-need">activity name</span>`;
  const cats=[...new Set(S.items.map(i=>i.cat))].map(catPhrase);
  const covers=cats.length?(co?` The requested ${esc(ORG.name.replace(" Student Chapter",""))} share will cover its portion of the expenses for ${esc(listJoin(cats))}.`:` The requested budget will cover the expenses for ${esc(listJoin(cats))}.`):"";
  const purpose=d.purpose.trim()?esc(d.purpose.trim()):`<span class="p-need">Write what the activity is and what it aims to do.</span>`;
  const p1=page(`${addressee("Budget Request")}
    <p class="lt-p">On behalf of the ${esc(ORG.name)}, we respectfully request a budget of <b>${wordsCaps(ask)} (${pm(ask)})</b> for the ${act}${co&&d.cohost.partner.trim()?`, co-hosted with ${esc(d.cohost.partner.trim())},`:""} scheduled on the <b>${d.date?dOrdinal(d.date):'<span class="p-need">date</span>'}</b>.</p>
    <p class="lt-p">${purpose}${covers}</p>
    <p class="lt-p">In view of the objectives of the activity, we respectfully request the support and approval of the ${esc(ORG.to.org)} for the proposed budget.</p>
    <p class="lt-thanks">Thank you very much!</p>
    <p class="lt-sub">Respectfully submitted,</p>
    <div class="sgs two">${sig(ORG.president,"President")}${sig(ORG.treasurer,"Treasurer")}</div>
    <p class="lt-sub">Noted by:</p>
    <div class="sgs">${sig(ORG.adviser,"Faculty Adviser")}</div>`);
  const P=d.program.filter(p=>p.seg.trim()||p.desc.trim());
  const flow=P.length?`<h3 class="pt">Program Flow</h3>
    <div class="pf-meta"><span><b>Participants:</b> ${esc(d.participants||"—")}</span><span><b>Date:</b> ${d.date?dDoc(d.date):"—"}</span><span><b>Venue:</b> ${esc(d.venue||"—")}</span></div>
    <table class="pt-table pf-t"><thead><tr><th>#</th><th>Segment</th><th></th></tr></thead><tbody>${P.map((p,i)=>`<tr><td class="n">${i+1}</td><td><b>${esc(p.seg)}</b></td><td>${esc(p.desc)}</td></tr>`).join("")}</tbody></table>`:"";
  const rows=S.items.length?S.items.map(i=>`<tr><td><b>${esc(i.cat)}</b></td><td>${esc(i.note)}</td><td class="c"><b>${priced(i)?pm(i.amt):'<span class="p-need">needs amount</span>'}</b></td></tr>`).join("")
    :`<tr><td colspan="3" class="p-empty">Budget lines you add appear here</td></tr>`;
  const p2=page(`${flow}<h3 class="pt">Budget Breakdown</h3>
    <p class="lt-p flush">The following table presents the itemized breakdown of the requested budget:</p>
    <table class="pt-table bd-t"><thead><tr><th>Budget Category</th><th>Notes</th><th>Amount</th></tr></thead><tbody>${rows}
      <tr class="pt-tot"><td colspan="2">TOTAL</td><td class="c">${pm(T)}${co?` ${ORG.short} share`:""}</td></tr></tbody></table>`);
  return p1+p2;}

/* ================= flows: Budget Requests has two steps, Liquidation keeps three ================= */
const FLOW={
  req:{steps:[["details","Details"],["program","Program flow"],["items","Budget"],["review","Preview & print"]],show:{details:["details"],program:["program"],items:["items"],review:["review"],done:["review"]}},
  liq:{steps:[["details","Request"],["items","Receipts"],["review","Preview & print"]],show:{tracker:["ltracker"],details:["ldetails"],items:["litems"],review:["review"],done:["review"]}}};
const SHORT={"Program flow":"Program","Preview & print":"Preview"};
const STAGE=[
  {b:"Draft",t:"Draft",s:"Not sent yet. Only you can see it."},
  {b:"With President",t:"With the President",s:""},
  {b:"With Adviser",t:"With the Adviser",s:"Signed by the President. Waiting for the Adviser to note it."},
  {b:"With CSC",t:"With the CSC Treasurer",s:"Signed and noted. The CSC Treasurer forwards it to the CSC President."},
  {b:"Approved",t:"Approved by the CSC",s:""}];
const stampFmt=d=>d?new Intl.DateTimeFormat("en-PH",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"}).format(d):"";
function stepOk(k){
  if(k==="review")return !!D().submitted;
  if(AREA==="liq")return k==="details"?!!L.req:L.items.length>0&&L.items.every(lp);
  if(k==="details")return !!(S.d.name&&S.d.date&&S.d.purpose.trim());
  if(k==="program")return S.d.program.some(p=>p.seg.trim());
  return S.items.length>0&&S.items.every(priced);}
function renderSteps(){const F=FLOW[AREA],stp=D().step,keys=F.steps.map(s=>s[0]),idx=stp==="done"?keys.length:keys.indexOf(stp),locked=stp==="done",br=true;
  $("#railSteps").innerHTML=F.steps.map(([k,lb],i)=>{const ok=stepOk(k),cur=i===idx,st=ok?"done":cur?"cur":(i<idx&&k!=="program")?"inc":"todo";
    const opt=k==="program"&&!ok;
    const mk=br?(ok?'<span class="ok">Done</span>':cur?'<span class="now">In progress</span>':opt?'<span class="todo">Optional</span>':i<idx?'<span class="inc">Incomplete</span>':'<span class="todo">Not done</span>')
               :(cur?'<span class="cur" aria-hidden="true"></span>':ok?'<span class="ok">Done</span>':(i<idx&&i===0?'<span class="ok" style="color:var(--sun)">Incomplete</span>':""));
    const n=br&&ok?`<svg class="i" aria-hidden="true"><use href="#i-check"/></svg><span class="sr">${i+1}</span>`:(i+1);
    return `<li><button class="rstep" type="button" data-to="${k}" data-st="${st}"${cur?' aria-current="step"':""}${locked?" disabled":""}><span class="n">${n}</span><span class="lb">${!br&&k==="review"?"Review &amp; submit":esc(lb)}</span><span class="mark">${mk}</span></button></li>`;}).join("");
  $("#tbSteps").innerHTML=F.steps.map(([k,lb],i)=>`<li><button class="stepbtn" type="button" data-to="${k}" data-done="${stepOk(k)}"${i===idx?' aria-current="step"':""}${locked?" disabled":""}>${esc(SHORT[lb]||lb)}</button></li>`).join("");}
function renderStatus(){const Dd=D(),stg=Dd.stage,bd=$("#hdBadge");bd.hidden=false;
  $("#statusBar").hidden=!(Dd.step==="review"||Dd.step==="done");
  const g=STAGE[stg];bd.textContent=g.b;bd.dataset.stage=stg;
  $("#stNow").textContent=g.t;
  $("#stSub").textContent=stg===1?`Sent ${stampFmt(Dd.submitted)}. Waiting for the President’s signature.`:stg===4?(AREA==="liq"?"The CSC accepted this liquidation.":"The CSC approved the budget. You can start buying."):g.s;
  const N=[["Draft","You prepare it"],["President","Signs"],["Adviser","Notes"],["CSC Treasurer","Receives"],["CSC","Approves"]];
  $("#stTrack").innerHTML=N.map(([a,b],i)=>{const c=(i<stg||stg===4)?"done":i===stg?"cur":"";
    return `<li class="${c}"${i===stg?' aria-current="step"':""}><span class="tk" aria-hidden="true"></span><span class="tl">${a}</span><span class="td">${b}</span></li>`;}).join("");}
function renderReviewSteps(){if(!$("#rvStep"))return;/* design review bar is not shipped */const B=AREA==="liq"?[["tracker","Tracker"],["details","Request"],["items","Receipts"],["review","Preview"],["done","Submitted"],["approved","Approved"]]
    :[["details","Details"],["program","Program"],["items","Budget"],["review","Preview"],["done","Submitted"],["approved","Approved"]];
  const Dd=D(),cur=Dd.step==="done"&&Dd.stage===4?"approved":Dd.step;
  $("#rvStep").innerHTML="<b>Step</b>"+B.map(([k,l])=>`<button type="button" data-go="${k}" aria-pressed="${k===cur}">${l}</button>`).join("");}

function renderMeta(){const liq=AREA==="liq",Dd=D(),d=Dd.d,stp=Dd.step,F=FLOW[AREA];
  $$('[data-bind="title"]').forEach(e=>e.textContent=d.name||(liq?"Choose a request":"Untitled request"));
  $('[data-bind="date"]').textContent=dLong(d.date);$('[data-bind="venue"]').textContent=d.venue||"—";$('[data-bind="fund"]').textContent=fundLabel(d);
  $('[data-bind="allot"]').textContent=Number(d.allot)?peso(d.allot):"—";
  $(".kicker").textContent=liq?"Liquidation report":"Budget request";
  const keys=F.steps.map(s=>s[0]),idx=keys.indexOf(stp);
  $("#tbSub").textContent=`${liq?"Liquidation":"Budget request"} · ${STAGE[Dd.stage].b}`;
  renderSteps();renderStatus();renderReviewSteps();
  $("[data-apv]").hidden=true;
  $("#phoneSigns").hidden=true;
  if(liq&&stp==="tracker"){$$('[data-bind="title"]').forEach(e=>e.textContent="First semester");$(".kicker").textContent="Liquidation · budget tracker";
    $("#tbSub").textContent="Liquidation · A.Y. 2026–27";renderRailTrack();}
}

/* ================= navigation ================= */
function go(step,o={}){queueMicrotask(persist);
  const liq=AREA==="liq",Dd=D(),F=FLOW[AREA];
  if(step==="edit")step="items";
  if(liq&&!L.req&&(step==="review"||step==="done")){toast("Choose an approved request first");step="details";}
  else if(step==="review"&&!o.force&&!Dd.items.length){toast(liq?"Add at least one receipt first":"Add at least one item first");$(liq?"#lqa":"#qa").focus();return;}
  Dd.step=step;closePop();const secs=F.show[step];
  $$(".step").forEach(s=>{s.hidden=!secs.includes(s.dataset.step);s.classList.remove("enter");});
  const cur=$(`.step[data-step="${secs[0]}"]`);
  if(!o.instant)secs.forEach(k=>{const el=$(`.step[data-step="${k}"]`);void el.offsetWidth;el.classList.add("enter");});
  $("#app").scrollTop=0;
  if(secs[0]==="review"){
    $("#paperBox").classList.toggle("land",false);
    $("#paper").innerHTML=liq?lpaperHTML():paperHTML();
    const need=liq?L.items.filter(i=>!lp(i)):S.items.filter(i=>!priced(i));
    $("#needBanner").hidden=!need.length||step==="done";
    $("#needText").textContent=liq?(need.length===1?"1 receipt needs a price":`${need.length} receipts need a price`):(need.length===1?"1 budget line needs an amount":`${need.length} budget lines need an amount`);
    $("#paperBox").classList.toggle("stamped",step==="done");
    $("#paperBtn").setAttribute("aria-label",liq?"Open the report full size":"Open the document full size");
    $("#hintZoom").classList.toggle("phone-only",!liq);$("#hintT").textContent=(touch()?"Tap":"Click")+" the paper to read it full size";}
  if(secs.includes("details")){renderFunds();fit($("#fPurpose"));}
  if(secs.includes("program"))$$("#pfList textarea").forEach(fit);
  if(secs.includes("ldetails"))renderReqs();
  $("#device").classList.toggle("trk",liq&&step==="tracker");
  if(secs.includes("ltracker"))renderTracker();
  renderMeta();renderDock();
  if(!o.noFocus){const h=cur.querySelector("[tabindex='-1']");h&&h.focus({preventScroll:true});}
}

/* ================= budget lines: add / edit / remove ================= */
function addItem(p){const it={id:++S.uid,cat:p.cat,note:p.note,amt:p.amt};S.items.push(it);saved();renderLedger(it.id);renderDock();renderMeta();
  const el=$(`.item[data-id="${it.id}"]`);el&&el.scrollIntoView({block:"nearest",behavior:reduced()?"auto":"smooth"});return it;}
$("#entry").addEventListener("submit",e=>{e.preventDefault();const p=parseLine($("#qa").value);if(!p){$("#qa").focus();return;}
  const sel=$("#qaCat");if(sel)p.cat=sel.value;addItem(p);$("#qa").value="";renderReads();$("#qa").focus();
  if(!priced(p))toast("Added in pencil. It still needs an amount");});
$("#qa").addEventListener("input",renderReads);
$("#qa").addEventListener("keydown",e=>{if(e.key==="Escape"){$("#qa").value="";renderReads();}
  if(e.key==="ArrowUp"&&!$("#qa").value&&S.items.length){e.preventDefault();toggle(S.items[S.items.length-1].id);}});

$("#groups").addEventListener("click",e=>{
  const li=e.target.closest(".item");if(!li)return;const id=Number(li.dataset.id),it=S.items.find(i=>i.id===id);
  if(e.target.closest(".rowbtn")){toggle(id);return;}
  if(e.target.closest('[data-w="use"]')){const v=calcVal(li);if(v>0){it.amt=v;li.querySelector('[data-f="amt"]').value=nf.format(v);upd(li,it);toast(`Amount set to ${peso(v)}`);}else toast("Enter a quantity and a price first");return;}
  if(e.target.closest("[data-done]")){toggle(id,false);return;}
  if(e.target.closest("[data-remove]"))remove(id);});
$("#groups").addEventListener("input",e=>{const li=e.target.closest(".item");if(!li)return;const it=S.items.find(i=>i.id==li.dataset.id);
  if(e.target.dataset.w){li.querySelector('[data-w="out"]').textContent="= "+peso(calcVal(li));return;}
  const f=e.target.dataset.f;if(!f)return;let v=e.target.value;
  if(f==="amt"){v=v.replace(/[^\d.]/g,"");it.amt=v===""?"":Number(v);}else it[f]=f==="cat"?v.trim()?v:"Other":v;
  if(e.target.tagName==="TEXTAREA")fit(e.target);upd(li,it);});
$("#groups").addEventListener("change",e=>{const f=e.target.dataset.f;if(f==="amt"&&e.target.value){const v=Number(e.target.value.replace(/[^\d.]/g,""));if(v>0)e.target.value=nf.format(v);}
  if(f==="cat"){const it=S.items.find(i=>i.id==e.target.closest(".item").dataset.id);it.cat=titleCase(e.target.value)||"Other";e.target.value=it.cat;syncCatList();upd(e.target.closest(".item"),it);}});
const calcVal=li=>{const q=Number((li.querySelector('[data-w="q"]').value||"").replace(/[^\d.]/g,""))||0,c=Number((li.querySelector('[data-w="c"]').value||"").replace(/[^\d.]/g,""))||0;return Math.round(q*c*100)/100;};
function upd(li,it){const pen=!priced(it);li.classList.toggle("pencil",pen);
  li.querySelector(".nm").textContent=it.cat||"Other";
  const nt=it.note?esc(it.note):'<span class="dim">no notes</span>';
  li.querySelector(".mt").innerHTML=nt+(pen?' · <span class="need">needs an amount</span>':"");li.querySelector(".c-note").innerHTML=nt;
  li.querySelector("[data-am]").innerHTML=pen?'<span class="need">needs an amount</span>':nf.format(amt(it));
  $("#brTotV").textContent=nf.format(total())+(S.d.cohost.on?` ${ORG.short} share`:"");
  saved();renderDock();renderSteps();}
function toggle(id,force){const was=S.open===id;S.open=(force===false||was)?null:id;
  $$("#groups .item").forEach(li=>{const o=Number(li.dataset.id)===S.open;li.dataset.open=o;li.querySelector(".rowbtn").setAttribute("aria-expanded",o);});
  if(S.open){const li=$(`#groups .item[data-id="${S.open}"]`),it=S.items.find(i=>i.id===S.open);li.querySelectorAll("textarea").forEach(fit);
    setTimeout(()=>{(priced(it)?li.querySelector('[data-f="note"]'):li.querySelector('[data-f="amt"]')).focus({preventScroll:true});li.scrollIntoView({block:"nearest",behavior:reduced()?"auto":"smooth"});},60);}
  else if(was){const b=$(`#groups .item[data-id="${id}"] .rowbtn`);b&&b.focus({preventScroll:true});}}
let lastDel;function remove(id){const i=S.items.findIndex(x=>x.id===id);lastDel={it:S.items[i],i};S.items.splice(i,1);S.open=null;saved();renderLedger();renderDock();renderSteps();
  toast(`Removed “${lastDel.it.cat}”`,()=>{S.items.splice(lastDel.i,0,lastDel.it);saved();renderLedger(lastDel.it.id);renderDock();renderSteps();});}

/* start over: clears the whole request, only after an in-page confirmation */
$("#resetBtn").addEventListener("click",()=>{const n=S.items.length;
  $("#rcD").textContent=n?`The activity details, the letter text and ${n===1?"1 budget line":n+" budget lines"} will be removed.`:"The activity details will be removed.";
  $("#resetConfirm").hidden=false;$("#rcNo").focus();});
$("#rcNo").addEventListener("click",()=>{$("#resetConfirm").hidden=true;$("#resetBtn").focus();});
$("#resetConfirm").addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();$("#rcNo").click();}});
$("#rcYes").addEventListener("click",()=>{const snap=JSON.stringify({items:S.items,d:S.d,uid:S.uid});
  S.items=[];S.open=null;S.d=blankD();S.shown=0;
  $("#resetConfirm").hidden=true;$("#qa").value="";renderReads();syncDetails();renderLedger();saved();go("details",{noFocus:true,force:true,instant:true});$("#fName").focus();
  toast("Request cleared",()=>{Object.assign(S,JSON.parse(snap));syncDetails();renderLedger();saved();go("details",{noFocus:true,force:true,instant:true});});});

/* ================= details ================= */
function renderFunds(){$("#fundTags").innerHTML=FUNDS.map(f=>`<button type="button" class="tagbtn" role="radio" aria-checked="${f===S.d.fund}" data-fund="${esc(f)}">${esc(f)}</button>`).join("");
  $("#fundOtherF").hidden=S.d.fund!=="Other";
  const c=S.d.cohost.on;$("#hostTags").innerHTML=[["solo","Only "+ORG.name.replace(" Student Chapter","")],["co","Co-hosted"]].map(([k,l])=>`<button type="button" class="tagbtn" role="radio" aria-checked="${(k==="co")===c}" data-host="${k}">${esc(l)}</button>`).join("");
  $("#cohostF").hidden=!c;}
$("#fundTags").addEventListener("click",e=>{const b=e.target.closest("[data-fund]");if(!b)return;S.d.fund=b.dataset.fund;renderFunds();saved();renderMeta();
  if(S.d.fund==="Other")$("#fOther").focus();else $(`[data-fund="${CSS.escape(S.d.fund)}"]`).focus();});
$("#hostTags").addEventListener("click",e=>{const b=e.target.closest("[data-host]");if(!b)return;S.d.cohost.on=b.dataset.host==="co";renderFunds();renderLedger();saved();renderMeta();renderDock();
  if(S.d.cohost.on)$("#fPartner").focus();else $('[data-host="solo"]').focus();});
[["#fName","name"],["#fDate","date"],["#fVenue","venue"],["#fPart","participants"],["#fOther","fundOther"],["#fPurpose","purpose"]].forEach(([s,k])=>$(s).addEventListener("input",e=>{S.d[k]=e.target.value;if(e.target.tagName==="TEXTAREA")fit(e.target);saved();renderMeta();}));
$("#fPartner").addEventListener("input",e=>{S.d.cohost.partner=e.target.value;saved();renderDock();});
/* money fields: numbers only; letters are refused with a short note */
let allotT;function numErr(el){if(el.id!=="fAllot"){toast("Numbers only");return;}$("#allotErr").hidden=false;el.setAttribute("aria-invalid","true");clearTimeout(allotT);allotT=setTimeout(()=>{$("#allotErr").hidden=true;el.removeAttribute("aria-invalid");},2800);}
document.addEventListener("beforeinput",e=>{if(e.target.classList&&e.target.classList.contains("num-only")&&e.data&&/[^\d.,]/.test(e.data)){e.preventDefault();numErr(e.target);}},true);
function cleanNum(el){const raw=el.value;let v=raw.replace(/[^\d.,]/g,"");const p=v.indexOf(".");if(p>-1)v=v.slice(0,p+1)+v.slice(p+1).replace(/\./g,"");
  if(v!==raw){const pos=Math.max(0,(el.selectionStart||v.length)-(raw.length-v.length));el.value=v;try{el.setSelectionRange(pos,pos);}catch(_){}numErr(el);}return v.replace(/,/g,"");}
$("#fAllot").addEventListener("input",e=>{S.d.allot=cleanNum(e.target);saved();renderMeta();renderDock();});
$("#fEvTotal").addEventListener("input",e=>{S.d.cohost.total=cleanNum(e.target);saved();renderDock();});
["#fAllot","#fEvTotal"].forEach(s=>$(s).addEventListener("change",e=>{const v=Number(String(e.target.value).replace(/[^\d.]/g,""));if(v>0)e.target.value=nf.format(v);}));
function syncDetails(){const d=S.d;$("#fName").value=d.name;$("#fDate").value=d.date;$("#fVenue").value=d.venue;$("#fPart").value=d.participants;$("#fOther").value=d.fundOther||"";
  $("#fAllot").value=Number(d.allot)?nf.format(d.allot):"";$("#fPurpose").value=d.purpose;$("#fPartner").value=d.cohost.partner;$("#fEvTotal").value=Number(d.cohost.total)?nf.format(d.cohost.total):"";
  renderFunds();renderProgram();requestAnimationFrame(()=>fit($("#fPurpose")));}

/* program flow: optional segments, printed on page 2 */
function renderProgram(){const P=S.d.program;
  $("#pfList").innerHTML=P.map((p,i)=>`<li class="pf-row" data-i="${i}"><span class="pf-n" aria-hidden="true">${i+1}</span>
    <div class="field"><label class="sr" for="pfs${i}">Segment ${i+1}</label><input class="line-in" id="pfs${i}" data-pf="seg" autocomplete="off" placeholder="Segment" value="${esc(p.seg)}"></div>
    <div class="field"><label class="sr" for="pfd${i}">What happens in segment ${i+1}</label><textarea class="line-in pf-ta" id="pfd${i}" data-pf="desc" rows="1" placeholder="What happens">${esc(p.desc)}</textarea></div>
    <button class="icon-btn" type="button" data-pfdel aria-label="Remove segment ${i+1}"><svg class="i"><use href="#i-x"/></svg></button></li>`).join("");}
$("#pfAdd").addEventListener("click",()=>{S.d.program.push({seg:"",desc:""});renderProgram();$$("#pfList textarea").forEach(fit);saved();$(`#pfs${S.d.program.length-1}`).focus();});
$("#pfList").addEventListener("input",e=>{const r=e.target.closest(".pf-row");if(!r||!e.target.dataset.pf)return;if(e.target.tagName==="TEXTAREA")fit(e.target);S.d.program[r.dataset.i][e.target.dataset.pf]=e.target.value;saved();});
$("#pfList").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.dataset.pf==="desc"){e.preventDefault();$("#pfAdd").click();}});
$("#pfList").addEventListener("click",e=>{const b=e.target.closest("[data-pfdel]");if(!b)return;const i=Number(b.closest(".pf-row").dataset.i),was=S.d.program[i];
  S.d.program.splice(i,1);renderProgram();saved();const nx=$(`#pfs${Math.min(i,S.d.program.length-1)}`);(nx||$("#pfAdd")).focus();
  toast("Segment removed",()=>{S.d.program.splice(i,0,was);renderProgram();saved();});});

/* ================= global actions ================= */
const slug=s=>String(s||"draft").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
document.addEventListener("click",e=>{
  const ar=e.target.closest("[data-area]");if(ar){setArea(ar.dataset.area);return;}
  const gb=e.target.closest("[data-go]");if(gb){reviewGo(gb.dataset.go);return;}
  const to=e.target.closest("[data-to]");if(to&&!to.disabled){go(to.dataset.to,{force:to.classList.contains("stepbtn")||to.classList.contains("rstep")});return;}
  if(e.target.closest("[data-close-flow]")){if(AREA==="liq"&&L.step!=="tracker"){go("tracker");toast("Back to the tracker. Your report is saved.");}else toast(AREA==="liq"?"This is the Liquidation home.":"Closes to Budget requests. Your draft is saved.");return;}
  if(e.target.closest("#moreBtn")){togglePop(e.target.closest("#moreBtn"));return;}
  const a=e.target.closest("[data-act]");if(a){closePop();act(a.dataset.act);return;}
  if(e.target.closest("#submitBtn")){submit();return;}
  if(e.target.closest("#unsend")){D().submitted=null;D().stage=0;go("review",{force:true});toast("Unsent. It’s back to draft");return;}
  if(e.target.closest("#homeBtn")){toast("Home is designed next");return;}
  if(!e.target.closest("#morePop"))closePop();});
function act(k){
  if(k==="copy"){const link=location.href.split("?")[0].split("#")[0]+"#"+(AREA==="liq"?"liquidation-":"request-")+slug(D().d.name);
    try{navigator.clipboard&&navigator.clipboard.writeText(link).catch(function(){});}catch(_){}toast("Link copied. Paste it in your org’s group chat");}
  if(k==="pdf"||k==="word"){const n=k==="pdf"?"PDF":"Word file";toast(`Preparing ${n}…`);setTimeout(()=>toast(`${n} ready (sample)`),900);}
  if(k==="print")doPrint();}
/* print: only the document pages, Long bond (8.5 × 13 in) */
function doPrint(){const liq=AREA==="liq";
  $("#printArea").innerHTML=`<div class="paper"><div class="paper-in">${liq?lpaperHTML():paperHTML()}</div></div>`;
  $("#pageSize").textContent="@page{size:8.5in 13in;margin:0}";
  let framed=false;try{framed=window.self!==window.top;}catch(_){framed=true;}
  try{window.print();}catch(_){}
  if(framed)toast("This preview can’t open the print dialog. Print works in the deployed app.");}
function submit(){const liq=AREA==="liq";if(liq&&!L.req){go("review");return;}
  const need=liq?L.items.filter(i=>!lp(i)):S.items.filter(i=>!priced(i));
  if(need.length){$("#needBanner").hidden=false;toast(liq?"Add the missing price first":"Add the missing amount first");$("#needFix").focus();return;}
  const now=new Date();D().submitted=now;D().stage=1;
  setStamp(now);
  go("done",{noFocus:true});setTimeout(()=>$("#homeBtn")&&$("#homeBtn").focus(),60);}
$("#needFix").addEventListener("click",()=>{
  if(AREA==="liq"){go("edit");const it=L.items.find(i=>!lp(i));if(it)setTimeout(()=>toggleL(it.id),240);return;}
  go("edit");const it=S.items.find(i=>!priced(i));if(it)setTimeout(()=>toggle(it.id),240);});
$("#peekBtn").addEventListener("click",()=>openZoom());
$("#lpeek").addEventListener("click",()=>openZoom());
$("#pastBtn").addEventListener("click",()=>toast("Opens your Library to pick a past request (designed next)"));
$("#paperBtn").addEventListener("click",()=>{if(!wide()||AREA==="liq")openZoom();});
/* preview overlay: Close button, Esc, or a click outside the paper all leave it, and focus goes back */
let zoomFrom=null;
function openZoom(html){const liq=AREA==="liq";zoomFrom=document.activeElement;
  $("#zoomBox").classList.toggle("land",false);$("#paperZoom").innerHTML=typeof html==="string"?html:(liq?lpaperHTML():paperHTML());
  $("#zoomT").textContent=liq?"Liquidation report":"Budget request";$("#zoomPrint").hidden=false;
  $("#zoom").classList.add("open");$("#zoom .scroller").scrollTop=0;$("#zoomClose").focus();}
function closeZoom(silent){const z=$("#zoom");if(!z.classList.contains("open"))return;z.classList.remove("open");if(!silent&&zoomFrom&&zoomFrom.focus)zoomFrom.focus({preventScroll:true});}
$("#zoomClose").addEventListener("click",()=>closeZoom());
$("#zoomPrint").addEventListener("click",()=>doPrint());
$("#zoom").addEventListener("click",e=>{if(!e.target.closest(".paper")&&!e.target.closest(".zoom-bar"))closeZoom();});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){if($("#zoom").classList.contains("open"))closeZoom();closePop();}
  const ed="items";
  if(e.key==="/"&&D().step===ed&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();$(AREA==="liq"?"#lqa":"#qa").focus();}
  if((e.metaKey||e.ctrlKey)&&e.key==="Enter"&&D().step===ed){e.preventDefault();go("review");}});

/* popover scales from its trigger */
function togglePop(btn){const p=$("#morePop");if(p.classList.contains("open")){closePop();return;}const d=$("#device").getBoundingClientRect(),r=btn.getBoundingClientRect();
  p.style.left=Math.max(8,r.left-d.left)+"px";p.style.bottom=(d.bottom-r.top+8)+"px";p.style.setProperty("--origin","bottom left");p.classList.add("open");btn.setAttribute("aria-expanded","true");setTimeout(()=>p.querySelector("button").focus(),20);}
function closePop(){const p=$("#morePop");if(!p.classList.contains("open"))return;p.classList.remove("open");const b=$("#moreBtn");b&&b.setAttribute("aria-expanded","false");}

/* toast (glass, control layer) */
let tT;function toast(msg,undo){const t=$("#toast");$("#toastMsg").textContent=msg;const a=$("#toastAct");a.hidden=!undo;a.onclick=()=>{undo&&undo();t.classList.remove("show");};t.classList.add("show");clearTimeout(tT);tT=setTimeout(()=>t.classList.remove("show"),undo?6000:2600);}

/* [Rafa] phone: dock slides away while the keyboard is up; header compacts on scroll */
$("#app").addEventListener("focusin",e=>{if(touch()&&/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))$("#dockWrap").classList.add("away");});
$("#app").addEventListener("focusout",()=>setTimeout(()=>{if(!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))$("#dockWrap").classList.remove("away");},50));
$("#app").addEventListener("scroll",()=>$("#topbar").classList.toggle("compact",$("#app").scrollTop>24),{passive:true});

/* ================= [Kai] lens: real edge refraction on the dock, Chromium only ================= */
const LENS=!!window.chrome&&CSS.supports("backdrop-filter","blur(1px)");
function lensMap(w,h,r){const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d"),img=x.createImageData(w,h),band=Math.min(18,h/3);
  for(let j=0;j<h;j++)for(let i=0;i<w;i++){
    const qx=Math.max(Math.abs(i+.5-w/2)-(w/2-r),0),qy=Math.max(Math.abs(j+.5-h/2)-(h/2-r),0);
    const dIn=Math.min(Math.max(Math.abs(i+.5-w/2)-(w/2-r),Math.abs(j+.5-h/2)-(h/2-r)),0)+Math.hypot(qx,qy)-r; /* signed distance, <0 inside */
    const d=-dIn,k=d<band?Math.pow(1-d/band,2):0;let vx=(w/2-i),vy=(h/2-j);const L=Math.hypot(vx,vy)||1;vx/=L;vy/=L;
    const o=(j*w+i)*4;img.data[o]=128+vx*k*127;img.data[o+1]=128+vy*k*127;img.data[o+2]=128;img.data[o+3]=255;}
  x.putImageData(img,0,0);return c.toDataURL();}
function placeholders(){$("#qa").placeholder=wide()?"Write a line… e.g. Food 450 light refreshments for guests":"e.g. Food 450 refreshments";$("#lqa").placeholder=wide()?"Add a receipt line… e.g. 10 Cheezy Red @8.10":"e.g. 10 Cheezy Red @8.10";}
let lensKey="";function sizeLens(){if(!LENS)return;const el=$("#dock"),w=Math.round(el.offsetWidth),h=Math.round(el.offsetHeight);if(!w||!h)return;const k=w+"x"+h;if(k===lensKey)return;lensKey=k;
  const m=$("#lensMap");m.setAttribute("href",lensMap(w,h,18));m.setAttribute("width",w);m.setAttribute("height",h);}

/* ================= liquidation: model ================= */
const lp=i=>Number(i.price)>0;
const lTot=i=>(Number(i.units)||0)*(Number(i.price)||0);
const lActual=()=>L.items.reduce((a,b)=>a+lTot(b),0);
const lAllot=()=>L.budget.reduce((a,b)=>a+b.allot,0);
const lPending=()=>L.items.filter(i=>!lp(i)).length;
const reqTot=r=>r.items.reduce((a,[,,v])=>a+v,0);
const exc=v=>v<0?"("+nf.format(-v)+")":nf.format(v);
const dShort=d=>d?new Intl.DateTimeFormat("en-PH",{month:"short",day:"numeric",year:"numeric"}).format(new Date(d+"T00:00")):"—";
function lGroups(){const G=L.budget.map(b=>({id:b.id,name:b.name,note:b.note,allot:b.allot,rows:L.items.filter(i=>i.g===b.id)}));
  const x=L.items.filter(i=>i.g==="x");if(x.length)G.push({id:"x",name:"Not in the request",allot:0,extra:true,rows:x});return G;}
const gAct=g=>g.rows.reduce((a,b)=>a+lTot(b),0), gPen=g=>g.rows.some(i=>!lp(i));
/* the approved request's budget categories come in; receipts are added under them */
function pickReq(id){if(L.req&&L.req.id!==id)LRS[L.req.id]=snapL();const r=REQS.find(x=>x.id===id);L.req=r;L.open=null;
  L.budget=r.items.map(([name,note,allot],i)=>({id:"b"+i,name,note,allot}));
  const s=LRS[id];if(s){L.items=s.items;L.uid=s.uid;L.stage=s.stage;L.submitted=s.submitted;}else{L.items=buildFromTrack(r);L.uid=L.items.length;L.stage=0;L.submitted=null;}
  L.d={name:r.name,date:r.date,venue:r.venue,fund:r.fund,allot:String(reqTot(r))};L.shown=lActual();}
function clearReq(){L.req=null;L.budget=[];L.items=[];L.uid=0;L.open=null;L.submitted=null;L.d={name:"",date:"",venue:"",fund:"Org funds",allot:""};L.shown=0;}
function fillCID(){}
function guessG(name){const w=s=>(s.toLowerCase().match(/[a-z]{4,}/g)||[]);const nw=w(name);let best=null,sc=0;
  L.budget.forEach(b=>{const bw=w(b.name+" "+(b.note||""));const s=nw.filter(x=>bw.some(y=>y.startsWith(x.slice(0,4))||x.startsWith(y.slice(0,4)))).length;if(s>sc){sc=s;best=b.id;}});
  if(best)return best;
  /* "Food/Refreshments/Materials" covers food and supplies: match the item's kind to any part of the category name */
  const c=guessCat(name),covers=b=>b.name.split(/\s*\/\s*|\s+and\s+|,\s*/).some(part=>knownCat(part)===c||guessCat(part)===c);
  const hit=c!=="Other"&&L.budget.find(covers);if(hit)return hit.id;if(c!=="Other")return "x";
  const last=L.items[L.items.length-1];return last?last.g:(L.budget[0]?L.budget[0].id:"x");}
const gOpts=cur=>L.budget.map(b=>`<option value="${b.id}"${b.id===cur?" selected":""}>${esc(b.name)}</option>`).join("")+`<option value="x"${cur==="x"?" selected":""}>Not in the request</option>`;
/* receipt details carry over from the last line in the same category, until "New receipt" */
let newRcpt=false;
const lastRcpt=g=>{const r=[...L.items].reverse().find(i=>i.g===g&&(i.store||i.inv||i.ref));return r?{store:r.store,inv:r.inv,ref:r.ref}:null;};
const nextRef=()=>{const n=new Set(L.items.filter(i=>/^Receipt #\d+$/.test(i.ref)).map(i=>i.ref)).size;return `Receipt #${n+1}`;};

/* ================= liquidation: the semester tracker (the Drive sheet, inside the Hub) =================
   One entry feeds both: receipts typed into a report are the tracker's rows. */
const LRS={};
const snapL=()=>({items:JSON.parse(JSON.stringify(L.items)),budget:L.budget,uid:L.uid,stage:L.stage,submitted:L.submitted});
function buildFromTrack(r){return (TRACK_RC[r.id]||[]).map((x,k)=>{const[gi,name,store,inv,ref,u,p]=x;return{id:k+1,g:"b"+gi,name,units:u,unit:"",price:p,store,inv,ref};});}
function evData(id){const r=REQS.find(x=>x.id===id);
  if(L.req&&L.req.id===id)return{r,items:L.items,stage:L.stage};
  if(LRS[id])return{r,items:LRS[id].items,stage:LRS[id].stage};
  return{r,items:buildFromTrack(r),stage:0};}
const evAllot=r=>r.ok?reqTot(r):null;
const rcBlocks=items=>{const B=[];items.forEach(i=>{const k=[i.g,i.inv,i.ref,i.store].join("|"),b=B[B.length-1];if(b&&b.k===k)b.rows.push(i);else B.push({k,rows:[i]});});return B;};
const LR_LABEL=["LR draft","LR with the President","LR with the Adviser","LR with the CSC","LR approved"];
function trkRow(id){const{r,items,stage}=evData(id),A=evAllot(r),T=items.reduce((a,b)=>a+lTot(b),0),open=L.trk===id;
  const pend=items.some(i=>!lp(i)),df=A==null?null:A-T,blocks=rcBlocks(items),nRc=blocks.filter(b=>b.rows[0].inv||b.rows[0].ref||b.rows[0].store).length;
  const name=r.short||r.name;
  const lr=!items.length?'<span class="tag-st">Not started</span>':`<span class="tag-st s${stage}">${LR_LABEL[stage]}</span>`;
  const meta=A==null?'<span class="dim">No approved budget yet</span>':`${items.length} ${items.length===1?"line":"lines"} · ${nRc} ${nRc===1?"receipt":"receipts"} · ${lr}`;
  const ex=df==null?"—":pend?'<span class="need">pending</span>':(df<0?"("+nf.format(-df)+")":nf.format(df));
  const cats=r.items.length>1;
  const body=!items.length?`<p class="empty-note" style="padding-left:0">${A==null?"There’s no approved budget for this event in the tracker yet, so there’s nothing to liquidate.":"No receipts yet."}</p>`
    :blocks.map(b=>{const r0=b.rows[0],has=r0.inv||r0.ref||r0.store,cat=(r.items[Number(r0.g.slice(1))]||[])[0]||"Not in the request",bt=b.rows.reduce((a,x)=>a+lTot(x),0);
      return `<div class="rc"><div class="rc-h"><span class="rc-n"><b>${has?esc([r0.ref,r0.store].filter(Boolean).join(" · ")||"Receipt"):esc(cat)}</b>${has&&r0.inv?`<span>${esc(r0.inv)}</span>`:""}${has&&cats?`<span>${esc(cat)}</span>`:""}</span><span class="rc-t tab">${nf.format(bt)}</span></div>
        <ul class="rc-l">${b.rows.map(x=>`<li><span class="p">${esc(x.name)}</span><span class="q tab">${x.units} × ${lp(x)?nf.format(x.price):"—"}</span><span class="t tab">${lp(x)?nf.format(lTot(x)):'<span class="need">needs a price</span>'}</span></li>`).join("")}</ul></div>`;}).join("");
  const acts=A==null?"":`<div class="acts trk-acts"><button class="ghost sm" type="button" data-evprev><svg class="i"><use href="#i-zoom"/></svg>Preview report</button><button class="key sm" type="button" data-evopen>${items.length?"Open report":"Start report"}<svg class="i"><use href="#i-arrow"/></svg></button></div>`;
  return `<div class="item trk${df!=null&&!pend&&df<0?" over":""}" data-ev="${id}" data-open="${open}">
    <button class="rowbtn" type="button" aria-expanded="${open}" aria-controls="tv-${id}">
      <span class="c-ev"><span class="nm">${esc(name)}</span><span class="mt">${meta}</span>${A==null?"":`<span class="mt ph tab">${peso(T)} of ${peso(A)}</span>`}</span>
      <span class="c-n tab">${A==null?"—":nf.format(T)}</span><span class="c-n tab">${A==null?"—":nf.format(A)}</span><span class="c-amt">${ex}</span>
    </button>
    <div class="editor" id="tv-${id}"><div><div class="trk-ed">${body}${acts}</div></div></div></div>`;}
function semTotals(){let T=0,A=0,over=0;REQS.forEach(r=>{const a=evAllot(r);if(a==null)return;const t=evData(r.id).items.reduce((s,b)=>s+lTot(b),0);T+=t;A+=a;if(t>a)over++;});return{T,A,over,n:REQS.length};}
function renderTracker(){
  $("#trkRows").innerHTML=REQS.map(r=>trkRow(r.id)).join("");
  const{T,A}=semTotals(),df=A-T;
  $("#trkTot").innerHTML=`<span class="c-ev">Semester total</span><span class="c-n tab">${nf.format(T)}</span><span class="c-n tab">${nf.format(A)}</span><span class="c-amt"><span>${df<0?"("+nf.format(-df)+")":nf.format(df)}</span></span>`;}
function renderRailTrack(){const{T,A,n}=semTotals(),df=A-T;
  $("#railTrack").innerHTML=`<dt>Events</dt><dd>${n}</dd><dt>Allotted</dt><dd class="tab">${peso(A)}</dd><dt>Actual</dt><dd class="tab">${peso(T)}</dd><dt>${df<0?"Deficit":"Excess"}</dt><dd class="tab">${peso(Math.abs(df))}</dd>`;}
$("#trkRows").addEventListener("click",e=>{const row=e.target.closest(".item.trk");if(!row)return;const id=row.dataset.ev;
  if(e.target.closest(".rowbtn")){L.trk=L.trk===id?null:id;$$("#trkRows .item").forEach(x=>{const o=x.dataset.ev===L.trk;x.dataset.open=o;x.querySelector(".rowbtn").setAttribute("aria-expanded",o);});
    if(L.trk){const el=$(`#trkRows .item[data-ev="${L.trk}"]`);setTimeout(()=>el.scrollIntoView({block:"nearest",behavior:reduced()?"auto":"smooth"}),230);}return;}
  if(e.target.closest("[data-evopen]")){openEvent(id);return;}
  if(e.target.closest("[data-evprev]")){previewEvent(id);}});
function openEvent(id){if(!L.req||L.req.id!==id)pickReq(id);renderReqs();renderLedgerL();go("items");}
function previewEvent(id){const prev=L.req&&L.req.id;let html;
  if(prev===id)html=lpaperHTML();else{pickReq(id);html=lpaperHTML();if(prev)pickReq(prev);else{LRS[id]=snapL();clearReq();}}
  openZoom(html);}

/* ================= liquidation: request picker ================= */
function renderReqs(){$("#reqList").innerHTML=REQS.map(r=>{const on=!!L.req&&L.req.id===r.id,dis=!r.ok;
  return `<button class="reqrow" type="button" role="radio" aria-checked="${on}"${dis?' aria-disabled="true"':""} data-req="${r.id}"><span class="rd" aria-hidden="true"></span>
    <span><span class="nm">${esc(r.name)}</span><span class="mt">${[r.date?dShort(r.date):"",r.venue?esc(r.venue):"",r.ok?"Allotted "+peso(reqTot(r)):""].filter(Boolean).join(" · ")}</span>${dis?`<span class="why">${esc(r.why)}</span>`:""}</span>
    <span class="st">${on?"Selected":r.ok?(r.approved?"Approved "+r.approved:"Approved"):"Not yet"}</span></button>`;}).join("");}
$("#reqList").addEventListener("click",e=>{const b=e.target.closest("[data-req]");if(!b)return;const r=REQS.find(x=>x.id===b.dataset.req);
  if(!r.ok){toast(r.why);return;}
  if(L.req&&L.req.id===r.id)return;
  const had=L.items.some(lp),snap=JSON.stringify({...L,req:L.req&&L.req.id});
  pickReq(r.id);saved();renderReqs();renderLedgerL();renderMeta();renderDock();
  const nb=$(`[data-req="${r.id}"]`);nb&&nb.focus();
  toast(`Items from “${r.name}” are in`,had?()=>{Object.assign(L,JSON.parse(snap));L.req=REQS.find(x=>x.id===L.req)||null;saved();renderReqs();renderLedgerL();renderMeta();renderDock();}:undefined);});

/* ================= liquidation: ledger ================= */
const lU=it=>`${it.units}${it.unit?" "+esc(it.unit):""}`;
const lMt=it=>lp(it)?`${lU(it)} × ${peso(it.price)}`:`${lU(it)} · <span class="need">needs the price</span>`;
const lMx=it=>{const x=[it.store,it.inv,it.ref].filter(Boolean).map(esc).join(" · ");return x||'<span class="dim">no store or invoice yet</span>';};
function lRowHTML(it,inked){
  const open=L.open===it.id,pen=!lp(it),i=it.id;
  return `<div class="item${pen?" pencil":""}${inked?" inked":""}" data-id="${i}" data-open="${open}">
    <button class="rowbtn" type="button" aria-expanded="${open}" aria-controls="led${i}">
      <span class="c-part"><span class="nm">${esc(it.name)}</span><span class="mt">${lMt(it)}</span><span class="mx">${lMx(it)}</span></span>
      <span class="c-qty tab">${it.units} ${esc(it.unit)}</span><span class="c-cost tab">${pen?'<span class="need">needs the price</span>':nf.format(it.price)}</span>
      <span class="c-amt" data-am>${pen?"—":nf.format(lTot(it))}</span>
    </button>
    <div class="editor" id="led${i}"><div><div class="ed">
      <div class="field"><label for="ln${i}">Particulars</label><textarea class="line-in" rows="1" id="ln${i}" data-f="name">${esc(it.name)}</textarea></div>
      <div class="three">
        <div class="field"><label for="lu${i}">Units</label><div class="stepper"><button type="button" data-q="-1" aria-label="One less">−</button><input id="lu${i}" data-f="units" inputmode="numeric" value="${it.units}"><button type="button" data-q="1" aria-label="One more">+</button></div></div>
        <div class="field"><label for="lt${i}">Unit</label><input class="line-in" id="lt${i}" data-f="unit" list="units" autocomplete="off" value="${esc(it.unit)}"></div>
        <div class="field money-f"><label for="lc${i}">Price</label><div class="money"><span class="peso" aria-hidden="true">₱</span><input class="line-in" id="lc${i}" data-f="price" inputmode="decimal" autocomplete="off" placeholder="0.00" value="${pen?"":nf.format(it.price)}"></div></div>
      </div>
      <div class="tprice">Total price <b data-tp>${peso(lTot(it))}</b></div>
      <div class="trio">
        <div class="field wide-f"><label for="ls${i}">Brand / store</label><input class="line-in" id="ls${i}" data-f="store" autocomplete="off" value="${esc(it.store)}"></div>
        <div class="field"><label for="li${i}">Invoice number</label><input class="line-in" id="li${i}" data-f="inv" autocomplete="off" value="${esc(it.inv)}"></div>
        <div class="field"><label for="lr${i}">Reference</label><input class="line-in" id="lr${i}" data-f="ref" autocomplete="off" value="${esc(it.ref)}"></div>
      </div>
      <div class="field"><label for="lk${i}">Charged to</label><select class="line-in" id="lk${i}" data-f="g">${gOpts(it.g)}</select></div>
      <div class="acts"><button class="textbtn danger" type="button" data-remove><svg class="i"><use href="#i-trash"/></svg>Remove</button><button class="ghost sm" type="button" data-done>Done</button></div>
    </div></div></div></div>`;
}
function renderLedgerL(inkedId){
  const G=lGroups();$("#lempty").hidden=!!L.req;
  $("#lgroups").innerHTML=G.map(g=>{const a=gAct(g),pen=gPen(g),df=g.allot-a;
    const head=`<div class="lrow gname" role="presentation"><span class="c-part">${esc(g.name)}</span><span class="c-qty"></span><span class="c-cost"></span><span class="c-amt"><small>Allotted</small>${g.extra?"—":nf.format(g.allot)}</span></div>`;
    const body=g.rows.length?g.rows.map(it=>lRowHTML(it,it.id===inkedId)).join(""):`<p class="gempty">No receipt yet. Write one above and charge it to this item.</p>`;
    const act=`<div class="lrow sub"><span class="c-part">Actual expense</span><span class="c-qty"></span><span class="c-cost"></span><span class="c-amt"><span data-gact="${g.id}">${nf.format(a)}</span></span></div>`;
    const diff=`<div class="lrow diff${!pen&&df<0?" def":""}" data-gd="${g.id}"><span class="c-part">Excess (Deficit)</span><span class="c-qty"></span><span class="c-cost"></span><span class="c-amt"><span data-gdiff="${g.id}">${pen?'<span class="need">pending</span>':exc(df)}</span></span></div>`;
    return head+body+act+diff;}).join("");
  $$("#lgroups textarea").forEach(fit);
}
function refreshG(gid){const g=lGroups().find(x=>x.id===gid);if(!g)return;const a=gAct(g),pen=gPen(g),df=g.allot-a;
  const ea=$(`[data-gact="${gid}"]`),ed=$(`[data-gdiff="${gid}"]`),row=$(`[data-gd="${gid}"]`);if(!ea||!ed)return;
  ea.textContent=nf.format(a);ed.innerHTML=pen?'<span class="need">pending</span>':exc(df);row.classList.toggle("def",!pen&&df<0);}
function updL(li,it){const pen=!lp(it);li.classList.toggle("pencil",pen);li.querySelector(".nm").textContent=it.name||"Untitled receipt";
  li.querySelector(".mt").innerHTML=lMt(it);li.querySelector(".mx").innerHTML=lMx(it);
  li.querySelector(".c-qty").textContent=`${it.units} ${it.unit}`;li.querySelector(".c-cost").innerHTML=pen?'<span class="need">needs the price</span>':nf.format(it.price);
  li.querySelector("[data-am]").textContent=pen?"—":nf.format(lTot(it));
  const tp=li.querySelector("[data-tp]");if(tp)tp.textContent=peso(lTot(it));
  refreshG(it.g);saved();renderDock();}
function toggleL(id,force){const was=L.open===id;L.open=(force===false||was)?null:id;
  $$("#lgroups .item").forEach(li=>{const o=Number(li.dataset.id)===L.open;li.dataset.open=o;li.querySelector(".rowbtn").setAttribute("aria-expanded",o);});
  if(L.open){const li=$(`#lgroups .item[data-id="${L.open}"]`),it=L.items.find(i=>i.id===L.open);li.querySelectorAll("textarea").forEach(fit);
    setTimeout(()=>{(lp(it)?li.querySelector('[data-f="name"]'):li.querySelector('[data-f="price"]')).focus({preventScroll:true});li.scrollIntoView({block:"nearest",behavior:reduced()?"auto":"smooth"});},60);}
  else if(was){const b=$(`#lgroups .item[data-id="${id}"] .rowbtn`);b&&b.focus({preventScroll:true});}}
let lastDelL;function removeL(id){const i=L.items.findIndex(x=>x.id===id);lastDelL={it:L.items[i],i};L.items.splice(i,1);L.open=null;saved();renderLedgerL();renderDock();
  toast(`Removed “${lastDelL.it.name}”`,()=>{L.items.splice(lastDelL.i,0,lastDelL.it);saved();renderLedgerL(lastDelL.it.id);renderDock();});}
$("#lgroups").addEventListener("click",e=>{const li=e.target.closest(".item");if(!li)return;const id=Number(li.dataset.id),it=L.items.find(i=>i.id===id);
  if(e.target.closest(".rowbtn")){toggleL(id);return;}
  const q=e.target.closest("[data-q]");if(q){it.units=Math.max(1,(Number(it.units)||0)+Number(q.dataset.q));li.querySelector('[data-f="units"]').value=it.units;updL(li,it);return;}
  if(e.target.closest("[data-done]")){toggleL(id,false);return;}
  if(e.target.closest("[data-remove]"))removeL(id);});
$("#lgroups").addEventListener("input",e=>{const f=e.target.dataset.f;if(!f||f==="g")return;const li=e.target.closest(".item"),it=L.items.find(i=>i.id==li.dataset.id);
  let v=e.target.value;if(f==="units"||f==="price"){v=v.replace(/[^\d.]/g,"");it[f]=v===""?"":Number(v);}else it[f]=v;if(e.target.tagName==="TEXTAREA")fit(e.target);updL(li,it);});
$("#lgroups").addEventListener("change",e=>{const f=e.target.dataset.f;const li=e.target.closest(".item");if(!li)return;const it=L.items.find(i=>i.id==li.dataset.id);
  if(f==="g"){it.g=e.target.value;saved();renderLedgerL();renderDock();const s=$(`#lgroups .item[data-id="${it.id}"] [data-f="g"]`);s&&s.focus();return;}
  if(f==="price"&&e.target.value){const v=Number(e.target.value.replace(/[^\d.]/g,""));if(v>0)e.target.value=nf.format(v);}});

/* quick add for receipts: same sentence parser, charged to the best-matching budget item */
function renderReadsL(){const p=parse($("#lqa").value),r=$("#lreads");const g=k=>$(`#lentry [data-lg="${k}"]`);
  if(!p||!L.req){r.hidden=true;["qty","cost","amt"].forEach(k=>g(k).textContent="");return;}
  r.hidden=false;g("qty").textContent=`${p.qty}`;const has=Number(p.cost)>0;g("cost").textContent=has?nf.format(p.cost):"";g("amt").textContent=has?nf.format(p.qty*p.cost):"";
  if(p.incomplete){r.innerHTML=`Reads as <b>${p.qty}</b> of… <span class="warn">add what it is</span>`;return;}
  const price=has?(p.how==="total"&&p.qty>1?`<b>${peso(p.tot)}</b> total → <b>${peso(p.cost)}</b> each`:`<b>${peso(p.cost)}</b> each`):`<span class="warn">no price yet, you can add it later</span>`;
  const sel=$("#lqaG"),gid=sel&&r.dataset.for===p.name?sel.value:guessG(p.name);r.dataset.for=p.name;
  const rc=newRcpt?null:lastRcpt(gid);
  const on=rc?`on <b>${esc(rc.ref||rc.inv||rc.store)}</b>${rc.store&&rc.ref?" · "+esc(rc.store):""} <button class="textbtn" type="button" id="lNewR">New receipt</button>`:`<span class="dim">new receipt</span>`;
  r.innerHTML=`Reads as <b>${p.qty}</b> · <b>${esc(p.name)}</b> · ${price} · ${on}
    <span class="grow"></span><label class="sr" for="lqaG">Budget category</label><select class="cat-select" id="lqaG" style="max-width:220px">${gOpts(gid)}</select>
    <button class="ghost sm" type="submit" form="lentry">Add</button>`;}
$("#lqa").addEventListener("input",renderReadsL);
$("#lqa").addEventListener("keydown",e=>{if(e.key==="Escape"){$("#lqa").value="";newRcpt=false;renderReadsL();}});
$("#lreads").addEventListener("change",e=>{if(e.target.id==="lqaG")renderReadsL();});
$("#lreads").addEventListener("click",e=>{if(e.target.id==="lNewR"){newRcpt=true;renderReadsL();$("#lqa").focus();}});
$("#lentry").addEventListener("submit",e=>{e.preventDefault();
  if(!L.req){toast("Choose an approved request first");return;}
  const p=parse($("#lqa").value);if(!p){$("#lqa").focus();return;}
  if(p.incomplete){toast("Add what it is, like “10 Cheezy Red @8.10”");return;}
  const sel=$("#lqaG"),g=sel?sel.value:guessG(p.name),rc=newRcpt?null:lastRcpt(g);
  const it={id:++L.uid,g,name:p.name,units:p.qty,unit:"",price:p.cost,store:rc?rc.store:"",inv:rc?rc.inv:"",ref:rc?rc.ref:(g==="x"||/prize/i.test((L.budget.find(b=>b.id===g)||{}).name||"")?"":nextRef())};
  L.items.push(it);newRcpt=false;saved();renderLedgerL(it.id);renderDock();
  $("#lqa").value="";renderReadsL();$("#lqa").focus();
  const el=$(`#lgroups .item[data-id="${it.id}"]`);el&&el.scrollIntoView({block:"nearest",behavior:reduced()?"auto":"smooth"});
  if(!lp(it))toast("Added in pencil. It still needs a price");else if(!rc&&it.ref)toast(`Started ${it.ref}. Add its store and invoice number`);});

/* ================= liquidation: page 1 letter, page 2 the table grouped by budget category ================= */
function lpaperHTML(){const G=lGroups(),d=L.d,A=lAllot(),T=lActual(),df=A-T;
  const act=d.name?`<b><i>${esc(d.name)}</i></b>`:`<span class="p-need">activity name</span>`;
  const p1=page(`${addressee("Liquidation Report")}
    <p class="lt-p">On behalf of the ${esc(ORG.name)}, we present the ${act} liquidation report that took place on <b>${d.date?dDoc(d.date):'<span class="p-need">date</span>'}</b>, with a total amount of <b>${wordsCaps(T)} (${pm(T)})</b> to your esteemed office.</p>
    <p class="lt-p">The liquidation table, including the corresponding receipts, has been appropriately enclosed on the succeeding page.</p>
    <p class="lt-thanks">Thank you very much!</p>
    <div class="sgs two lab2"><div><p class="lt-sub">Prepared by:</p>${sig(ORG.president,"President")}</div><div><p class="lt-sub">Endorsed by:</p>${sig(ORG.treasurer,"Treasurer")}</div></div>
    <p class="lt-sub">Noted by:</p>
    <div class="sgs">${sig(ORG.adviser,"Faculty Adviser")}</div>`);
  let rows="";
  G.forEach(g=>{const a=gAct(g),pen=gPen(g),gd=g.allot-a,n=Math.max(g.rows.length,1);
    rows+=`<tr class="lq-cat"><td colspan="6">${esc(g.name)}</td><td></td><td></td><td></td><td></td></tr>`;
    const sums=`<td class="c blu" rowspan="${n}">${pm(a)}</td><td class="c blu" rowspan="${n}">${g.extra?"—":pm(g.allot)}</td><td class="c blu${!pen&&gd<0?" p-def":""}" rowspan="${n}">${pen?'<span class="p-need">pending</span>':exc2(gd)}</td>`;
    if(!g.rows.length){rows+=`<tr><td colspan="7" class="p-empty">No receipt yet</td>${sums}</tr>`;return;}
    /* consecutive lines with the same invoice, reference and store are one receipt */
    const blocks=[];g.rows.forEach(r=>{const k=[r.inv,r.ref,r.store].join("|");const b=blocks[blocks.length-1];if(b&&b.k===k)b.rows.push(r);else blocks.push({k,rows:[r]});});
    let first=true;
    blocks.forEach(b=>{const bt=b.rows.reduce((s,r)=>s+lTot(r),0),bn=b.rows.length,r0=b.rows[0];
      const noR=!(r0.inv||r0.ref||r0.store);
      b.rows.forEach((r,k)=>{rows+=`<tr>${k===0?(noR?`<td colspan="3" rowspan="${bn}"></td>`:`<td class="c" rowspan="${bn}"><b>${esc(r0.inv)}</b></td><td class="c" rowspan="${bn}"><b>${esc(r0.ref)}</b></td><td class="c" rowspan="${bn}"><b>${esc(r0.store)}</b></td>`):""}
        <td class="c">${esc(r.name)}</td><td class="c">${lp(r)?pm(r.price):'<span class="p-need">needs price</span>'}</td><td class="c">${r.units}</td>
        ${k===0?`<td class="c" rowspan="${bn}"><b>${pm(bt)}</b></td>`:""}${first?sums:""}</tr>`;first=false;});});});
  if(!L.req)rows=`<tr><td colspan="10" class="p-empty">Choose an approved request. Receipts you add appear here</td></tr>`;
  const th=["Invoice Number","Reference","Brand / Store","Particulars","Price","Units","Total Price","Actual Expense","Allotted Budget","Excess (Deficit)"];
  const p2=page(`<h3 class="pt">Liquidation Report</h3>
    <table class="pt-table lq-t"><thead><tr>${th.map(t=>`<th>${t}</th>`).join("")}</tr></thead><tbody>${rows}
    ${L.req?`<tr class="pt-tot"><td colspan="7">TOTAL</td><td class="c">${pm(T)}</td><td class="c">${pm(A)}</td><td class="c">${exc2(df)}</td></tr>`:""}</tbody></table>`,"wide");
  return p1+p2;}
const exc2=v=>v<0?"("+pm(-v)+")":pm(v);

/* start over (liquidation): clears the picked request and every receipt, only after confirmation */
$("#lresetBtn").addEventListener("click",()=>{const n=L.items.length;
  $("#lrcD").textContent=L.req?`The picked request and ${n===1?"1 receipt line":n+" receipt lines"} will be removed.`:"Nothing is picked yet.";
  $("#lresetConfirm").hidden=false;$("#lrcNo").focus();});
$("#lrcNo").addEventListener("click",()=>{$("#lresetConfirm").hidden=true;$("#lresetBtn").focus();});
$("#lresetConfirm").addEventListener("keydown",e=>{if(e.key==="Escape"){e.stopPropagation();$("#lrcNo").click();}});
$("#lrcYes").addEventListener("click",()=>{const snap=JSON.stringify({...L,req:L.req&&L.req.id});
  if(L.req)LRS[L.req.id]={items:[],budget:L.budget,uid:0,stage:0,submitted:null};clearReq();L.stage=0;L.shown=0;$("#lresetConfirm").hidden=true;$("#lqa").value="";renderReadsL();renderReqs();renderLedgerL();saved();go("details",{noFocus:true,force:true,instant:true});
  toast("Report cleared",()=>{Object.assign(L,JSON.parse(snap));L.req=REQS.find(x=>x.id===L.req)||null;saved();renderReqs();renderLedgerL();go("details",{noFocus:true,force:true,instant:true});});});

/* ================= area switch: Budget Requests | Liquidation ================= */
function setArea(a,o={}){if(a===AREA&&!o.force)return;AREA=a;
  $$("[data-area]").forEach(b=>{b.removeAttribute("aria-current");if(b.dataset.area===a)b.setAttribute("aria-current","page");});
  $$("[data-state]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.state===D().mode));
  S.offline=D().mode==="offline";setSave(S.offline?"offline":"saved");
  closePop();closeZoom(true);$("#resetConfirm").hidden=true;$("#lresetConfirm").hidden=true;
  go(D().step,{instant:true,noFocus:true,force:true});}

/* ================= saving on this device (front-end draft; the server comes later) ================= */
const SAVE_KEY="sectreas:treasurer:v1";let BOOTED=false;
function setStamp(d){$("#stampDate").textContent=new Intl.DateTimeFormat("en-PH",{month:"short",day:"numeric",year:"numeric"}).format(d).toUpperCase().replace(",","")+" · "+new Intl.DateTimeFormat("en-PH",{hour:"numeric",minute:"2-digit"}).format(d).toUpperCase();}
function persist(){if(!BOOTED)return;
  const lrs={...LRS};if(L.req)lrs[L.req.id]=snapL();
  const data={v:1,at:Date.now(),area:AREA,
    S:{items:S.items,uid:S.uid,step:S.step,stage:S.stage,submitted:S.submitted,d:S.d},
    L:{step:L.step,req:L.req&&L.req.id},LRS:lrs};
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(data));}catch(e){}}
function loadSaved(){try{const d=JSON.parse(localStorage.getItem(SAVE_KEY)||"null");return d&&d.v===1?d:null;}catch(e){return null;}}
function wipeSaved(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}
const toDate=v=>v?new Date(v):null;
function restore(d){
  Object.assign(S,{mode:"filled",open:null,offline:!navigator.onLine,...d.S,submitted:toDate(d.S.submitted)});S.shown=total();syncDetails();renderLedger();
  clearReq();for(const k in LRS)delete LRS[k];
  for(const [k,v] of Object.entries(d.LRS||{}))LRS[k]={...v,submitted:toDate(v.submitted)};
  if(d.L.req)pickReq(d.L.req);L.step=d.L.step||"tracker";L.shown=lActual();renderReqs();renderLedgerL();
  setArea(d.area==="liq"?"liq":"req",{force:true});
  const sub=D().submitted;if(sub)setStamp(sub);
  const st=D().step||"details";go(st,{instant:true,noFocus:true,force:true});}
addEventListener("pagehide",persist);
addEventListener("offline",()=>{S.offline=true;setSave("offline");toast("You’re offline. Changes save on this device and sync later");});
addEventListener("online",()=>{S.offline=false;saved();});

/* ================= sample data (first run only; ?state= and ?reset in the URL for testing) ================= */
function setState(m){S.mode=m;S.uid=0;S.open=null;S.offline=m==="offline";S.submitted=null;S.stage=0;
  if(m==="empty"){S.items=[];S.d=blankD();}
  else{S.items=SAMPLE.map(s=>({id:++S.uid,...s}));
    S.d={...blankD(),name:"ACM-AUF Hackathon 2026",date:"2026-11-21",venue:"Computer Laboratory",participants:"AUF CCS Students",allot:m==="over"?"10000":"15000",
      purpose:SAMPLE_PURPOSE,program:SAMPLE_PROGRAM.map(p=>({...p}))};
    if(m==="attn")S.items.push({id:++S.uid,cat:"Transportation",note:"Van rental for the guest judges",amt:""});}
  S.shown=total();syncDetails();renderLedger();saved();$("#resetConfirm").hidden=true;$$("[data-state]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.state===m));}
function setStateL(m){L.mode=m;if(L.req)LRS[L.req.id]=snapL();L.req=null;delete LRS.cid;L.stage=0;L.submitted=null;L.step=L.step||"edit";S.offline=m==="offline";newRcpt=false;
  if(m==="empty"){clearReq();}
  else{pickReq("cid");fillCID();
    if(m==="attn")L.items[L.items.length-1].price="";
    if(m==="over"){L.items.find(i=>i.name==="1st Place").price=650;
      L.items.push({id:++L.uid,g:"x",name:"Masking tape, 48 mm",units:2,unit:"",price:45,store:"Calix",inv:"5822990",ref:"Receipt #3"});}}
  L.shown=lActual();renderReqs();renderLedgerL();saved();$$("[data-state]").forEach(b=>b.setAttribute("aria-pressed",b.dataset.state===m));}
function reviewGo(k){const liq=AREA==="liq",Dd=D();
  if(k==="done"||k==="approved"){const bad=liq?(!L.req||L.items.some(i=>!lp(i))):(!S.items.length||S.items.some(i=>!priced(i)));
    if(bad)(liq?setStateL:setState)("filled");
    if(Dd.step!=="done")submit();Dd.stage=k==="approved"?4:1;go("done",{noFocus:true,instant:true});return;}
  go(k,{force:true,noFocus:true});}
$$("[data-state]").forEach(b=>b.addEventListener("click",()=>{(AREA==="liq"?setStateL:setState)(b.dataset.state);go(D().step==="done"?"review":D().step,{instant:true,noFocus:true,force:true});if(b.dataset.state==="offline")toast("You’re offline. Changes save on this device and sync later");}));
$$("[data-view]").forEach(b=>b.addEventListener("click",()=>{document.body.classList.toggle("phone",b.dataset.view==="phone");$$("[data-view]").forEach(x=>x.setAttribute("aria-pressed",x===b));}));
$$("[data-glass]").forEach(b=>b.addEventListener("click",()=>{document.body.classList.toggle("solid",b.dataset.glass==="solid");$$("[data-glass]").forEach(x=>x.setAttribute("aria-pressed",x===b));renderDock();}));
new ResizeObserver(()=>{const d=$("#device");d.classList.toggle("tall",d.clientHeight>d.clientWidth*1.1);sizeLens();placeholders();}).observe($("#device"));

const qs=new URLSearchParams(location.search);
if(qs.get("view")==="phone"){document.body.classList.add("phone");$$("[data-view]").forEach(x=>x.setAttribute("aria-pressed",x.dataset.view==="phone"));}
if(qs.get("glass")==="solid")document.body.classList.add("solid");
if(qs.has("reset")){wipeSaved();qs.delete("reset");history.replaceState(null,"",location.pathname+(qs.size?"?"+qs:"")+location.hash);}
const snap0=qs.get("state")?null:loadSaved();
if(snap0){restore(snap0);}
else{
const st0=qs.get("state")||"filled";setState(st0);setStateL(st0);
const a0=(qs.get("area")==="liq"||/^#liquidation/.test(location.hash))?"liq":"req";
setArea(a0,{force:true});
const st=qs.get("step")||(a0==="liq"?"tracker":"details");
if(st==="done"||st==="approved")reviewGo(st);else go(st,{instant:true,noFocus:true,force:true});}
BOOTED=true;persist();
if(qs.get("type")){(AREA==="liq"?$("#lqa"):$("#qa")).value=qs.get("type");(AREA==="liq"?renderReadsL:renderReads)();}
