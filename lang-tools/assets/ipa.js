"use strict";
/* Generic Sound Cards engine for the Sekh Universe conlangs. Reads LX (language data) and LIB / LIBA (shared sound library). */
var SS="https://www.seeingspeech.ac.uk/ipa-charts/";
var cur=(LX.dialects&&LX.dialects[0].k)||"";
var DS={},DN={};(LX.dialects||[]).forEach(function(d){DN[d.k]=d.n;DS[d.k]=d.s||d.n;});
var sel=null,REF={},MINE={};
var MORD=["Plosive","Ejective","Implosive","Nasal","Prenasal","Trill","Tap","Fricative","Lateral fricative","Affricate","Approximant","Lateral approximant"];
var PORD=["Bilabial","Labiodental","Dental","Alveolar","Post-alveolar","Retroflex","Palatal","Labial-palatal","Velar","Labial-velar","Uvular","Pharyngeal","Epiglottal","Glottal"];
var HORD=["Close","Near-close","Close-mid","Mid","Open-mid","Near-open","Open"];
var BORD=["Front","Central","Back"];
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c];});}
function hex(s){return Array.from(s).map(function(c){return c.codePointAt(0).toString(16);}).join("-");}
function baseOf(ipa){return(LIB[ipa])?ipa:(ipa.slice(-1)==="ː"&&LIB[ipa.slice(0,-1)]?ipa.slice(0,-1):ipa);}
var SOUNDS=[],BYKEY={};
LX.sounds.forEach(function(o,n){
  o.key=hex(o.ipa)+"_"+n; o.dl=o.dl||"";
  var b=baseOf(o.ipa),L=LIB[b];
  if(o.diph||(LIBD&&LIBD[o.ipa])){o.g="d";var d=LIBD[o.ipa]||["a","i"];o.how=o.how||('Start with '+d[0]+' and glide toward '+d[1]+' in one movement. It counts as a single vowel unit, not two.');o.know=o.know||[];var sv=LIB[d[0]];o.pos=sv?[sv.h,sv.b]:["Open","Front"];o.nasal=false;}
  else if(L){
    o.g=(L.t==="v")?"v":(L.m==="Prenasal"?"b":"c");
    o.how=o.how||L.how+((o.ipa.slice(-1)==="ː")?LONGNOTE:"");
    o.know=o.know||L.know;
    o.pos=L.t==="v"?[L.h,L.b]:[L.m,L.p]; o.nasal=!!L.nasal;
  } else {o.g=o.g||"c";o.how=o.how||"";o.know=o.know||[];o.pos=o.pos||["Other","—"];}
  o.base=b; SOUNDS.push(o); BYKEY[o.key]=o;
});
function dget(s,k){var b=s.by&&s.by[cur];return(b&&b[k]!==undefined)?b[k]:s[k];}
function inD(s){return!s.dl||s.dl.indexOf(cur)>=0;}
function allD(){return(LX.dialects||[]).map(function(d){return d.k;}).join("");}
function cardNote(s){return dget(s,"note");}

/* ---------- toggle ---------- */
function buildToggle(){
  var bar=document.querySelector(".subbar");
  if(!LX.dialects){if(bar)bar.style.display="none";return;}
  var el=document.getElementById("tog");el.innerHTML="";
  LX.dialects.forEach(function(d){
    var b=document.createElement("button");b.textContent=d.n;b.setAttribute("aria-pressed",d.k===cur?"true":"false");
    b.onclick=function(){cur=d.k;buildToggle();buildCharts();if(sel&&BYKEY[sel]&&inD(BYKEY[sel]))openCard(sel);else if(sel){sel=null;clearCard();}};
    el.appendChild(b);
  });
}
function clearCard(){var c=document.getElementById("card");c.className="card empty";c.innerHTML="<p><strong>Pick a sound.</strong> Click any letter on the charts.</p>";}

/* ---------- charts ---------- */
function snd(s){
  var b=document.createElement("button");b.className="snd"+(LX.dialects&&s.dl&&s.dl.length<allD().length?" only":"")+(sel===s.key?" sel":"")+(s.flag?" flag":"");b.dataset.id=s.key;
  b.innerHTML='<span class="l"></span><span class="i"></span>';
  b.querySelector(".l").textContent=dget(s,"l");b.querySelector(".i").textContent="["+dget(s,"ipa")+"]";
  b.onclick=function(){openCard(s.key);};return b;
}
function hasAudio(s){return!!audioFor(s);}
function buildCharts(){
  var col=document.getElementById("chartcol");col.innerHTML="";
  var vis=SOUNDS.filter(inD);
  var intro=document.createElement("div");intro.className="intro";
  var dn=LX.dialects?cur&&DN[cur]:"";
  var dd=LX.dialects?LX.dialects.filter(function(d){return d.k===cur;})[0]:null;
  intro.innerHTML=(dn?"<strong>"+esc(dn)+".</strong> ":"")+(dd&&dd.note?dd.note+" ":"")+(LX.intro||"");
  col.appendChild(intro);
  var cons=vis.filter(function(s){return s.g==="c";});
  if(cons.length){
    var h=document.createElement("h2");h.textContent="Consonants";col.appendChild(h);
    var ms=MORD.filter(function(m){return cons.some(function(s){return s.pos[0]===m;});});
    var extraM=[];cons.forEach(function(s){if(MORD.indexOf(s.pos[0])<0&&extraM.indexOf(s.pos[0])<0)extraM.push(s.pos[0]);});ms=ms.concat(extraM);
    var ps=PORD.filter(function(p){return cons.some(function(s){return s.pos[1]===p;});});
    cons.forEach(function(s){if(PORD.indexOf(s.pos[1])<0&&ps.indexOf(s.pos[1])<0)ps.push(s.pos[1]);});
    var wrap=document.createElement("div");wrap.className="tblwrap";
    var t=document.createElement("table");t.className="chart";
    t.innerHTML="<tr><th></th>"+ps.map(function(p){return"<th>"+p+"</th>";}).join("")+"</tr>";
    ms.forEach(function(m){
      var tr=document.createElement("tr");var th=document.createElement("th");th.className="rowh";th.textContent=m;tr.appendChild(th);
      ps.forEach(function(p){var td=document.createElement("td");cons.filter(function(s){return s.pos[0]===m&&s.pos[1]===p;}).forEach(function(s){td.appendChild(snd(s));});tr.appendChild(td);});
      t.appendChild(tr);
    });
    wrap.appendChild(t);col.appendChild(wrap);
  }
  var bl=vis.filter(function(s){return s.g==="b";});
  if(bl.length){var hb=document.createElement("h2");hb.textContent="Prenasals and blends";col.appendChild(hb);var rb=document.createElement("div");rb.className="row";bl.forEach(function(s){rb.appendChild(snd(s));});col.appendChild(rb);}
  function vtable(list,title){
    if(!list.length)return;
    var h3=document.createElement("h2");h3.textContent=title;col.appendChild(h3);
    var hs=HORD.filter(function(h){return list.some(function(s){return s.pos[0]===h;});});
    var vw=document.createElement("div");vw.className="tblwrap";
    var vt=document.createElement("table");vt.className="chart vgrid";
    vt.innerHTML="<tr><th></th>"+BORD.map(function(b){return"<th>"+b+"</th>";}).join("")+"</tr>";
    hs.forEach(function(h){
      var tr=document.createElement("tr");var th=document.createElement("th");th.className="rowh";th.textContent=h;tr.appendChild(th);
      BORD.forEach(function(b){var td=document.createElement("td");var items=list.filter(function(s){return s.pos[0]===h&&s.pos[1]===b;});if(!items.length)td.className="empty";items.forEach(function(s){td.appendChild(snd(s));});tr.appendChild(td);});
      vt.appendChild(tr);
    });
    vw.appendChild(vt);col.appendChild(vw);
  }
  var vo=vis.filter(function(s){return s.g==="v";});
  vtable(vo.filter(function(s){return!s.nasal;}),"Vowels");
  vtable(vo.filter(function(s){return s.nasal;}),"Nasal vowels");
  var dp=vis.filter(function(s){return s.g==="d";});
  if(dp.length){var h4=document.createElement("h2");h4.textContent="Diphthongs";col.appendChild(h4);var dr=document.createElement("div");dr.className="row";dp.forEach(function(s){dr.appendChild(snd(s));});col.appendChild(dr);}
  (LX.notes||[]).forEach(function(n){
    if(n.dl&&n.dl.indexOf(cur)<0)return;
    var p=document.createElement("div");p.className="panel";p.innerHTML="<strong>"+n.t+"</strong> "+n.h;col.appendChild(p);
  });
}

/* ---------- pairs ---------- */
function pairsFor(s){
  var vis=SOUNDS.filter(function(x){return inD(x)&&x!==s&&x.g===s.g;});
  var L=dget(s,"l");
  function sc(x){
    if(s.g==="v"||s.g==="d"){var hi=HORD.indexOf(s.pos[0])-HORD.indexOf(x.pos[0]);var bi=BORD.indexOf(s.pos[1])-BORD.indexOf(x.pos[1]);return Math.abs(hi)*1.2+Math.abs(bi)+(s.nasal!==x.nasal?2:0)+(s.g==="d"?0:0);}
    var d=0;if(x.pos[1]!==s.pos[1])d+=1.2;if(x.pos[0]!==s.pos[0])d+=1;return d||0.5;
  }
  vis.sort(function(a,b){return sc(a)-sc(b);});
  var out=[];
  vis.slice(0,3).forEach(function(x){
    if(s.g==="v"||s.g==="d")out.push([L,dget(x,"l")]);
    else out.push([L+"a",dget(x,"l")+"a"]);
  });
  return out;
}

/* ---------- card ---------- */
function audioFor(s){
  var k=s.au||s.base;var a=LIBA[k];
  if(!a&&s.ipa.slice(-1)==="ː")a=LIBA[s.ipa.slice(0,-1)];
  return a||null;
}
function openCard(key){
  var s=BYKEY[key];if(!s)return;sel=key;
  document.querySelectorAll(".snd").forEach(function(b){b.classList.toggle("sel",b.dataset.id===key);});
  var c=document.getElementById("card");c.className="card";
  var only=(LX.dialects&&s.dl&&s.dl.length<allD().length)?'<span class="badge">Only in '+s.dl.split("").map(function(k){return DS[k];}).join(", ")+'</span>':"";
  var h='<div class="big"><span class="L">'+esc(dget(s,"l"))+'</span><span class="I">['+esc(dget(s,"ipa"))+']</span></div><div style="margin-top:6px">'+only+(s.flag?'<span class="badge w">Needs your ruling</span>':"")+'</div>';
  h+="<h3>How to make it</h3><p>"+esc(dget(s,"how"))+"</p>";
  var nt=dget(s,"note");if(nt)h+='<div class="panel">'+nt+"</div>";
  var kk=dget(s,"know")||[];
  h+="<h3>Sounds you may know</h3>";
  h+=kk.length?"<ul>"+kk.map(function(k){return"<li>"+esc(k)+"</li>";}).join("")+"</ul>":'<p class="small">No widely studied language I can confirm has this sound. Use your own recording as the model.</p>';
  h+='<p class="small">Examples follow the Wikipedia Help:IPA key, in its language order: French, German and Spanish; then Mandarin, Hindustani, Arabic and Russian; then Swahili, Zulu and Turkish. Matches are approximate.</p>';
  var ex=dget(s,"ex");
  h+="<h3>In "+esc(LX.name)+"</h3>";
  h+=ex?'<p><strong>'+esc(ex[0])+'</strong> ('+esc(ex[1])+')'+(ex[2]?' /'+esc(ex[2])+'/':'')+(ex[3]?' <span class="small">'+esc(ex[3])+'</span>':'')+'</p>':'<p class="small">No example word with this sound in your language files yet.</p>';
  h+='<h3>Listen</h3><div id="lst"></div>';
  h+='<div class="links"><a href="'+SS+'" target="_blank" rel="noopener">Seeing Speech: IPA chart</a></div>';
  h+='<h3>Record yourself and compare</h3><div id="rc"></div>';
  var pr=pairsFor(s);
  h+="<h3>Syllable pairs to practise</h3>";
  h+=pr.length?'<div class="pairs">'+pr.map(function(p){return'<span class="pair">'+esc(p[0])+" / "+esc(p[1])+"</span>";}).join("")+'</div><p class="small">Built from this language\'s own sounds, nearest neighbours first.</p>':'<p class="small">No pairs yet.</p>';
  c.innerHTML=h;
  buildListen(document.getElementById("lst"),s);
  buildRecorder(document.getElementById("rc"),s);
}
function buildListen(box,s){
  var a=audioFor(s);
  if(!a){box.innerHTML='<p class="small">No reference file for this sound yet. Record it below with the Record button; use the upload box under “My reference recording” to keep it as the model.</p>';return;}
  var au=document.createElement("audio");au.controls=true;au.preload="none";au.src="../../audio/"+a.f+".mp3";
  var p=document.createElement("p");p.className="small";
  p.textContent="Reference recording"+(a.site?" made for this site.":" from Wikimedia Commons.")+(s.auNote?" "+s.auNote:"");
  box.appendChild(au);box.appendChild(p);
}
/* ---------- audio: recorder + spectrogram ---------- */
function fft(re,im){
  var n=re.length;
  for(var i=1,j=0;i<n;i++){var bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;if(i<j){var t=re[i];re[i]=re[j];re[j]=t;t=im[i];im[i]=im[j];im[j]=t;}}
  for(var len=2;len<=n;len<<=1){
    var ang=-2*Math.PI/len,wr=Math.cos(ang),wi=Math.sin(ang);
    for(var i2=0;i2<n;i2+=len){var cr=1,ci=0;
      for(var k=0;k<len/2;k++){
        var ur=re[i2+k],ui=im[i2+k],vr=re[i2+k+len/2]*cr-im[i2+k+len/2]*ci,vi=re[i2+k+len/2]*ci+im[i2+k+len/2]*cr;
        re[i2+k]=ur+vr;im[i2+k]=ui+vi;re[i2+k+len/2]=ur-vr;im[i2+k+len/2]=ui-vi;
        var nr=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=nr;}}}
}
function drawSpec(data,sr,canvas){
  var N=512,hop=128,maxHz=8000,bins=Math.min(N/2,Math.floor(maxHz/(sr/N)));
  var frames=Math.max(1,Math.floor((data.length-N)/hop));
  var off=document.createElement("canvas");off.width=frames;off.height=bins;
  var cx=off.getContext("2d"),img=cx.createImageData(frames,bins);
  var win=new Float32Array(N);for(var i=0;i<N;i++)win[i]=0.5-0.5*Math.cos(2*Math.PI*i/(N-1));
  var all=[],mx=-1e9;
  for(var f=0;f<frames;f++){
    var re=new Float32Array(N),im=new Float32Array(N);
    for(var k=0;k<N;k++)re[k]=(data[f*hop+k]||0)*win[k];
    fft(re,im);var col=new Float32Array(bins);
    for(var b=0;b<bins;b++){var m=Math.log10(1e-9+Math.sqrt(re[b]*re[b]+im[b]*im[b]))*20;col[b]=m;if(m>mx)mx=m;}
    all.push(col);
  }
  for(var f2=0;f2<frames;f2++)for(var b2=0;b2<bins;b2++){
    var v=(all[f2][b2]-(mx-70))/70;v=Math.max(0,Math.min(1,v));
    var p=((bins-1-b2)*frames+f2)*4;
    img.data[p]=Math.round(255*Math.min(1,v*2.2));img.data[p+1]=Math.round(255*Math.max(0,Math.min(1,(v-.35)*1.8)));img.data[p+2]=Math.round(255*(v<.5?v*1.6:Math.max(0,1.2-v*1.4)));img.data[p+3]=255;
  }
  cx.putImageData(img,0,0);
  canvas.width=800;canvas.height=180;var c2=canvas.getContext("2d");c2.imageSmoothingEnabled=true;c2.drawImage(off,0,0,800,180);
}
function decode(blob){
  return blob.arrayBuffer().then(function(ab){var AC=window.AudioContext||window.webkitAudioContext;var ctx=new AC();return ctx.decodeAudioData(ab).then(function(buf){var d=buf.getChannelData(0);ctx.close&&ctx.close();return{data:d,sr:buf.sampleRate,blob:blob};});});
}
/* optional IndexedDB for reference recordings */
var DB=null;
function idb(){return new Promise(function(res){if(DB)return res(DB);try{var rq=indexedDB.open("lxsound",1);rq.onupgradeneeded=function(){rq.result.createObjectStore("refs");};rq.onsuccess=function(){DB=rq.result;res(DB);};rq.onerror=function(){res(null);};}catch(e){res(null);}});}
function saveRef(k,blob){return idb().then(function(db){if(!db)return;try{db.transaction("refs","readwrite").objectStore("refs").put(blob,k);}catch(e){}});}
function loadRef(k){return idb().then(function(db){return new Promise(function(res){if(!db)return res(null);try{var q=db.transaction("refs").objectStore("refs").get(k);q.onsuccess=function(){res(q.result||null);};q.onerror=function(){res(null);};}catch(e){res(null);}});});}
function buildRecorder(box,s){
  var key=LX.id+":"+cur+":"+s.key;
  box.innerHTML='<div class="lab">My reference recording (the model sound)</div><canvas class="spec" id="cref"></canvas>'+
   '<div><input type="file" id="fref" accept="audio/*"> <button class="act" id="pref" disabled>Play</button> <button class="act" id="dref" disabled>Download</button></div>'+
   '<div class="lab">My attempt</div><canvas class="spec" id="cmine"></canvas>'+
   '<div><button class="act" id="rec">Record</button> <input type="file" id="fmine" accept="audio/*"> <button class="act" id="pmine" disabled>Play</button> <button class="act" id="dmine" disabled>Download</button></div>'+
   '<div class="msg" id="rmsg"></div>';
  var msg=box.querySelector("#rmsg");
  function show(obj,cv,pb,store){var db=box.querySelector(store===REF?"#dref":"#dmine");db.disabled=false;db.onclick=function(){var t=(obj.blob.type||"").toLowerCase();var ex=t.indexOf("webm")>=0?"webm":t.indexOf("ogg")>=0?"ogg":(t.indexOf("mp4")>=0||t.indexOf("m4a")>=0)?"m4a":(t.indexOf("mpeg")>=0||t.indexOf("mp3")>=0)?"mp3":t.indexOf("wav")>=0?"wav":"audio";var a=document.createElement("a");a.href=URL.createObjectURL(obj.blob);a.download=LX.id+"-"+cur+"-"+s.key+(store===REF?"-reference.":"-attempt.")+ex;document.body.appendChild(a);a.click();a.remove();};store[key]=obj;drawSpec(obj.data,obj.sr,cv);pb.disabled=false;pb.onclick=function(){var a=new Audio(URL.createObjectURL(obj.blob));a.play();};}
  var cref=box.querySelector("#cref"),cmine=box.querySelector("#cmine"),pref=box.querySelector("#pref"),pmine=box.querySelector("#pmine");
  [cref,cmine].forEach(function(c){c.width=800;c.height=180;});
  if(REF[key])show(REF[key],cref,pref,REF);else loadRef(key).then(function(b){if(b&&sel===s.key)decode(b).then(function(o){show(o,cref,pref,REF);}).catch(function(){});});
  if(MINE[key])show(MINE[key],cmine,pmine,MINE);
  box.querySelector("#fref").onchange=function(e){var f=e.target.files[0];if(!f)return;decode(f).then(function(o){show(o,cref,pref,REF);saveRef(key,f);msg.textContent="";}).catch(function(){msg.textContent="Could not read that audio file.";});};
  box.querySelector("#fmine").onchange=function(e){var f=e.target.files[0];if(!f)return;decode(f).then(function(o){show(o,cmine,pmine,MINE);msg.textContent="";}).catch(function(){msg.textContent="Could not read that audio file.";});};
  var rb=box.querySelector("#rec"),mr=null,chunks=[],stream=null;
  rb.onclick=function(){
    if(mr&&mr.state==="recording"){mr.stop();return;}
    if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia||!window.MediaRecorder){msg.textContent="This browser can't record here. Use the upload box to add a recording instead.";return;}
    navigator.mediaDevices.getUserMedia({audio:true}).then(function(st){
      stream=st;chunks=[];mr=new MediaRecorder(st);
      mr.ondataavailable=function(e){if(e.data.size)chunks.push(e.data);};
      mr.onstop=function(){stream.getTracks().forEach(function(t){t.stop();});rb.textContent="Record";rb.classList.remove("rec");var blob=new Blob(chunks,{type:mr.mimeType||"audio/webm"});decode(blob).then(function(o){show(o,cmine,pmine,MINE);}).catch(function(){msg.textContent="Recording could not be read back.";});};
      mr.start();rb.textContent="Stop";rb.classList.add("rec");msg.textContent="";
    }).catch(function(){msg.textContent="Microphone access was refused or isn't available here. Upload a recording instead.";});
  };
}

buildToggle();buildCharts();
