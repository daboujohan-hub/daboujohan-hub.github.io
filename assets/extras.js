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
const el=(t,a={},...k)=>{const e=document.createElement(t);for(const[x,v]of Object.entries(a))x==='class'?e.className=v:x.startsWith('on')?e.addEventListener(x.slice(2),v):e.setAttribute(x,v);k.flat().forEach(c=>e.append(c));return e};
const wa=$('a[href*="wa.me"],a[href*="whatsapp"]');
const waLink=t=>{try{const u=new URL(wa.href);u.searchParams.set('text',t);return u.href}catch{return '#'}};
const db=()=>{try{return window.firebase&&firebase.apps.length?firebase.firestore():null}catch{return null}};
let lang=localStorage.getItem('lang')||'fr';

/* CSS */
document.head.append(el('style',{},`
.rv{opacity:0;transform:translateY(18px);transition:.6s}.rv.in{opacity:1;transform:none}
#prog{position:fixed;top:0;left:0;height:3px;width:0;background:var(--green);z-index:50}
#dock{position:fixed;left:14px;bottom:82px;z-index:30;display:flex;flex-direction:column;gap:8px}
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
const prog=el('div',{id:'prog'}),top=el('button',{id:'top','aria-label':'Haut',onclick:()=>scrollTo({top:0})},'↑');document.body.append(prog,top);
addEventListener('scroll',()=>{const h=document.documentElement;prog.style.width=scrollY/(h.scrollHeight-innerHeight)*100+'%';top.style.display=scrollY>600?'block':'none'},{passive:true});

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
const dock=el('div',{id:'dock'},[['🔍','Recherche',search],['🌐','FR/EN',()=>setLang(lang==='fr'?'en':'fr')],['⭳','CV',cv],['↗','Partager',share],['✍','Commander',order],['🤖','LIRA',lira],['📊','Stats',stats]].map(([i,t,f])=>el('button',{title:t,'aria-label':t,onclick:f},i)));document.body.append(dock);
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();search()}});

/* 18 terminal */
const hp=$('.hero-panel');if(hp){const o=el('div',{id:'tout'},'Tape « help »'),i=el('input',{id:'tin',placeholder:'$ commande',autocomplete:'off'});hp.append(el('div',{id:'term'},o,i));
 const C={help:()=>'help projets contact cv theme lang clear whoami',whoami:()=>'DEV.D.A.J — AbouDev Labs',projets:()=>{location.hash='#projets';return 'ok'},contact:()=>{location.hash='#contact';return 'ok'},cv:()=>{cv();return 'ok'},theme:()=>{$('#themeToggle').click();return 'ok'},lang:()=>{setLang(lang==='fr'?'en':'fr');return lang},clear:()=>{o.textContent='';return ''}};
 i.onkeydown=e=>{if(e.key!=='Enter')return;const c=i.value.trim();i.value='';o.append('\n$ '+c+'\n'+(C[c]?C[c]():'commande inconnue'));o.scrollTop=1e9}}

/* 22 PWA */
if('serviceWorker'in navigator)addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
