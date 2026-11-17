(function(){
var me=document.currentScript.src;
var root=me.replace(/assets\/shell\.js.*$/,"");
var LANGS=[{"id": "nok", "name": "Nok", "tools": [{"id": "sounds", "label": "Sound Cards"}, {"id": "flashcards", "label": "Flashcards"}]}, {"id": "vatrahu", "name": "Vatrahu", "tools": [{"id": "sounds", "label": "Sound Cards"}]}, {"id": "vatraxu", "name": "Vatraxu", "tools": [{"id": "sounds", "label": "Sound Cards"}]}, {"id": "urhmauuri", "name": "Urhmauuri", "tools": [{"id": "sounds", "label": "Sound Cards"}, {"id": "flashcards", "label": "Flashcards"}]}, {"id": "stamfaen", "name": "Stamfaen", "tools": [{"id": "sounds", "label": "Sound Cards"}]}, {"id": "lyndfen", "name": "Lyndfên", "tools": [{"id": "sounds", "label": "Sound Cards"}], "parent": "stamfaen"}, {"id": "rejfen", "name": "Rejfên", "tools": [{"id": "sounds", "label": "Sound Cards"}], "parent": "stamfaen"}, {"id": "mylzhfa", "name": "Mylzhfã", "tools": [{"id": "sounds", "label": "Sound Cards"}], "parent": "stamfaen"}, {"id": "dorrwfo", "name": "Dorrwfø", "tools": [{"id": "sounds", "label": "Sound Cards"}], "parent": "stamfaen"}, {"id": "selo", "name": "Selo", "tools": [{"id": "sounds", "label": "Sound Cards"}]}, {"id": "mouane", "name": "Mouane", "tools": [{"id": "sounds", "label": "Sound Cards"}]}];
window.SHELL={root:root,langs:LANGS};
var b=document.body,L=b.getAttribute("data-lang"),T=b.getAttribute("data-tool");
var lang=null;LANGS.forEach(function(x){if(x.id===L)lang=x;});
var h='<a class="brand" href="'+root+'../index.html">The Sekh Universe</a><a class="tools" href="'+root+'index.html">Language tools</a>';
if(lang){
  if(lang.parent){var pp=null;LANGS.forEach(function(x){if(x.id===lang.parent)pp=x;});if(pp)h+='<a class="lang" href="'+root+pp.id+'/index.html" style="opacity:.75">'+pp.name+' &rsaquo;</a>';}
  h+='<a class="lang" href="'+root+lang.id+'/index.html">'+lang.name+'</a><nav>';
  h+='<a href="'+root+lang.id+'/index.html"'+(!T?' aria-current="page"':'')+'>Home</a>';
  lang.tools.forEach(function(t){h+='<a href="'+root+lang.id+'/'+t.id+'/index.html"'+(T===t.id?' aria-current="page"':'')+'>'+t.label+'</a>';});
  h+='</nav>';
}
var e=document.createElement("header");e.className="site";e.innerHTML=h;
b.insertBefore(e,b.firstChild);
})();
