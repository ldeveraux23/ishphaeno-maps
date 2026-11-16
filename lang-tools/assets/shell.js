(function(){
var me=document.currentScript.src;
var root=me.replace(/assets\/shell\.js.*$/,"");
var LANGS=[
 {id:"nok",name:"Nok",tools:[{id:"sounds",label:"Sound Cards"},{id:"flashcards",label:"Flashcards"}]}
];
window.SHELL={root:root,langs:LANGS};
var b=document.body,L=b.getAttribute("data-lang"),T=b.getAttribute("data-tool");
var lang=null;LANGS.forEach(function(x){if(x.id===L)lang=x;});
var h='<a class="brand" href="'+root+'../index.html">The Sekh Universe</a><a class="tools" href="'+root+'index.html">Language tools</a>';
if(lang){
  h+='<a class="lang" href="'+root+lang.id+'/index.html">'+lang.name+'</a><nav>';
  h+='<a href="'+root+lang.id+'/index.html"'+(!T?' aria-current="page"':'')+'>Home</a>';
  lang.tools.forEach(function(t){h+='<a href="'+root+lang.id+'/'+t.id+'/index.html"'+(T===t.id?' aria-current="page"':'')+'>'+t.label+'</a>';});
  h+='</nav>';
}
var e=document.createElement("header");e.className="site";e.innerHTML=h;
b.insertBefore(e,b.firstChild);
})();
