function buildToggle(){
  var el=document.getElementById("tog");el.innerHTML="";
  Object.keys(DN).forEach(function(k){
    var b=document.createElement("button");b.textContent=DN[k];b.setAttribute("aria-pressed",k===cur?"true":"false");
    b.onclick=function(){cur=k;buildToggle();buildCharts();if(sel&&BYID[sel]&&inD(BYID[sel]))openCard(sel);else if(sel){sel=null;clearCard();}else{}};
    el.appendChild(b);
  });
}
function clearCard(){var c=document.getElementById("card");c.className="card empty";c.innerHTML="<p><strong>Pick a sound.</strong> Click any letter on the charts.</p>";}

/* ---------- charts ---------- */
var PL=["Bilabial","Labiodental","Dental","Alveolar","Post-alveolar","Palatal","Velar","Labial-velar","Uvular","Glottal"];
var MN=["Plosive","Nasal","Tap","Approximant","Fricative","Affricate","Lateral"];
function snd(s){
  var b=document.createElement("button");b.className="snd"+(s.dl.length<4?" only":"")+(sel===s.id?" sel":"");b.dataset.id=s.id;
  b.innerHTML='<span class="l"></span><span class="i"></span>';
  b.querySelector(".l").textContent=dget(s,"l");b.querySelector(".i").textContent="["+dget(s,"i")+"]";
  b.onclick=function(){openCard(s.id);};return b;
}
function buildCharts(){
  var col=document.getElementById("chartcol");col.innerHTML="";
  var intro=document.createElement("div");intro.className="intro";
  intro.innerHTML="<strong>"+DN[cur]+".</strong> Dashed green borders mark sounds that exist only in some dialects. Tones are retired: accents change vowel quality only, and stress (penultimate by default) is never written.";
  col.appendChild(intro);
  var h=document.createElement("h2");h.textContent="Consonants";col.appendChild(h);
  var wrap=document.createElement("div");wrap.className="tblwrap";
  var t=document.createElement("table");t.className="chart";
  var hr="<tr><th></th>"+PL.map(function(p){return"<th>"+p+"</th>";}).join("")+"</tr>";
  t.innerHTML=hr;
  MN.forEach(function(m){
    var tr=document.createElement("tr");var th=document.createElement("th");th.className="rowh";th.textContent=m;tr.appendChild(th);
    PL.forEach(function(p){
      var td=document.createElement("td");
      SOUNDS.filter(function(s){return!s.vowel&&!s.blend&&inD(s)&&posOf(s)[0]===m&&posOf(s)[1]===p;}).forEach(function(s){td.appendChild(snd(s));});
      tr.appendChild(td);
    });
    t.appendChild(tr);
  });
  wrap.appendChild(t);col.appendChild(wrap);
  var h2=document.createElement("h2");h2.textContent="Blends with their own letters";col.appendChild(h2);
  var r=document.createElement("div");r.className="row";
  SOUNDS.filter(function(s){return s.blend&&inD(s);}).forEach(function(s){r.appendChild(snd(s));});col.appendChild(r);
  var h3=document.createElement("h2");h3.textContent="Vowels";col.appendChild(h3);
  var VG=[["Close",["v-ia","v-ua"],["v-in"],["v-ig"],["v-u"],[]],
          ["Near-close",["v-i"],["v-un"],[],["v-ug"],[]],
          ["Close-mid",["v-ea","v-og"],["v-en","v-on"],[],["v-o"],[]],
          ["Mid",[],[],["v-ex"],["v-oa"],[]],
          ["Open-mid",["v-eg","v-e"],[],[],["v-ed","v-ud"],[]],
          ["Near-open",["v-ad"],[],["v-a"],[],[]],
          ["Open",["v-aa"],[],[],["v-ag"],["v-an"]]];
  var vw=document.createElement("div");vw.className="tblwrap";
  var vt=document.createElement("table");vt.className="chart vgrid";
  vt.innerHTML="<tr><th></th><th>Front</th><th>Nasalized front</th><th>Central</th><th>Back</th><th>Nasalized back</th></tr>";
  VG.forEach(function(row){
    var tr=document.createElement("tr");var th=document.createElement("th");th.className="rowh";th.textContent=row[0];tr.appendChild(th);
    for(var c=1;c<=5;c++){var td=document.createElement("td");if(!row[c].length)td.className="empty";row[c].forEach(function(id){td.appendChild(snd(BYID[id]));});tr.appendChild(td);}
    vt.appendChild(tr);
  });
  vw.appendChild(vt);col.appendChild(vw);
  var h4=document.createElement("h2");h4.textContent="Diphthongs";col.appendChild(h4);
  var dr=document.createElement("div");dr.className="row";
  ["d-ai","d-au","d-ei","d-oi"].forEach(function(id){dr.appendChild(snd(BYID[id]));});col.appendChild(dr);
  var note=document.createElement("p");note.className="small";
  note.textContent="Accents: plain (i u o e a), acute / shina (í ú ó é á), grave / shẹna (ì ù ò è à), underdot / dụna (ẹ ọ ụ ạ), umlaut / tóna (ï ü ö ë ä, the nasal vowels). Front rounded vowels: ú ò e ü ö.";
  col.appendChild(note);
  if(cur==="r"){var rp=document.createElement("div");rp.className="panel";rp.innerHTML="<strong>Ranakumùng final-vowel reduction.</strong> An unstressed plain or acute vowel at the very end of a word reduces, and the spelling changes: o, ó → u; é → í; e → i; á → a. Grave, underdot and umlaut vowels never reduce. Open any of o, ó, é, e, á to see it on its card.";col.appendChild(rp);}
  if(cur==="n"){var np=document.createElement("div");np.className="panel";np.innerHTML="<strong>Nasibumù shifts.</strong> d → z; t → l or d; p → b; b → bh; k and y → g before close vowels (Sónánèbọné), kw → gw. Open t, d, p, b, k, y or kw to see the rule on its card.";col.appendChild(np);}
}

/* ---------- card ---------- */
function esc(s){return String(s).replace(/[&<>]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;"}[c];});}
function openCard(id){
  var s=BYID[id];if(!s)return;sel=id;
  document.querySelectorAll(".snd").forEach(function(b){b.classList.toggle("sel",b.dataset.id===id);});
  var c=document.getElementById("card");c.className="card";
  var only=s.dl.length<4?'<span class="badge">Only in '+s.dl.split("").map(function(k){return DS[k];}).join(", ")+'</span>':"";
  var h='<div class="big"><span class="L">'+esc(dget(s,"l"))+'</span><span class="I">['+esc(dget(s,"i"))+']</span></div><div style="margin-top:6px">'+only+(s.name?'<span class="badge">'+esc(s.name)+'</span>':"")+'<span class="badge" style="background:#eee;color:#444;border-color:#ccc">'+DS[cur]+'</span></div>';
  h+="<h3>How to make it</h3><p>"+esc(dget(s,"how"))+"</p>";
  var nt=dget(s,"note");if(nt)h+='<div class="panel">'+esc(nt)+"</div>";
  if(cur==="n"){
    var key=s.id==="gl"?null:s.id;
    var sh=SHIFT[key==="j6"?"y":key];if(key==="y")sh=SHIFT.y;
    if(sh&&["d","t","p","b","k","y","kw"].indexOf(s.id)>=0)h+='<div class="panel"><strong>Nasibumù shift.</strong> '+esc(sh)+"</div>";
    if(RAISE[s.id])h+='<div class="panel"><strong>Nasibumù raising.</strong> Before a g made by Sónánèbọné, '+esc(RAISE[s.id])+".</div>";
  }
  if(cur==="r"&&RED[s.id])h+='<div class="panel"><strong>Ranakumùng reduction.</strong> Unstressed and at the end of a word: '+esc(RED[s.id])+" (the spelling changes too).</div>";
  var kk=KEY[s.id+":"+cur]||KEY[s.id]||[];
  if((s.id==="th"||s.id==="theta")&&(cur==="n"||cur==="r"))kk=["No th sound here. ð is said t and θ is said s: use the English t and s."];
  h+="<h3>Sounds you may know</h3>";
  var k2n=(KEY2[s.id+":"+cur]||KEY2[s.id]||[]).length>0;
  h+=kk.length?"<ul>"+kk.map(function(k){return"<li>"+esc(k)+"</li>";}).join("")+"</ul>":(k2n?"":'<p class="small">Not in the Wikipedia IPA key, and no widely studied language I can confirm has it. Use your own recording as the model.</p>');
  var k2=KEY2[s.id+":"+cur]||KEY2[s.id]||[];
  if(k2.length)h+='<p class="small"><strong>Not in the key; from widely studied languages:</strong></p><ul>'+k2.map(function(k){return"<li>"+esc(k)+"</li>";}).join("")+"</ul>";
  h+='<p class="small">Examples follow the Wikipedia Help:IPA key, in its language order: French, German and Spanish; then Mandarin, Hindustani, Arabic and Russian; then Swahili, Zulu and Turkish. Matches are approximate.</p>';
  var cl=CL[s.id+":"+cur]||CL[s.id];
  h+="<h3>In your languages</h3>";
  h+=cl?'<p><strong>'+esc(cl[0])+':</strong> '+esc(cl[1])+' ('+esc(cl[2])+')'+(cl[3]?' /'+esc(cl[3])+'/':'')+'</p>':'<p class="small">No word with this sound in your language files yet.</p>';
  var an=ART[s.id+":"+cur]||ART[s.id];
  if(an)h+='<p class="small"><a href="https://en.wikipedia.org/wiki/'+an+'" target="_blank" rel="noopener">Wikipedia article for this sound</a> (audio and more languages)</p>';
  var wu=WK[s.id];
  if(s.id==="r"&&cur!=="z"&&cur!=="n")wu=null;
  if((s.id==="th"||s.id==="theta")&&(cur==="n"||cur==="r"))wu=null;
  h+='<h3>Listen</h3><div id="lst"></div>';
  h+='<div class="links"><a href="'+SS+'" target="_blank" rel="noopener">Seeing Speech: IPA chart</a>';
  h+="</div>";
  h+='<h3>Record yourself and compare</h3><div id="rc"></div>';
  var pr=dget(s,"pairs")||[];
  if(s.vowel)pr=pr.map(function(p){return[p[0].replace(/^b/,""),p[1].replace(/^b/,"")];});
  h+="<h3>Syllable pairs to practise</h3>";
  if(pr.length){h+='<div class="pairs">'+pr.map(function(p){return'<span class="pair">'+esc(p[0])+" / "+esc(p[1])+"</span>";}).join("")+'</div><p class="small">Vowels are paired bare, with their nearest neighbours in quality. Real Nok minimal word pairs can replace these as the dictionary grows.</p>';}
  else h+='<p class="small">No pairs yet.</p>';
  c.innerHTML=h;
  buildListen(document.getElementById("lst"),s,wu);
  buildRecorder(document.getElementById("rc"),s);
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
function idb(){return new Promise(function(res){if(DB)return res(DB);try{var rq=indexedDB.open("noksound",1);rq.onupgradeneeded=function(){rq.result.createObjectStore("refs");};rq.onsuccess=function(){DB=rq.result;res(DB);};rq.onerror=function(){res(null);};}catch(e){res(null);}});}
function saveRef(k,blob){return idb().then(function(db){if(!db)return;try{db.transaction("refs","readwrite").objectStore("refs").put(blob,k);}catch(e){}});}
function loadRef(k){return idb().then(function(db){return new Promise(function(res){if(!db)return res(null);try{var q=db.transaction("refs").objectStore("refs").get(k);q.onsuccess=function(){res(q.result||null);};q.onerror=function(){res(null);};}catch(e){res(null);}});});}
function buildRecorder(box,s){
  var key=cur+":"+s.id;
  var emb=window.REFURL||null;
  box.innerHTML='<div class="lab">'+(emb?'Reference recording':'My reference recording (the model sound)')+'</div>'+(emb?'<div><button class="act" id="tref" type="button" aria-pressed="false">Show reference spectrogram</button></div>':'')+'<canvas class="spec" id="cref"'+(emb?' style="display:none"':'')+'></canvas>'+
   '<div id="refbtns"'+(emb?' style="display:none"':'')+'>'+(emb?'':'<input type="file" id="fref" accept="audio/*"> ')+'<button class="act" id="pref" disabled>Play</button> <button class="act" id="dref" disabled>Download</button></div>'+
   '<div class="lab">My attempt</div><canvas class="spec" id="cmine"></canvas>'+
   '<div><button class="act" id="rec">Record</button> <input type="file" id="fmine" accept="audio/*"> <button class="act" id="pmine" disabled>Play</button> <button class="act" id="dmine" disabled>Download</button></div>'+
   '<div class="msg" id="rmsg"></div>';
  var msg=box.querySelector("#rmsg");
  function show(obj,cv,pb,store){var db=box.querySelector(store===REF?"#dref":"#dmine");db.disabled=false;db.onclick=function(){var t=(obj.blob.type||"").toLowerCase();var ex=t.indexOf("webm")>=0?"webm":t.indexOf("ogg")>=0?"ogg":(t.indexOf("mp4")>=0||t.indexOf("m4a")>=0)?"m4a":(t.indexOf("mpeg")>=0||t.indexOf("mp3")>=0)?"mp3":t.indexOf("wav")>=0?"wav":"audio";var a=document.createElement("a");a.href=URL.createObjectURL(obj.blob);a.download="nok-"+cur+"-"+s.id+(store===REF?"-reference.":"-attempt.")+ex;document.body.appendChild(a);a.click();a.remove();};store[key]=obj;drawSpec(obj.data,obj.sr,cv);pb.disabled=false;pb.onclick=function(){var a=new Audio(URL.createObjectURL(obj.blob));a.play();};}
  var cref=box.querySelector("#cref"),cmine=box.querySelector("#cmine"),pref=box.querySelector("#pref"),pmine=box.querySelector("#pmine");
  [cref,cmine].forEach(function(c){c.width=800;c.height=180;});
  if(emb){var tref=box.querySelector("#tref"),loaded=false;
    function loadEmb(){if(loaded)return;loaded=true;fetch(emb).then(function(r){if(!r.ok)throw 0;return r.blob();}).then(function(b){return decode(b);}).then(function(o){if(sel===s.id)show(o,cref,pref,REF);}).catch(function(){loaded=false;msg.textContent="The reference spectrogram could not be loaded here. The player above still works.";});}
    function setT(on){cref.style.display=on?"":"none";box.querySelector("#refbtns").style.display=on?"":"none";tref.setAttribute("aria-pressed",on);tref.textContent=on?"Hide reference spectrogram":"Show reference spectrogram";try{localStorage.setItem("lxshowref",on?"1":"0");}catch(e){}if(on)loadEmb();}
    tref.onclick=function(){setT(cref.style.display==="none");};
    var pref0=false;try{pref0=localStorage.getItem("lxshowref")==="1";}catch(e){}
    if(pref0)setT(true);}
  else if(REF[key])show(REF[key],cref,pref,REF);else loadRef(key).then(function(b){if(b&&sel===s.id)decode(b).then(function(o){show(o,cref,pref,REF);}).catch(function(){});});
  if(MINE[key])show(MINE[key],cmine,pmine,MINE);
  if(box.querySelector("#fref"))box.querySelector("#fref").onchange=function(e){var f=e.target.files[0];if(!f)return;decode(f).then(function(o){show(o,cref,pref,REF);saveRef(key,f);msg.textContent="";}).catch(function(){msg.textContent="Could not read that audio file.";});};
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

/* ---------- reference audio: site recordings first, then Wikimedia Commons ---------- */
var LOCAL=(typeof LOCAL_AUDIO!=="undefined")?LOCAL_AUDIO:[];
function buildListen(box,s,wu){
  var list=[];
  if(LOCAL.indexOf(s.id+"-"+cur)>=0)list.push({u:"../audio/"+s.id+"-"+cur+".mp3",site:true});
  if(LOCAL.indexOf(s.id)>=0)list.push({u:"../audio/"+s.id+".mp3",site:true});
  if(wu)list.push({u:wu,site:false});
  window.REFURL=null;
  if(!list.length){box.innerHTML='<p class="small">No reference file for this sound yet. Add your own recording below; it becomes the model.</p>';return;}
  var a=document.createElement("audio");a.controls=true;a.preload="none";a.src=list[0].u;window.REFURL=list[0].u;
  var p=document.createElement("p");p.className="small";
  var vl=(list[0].site===false&&(s.id==="p"||s.id==="t"||s.id==="k"||s.id==="s"||s.id==="sh"||s.id==="tsh6"))?" It is the voiceless sound; the voiced partner has no file yet.":"";
  p.textContent=list[0].site?"Reference recording made for this site.":"Reference recording from Wikimedia Commons."+vl;
  box.appendChild(a);box.appendChild(p);
}
