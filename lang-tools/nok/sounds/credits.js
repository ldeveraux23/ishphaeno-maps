/* Credits are built from the sound list, the audio manifest and the Wikimedia links, so the page stays correct as recordings are added. */
var CREDIT={
  who:"Recorded for this site by its author",   /* put your name here if you want it shown */
  licence:""   /* optional, e.g. "CC BY 4.0"; left empty it shows a dash */
};
/* Optional: fill in what the Commons file page says, so it shows here too. Key = file name.
   Example: "Voiceless_bilabial_plosive.ogg":{author:"Name",licence:"CC BY-SA 3.0"} */
var META={};
/* Recordings copied from Wikimedia Commons into audio/. Key = card id (or id-dialect). file = the Commons file name; author and licence are as stated there (empty = see the file page). */
var LOCAL_META={
 "gl":{file:"Glottal_stop.ogg",author:"Peter Isotalo",licence:""},
 "ch":{file:"Voiceless_uvular_fricative.ogg",author:"Peter Isotalo",licence:""},
 "kh":{file:"Voiceless_velar_fricative.ogg",author:"Peter Isotalo",licence:""},
 "r":{file:"Alveolar_tap.ogg",author:"Peter Isotalo",licence:""},
 "r-t":{file:"Retroflex_Approximant2.oga",author:"Pranav Jayachand",licence:""},
 "r-r":{file:"Voiced_uvular_fricative.ogg",author:"Peter Isotalo",licence:""},
 "ts":{file:"Voiceless_alveolar_sibilant_affricate.ogg",author:"Peter Isotalo",licence:""},
 "v-ud":{file:"PR-open-mid_back_unrounded_vowel2.ogg",author:"RoachPeter",licence:""},
 "v-e":{file:"Open-mid_front_rounded_vowel_%282%29.ogg",author:"Denelson83",licence:""},
 "v-og":{file:"Close-mid_front_rounded_vowel.ogg",author:"Denelson83",licence:""},
 "v-ig":{file:"Close_central_unrounded_vowel.ogg",author:"Denelson83",licence:""},
 "v-eg":{file:"Open-mid_front_unrounded_vowel.ogg",author:"Denelson83 (description credits Terfili)",licence:""},
 "v-aa":{file:"PR-open_front_unrounded_vowel.ogg",author:"RoachPeter",licence:""},
 "v-ag":{file:"Open_back_unrounded_vowel.ogg",author:"Denelson83",licence:""},
 "v-a":{file:"Near-open_central_unrounded_vowel.ogg",author:"Denelson83",licence:""},
 "v-ad":{file:"Near-open_front_unrounded_vowel.ogg",author:"Denelson83",licence:""},
 "v-an":{file:"Fr-en.ogg",author:"Vion Nicolas (Shtooka Project)",licence:""},
 "b":{file:"Voiced_bilabial_plosive.ogg",author:"Peter Isotalo",licence:""},
 "bh":{file:"Voiced_bilabial_fricative.ogg",author:"Peter Isotalo",licence:""},
 "th":{file:"Voiced_dental_fricative.ogg",author:"Peter Isotalo",licence:""},
 "g":{file:"Voiced_velar_plosive_02.ogg",author:"Peter Isotalo",licence:""},
 "y":{file:"Palatal_approximant.ogg",author:"Karmosin",licence:""},
 "l":{file:"Alveolar_lateral_approximant.ogg",author:"Peter Isotalo",licence:""},
 "v-ia":{file:"Close_front_unrounded_vowel.ogg",author:"Denelson83",licence:""},
 "v-i":{file:"Near-close_near-front_unrounded_vowel.ogg",author:"Denelson83",licence:""},
 "v-ea":{file:"Close-mid_front_unrounded_vowel.ogg",author:"Denelson83",licence:""},
 "v-ex":{file:"Mid-central_vowel.ogg",author:"Denelson83",licence:""},
 "n":{file:"Alveolar_nasal.ogg",author:"Peter Isotalo",licence:""},
 "ng":{file:"Velar_nasal.ogg",author:"Peter Isotalo",licence:""},
 "p":{file:"Voiceless_bilabial_plosive.ogg",author:"Peter Isotalo",licence:""},
 "ny":{file:"Palatal_nasal.ogg",author:"Peter Isotalo",licence:""},
 "s":{file:"Voiceless_alveolar_sibilant.ogg",author:"Peter Isotalo",licence:""},
 "sh":{file:"Voiceless_palato-alveolar_sibilant.ogg",author:"Peter Isotalo",licence:""},
 "tsh6":{file:"Voiceless_palato-alveolar_affricate.ogg",author:"Peter Isotalo",licence:""},
 "t":{file:"Voiceless_alveolar_plosive.ogg",author:"Peter Isotalo",licence:""},
 "v-ug":{file:"Near-close_near-back_rounded_vowel.ogg",author:"Denelson83",licence:""},
 "z":{file:"Voiced_alveolar_sibilant.ogg",author:"Peter Isotalo",licence:""},
 "zh":{file:"Voiced_palato-alveolar_sibilant.ogg",author:"Peter Isotalo",licence:""},
 "w":{file:"Voiced_labio-velar_approximant.ogg",author:"Peter Isotalo",licence:""},
 "v-u":{file:"Close_back_rounded_vowel.ogg",author:"Denelson83",licence:""},
 "v-ed":{file:"PR-open-mid_back_rounded_vowel.ogg",author:"RoachPeter",licence:""},
 "v-o":{file:"Close-mid_back_rounded_vowel.ogg",author:"Denelson83",licence:""},
 "k":{file:"Voiceless_velar_plosive.ogg",author:"Peter Isotalo",licence:""},
 "m":{file:"Bilabial_nasal.ogg",author:"Peter Isotalo",licence:""},
 "f":{file:"Voiceless_labio-dental_fricative.ogg",author:"Nixinova",licence:""},
 "v-oa":{file:"Mid_back_rounded_vowel.ogg",author:"TFighterPilot",licence:""},
 "d":{file:"Voiced_alveolar_plosive.ogg",author:"Peter Isotalo",licence:""},
 "j6":{file:"Voiced_palato-alveolar_affricate.ogg",author:"Octane (English Wikipedia)",licence:"Public domain"},
 "gb":{file:"Voiced_labial-velar_plosive.ogg",author:"Denis Jacquerye (Moyogo)",licence:""},
 "v-on":{file:"Fr-un-fr_BE.ogg",author:"",licence:""},
 "v-en":{file:"Fr-Un-fr_FR-Paris.ogg",author:"Darkdadaah",licence:""},
 "theta":{file:"Voiceless_dental_fricative.ogg",author:"Peter Isotalo (Karmosin)",licence:""},
 "c":{file:"Voiceless_velar_plosive.ogg",author:"Peter Isotalo",licence:""},
 "h":{file:"Voiceless_glottal_fricative.ogg",author:"Peter Isotalo",licence:""},
 "hw":{file:"Voiceless_labio-velar_fricative.ogg",author:"",licence:""},
 "v-ua":{file:"Close_front_rounded_vowel.ogg",author:"",licence:""}
};
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
    if(mine.length){var rs=[],as=[],ls=[],anyW=false;mine.forEach(function(n){var lm=LOCAL_META[n];if(lm){anyW=true;rs.push('<a href="https://commons.wikimedia.org/wiki/File:'+esc(lm.file)+'" target="_blank" rel="noopener">'+esc(decodeURIComponent(lm.file))+'</a> <span class="small">(copied here as '+esc(n)+'.mp3)</span>');as.push(lm.author?esc(lm.author):'<span class="small">see file page</span>');ls.push(lm.licence?esc(lm.licence):'<span class="small">see file page</span>');}else{rs.push('Recording made for this site <span class="small">('+esc(n)+'.mp3)</span>');as.push(esc(CREDIT.who));ls.push(CREDIT.licence?esc(CREDIT.licence):"&mdash;");}});if(anyW)nWiki++;else nSite++;src=rs.join("<br>");au=as.join("<br>");li=ls.join("<br>");}
    else if(f){nWiki++;var m=META[f]||{};src='<a href="https://commons.wikimedia.org/wiki/File:'+esc(f)+'" target="_blank" rel="noopener">'+esc(decodeURIComponent(f))+'</a>';au=m.author?esc(m.author):'<span class="small">see file page</span>';li=m.licence?esc(m.licence):'<span class="small">see file page</span>';}
    else{nNone++;src='<span class="small">No reference recording yet</span>';au="";li="";}
    rows+="<tr><td><strong>"+esc(s.l)+"</strong></td><td>["+esc(s.i)+"]</td><td>"+src+"</td><td>"+au+"</td><td>"+li+"</td></tr>";
  });
  out+="<h2>"+g[0]+"</h2><div class=\"tblwrap\"><table class=\"credits\"><tr><th>Sound</th><th>IPA</th><th>Source</th><th>Author</th><th>Licence</th></tr>"+rows+"</table></div>";
});
document.getElementById("tables").innerHTML=out;
document.getElementById("counts").textContent=nSite+" sounds use a recording made for this site, "+nWiki+" use a Wikimedia Commons file, and "+nNone+" have no reference recording yet.";
