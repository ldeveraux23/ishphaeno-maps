(function(){
var q=document.getElementById('q'),res=document.getElementById('res');
if(!q||!res)return;
var data=null,loading=false,sel=-1,SP={'ə':'e','æ':'a','ø':'o','þ':'t','ð':'d','ħ':'h','ʁ':'r','ɾ':'r','ɯ':'u','ʊ':'u','œ':'o','ɛ':'e','ɔ':'o','ʉ':'u','ɪ':'i','ß':'s','ʒ':'z','ʕ':'h','ɬ':'l','ɫ':'l','ɽ':'r','ʂ':'s','ɖ':'d','ɓ':'b','ɠ':'g'};
function norm(s){var o='',i,c,d;s=String(s).toLowerCase();for(i=0;i<s.length;i++){c=s[i];if(SP[c]){o+=SP[c];continue}d=c.normalize('NFD');o+=d.charAt(0)}return o}
function load(cb){if(data)return cb();if(loading)return;loading=true;
 fetch('search.json').then(function(r){return r.json()}).then(function(j){
  data=j.map(function(p){p.nt=norm(p.t);p.nh=norm(p.h);p.nx=norm(p.x);return p});cb()}).catch(function(){loading=false;
  res.className='on';res.innerHTML='<div class="none">Search could not load.</div>'})}
function run(){
 var raw=q.value.trim();sel=-1;
 if(raw.length<2){res.className='';res.innerHTML='';return}
 var terms=norm(raw).split(/\s+/).filter(Boolean),out=[];
 data.forEach(function(p){var sc=0,ok=true;
  for(var i=0;i<terms.length;i++){var t=terms[i],a=p.nt.indexOf(t)>=0,b=p.nh.indexOf(t)>=0,c=p.nx.indexOf(t)>=0;
   if(!a&&!b&&!c){ok=false;break}
   sc+=(a?20:0)+(b?8:0)+(c?Math.min(6,p.nx.split(t).length-1):0)}
  if(ok)out.push([sc,p])});
 out.sort(function(x,y){return y[0]-x[0]});
 res.className='on';res.innerHTML='';
 if(!out.length){var n=document.createElement('div');n.className='none';n.textContent='No pages match.';res.appendChild(n);return}
 out.slice(0,8).forEach(function(r){var p=r[1],a=document.createElement('a'),b=document.createElement('b'),s=document.createElement('span');
  a.href=p.u;b.textContent=p.t;a.appendChild(b);
  var at=-1,i;for(i=0;i<terms.length;i++){at=p.nx.indexOf(terms[i]);if(at>=0)break}
  if(at>=0){var st=Math.max(0,at-50),en=Math.min(p.x.length,at+90);
   s.appendChild(document.createTextNode((st>0?'… ':'')+p.x.slice(st,at)));
   var m=document.createElement('mark');m.textContent=p.x.slice(at,at+terms[i].length);s.appendChild(m);
   s.appendChild(document.createTextNode(p.x.slice(at+terms[i].length,en)+(en<p.x.length?' …':'')))}
  a.appendChild(s);res.appendChild(a)})}
q.addEventListener('focus',function(){load(function(){if(q.value.trim().length>=2)run()})});
q.addEventListener('input',function(){load(run)});
q.addEventListener('keydown',function(e){var l=res.querySelectorAll('a');
 if(e.key==='Escape'){q.value='';res.className='';res.innerHTML='';return}
 if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();if(!l.length)return;
  sel=(sel+(e.key==='ArrowDown'?1:-1)+l.length)%l.length;l.forEach(function(x,i){x.className=i===sel?'sel':''});l[sel].scrollIntoView({block:'nearest'})}
 if(e.key==='Enter'&&l.length){e.preventDefault();location.href=l[sel>=0?sel:0].getAttribute('href')}});
document.addEventListener('click',function(e){if(!e.target.closest('.sbox')){res.className=''}});
})();
