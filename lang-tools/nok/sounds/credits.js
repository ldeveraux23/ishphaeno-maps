/* Credits are built from the sound list, the audio manifest and the Wikimedia links, so the page stays correct as recordings are added. */
var CREDIT={
  who:"Recorded for this site by its author",   /* put your name here if you want it shown */
  licence:""   /* optional, e.g. "CC BY 4.0"; left empty it shows a dash */
};
/* Optional: fill in what the Commons file page says, so it shows here too. Key = file name.
   Example: "Voiceless_bilabial_plosive.ogg":{author:"Name",licence:"CC BY-SA 3.0"} */
var META={};
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function fileOf(u){var m=u&&u.match(/\/([^\/]+\.(?:ogg|oga|wav|mp3))(?:\/|$)/);return m?m[1]:null;}
var GROUPS=[["Consonants",function(s){return!s.vowel&&!s.blend&&s.id.indexOf("d-")!==0;}],["Blends",function(s){return!!s.blend;}],["Vowels",function(s){return!!s.vowel&&s.id.indexOf("d-")!==0;}],["Diphthongs",function(s){return s.id.indexOf("d-")===0;}]];
var DL=(typeof LOCAL_AUDIO!=="undefined")?LOCAL_AUDIO:[];
var out="",nSite=0,nWiki=0,nNone=0;
GROUPS.forEach(function(g){
  var rows="";
  SOUNDS.filter(g[1]).forEach(function(s){
    var mine=DL.filter(function(n){return n===s.id||(n.indexOf(s.id+"-")===0&&/^[ztnr]$/.test(n.slice(s.id.length+1)));});
    var wu=WK[s.id],f=fileOf(wu),src,au,li;
    if(mine.length){nSite++;src="Recording made for this site <span class=\"small\">("+mine.map(function(n){return esc(n)+".mp3";}).join(", ")+")</span>";au=esc(CREDIT.who);li=CREDIT.licence?esc(CREDIT.licence):"&mdash;";}
    else if(f){nWiki++;var m=META[f]||{};src='<a href="https://commons.wikimedia.org/wiki/File:'+esc(f)+'" target="_blank" rel="noopener">'+esc(decodeURIComponent(f))+'</a>';au=m.author?esc(m.author):'<span class="small">see file page</span>';li=m.licence?esc(m.licence):'<span class="small">see file page</span>';}
    else{nNone++;src='<span class="small">No reference recording yet</span>';au="";li="";}
    rows+="<tr><td><strong>"+esc(s.l)+"</strong></td><td>["+esc(s.i)+"]</td><td>"+src+"</td><td>"+au+"</td><td>"+li+"</td></tr>";
  });
  out+="<h2>"+g[0]+"</h2><div class=\"tblwrap\"><table class=\"credits\"><tr><th>Sound</th><th>IPA</th><th>Source</th><th>Author</th><th>Licence</th></tr>"+rows+"</table></div>";
});
document.getElementById("tables").innerHTML=out;
document.getElementById("counts").textContent=nSite+" sounds use a recording made for this site, "+nWiki+" use a Wikimedia Commons file, and "+nNone+" have no reference recording yet.";
