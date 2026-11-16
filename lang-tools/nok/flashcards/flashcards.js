
var S={deck:"Verbs",dir:"nk2en",mode:"flip",shuffle:true,lenient:false,kb:true};
var Q=[],i=0,flipped=false,answered=false,again=[],known={};
try{var sv=JSON.parse(localStorage.getItem("nokflash")||"{}");for(var k in sv.S||{})S[k]=sv.S[k];known=sv.known||{};}catch(e){}
function save(){try{localStorage.setItem("nokflash",JSON.stringify({S:S,known:known}));}catch(e){}}
function $(id){return document.getElementById(id)}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function deckObj(id){for(var j=0;j<DECKS.length;j++)if(DECKS[j].id===id)return DECKS[j];return null}
function allCards(){if(S.deck==="__all")return DECKS.reduce(function(a,d){return a.concat(d.cards.map(function(c){return c.concat([d.id])}))},[]);var d=deckObj(S.deck);return d.cards.map(function(c){return c.concat([d.id])})}
function key(c){return c[2]+"|"+c[0]}
function shuf(a){a=a.slice();for(var j=a.length-1;j>0;j--){var r=Math.floor(Math.random()*(j+1));var t=a[j];a[j]=a[r];a[r]=t}return a}
function build(onlyUnknown){var c=allCards();if(onlyUnknown)c=c.filter(function(x){return !known[key(x)]});Q=S.shuffle?shuf(c):c;i=0;again=[];render()}
function norm(s,len){s=s.toLowerCase().replace(/[’‘`ʼ′]/g,"'").replace(/\([^)]*\)/g," ").replace(/ng'\s+/g,"ng'").replace(/[.!?¿¡]/g,"");if(len){s=s.normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ä/g,"a")}else s=s.normalize("NFC");return s.replace(/\s+/g," ").trim()}
function alts(s){s=s.replace(/\([^)]*\)/g," ");var p=s.split(/\s*[\/,;]\s*|\s+or\s+/i),out=[];p.forEach(function(x){x=x.trim();if(!x)return;var m=x.split(/(?=ng[’‘'`]\s*\S)/i);m.forEach(function(y){y=y.trim();if(y)out.push(y)})});return out.length?out:[s]}
function enAlts(s){return alts(s).map(function(x){return x.replace(/^to\s+/i,"")})}
function cur(){return Q[i]}
function frontText(c){return S.dir==="nk2en"?c[1]:c[0]}
function backText(c){return S.dir==="nk2en"?c[0]:c[1]}
function buildTop(){
 var d=$("decks");d.innerHTML="";
 var all=DECKS.reduce(function(a,x){return a+x.cards.length},0);
 function chip(id,name,n){var b=el("button","chip");b.setAttribute("aria-pressed",S.deck===id);b.innerHTML=name+"<small>"+n+"</small>";b.onclick=function(){S.deck=id;save();buildTop();build()};d.appendChild(b)}
 chip("__all","All sections",all);DECKS.forEach(function(x){chip(x.id,x.name,x.cards.length)});
 var o=$("opts");o.innerHTML="";
 function tog(label,get,set){var b=el("button","chip",label);b.setAttribute("aria-pressed",get());b.onclick=function(){set(!get());save();buildTop();render()};o.appendChild(b)}
 function pick(label,on,fn){var b=el("button","chip",label);b.setAttribute("aria-pressed",on);b.onclick=function(){fn();save();buildTop();build()};o.appendChild(b)}
 pick("Nok → English",S.dir==="nk2en",function(){S.dir="nk2en"});
 pick("English → Nok",S.dir==="en2nk",function(){S.dir="en2nk"});
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
 }else{$("stage").onclick=null;a.style.display="";h.textContent=S.dir==="nk2en"?"Type the English meaning":"Type it in Nok (verbs start with ng’)";
  var ck=el("button","btn big pri","Check");ck.onclick=check;ctl.appendChild(ck);
  var sk=el("button","btn big","Show answer");sk.onclick=function(){reveal(false)};ctl.appendChild(sk);
  if(window.matchMedia("(hover:hover)").matches)a.focus();}
}
function flip(){flipped=true;$("back").textContent=backText(cur());$("hint").textContent="";var ctl=$("ctl");ctl.innerHTML="";
 var g=el("button","btn big good","Got it");g.onclick=function(e){e.stopPropagation();mark(true)};
 var x=el("button","btn big bad","Again");x.onclick=function(e){e.stopPropagation();mark(false)};ctl.appendChild(x);ctl.appendChild(g);$("stage").onclick=null}
function mark(ok){var c=cur();if(ok)known[key(c)]=1;else{delete known[key(c)];again.push(c)}save();i++;render()}
function isCorrect(t,c){
 if(S.dir==="nk2en"){var g=norm(t,true).replace(/^to\s+/,"");return enAlts(c[0]).some(function(x){return norm(x,true)===g})}
 var g2=norm(t,S.lenient);return alts(c[1]).some(function(x){return norm(x,S.lenient)===g2})}
function check(){if(answered)return;var c=cur(),t=$("ans").value;if(!t.trim())return;var ok=isCorrect(t,c),a=$("ans"),fb=$("fb");
 if(!ok&&S.dir==="en2nk"&&c[2]==="Verbs"&&!/^ng['’‘`]/i.test(t.trim())){var t2="ng’"+t.trim();if(isCorrect(t2,c)){fb.className="no-t";fb.textContent="Nearly. Infinitives always start with ng’.";a.className="no";reveal(false,true);return}}
 a.className=ok?"ok":"no";answered=true;fb.className=ok?"ok-t":"no-t";fb.textContent=ok?"Correct":"Not quite. Answer: "+backText(c);
 $("back").textContent=backText(c);if(ok)known[key(c)]=1;else{delete known[key(c)];again.push(c)}save();next()}
function reveal(ok,keep){var c=cur();answered=true;$("back").textContent=backText(c);if(!keep)$("fb").textContent="";delete known[key(c)];again.push(c);save();next()}
function next(){var ctl=$("ctl");ctl.innerHTML="";var b=el("button","btn big pri","Next");b.onclick=function(){i++;render()};ctl.appendChild(b);b.focus()}
$("ans").addEventListener("keydown",function(e){if(e.key==="Enter"){e.preventDefault();if(answered){i++;render()}else check()}});
document.addEventListener("keydown",function(e){if(e.target.id==="ans")return;if(e.code==="Space"&&S.mode==="flip"&&cur()){e.preventDefault();if(!flipped)flip()}else if(flipped&&cur()){if(e.key==="ArrowRight")mark(true);if(e.key==="ArrowLeft")mark(false)}});
/* keyboard */
var KB=[["a","á","à","ạ","ä"],["e","é","è","ẹ","ë"],["i","í","ì","ï"],["o","ó","ò","ọ","ö"],["u","ú","ù","ụ","ü"],["č"],["ʼ"]];
var kbShift=false;
function ins(ch){var a=$("ans");if(a.style.display==="none")return;var s=a.selectionStart==null?a.value.length:a.selectionStart,e=a.selectionEnd==null?s:a.selectionEnd;a.value=a.value.slice(0,s)+ch+a.value.slice(e);var p=s+ch.length;try{a.setSelectionRange(p,p)}catch(x){}a.focus()}
function renderKb(){var k=$("kb");if(!S.kb||S.mode!=="type"||!cur()){k.hidden=true;return}k.hidden=false;k.innerHTML="";
 function key(label,fn,cls){var b=el("button","k "+(cls||""),label);b.type="button";b.onmousedown=function(e){e.preventDefault()};b.ontouchstart=function(e){};b.onclick=function(){fn();};return b}
 var r0=el("div","krow");
 var gs=el("div","kg");KB.forEach(function(g){if(g.length>1||true){}});
 r0.appendChild(key("ng’",function(){ins("ng’")},"w"));
 r0.appendChild(key("’",function(){ins("’")}));
 r0.appendChild(key(kbShift?"⇧ on":"⇧",function(){kbShift=!kbShift;renderKb()},"w "+(kbShift?"on":"")));
 r0.appendChild(key("⌫",function(){var a=$("ans"),s=a.selectionStart,e=a.selectionEnd;if(s===e&&s>0){a.value=a.value.slice(0,s-1)+a.value.slice(e);a.setSelectionRange(s-1,s-1)}else{a.value=a.value.slice(0,s)+a.value.slice(e);a.setSelectionRange(s,s)}a.focus()},"w"));
 r0.appendChild(key("space",function(){ins(" ")},"w"));
 k.appendChild(r0);
 KB.slice(0,6).forEach(function(g){var r=el("div","krow");g.forEach(function(ch){var c=kbShift?ch.toUpperCase():ch;r.appendChild(key(c,function(){ins(c);if(kbShift){kbShift=false;renderKb()}}))});k.appendChild(r)});
 var n=el("div","sm","Dot-below letters (ạ ẹ ọ ụ) and ä ë ï ö ü are separate keys. ’ and ‘ both work.");n.style.textAlign="center";k.appendChild(n)}
/* record */
var rc=null,chunks=[],stream=null,lastUrl=null;
function renderRec(){var r=$("rec");r.innerHTML="";var c=cur();if(!c||!navigator.mediaDevices||!window.MediaRecorder)return;
 var b=el("button","btn",rc?"Stop":"Record yourself saying it");b.onclick=toggleRec;r.appendChild(b);
 if(rc){var d=el("span","dot");r.appendChild(d)}
 if(lastUrl&&!rc){var au=el("audio");au.controls=true;au.src=lastUrl;r.appendChild(au);var dl=el("a","btn","Download");dl.href=lastUrl;dl.download="nok-"+(c[1]||"card").replace(/[^\wÀ-ɏạẹọụ]+/g,"_")+".webm";r.appendChild(dl)}}
function toggleRec(){if(rc){rc.stop();return}
 navigator.mediaDevices.getUserMedia({audio:true}).then(function(s){stream=s;chunks=[];rc=new MediaRecorder(s);rc.ondataavailable=function(e){chunks.push(e.data)};
  rc.onstop=function(){var bl=new Blob(chunks,{type:rc.mimeType||"audio/webm"});lastUrl=URL.createObjectURL(bl);stream.getTracks().forEach(function(t){t.stop()});rc=null;renderRec()};rc.start();renderRec()}).catch(function(){var r=$("rec");r.appendChild(el("span","sm"," Microphone not available."))})}
buildTop();build();
