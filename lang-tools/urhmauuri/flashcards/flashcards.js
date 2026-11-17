var S={deck:"Phrases",dir:"fw2en",mode:"flip",shuffle:true,lenient:false,kb:true};
var Q=[],i=0,flipped=false,answered=false,again=[],known={},SK="urhflash";
try{var sv=JSON.parse(localStorage.getItem(SK)||"{}");for(var k in sv.S||{})S[k]=sv.S[k];known=sv.known||{};}catch(e){}
function save(){try{localStorage.setItem(SK,JSON.stringify({S:S,known:known}));}catch(e){}}
function $(id){return document.getElementById(id)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function deckObj(id){for(var j=0;j<DECKS.length;j++)if(DECKS[j].id===id)return DECKS[j];return null}
function withDeck(d){return d.cards.map(function(c){return [c[0],c[1],c[2]||"",d.id]})}
function allCards(){if(S.deck==="__all")return DECKS.reduce(function(a,d){return a.concat(withDeck(d))},[]);var d=deckObj(S.deck)||DECKS[0];return withDeck(d)}
function key(c){return c[3]+"|"+c[0]+"|"+c[1]}
function shuf(a){a=a.slice();for(var j=a.length-1;j>0;j--){var r=Math.floor(Math.random()*(j+1));var t=a[j];a[j]=a[r];a[r]=t}return a}
function build(onlyUnknown){var c=allCards();if(onlyUnknown)c=c.filter(function(x){return !known[key(x)]});Q=S.shuffle?shuf(c):c;i=0;again=[];render()}
var FOLD=[["ʁ","rh"],["ʉ","uu"],["ɨ","ii"],["χ","kh"],["ɾ","r"],["ʃ","sh"],["ŋ","ng"],["ɲ","ny"],["ɬ","lh"],["ł","lh"],["ʔ","'"]];
function norm(s,len,urh){s=s.toLowerCase().replace(/[’‘`ʼ′]/g,"'").replace(/[“”"]/g,"").replace(/[.!?¿¡]/g,"");
 if(urh){FOLD.forEach(function(f){s=s.split(f[0]).join(f[1])})}
 s=s.normalize("NFC");if(len){s=s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/'/g,"")}
 return s.replace(/\s+/g," ").trim()}
function alts(s,urh){var par=[];s.replace(/\(([^)]*)\)/g,function(m,x){par.push(x);return m});
 var base=s.replace(/\([^)]*\)/g," "),out=[];
 base.split(/\s*[\/;]\s*|\s+or\s+|,\s*/i).forEach(function(x){x=x.trim();if(x)out.push(x)});
 if(urh)par.forEach(function(x){x=x.trim();if(x&&x.split(" ").length<3)out.push(x)});
 var whole=s.replace(/\([^)]*\)/g," ").replace(/\s+/g," ").trim();if(whole&&out.indexOf(whole)<0)out.push(whole);
 return out.length?out:[s]}
function enAlts(s){return alts(s,false).map(function(x){return x.replace(/^(to|the|a|an)\s+/i,"")})}
function cur(){return Q[i]}
function frontText(c){return S.dir==="fw2en"?c[1]:c[0]}
function backText(c){return S.dir==="fw2en"?c[0]:c[1]}
function buildTop(){
 var d=$("decks");d.innerHTML="";
 var all=DECKS.reduce(function(a,x){return a+x.cards.length},0);
 function chip(id,name,n){var b=el("button","chip");b.setAttribute("aria-pressed",S.deck===id);b.innerHTML=name+"<small>"+n+"</small>";b.onclick=function(){S.deck=id;save();buildTop();build()};d.appendChild(b)}
 chip("__all","All decks",all);DECKS.forEach(function(x){chip(x.id,x.name,x.cards.length)});
 var o=$("opts");o.innerHTML="";
 function tog(label,get,set){var b=el("button","chip",label);b.setAttribute("aria-pressed",get());b.onclick=function(){set(!get());save();buildTop();render()};o.appendChild(b)}
 function pick(label,on,fn){var b=el("button","chip",label);b.setAttribute("aria-pressed",on);b.onclick=function(){fn();save();buildTop();build()};o.appendChild(b)}
 pick("Urhmauuri → English",S.dir==="fw2en",function(){S.dir="fw2en"});
 pick("English → Urhmauuri",S.dir==="en2fw",function(){S.dir="en2fw"});
 pick("Flip cards",S.mode==="flip",function(){S.mode="flip"});
 pick("Type the answer",S.mode==="type",function(){S.mode="type"});
 tog("Shuffle",function(){return S.shuffle},function(v){S.shuffle=v;build()});
 tog("Ignore accents",function(){return S.lenient},function(v){S.lenient=v});
 tog("Keyboard",function(){return S.kb},function(v){S.kb=v});
}
function render(){
 var c=cur(),f=$("front"),b=$("back"),h=$("hint"),a=$("ans"),fb=$("fb"),ctl=$("ctl");
 ctl.innerHTML="";fb.textContent="";fb.className="";a.className="";a.value="";flipped=false;answered=false;
 var dn=Object.keys(known).filter(function(k){return allCards().some(function(x){return key(x)===k})}).length;
 var tot=allCards().length;
 $("st1").textContent=Q.length?("Card "+Math.min(i+1,Q.length)+" of "+Q.length):"";
 $("st2").textContent="Known: "+dn+" / "+tot;
 $("bar").style.width=(Q.length?Math.min(i,Q.length)/Q.length*100:0)+"%";
 renderKb();renderRec();
 if(!c){f.textContent="Round finished";b.textContent="";a.style.display="none";
  h.innerHTML='<span class="done">'+(again.length?again.length+" card"+(again.length>1?"s":"")+" to review again.":"Every card in this round is marked known.")+"</span>";
  if(again.length){var r=el("button","btn big pri","Review the “again” pile");r.onclick=function(){Q=S.shuffle?shuf(again):again;again=[];i=0;render()};ctl.appendChild(r)}
  var n=el("button","btn big","Restart deck");n.onclick=function(){build()};ctl.appendChild(n);
  var u=el("button","btn big","Only cards not yet known");u.onclick=function(){build(true)};ctl.appendChild(u);return}
 f.textContent=frontText(c);b.textContent="";
 if(S.mode==="flip"){a.style.display="none";h.textContent="Tap the card or press Space to flip";
  $("stage").onclick=function(){if(!flipped)flip()};
  var fl=el("button","btn big pri","Show answer");fl.onclick=function(e){e.stopPropagation();flip()};ctl.appendChild(fl);
 }else{$("stage").onclick=null;a.style.display="";h.textContent=S.dir==="fw2en"?"Type the English meaning":"Type it in Urhmauuri (formal or keyboard spelling both work)";
  var ck=el("button","btn big pri","Check");ck.onclick=check;ctl.appendChild(ck);
  var sk=el("button","btn big","Show answer");sk.onclick=function(){reveal()};ctl.appendChild(sk);
  if(window.matchMedia("(hover:hover)").matches)a.focus();}
}
function showBack(c){$("back").textContent=backText(c);var n=c[2];$("hint").textContent=n?n:""}
function flip(){flipped=true;showBack(cur());var ctl=$("ctl");ctl.innerHTML="";
 var g=el("button","btn big good","Got it");g.onclick=function(e){e.stopPropagation();mark(true)};
 var x=el("button","btn big bad","Again");x.onclick=function(e){e.stopPropagation();mark(false)};ctl.appendChild(x);ctl.appendChild(g);$("stage").onclick=null}
function mark(ok){var c=cur();if(ok)known[key(c)]=1;else{delete known[key(c)];again.push(c)}save();i++;render()}
function isCorrect(t,c){
 if(S.dir==="fw2en"){var g=norm(t,true,false).replace(/^(to|the|a|an)\s+/,"");return enAlts(c[0]).some(function(x){return norm(x,true,false)===g})}
 var g2=norm(t,S.lenient,true);return alts(c[1],true).some(function(x){return norm(x,S.lenient,true)===g2})}
function check(){if(answered)return;var c=cur(),t=$("ans").value;if(!t.trim())return;var ok=isCorrect(t,c),a=$("ans"),fb=$("fb");
 a.className=ok?"ok":"no";answered=true;fb.className=ok?"ok-t":"no-t";fb.textContent=ok?"Correct":"Not quite. Answer: "+backText(c);
 showBack(c);if(ok)known[key(c)]=1;else{delete known[key(c)];again.push(c)}save();next()}
function reveal(){var c=cur();answered=true;showBack(c);$("fb").textContent="";delete known[key(c)];again.push(c);save();next()}
function next(){var ctl=$("ctl");ctl.innerHTML="";var b=el("button","btn big pri","Next");b.onclick=function(){i++;render()};ctl.appendChild(b);b.focus()}
$("ans").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();if(answered){i++;render()}else check()}});
document.addEventListener("keydown",function(e){if(e.target.id==="ans")return;if(e.code==="Space"&&S.mode==="flip"&&cur()){e.preventDefault();if(!flipped)flip()}else if(flipped&&cur()){if(e.key==="ArrowRight")mark(true);if(e.key==="ArrowLeft")mark(false)}});
var KB=["ʉ","ɨ","ʁ","χ","ɾ","ɬ","ʃ","ŋ","ɲ","’"];
function ins(ch){var a=$("ans");if(a.style.display==="none")return;var s=a.selectionStart==null?a.value.length:a.selectionStart,e=a.selectionEnd==null?s:a.selectionEnd;a.value=a.value.slice(0,s)+ch+a.value.slice(e);var p=s+ch.length;try{a.setSelectionRange(p,p)}catch(x){}a.focus()}
function renderKb(){var k=$("kb");if(!S.kb||S.mode!=="type"||!cur()){k.hidden=true;return}k.hidden=false;k.innerHTML="";
 function key2(label,fn,cls){var b=el("button","k "+(cls||""),label);b.type="button";b.onmousedown=function(e){e.preventDefault()};b.onclick=fn;return b}
 var r=el("div","krow");KB.forEach(function(ch){r.appendChild(key2(ch,function(){ins(ch)}))});
 r.appendChild(key2("space",function(){ins(" ")},"w"));
 r.appendChild(key2("⌫",function(){var a=$("ans"),s=a.selectionStart,e=a.selectionEnd;if(s===e&&s>0){a.value=a.value.slice(0,s-1)+a.value.slice(e);a.setSelectionRange(s-1,s-1)}else{a.value=a.value.slice(0,s)+a.value.slice(e);a.setSelectionRange(s,s)}a.focus()},"w"));
 k.appendChild(r);
 var n=el("div","sm","You do not need these letters: typing uu for ʉ, ii for ɨ, rh for ʁ, kh for χ and lh for ɬ is accepted too.");n.style.textAlign="center";k.appendChild(n)}
var rc=null,chunks=[],stream=null,lastUrl=null;
function renderRec(){var r=$("rec");r.innerHTML="";var c=cur();if(!c||!navigator.mediaDevices||!window.MediaRecorder)return;
 var b=el("button","btn",rc?"Stop":"Record yourself saying it");b.onclick=toggleRec;r.appendChild(b);
 if(rc){var d=el("span","dot");r.appendChild(d)}
 if(lastUrl&&!rc){var au=el("audio");au.controls=true;au.src=lastUrl;r.appendChild(au);var dl=el("a","btn","Download");dl.href=lastUrl;dl.download="urhmauuri-"+(c[1]||"card").replace(/[^\w]+/g,"_")+".webm";r.appendChild(dl)}}
function toggleRec(){if(rc){rc.stop();return}
 navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){stream=s;chunks=[];rc=new MediaRecorder(s);rc.ondataavailable=function(e){chunks.push(e.data)};
  rc.onstop=function(){var bl=new Blob(chunks,{type:rc.mimeType||"audio/webm"});lastUrl=URL.createObjectURL(bl);stream.getTracks().forEach(function(t){t.stop()});rc=null;renderRec()};rc.start();renderRec()}).catch(function(){var r=$("rec");r.appendChild(el("span","sm","Microphone not available."))})}
buildTop();build();
