'use strict';
const videos=[
{id:'OMvpRNQ_aoY',category:'documentary',title:'Tunisia — Documentary',description:'Long-form storytelling'},
{id:'Ppmsg0BdU3U',category:'shorts',title:'Social Edit 01',vertical:true},
{id:'CBpJ73PNUxU',category:'shorts',title:'Social Edit 02',vertical:true},
{id:'5P-7vhaGdGI',category:'shorts',title:'Social Edit 03'},
{id:'pzkVh7FnTwU',category:'shorts',title:'Social Edit 04'},
{id:'3eo5X-f6IQo',category:'promo',title:'Promo 01'},
{id:'Df-4St3mmqY',category:'promo',title:'Promo 02',vertical:true},
{id:'twNEAxifLFI',category:'promo',title:'Promo 03',vertical:true},
{id:'mvjaDy7wVNk',category:'promo',title:'Promo 04'},
{id:'YHEA_IEYn7Q',category:'promo',title:'Promo 05',vertical:true},
{id:'xSTYfDZDYTc',category:'promo',title:'Promo 06',vertical:true},
{id:'m_0HSI_R0F8',category:'promo',title:'Promo 07',vertical:true},
{id:'bkEPwvrspPY',category:'promo',title:'Promo 08',vertical:true},
{id:'MddDrOfCfCQ',category:'promo',title:'Promo 09',vertical:true}
];
const labels={documentary:'Documentary',shorts:'Social & shorts',promo:'Promo & motion'};
const grid=document.getElementById('projectGrid');
const more=document.getElementById('showMore');
let filter='all',expanded=false;
for(const v of videos){
 const a=document.createElement('a');a.className='project';a.href='https://www.youtube.com/watch?v='+v.id;a.dataset.video=v.id;a.dataset.title=v.title;a.dataset.category=v.category;
 a.innerHTML=`<div class="project-visual"><img alt="" loading="lazy" width="640" height="400"><span class="project-type"></span><span class="play" aria-hidden="true"><span>▶</span></span></div><div class="project-info"><div><h3></h3><p></p></div><span aria-hidden="true">↗</span></div>`;
 a.querySelector('h3').textContent=v.title;a.querySelector('.project-type').textContent=labels[v.category];a.querySelector('.project-info p').textContent=v.description||(v.vertical?'Vertical edit':'Video editing');
 const img=a.querySelector('img');const fallback=`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
 img.src=v.vertical?`https://i.ytimg.com/vi/${v.id}/oardefault.jpg`:fallback;
 function fallbackImage(){if(img.src!==fallback){img.src=fallback;}else{img.style.visibility='hidden';}}
 img.addEventListener('error',fallbackImage);img.addEventListener('load',()=>{if(img.naturalWidth<=120)fallbackImage();});grid.append(a);
}
function updateGrid(){let shown=0;const matching=videos.filter(v=>filter==='all'||v.category===filter).length;for(const a of grid.children){const match=filter==='all'||a.dataset.category===filter;a.hidden=!match||(!expanded&&filter==='all'&&shown>=6);if(match)shown++;}const count=filter==='all'&&!expanded?Math.min(6,matching):matching;document.getElementById('resultCount').textContent=`${count} / ${matching} projects`;more.hidden=filter!=='all';more.setAttribute('aria-expanded',String(expanded));more.innerHTML=expanded?'Show fewer projects <span aria-hidden="true">−</span>':'View all 14 projects <span aria-hidden="true">+</span>';}
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{filter=btn.dataset.filter;expanded=false;document.querySelectorAll('[data-filter]').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});updateGrid();}));
more.addEventListener('click',()=>{expanded=!expanded;updateGrid();if(!expanded)document.getElementById('work').scrollIntoView({block:'start'});});updateGrid();
const dialog=document.getElementById('videoDialog');const playerContainer=document.getElementById('playerContainer');let previousFocus=null,player=null,playerTimer=null,activeVideo=null,apiPromise=null;
function loadAPI(){if(window.YT?.Player)return Promise.resolve();if(apiPromise)return apiPromise;apiPromise=new Promise((resolve,reject)=>{window.onYouTubeIframeAPIReady=resolve;const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=reject;document.head.append(script);});return apiPromise;}
function stopPlayer(){clearTimeout(playerTimer);try{player?.destroy();}catch{}player=null;playerContainer.replaceChildren();}
function fallback(id){if(activeVideo!==id)return;stopPlayer();const img=document.createElement('img');img.src=`https://i.ytimg.com/vi/${id}/hqdefault.jpg`;img.alt='Video preview';playerContainer.append(img);document.getElementById('playerStatus').textContent='Watch this video directly on YouTube.';}
async function openVideo(trigger){const id=trigger.dataset.video;previousFocus=trigger;activeVideo=id;stopPlayer();document.getElementById('videoTitle').textContent=trigger.dataset.title;document.getElementById('youtubeLink').href=trigger.href;document.getElementById('playerStatus').textContent='Loading video. You can also watch on YouTube.';dialog.showModal();document.body.classList.add('modal-open');document.getElementById('closeVideo').focus();if(!/^https?:$/.test(location.protocol)){fallback(id);return;}const target=document.createElement('div');playerContainer.append(target);playerTimer=setTimeout(()=>fallback(id),15000);try{await loadAPI();if(activeVideo!==id||!dialog.open)return;player=new YT.Player(target,{videoId:id,width:'100%',height:'100%',playerVars:{autoplay:1,playsinline:1,rel:0,origin:location.origin},events:{onReady:e=>{clearTimeout(playerTimer);e.target.getIframe().title=trigger.dataset.title;e.target.getIframe().setAttribute('referrerpolicy','strict-origin-when-cross-origin');document.getElementById('playerStatus').textContent='Prefer to watch on YouTube?';},onError:()=>fallback(id)}});}catch{fallback(id);}}
document.addEventListener('click',e=>{const trigger=e.target.closest('a[data-video]');if(trigger&&!e.ctrlKey&&!e.metaKey&&!e.shiftKey&&!e.altKey){e.preventDefault();openVideo(trigger);}});
document.getElementById('closeVideo').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{activeVideo=null;stopPlayer();document.body.classList.remove('modal-open');previousFocus?.focus();});
document.getElementById('year').textContent=new Date().getFullYear();function clock(){document.getElementById('clock').textContent=new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Tunis'}).format(new Date());}clock();setInterval(clock,30000);
