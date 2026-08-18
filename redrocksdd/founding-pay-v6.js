(function(){
  function patchFoundingPay(){
    if(!location.hash.startsWith('#/company')) return;
    const app=document.querySelector('#app');
    if(!app) return;
    const banner=app.querySelector('.founding-banner');
    if(!banner) return;
    const h=banner.querySelector('h2');
    if(h) h.textContent='$350 + TIPS FOR YOUR FIRST RED ROCKS DD TRIP.';
    const p=banner.querySelector('p');
    if(p){
      const slot=(p.textContent.match(/\d+ of 10 founding-driver slots remain/i)||[])[0] || 'Founding-driver slots are limited';
      p.innerHTML='<b>$250 trip pay + $100 founding-driver bonus after successful completion.</b> '+slot+'. When the 10 signup slots are filled, signups close for now. <b>Every trip after your first pays $250 + tips.</b>';
    }
    const money=banner.querySelector('.founding-money');
    if(money) money.innerHTML='$350+<small>FIRST TRIP + TIPS</small>';
  }
  addEventListener('hashchange',()=>setTimeout(patchFoundingPay,50));
  document.addEventListener('DOMContentLoaded',()=>setTimeout(patchFoundingPay,50));
  new MutationObserver(()=>patchFoundingPay()).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(patchFoundingPay,100);
})();