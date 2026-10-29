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

document.head.append(el('style',{},`#mc{display:flex;align-items:flex-end;gap:10px;margin:0 0 18px}#mg{width:60px;flex:none;cursor:pointer;animation:bob 2s ease-in-out infinite}
#mg.in{animation:walk 2.6s ease-out,bob 2s ease-in-out 2.6s infinite}.arm{transform-origin:40px 44px}.w .arm{animation:wr .35s ease-in-out infinite alternate}
#mb{flex:1;background:#0f2a22;border:3px solid #8b6b3f;border-radius:10px;padding:8px 12px;font:.85rem/1.5 ui-monospace,monospace;color:#e8f5ec;min-height:62px;max-height:96px;overflow:hidden}
#mb p{margin:0}#mb .c:after{content:'▍';animation:bl 1s steps(2) infinite}
@keyframes walk{from{transform:translateX(-140px)}to{transform:none}}@keyframes bob{50%{transform:translateY(-3px)}}@keyframes wr{to{transform:rotate(-25deg)}}@keyframes bl{50%{opacity:0}}
.ch p{margin:6px 0;padding:8px 10px;border-radius:10px;background:var(--surface-2)}.ch .u{background:var(--green);color:#062315;text-align:right}`));
const MS=(()=>{const h=new Date().getHours(),g=h<12?'Bonjour':h<18?'Bon après-midi':'Bonsoir';return [g+' ! Nous sommes le '+new Date().toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'})+'.','Ici, Abou transforme tes idées en outils : applis, sites et API.','Maintenant : explore les projets, commande, ou touche-moi pour poser une question.']})();
const KB=[[/qui|abou|johan|d\.?a\.?j/i,'Diomandé Abou Johan (DEV.D.A.J), développeur ivoirien, fondateur d\'AbouDev Labs.'],[/projet|termchat|vite|lira|r[ée]alisation/i,'Les projets sont juste en dessous : touche une carte pour les détails.'],[/prix|co[uû]t|tarif|combien|devis/i,'Chaque projet a un devis. Utilise « Estimer mon projet » plus bas.'],[/contact|whatsapp|joindre|appel/i,'Le plus simple : le bouton WhatsApp vert, ou « Réserver un appel ».'],...CONFIG.FAQ.map(([q,a])=>[new RegExp(q.toLowerCase().split(/\W+/).filter(w=>w.length>4).join('|')||'^$','i'),a])];
const ans=q=>(KB.find(([r])=>r.test(q))||[])[1];
const bd=el('div',{id:'mb'}),mg=el('div',{id:'mg',title:'Pose-moi une question','aria-label':'Mascotte'});
mg.innerHTML='<svg viewBox="0 0 64 90"><circle cx="30" cy="16" r="12" fill="#ffd9b0"/><path d="M18 13a12 12 0 0 1 24 0z" fill="#32d583"/><circle cx="26" cy="18" r="1.6" fill="#132033"/><circle cx="35" cy="18" r="1.6" fill="#132033"/><path d="M26 23q4 3 8 0" stroke="#132033" fill="none"/><rect x="19" y="28" width="22" height="30" rx="6" fill="#ff922b"/><path d="M24 58v22M36 58v22" stroke="#132033" stroke-width="4" stroke-linecap="round"/><g class="arm"><path d="M40 34l16-8" stroke="#ffd9b0" stroke-width="5" stroke-linecap="round"/><rect x="54" y="20" width="4" height="9" rx="1" fill="#fff" transform="rotate(30 56 24)"/></g><path d="M19 34l-8 14" stroke="#ffd9b0" stroke-width="5" stroke-linecap="round"/></svg>';
const mc=el('div',{id:'mc'},mg,bd);const hc=$('.hero .container')||$('.hero');hc&&hc.prepend(mc);
const sleep=t=>new Promise(r=>setTimeout(r,t));let busy=0;
const write=async t=>{const p=el('p',{class:'c'});bd.append(p);while(bd.children.length>3)bd.firstChild.remove();mg.classList.add('w');for(const c of t){p.textContent+=c;await sleep(32)}mg.classList.remove('w');p.classList.remove('c');await sleep(1200)};
const act=async()=>{try{const r=await fetch('assets/actus.json'),j=await r.json();return (Array.isArray(j)?j:j.actus||[]).slice(0,2).map(a=>'Nouveau : '+(a.titre||a.title||'')).filter(x=>x.length>10)}catch{return[]}};
const run=async back=>{if(busy)return;busy=1;if(back){mg.classList.remove('in');void mg.offsetWidth;mg.classList.add('in');bd.replaceChildren();await sleep(2600)}
 const all=[...(back?['Ça fait une semaine, je suis de retour !']:[]),...MS,...await act()];for(const m of all)await write(m);busy=0};
const WK=6048e5,last=+localStorage.getItem('mascot_last')||0,first=!last||Date.now()-last>=WK;
localStorage.setItem('mascot_last',Date.now());if(first)mg.classList.add('in');run(false);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-(+localStorage.getItem('mascot_last')||0)>=WK){localStorage.setItem('mascot_last',Date.now());run(true)}});
mg.onclick=()=>{const l=el('div',{class:'ch'},el('p',{},'Salut ! Pose-moi une question sur le site.')),i=field('Ta question…');const go=q=>{if(!q)return;l.append(el('p',{class:'u'},q));const a=ans(q);l.append(el('p',{},a||'Je n\'ai pas la réponse. Je transmets à Abou sur WhatsApp ?'));if(!a)l.append(el('button',{class:'btn',onclick:()=>send('Question depuis le portfolio : '+q)},'Envoyer sur WhatsApp ↗'));i.value=''};
 i.onkeydown=e=>e.key==='Enter'&&go(i.value.trim());modal('Le petit gardien',l,i,el('button',{class:'btn',onclick:lira},'Parler à LIRA 🤖'))};
})();
