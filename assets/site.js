/* Light/dark: a saved choice wins; otherwise the visitor's phone/computer setting (and it follows that
   setting live until they press 🌓). Runs in <head> so there's no flash. site.css has a no-JS fallback. */
(function(){
  var K='scd-theme', d=document.documentElement, mq=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');
  function saved(){ try{ var t=localStorage.getItem(K); return (t==='dark'||t==='light')?t:''; }catch(e){ return ''; } }
  function apply(){ d.dataset.theme=saved()||(mq&&mq.matches?'dark':'light'); }
  apply();
  if(mq){ var on=function(){ if(!saved()) apply(); }; mq.addEventListener?mq.addEventListener('change',on):mq.addListener&&mq.addListener(on); }
  document.addEventListener('click',function(e){
    if(!e.target.closest('[data-theme-toggle]')) return;
    var n=d.dataset.theme==='dark'?'light':'dark'; d.dataset.theme=n;
    try{ localStorage.setItem(K,n); }catch(e){}
  });
})();

/* Pictures open large when tapped (2026-11-19). Esc, ✕ or a tap anywhere closes. Keyboard: Enter/Space on a picture. */
(function(){
  var dlg;
  function box(){
    if(dlg) return dlg;
    dlg=document.createElement('dialog'); dlg.className='zoom-view'; dlg.setAttribute('aria-label','Large picture');
    dlg.innerHTML='<button type="button" class="zoom-x" aria-label="Close">✕</button><img alt="">';
    dlg.addEventListener('click',function(){ dlg.close(); });
    document.body.appendChild(dlg); return dlg;
  }
  function show(img){
    var d=box(), big=d.querySelector('img'); big.src=img.currentSrc||img.src; big.alt=img.alt||'';
    if(d.showModal) d.showModal(); else d.setAttribute('open','');
  }
  function zoomable(el){ return el&&el.tagName==='IMG'&&!el.closest('a,button,dialog,header,.no-zoom'); }
  document.addEventListener('click',function(e){ if(zoomable(e.target)){ e.preventDefault(); show(e.target); } });
  document.addEventListener('keydown',function(e){ if((e.key==='Enter'||e.key===' ')&&zoomable(e.target)){ e.preventDefault(); show(e.target); } });
  function mark(){ Array.prototype.forEach.call(document.querySelectorAll('main img'),function(i){
    if(!zoomable(i)) return; i.tabIndex=0; i.setAttribute('role','button'); if(!i.title) i.title='Tap to enlarge'; }); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mark); else mark();
})();

/* Looping clips (2026-11-25): a ⏸ button on each; visitors who ask for reduced motion get the still picture. */
(function(){
  function set(v,b,play){ if(play){ var p=v.play(); if(p&&p.catch) p.catch(function(){}); } else v.pause();
    b.textContent=play?'⏸':'▶'; b.setAttribute('aria-label',play?'Pause the clip':'Play the clip'); }
  function init(){
    var still=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    Array.prototype.forEach.call(document.querySelectorAll('video[data-loop]'),function(v){
      var b=document.createElement('button'); b.type='button'; b.className='lp';
      v.parentNode.insertBefore(b,v.nextSibling);
      if(still){ v.removeAttribute('autoplay'); set(v,b,false); } else set(v,b,!v.paused||v.autoplay);
      b.addEventListener('click',function(){ set(v,b,v.paused); });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
