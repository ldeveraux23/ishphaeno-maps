
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function baseOf(i){return LIB[i]?i:(i.slice(-1)==="ː"&&LIB[i.slice(0,-1)]?i.slice(0,-1):i);}
var rows="",have=0,none=0;
LX.sounds.forEach(function(o){
  var k=o.au||baseOf(o.ipa),a=LIBA[k]||(o.ipa.slice(-1)==="ː"?LIBA[o.ipa.slice(0,-1)]:null);
  var src,au;
  if(a){have++;src=a.src?'<a href="https://commons.wikimedia.org/wiki/File:'+esc(a.src)+'" target="_blank" rel="noopener">'+esc(decodeURIComponent(a.src))+'</a>':'<span class="small">Wikimedia Commons</span>';au=a.author?esc(a.author):'<span class="small">see file page</span>';}
  else{none++;src='<span class="small">No reference recording yet</span>';au="";}
  rows+="<tr><td><strong>"+esc(o.l)+"</strong></td><td>["+esc(o.ipa)+"]</td><td>"+src+"</td><td>"+au+"</td><td>"+(a?'<span class="small">see file page</span>':"")+"</td></tr>";
});
document.getElementById("tables").innerHTML='<div class="tblwrap"><table class="credits"><tr><th>Sound</th><th>IPA</th><th>Source</th><th>Author</th><th>Licence</th></tr>'+rows+"</table></div>";
document.getElementById("counts").textContent=have+" sounds have a reference recording from Wikimedia Commons or this site, and "+none+" have none yet (record them with the Record button).";
