/* DEV.D.A.J extras — 29 fonctionnalités. Remplis CONFIG ci-dessous. */
(()=>{'use strict';
const CONFIG={
 CV_URL:'',                       // ex: 'assets/cv.pdf' (sinon: impression PDF de la page)
 TESTIMONIALS:[],                 // [{nom:'Awa',texte:'…',projet:'Site'}]
 ARTICLES:[],                     // [{titre:'…',date:'2026-10-29',resume:'…',url:'…'}]
 TIMELINE:[],                     // [{date:'2026',titre:'…',texte:'…'}]
 SKILLS:{'Python':80,'JavaScript':75,'HTML / CSS':85,'Firebase':70}, // % indicatifs, à ajuster
 PRICES:{'Site vitrine':[50000,15000],'Application mobile':[200000,40000],'API / outil':[100000,25000]}, // [base, par écran/page] FCFA — À AJUSTER
 FAQ:[['Comment passer commande ?','Choisis une idée dans « Commander » : ta demande arrive sur WhatsApp, déjà écrite.'],['Y a-t-il un devis ?','Oui, chaque projet fait l\'objet d\'un devis.'],['Quels délais ?','Ils dépendent du projet ; je te les précise dans ma proposition.'],['Comment payer ?','Mobile money (Wave, Orange, MTN, Moov), à convenir sur WhatsApp.']],
 LIRA_URL:'lira-demo/', COLLECTION_ORDERS:'commandes', COLLECTION_GUEST:'livre_or'
};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const el=(t,a={},...k)=>{const e=document.createElement(t);for(const[x,v]of Object.entries(a))x==='class'?e.className=v:x.startsWith('on')?e.addEventListener(x.slice(2),v):e.setAttribute(x,v);k.flat(Infinity).forEach(c=>e.append(c));return e};
const wa=$('a[href*="wa.me"],a[href*="whatsapp"]');
const waLink=t=>{try{const u=new URL(wa.href);u.searchParams.set('text',t);return u.href}catch{return '#'}};
const db=()=>{try{return window.firebase&&firebase.apps.length?firebase.firestore():null}catch{return null}};
let lang=localStorage.getItem('lang')||'fr';

/* CSS */
document.head.append(el('style',{},`
.rv{opacity:0;transform:translateY(18px);transition:.6s}.rv.in{opacity:1;transform:none}
#prog{position:fixed;top:0;left:0;height:3px;width:0;background:var(--green);z-index:50}
#dock{position:fixed;left:14px;bottom:70px;z-index:30;display:none;flex-direction:column;gap:8px}#dock.o{display:flex}#dt{position:fixed;left:14px;bottom:18px;z-index:31;width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:var(--surface);cursor:pointer}
#dock button,#top{width:42px;height:42px;border-radius:50%;border:1px solid var(--line);background:var(--surface);color:var(--text);cursor:pointer}
#top{position:fixed;right:18px;bottom:150px;z-index:30;display:none}
.mod{position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:60;display:grid;place-items:center;padding:16px}
.mod>div{background:var(--surface);border:1px solid var(--line);border-radius:var(--radius);padding:20px;max-width:560px;width:100%;max-height:86vh;overflow:auto}
.mod input,.mod select,.mod textarea,.xs input,.xs select,.xs textarea,#tin{width:100%;margin:6px 0;padding:10px;border-radius:10px;border:1px solid var(--line);background:var(--surface-2);color:var(--text)}
.chips{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 14px}.chips button{padding:6px 12px;border-radius:99px;border:1px solid var(--line);background:var(--surface);color:var(--text);cursor:pointer}.chips .on{background:var(--green);color:#062315}
.xs .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}
.bar{height:8px;border-radius:9px;background:var(--surface-2);overflow:hidden}.bar i{display:block;height:100%;background:var(--green)}
details{border-bottom:1px solid var(--line);padding:10px 0}summary{cursor:pointer;font-weight:700}
#term{margin-top:14px;font:.85rem ui-monospace,monospace;color:var(--muted)}#tout{white-space:pre-wrap;max-height:130px;overflow:auto}
@media print{#dock,#top,header,.whatsapp-float,#prog{display:none!important}}`));

/* 17 reveal, 21 progress/top, 23 lazy */
const io=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&x.target.classList.add('in')),{threshold:.1});
$$('section .card,section h2').forEach(e=>{e.classList.add('rv');io.observe(e)});
$$('img').forEach(i=>i.loading='lazy');
const prog=el('div',{id:'prog'});document.body.append(prog);
addEventListener('scroll',()=>{const h=document.documentElement;prog.style.width=scrollY/(h.scrollHeight-innerHeight)*100+'%'},{passive:true});

/* 15 thème mémorisé */
if(localStorage.getItem('theme')==='light')document.body.classList.add('light');
$('#themeToggle')?.addEventListener('click',()=>setTimeout(()=>localStorage.setItem('theme',document.body.classList.contains('light')?'light':'dark'),0));

/* modal */
const modal=(title,...c)=>{const m=el('div',{class:'mod',onclick:e=>e.target===m&&m.remove()},el('div',{},el('button',{class:'btn',onclick:()=>m.remove(),style:'float:right'},'✕'),el('h3',{},title),c));document.body.append(m);return m};
const field=(ph,t='input')=>el(t,{placeholder:ph});
const send=t=>open(waLink(t),'_blank','noopener');

/* 1+19 carrousel : détails + filtres */
const car=$('#carousel');
if(car){const cats={Tous:'','Mobile':'mobile|app','Web':'web|site','IA':'ia|lira|intelligence','API':'api'};
 const chips=el('div',{class:'chips'});Object.entries(cats).forEach(([n,r],i)=>chips.append(el('button',{class:i?'':'on',onclick:e=>{$$('button',chips).forEach(b=>b.classList.remove('on'));e.target.classList.add('on');[...car.children].forEach(c=>c.style.display=!r||new RegExp(r,'i').test(c.textContent)?'':'none')}},n)));
 car.before(chips);
 car.addEventListener('click',e=>{const c=e.target.closest('#carousel>*');if(!c||e.target.closest('a,button'))return;const t=c.querySelector('h3,h4')?.textContent||'Projet';modal(t,el('p',{},c.textContent.trim()),el('a',{class:'btn primary',href:waLink('Bonjour, je suis intéressé par : '+t),target:'_blank'},'Commander ce projet ↗'))})}

/* sections extras */
const wrap=el('section',{class:'xs',id:'extras'});const ct=el('div',{class:'container'});wrap.append(ct);($('#contact')||document.body).before(wrap);
const card=(t,...c)=>el('div',{class:'card rv in'},el('h3',{},t),c);
const sec=(t,...c)=>{ct.append(el('h2',{},t),...c)};
/* 5 compteurs */
const cnt=[['Projets',car?.children.length||0],['Technologies',$$('#competences .card').length],['Services',$$('#services .card').length]];
sec('En chiffres',el('div',{class:'g'},cnt.map(([l,n])=>{const b=el('b',{style:'font-size:2rem'},'0');const o=new IntersectionObserver(([x])=>{if(!x.isIntersecting)return;o.disconnect();let i=0;const t=setInterval(()=>{b.textContent=Math.min(++i,n);i>=n&&clearInterval(t)},60)});o.observe(b);return card(l,b)})));
/* 4 timeline, 2 témoignages, 3 blog */
if(CONFIG.TIMELINE.length)sec('Mon parcours',el('div',{class:'g'},CONFIG.TIMELINE.map(t=>card(t.date+' — '+t.titre,el('p',{},t.texte)))));
if(CONFIG.TESTIMONIALS.length)sec('Ils m\'ont fait confiance',el('div',{class:'g'},CONFIG.TESTIMONIALS.map(t=>card(t.nom,el('p',{},'« '+t.texte+' »'),el('small',{},t.projet||'')))));
if(CONFIG.ARTICLES.length)sec('Actualités',el('div',{class:'g'},CONFIG.ARTICLES.map(a=>card(a.titre,el('small',{},a.date),el('p',{},a.resume),a.url?el('a',{class:'btn',href:a.url},'Lire'):''))));
/* 6 barres */
const sk=Object.entries(CONFIG.SKILLS);if(sk.length)sec('Niveaux (indicatifs)',card('Compétences',sk.map(([n,v])=>el('div',{},el('small',{},n+' — '+v+'%'),el('div',{class:'bar'},el('i',{style:'width:'+v+'%'}))))));
/* 8 FAQ */
sec('FAQ',card('Questions fréquentes',CONFIG.FAQ.map(([q,a])=>el('details',{},el('summary',{},q),el('p',{},a)))));
/* 10 estimateur + 14 paiement */
const sel=el('select',{},Object.keys(CONFIG.PRICES).map(k=>el('option',{},k))),rg=el('input',{type:'range',min:1,max:20,value:3}),out=el('b',{}),pay=el('select',{},['Wave','Orange Money','MTN MoMo','Moov Money'].map(p=>el('option',{},p)));
const calc=()=>{const[b,p]=CONFIG.PRICES[sel.value];out.textContent=(b+p*rg.value).toLocaleString('fr-FR')+' FCFA ('+rg.value+' écrans/pages)'};[sel,rg].forEach(x=>x.oninput=calc);calc();
sec('Estimer mon projet',card('Estimation indicative — le devis final fait foi',sel,rg,out,el('p',{},'Paiement souhaité :'),pay,el('button',{class:'btn primary',onclick:()=>send(`Bonjour, estimation : ${sel.value}, ${rg.value} écrans, ~${out.textContent}. Paiement par ${pay.value}.`)},'Envoyer sur WhatsApp ↗')));
/* 12 réservation */
const day=el('input',{type:'date'}),hr=el('select',{},['09:00','11:00','14:00','16:00'].map(h=>el('option',{},h)));
sec('Réserver un appel',card('Choisis un créneau',day,hr,el('button',{class:'btn',onclick:()=>day.value&&send(`Bonjour, je souhaite un appel le ${day.value} à ${hr.value}.`)},'Demander ce créneau ↗')));
/* 11 suivi + 28 livre d'or */
const code=field('Code de commande'),res=el('p',{});
sec('Suivi de commande',card('Entre ton code',code,el('button',{class:'btn',onclick:async()=>{const d=db();if(!d)return res.textContent='Suivi indisponible pour le moment.';try{const s=await d.collection(CONFIG.COLLECTION_ORDERS).doc(code.value.trim()).get();res.textContent=s.exists?'Statut : '+(s.data().statut||'en cours'):'Code introuvable.'}catch{res.textContent='Erreur de lecture.'}}},'Vérifier'),res));
const gn=field('Ton nom'),gm=field('Ton message','textarea'),gl=el('div',{});
const loadG=async()=>{const d=db();if(!d)return;try{const s=await d.collection(CONFIG.COLLECTION_GUEST).orderBy('t','desc').limit(10).get();gl.replaceChildren(...s.docs.map(x=>el('p',{},el('b',{},String(x.data().n).slice(0,40)+' : '),String(x.data().m).slice(0,300))))}catch{}};
sec('Livre d\'or',card('Laisse un mot',gn,gm,el('button',{class:'btn',onclick:async()=>{const d=db();if(!d||!gn.value||!gm.value)return;try{await d.collection(CONFIG.COLLECTION_GUEST).add({n:gn.value.slice(0,40),m:gm.value.slice(0,300),t:Date.now()});gm.value='';loadG()}catch{}}},'Publier'),gl));loadG();

/* 13 WhatsApp contextuel */
if(wa){const so=new IntersectionObserver(e=>e.forEach(x=>x.isIntersecting&&(wa.href=waLink('Bonjour, je te contacte depuis la section « '+(x.target.querySelector('h2')?.textContent||x.target.id)+' » de ton portfolio.'))),{threshold:.5});$$('section[id]').forEach(s=>so.observe(s))}

/* 16 FR/EN */
const EN={'Accueil':'Home','Projets':'Projects','Commander':'Order','À propos':'About','Compétences':'Skills','Services':'Services','Contact':'Contact','Commander un projet ↗':'Order a project ↗','Voir les démos ▶':'See demos ▶','Mes projets':'My projects','Réalisations':'Work','Parlons de ton idée':'Let\'s talk about your idea','Technologies':'Technologies','Qui suis-je ?':'Who am I?'};
const orig=new Map(),setLang=l=>{lang=l;localStorage.setItem('lang',l);const w=document.createTreeWalker(document.body,4);let n;while(n=w.nextNode()){const t=n.nodeValue.trim();if(!orig.has(n)&&EN[t])orig.set(n,n.nodeValue);if(orig.has(n))n.nodeValue=l==='en'?orig.get(n).replace(t,EN[t]):orig.get(n)}document.documentElement.lang=l};
if(lang==='en')setLang('en');

/* 7 CV, 20 recherche, 25 partage, 9 commande, 27 LIRA, 29 stats */
const cv=()=>CONFIG.CV_URL?open(CONFIG.CV_URL):print();
const search=()=>{const i=field('Rechercher…'),r=el('div',{});i.oninput=()=>{r.replaceChildren();const q=i.value.toLowerCase();if(q.length<2)return;$$('section[id]').forEach(s=>{if(s.textContent.toLowerCase().includes(q))r.append(el('p',{},el('a',{href:'#'+s.id,onclick:()=>$('.mod').remove()},'→ '+(s.querySelector('h2')?.textContent||s.id))))})};modal('Recherche',i,r);i.focus()};
const share=()=>navigator.share?navigator.share({title:document.title,url:location.href}):send('Découvre ce portfolio : '+location.href);
const order=()=>{const n=field('Ton nom'),p=field('Ton projet','textarea'),b=field('Budget (FCFA)'),d=field('Délai souhaité');modal('Commander',n,p,b,d,el('button',{class:'btn primary',onclick:()=>send(`Bonjour, je suis ${n.value}. Projet : ${p.value}. Budget : ${b.value}. Délai : ${d.value}.`)},'Envoyer ↗'))};
const lira=()=>modal('Essayer LIRA',el('iframe',{src:CONFIG.LIRA_URL,style:'width:100%;height:60vh;border:0',loading:'lazy'}));
const stats=()=>modal('Statistiques',...$$('.stat').map(s=>el('p',{},s.textContent.trim())));
const dock=el('div',{id:'dock'},[['🔍','Recherche',search],['🌐','FR/EN',()=>setLang(lang==='fr'?'en':'fr')],['📄','CV',cv],['↗','Partager',share],['✍','Commander',order],['🤖','LIRA',lira],['📊','Stats',stats]].map(([i,t,f])=>el('button',{title:t,'aria-label':t,onclick:f},i)));dock.onclick=()=>dock.classList.remove('o');document.body.append(dock,el('button',{id:'dt','aria-label':'Outils',onclick:()=>dock.classList.toggle('o')},'🧰'));
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();search()}});

/* 18 terminal */
const hp=$('.hero-panel');if(hp){const o=el('div',{id:'tout'},'Tape « help »'),i=el('input',{id:'tin',placeholder:'$ commande',autocomplete:'off'});hp.append(el('div',{id:'term'},o,i));
 const C={help:()=>'help projets contact cv theme lang clear whoami',whoami:()=>'DEV.D.A.J — AbouDev Labs',projets:()=>{location.hash='#projets';return 'ok'},contact:()=>{location.hash='#contact';return 'ok'},cv:()=>{cv();return 'ok'},theme:()=>{$('#themeToggle').click();return 'ok'},lang:()=>{setLang(lang==='fr'?'en':'fr');return lang},clear:()=>{o.textContent='';return ''}};
 i.onkeydown=e=>{if(e.key!=='Enter')return;const c=i.value.trim();i.value='';o.append('\n$ '+c+'\n'+(C[c]?C[c]():'commande inconnue'));o.scrollTop=1e9}}

/* 22 PWA */
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

document.head.append(el('style',{},`#mc{margin:0 0 20px}#cast{display:flex;justify-content:space-between;gap:6px;margin-bottom:10px}
.ag{flex:1;max-width:86px;text-align:center;cursor:pointer;transition:transform .3s;animation:pop .7s backwards}.ag:nth-child(2){animation-delay:.15s}.ag:nth-child(3){animation-delay:.3s}.ag:nth-child(4){animation-delay:.45s}
.ag svg{width:100%;height:auto;display:block;animation:bob 3s ease-in-out infinite}.ag:nth-child(even) svg{animation-delay:-1.4s}
.ag small{display:block;font-size:.74rem;color:var(--muted)}.ag.talk{transform:translateY(-5px) scale(1.1)}.ag.talk small{color:var(--green);font-weight:800}
.ag.talk .arm,.big .arm{animation:wr .4s ease-in-out infinite alternate}.arm{transform-origin:53px 60px}.eye{animation:blk 4s infinite;transform-box:fill-box;transform-origin:center}
#mb{background:linear-gradient(160deg,#12352b,#0b211a);border:3px solid #8b6b3f;border-radius:14px;padding:10px 14px;font:.86rem/1.55 ui-monospace,monospace;color:#e8f5ec;min-height:78px;max-height:128px;overflow:hidden;box-shadow:inset 0 0 18px rgba(0,0,0,.4)}
#mb p{margin:2px 0}#mb b{color:#ffd43b}#mb .c span:after{content:'▍';animation:bl 1s steps(2) infinite}
.ch p{margin:6px 0;padding:8px 10px;border-radius:12px;background:var(--surface-2)}.ch .u{background:var(--green);color:#062315;text-align:right}
.hd{display:flex;gap:14px;align-items:center}.hd svg{width:86px;flex:none}.mod ul,.card ul{padding-left:18px;margin:8px 0}
@keyframes pop{from{opacity:0;transform:translateY(24px) scale(.6)}}@keyframes bob{50%{transform:translateY(-3px)}}@keyframes wr{to{transform:rotate(-28deg)}}@keyframes bl{50%{opacity:0}}@keyframes blk{0%,94%,100%{transform:scaleY(1)}97%{transform:scaleY(.1)}}`));
const AVS=[
{n:'Koffi',r:'Guide des projets',sk:'#8d5524',hr:'#1b1b1b',st:'short',cl:'#ff922b',cl2:'#26364d',g:0,adv:['Projets présentés honnêtement, avec leur état d\'avancement','Démos à voir et à écouter','Pensés pour la Côte d\'Ivoire']},
{n:'Aya',r:'Devis & prix',sk:'#a9713f',hr:'#2a1a12',st:'buns',cl:'#32d583',cl2:'#0b8f55',g:1,adv:['Un devis pour chaque projet','Estimation indicative en ligne','Paiement à convenir sur WhatsApp']},
{n:'Yao',r:'Technique',sk:'#6b4226',hr:'#22b8cf',st:'cap',cl:'#4c6ef5',cl2:'#26364d',g:0,ac:1,adv:['Python, JavaScript, React Native, Firebase','Applis, sites web et API','Des outils adaptés aux besoins réels']},
{n:'Awa',r:'Contact & suivi',sk:'#c68642',hr:'#1b1b1b',st:'braids',cl:'#f76707',cl2:'#ffd43b',g:1,adv:['Réponse sur WhatsApp, message déjà écrit','Un seul contact du début à la fin','Appel sur rendez-vous']}];
const svg=a=>{const{sk,hr,st,cl,cl2,g,ac}=a,e='#132033',cap='<path d="M19 34c0-14 9-21 21-21s21 7 21 21c-5-7-12-10-21-10s-16 3-21 10z" fill="'+hr+'"/>';
const hair={short:'<path d="M19 34c0-14 9-21 21-21s21 7 21 21c-5-6-12-9-21-9s-16 3-21 9z" fill="'+hr+'"/>',
cap:'<path d="M19 33c0-14 9-21 21-21s21 7 21 21z" fill="'+hr+'"/><rect x="38" y="29" width="28" height="5" rx="2.5" fill="'+hr+'"/>',
buns:'<circle cx="21" cy="15" r="8" fill="'+hr+'"/><circle cx="59" cy="15" r="8" fill="'+hr+'"/>'+cap,
braids:'<path d="M20 36q-7 22-2 40M60 36q7 22 2 40" stroke="'+hr+'" stroke-width="6" fill="none" stroke-linecap="round"/>'+cap}[st];
const body=g?'<path d="M27 56h26l9 42H18z" fill="'+cl+'"/>'+[[30,80],[46,72],[38,90],[52,88]].map(([x,y])=>'<circle cx="'+x+'" cy="'+y+'" r="2.5" fill="'+cl2+'"/>').join(''):'<rect x="25" y="56" width="30" height="36" rx="12" fill="'+cl+'"/><rect x="27" y="82" width="26" height="20" rx="6" fill="'+cl2+'"/>';
const leg=x=>'<rect x="'+x+'" y="'+(g?96:90)+'" width="8" height="'+(g?16:22)+'" rx="4" fill="'+(g?sk:cl2)+'"/><ellipse cx="'+(x+4)+'" cy="114" rx="8" ry="4" fill="'+e+'"/>';
const arm='stroke="'+sk+'" stroke-width="6" fill="none" stroke-linecap="round"';
return '<svg viewBox="0 0 80 122" aria-hidden="true">'+leg(29)+leg(43)+body+'<path d="M27 60q-9 10-8 24" '+arm+'/><g class="arm"><path d="M53 60q10 6 15-8" '+arm+'/></g><rect x="35" y="50" width="10" height="10" fill="'+sk+'"/><circle cx="40" cy="36" r="21" fill="'+sk+'"/><circle cx="19" cy="38" r="4" fill="'+sk+'"/><circle cx="61" cy="38" r="4" fill="'+sk+'"/>'+hair+'<g class="eye"><ellipse cx="32" cy="39" rx="3" ry="3.6" fill="'+e+'"/><ellipse cx="48" cy="39" rx="3" ry="3.6" fill="'+e+'"/><circle cx="33" cy="37.8" r="1" fill="#fff"/><circle cx="49" cy="37.8" r="1" fill="#fff"/></g><circle cx="27" cy="46" r="3.5" fill="#ff6b6b" opacity=".3"/><circle cx="53" cy="46" r="3.5" fill="#ff6b6b" opacity=".3"/><path d="M34 47q6 6 12 0" stroke="'+e+'" stroke-width="2" fill="none" stroke-linecap="round"/>'+(ac?'<g fill="none" stroke="'+e+'" stroke-width="1.6"><circle cx="32" cy="39" r="6.5"/><circle cx="48" cy="39" r="6.5"/><path d="M38.5 39h3"/></g>':'')+'</svg>'};
const nz=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const KB=[['termchat','TermChat est une messagerie en terminal, chiffrée, créée par Abou.',0],['lira','LIRA est une « étudiante artificielle » : un assistant qui répond et apprend. Essaie-la avec 🧰 puis 🤖.',0],['vite','VITE API est une sandbox de paiement mobile (Wave, Orange, MTN, Moov) pour les développeurs africains. Regarde la carte du projet pour son état d\'avancement.',0],
['projet|realisation|catalogue|demo','Les projets sont dans la section « Projets » : certains sont en cours, d\'autres arrivent bientôt. Touche « Voir la démo ».',0],
['suivi|suivre','Pour suivre une commande, entre ton code dans « Suivi de commande ».',3],
['prix|cout|tarif|combien|devis|budget|pay|wave|orange|mtn|moov','Chaque projet a un devis. Pour un ordre d\'idée, utilise « Estimer mon projet » ; le paiement mobile money se convient sur WhatsApp.',1],
['delai|duree|quand|rapide','Le délai dépend du projet : Abou te le précise dans sa proposition.',1],
['command','Choisis une idée dans « Commander » ou utilise ✍ : ta demande arrive sur WhatsApp, déjà écrite.',1],
['techno|competence|langage|python|javascript|react|firebase|outil','Python, HTML/CSS, JavaScript, React Native/Expo, Firebase, API REST, Linux/Termux et de l\'IA (LIRA).',2],
['applic|appli|mobile|android|site|web|api|boutique','Abou crée des applis mobiles, des sites web, des API et des outils d\'automatisation.',2],
['installer|hors ligne|offline|ecran d\'accueil','Le site s\'installe comme une appli : menu du navigateur → « Ajouter à l\'écran d\'accueil ».',2],
['contact|whatsapp|joindre|appel|rendez|mail','Le plus simple : le bouton WhatsApp vert. Tu peux aussi réserver un appel plus bas.',3],
['qui|abou|johan|daj','Diomandé Abou Johan (DEV.D.A.J), développeur ivoirien basé à San Pedro, fondateur d\'AbouDev Labs.',3],
['san pedro|adresse|ville|habite|localis','Abou est basé à San Pedro, en Côte d\'Ivoire.',3],
['bonjour|salut|coucou|bonsoir|hello','Salut ! Dis-moi ce que tu cherches : projets, prix, technologies ou contact.',3],
['merci','Avec plaisir !',3],
...CONFIG.FAQ.map(([q,a])=>[nz(q).split(/\W+/).filter(w=>w.length>4).join('|')||'^$',a,1])];
const reply=q=>{const n=nz(q),h=KB.find(([r])=>new RegExp(r).test(n));return h?{i:h[2],t:h[1]}:{i:3,t:'Je n\'ai pas la réponse, mais Abou répond lui-même sur WhatsApp.',f:1}};
const SUG=['Quels projets ?','Combien ça coûte ?','Quelles technologies ?','Comment vous contacter ?','C\'est quoi LIRA ?'];
const fiche=i=>{const a=AVS[i],l=el('div',{class:'ch'},el('p',{},el('b',{},a.n+' : '),'Salut ! Pose-moi une question.')),inp=field('Ta question…'),hd=el('div',{class:'hd big'});hd.innerHTML=svg(a);hd.append(el('div',{},el('b',{},a.r),el('ul',{},a.adv.map(x=>el('li',{},x)))));
 const go=q=>{q=q.trim();if(!q)return;l.append(el('p',{class:'u'},q));const r=reply(q);l.append(el('p',{},el('b',{},AVS[r.i].n+' : '),r.t));if(r.f)l.append(el('button',{class:'btn',onclick:()=>send('Question depuis le portfolio : '+q)},'Envoyer sur WhatsApp ↗'));inp.value=''};
 inp.onkeydown=e=>e.key==='Enter'&&go(inp.value);modal(a.n+' — '+a.r,hd,el('div',{class:'chips'},SUG.map(q=>el('button',{onclick:()=>go(q)},q))),l,inp,el('button',{class:'btn',onclick:lira},'Parler à LIRA 🤖'))};
const cast=AVS.map((a,i)=>{const d=el('div',{class:'ag',title:a.n,onclick:()=>fiche(i)});d.innerHTML=svg(a)+'<small>'+a.n+'</small>';return d});
const bd=el('div',{id:'mb'}),mc=el('div',{id:'mc'},el('div',{id:'cast'},cast),bd);const hc=$('.hero .container')||$('.hero');hc&&hc.prepend(mc);
ct.prepend(el('h2',{},'Ton équipe'),el('div',{class:'g'},AVS.map((a,i)=>{const d=el('div',{style:'width:70px'});d.innerHTML=svg(a);const c=card(a.n+' — '+a.r,el('ul',{},a.adv.map(x=>el('li',{},x))),el('button',{class:'btn',onclick:()=>fiche(i)},'Poser une question'));c.prepend(d);return c})));
const sleep=t=>new Promise(r=>setTimeout(r,t));let busy=0;
const write=async(i,t)=>{const p=el('p',{class:'c'},el('b',{},AVS[i].n+' : ')),s=el('span',{});p.append(s);bd.append(p);while(bd.children.length>3)bd.firstChild.remove();cast[i].classList.add('talk');for(const c of t){s.textContent+=c;await sleep(28)}cast[i].classList.remove('talk');p.classList.remove('c');await sleep(1100)};
const say=async L=>{if(busy)return;busy=1;for(const[i,t]of L)await write(i,t);busy=0};
const act=async()=>{try{const j=await(await fetch('assets/actus.json')).json();return(Array.isArray(j)?j:j.actus||[]).slice(0,2).map(a=>[0,'Nouveau : '+(a.titre||a.title||'')]).filter(x=>x[1].length>12)}catch{return[]}};
const MS=()=>{const h=new Date().getHours();return[[0,(h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir')+' ! Nous sommes le '+new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+'.'],[0,'Ici, Abou transforme tes idées en outils.'],[1,'Chaque projet a son devis, rien n\'est caché.'],[3,'Touche l\'un de nous pour poser une question !']]};
const DLG=[[[0,'Aya, tu as vu le catalogue ?'],[1,'Oui ! Chaque projet a son devis.'],[0,'C\'est ça qu\'on aime.']],[[2,'Awa, encore une question sur WhatsApp ?'],[3,'Oui, et Abou répond lui-même.'],[2,'Respect !']],[[1,'Koffi, tu dors ? Les démos sont prêtes !'],[0,'Je ne dors pas, je regarde les projets.'],[1,'Alors montre-les aux visiteurs !']],[[3,'Yao, c\'est quoi la techno du site ?'],[2,'HTML, CSS et JavaScript, bien simple.'],[3,'Et ça s\'installe comme une appli.']]];
const WK=6048e5,last=+localStorage.getItem('mascot_last')||0,back=last&&Date.now()-last>=WK;localStorage.setItem('mascot_last',Date.now());
(async()=>{await say([...(back?[[3,'Ça fait une semaine, on est de retour !']]:[]),...MS(),...await act()]);for(let k=0;;k++){await sleep(18e3+Math.random()*15e3);if(document.hidden||$('.mod'))continue;await say(DLG[k%DLG.length])}})();
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-(+localStorage.getItem('mascot_last')||0)>=WK){localStorage.setItem('mascot_last',Date.now());cast.forEach(c=>{c.style.animation='none';void c.offsetWidth;c.style.animation=''});say([[3,'Ça fait une semaine, on est de retour !']])}});
})();
