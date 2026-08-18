(function(){
  function replaceText(root, from, to){
    if(!root) return;
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n=>{if(n.nodeValue&&n.nodeValue.includes(from)) n.nodeValue=n.nodeValue.split(from).join(to)});
  }
  function patchHome(){
    const app=document.querySelector('#app'); if(!app) return;
    replaceText(app,'$250 driver + $59 reservation ÷ 6','$309 total ÷ 6');
    replaceText(app,"selected driver's transportation price + separate $59 Red Rocks DD reservation, divided by group size",'total trip cost, divided by group size');
    replaceText(app,"You still pay the driver's full listed transportation price separately on service day. The $59 is what secures the accepted Red Rocks DD booking.",'Your trip is one booking with two payment moments: $59 when you reserve after acceptance, then the remaining trip cost at pickup.');
    replaceText(app,'WHAT YOUR $59 RESERVATION GETS','WHAT YOUR RESERVATION INCLUDES');
    replaceText(app,"The driver's full transportation price stays separate and is paid on service day. Tips are optional and go directly to your driver.",'Pay $59 after your DD accepts, then pay the remaining trip cost at pickup. Tips are optional.');
    const feeList=app.querySelector('.fee-list');
    if(feeList && !feeList.querySelector('.support-benefit')){
      const d=document.createElement('div'); d.className='support-benefit';
      d.innerHTML='<span>✓</span><p><b>Email + text support around your booking.</b><br><small>If plans change or something goes wrong, Red Rocks DD support can help with the reservation and replacement process.</small></p>';
      feeList.prepend(d);
    }
    const math=app.querySelector('.math-card .muted'); if(math) math.textContent='$309 total ÷ 6';
  }
  const oldHome=window.home;
  if(oldHome){window.home=function(){oldHome();patchHome();}}
  const oldCalc=window.updateCostCalc;
  if(oldCalc){window.updateCostCalc=function(){oldCalc();const p=+(document.querySelector('#calcprice')?.value||250),g=+(document.querySelector('#calcgroup')?.value||6),total=p+59,per=total/g;const out=document.querySelector('#calcper');if(out)out.textContent='$'+per.toFixed(2);const fine=document.querySelector('.fineprint');if(fine)fine.textContent='All-in calculator = total trip cost divided by group size. $59 is due when you reserve after driver acceptance; the remainder is due at pickup. Actual totals vary by driver.';}}
  const oldSearch=window.searchDrivers;
  if(oldSearch){window.searchDrivers=async function(){await oldSearch();setTimeout(()=>{
    document.querySelectorAll('.op').forEach(card=>{
      const price=card.querySelector('.price'); if(!price) return;
      const base=parseFloat(price.textContent.replace(/[^0-9.]/g,'')); if(!Number.isFinite(base)) return;
      const total=base+59;
      const muted=[...card.querySelectorAll('.muted')].find(x=>/driver transportation price|operator transportation price/i.test(x.textContent));
      if(muted) muted.textContent='remaining trip cost due at pickup';
      price.textContent='$'+total.toFixed(0)+' total';
      const action=card.querySelector('.action-col b'); if(action) action.textContent='$59 to reserve after acceptance';
    });
  },0);}}
  const oldRequest=window.refreshRequest;
  if(oldRequest){window.refreshRequest=async function(){await oldRequest.apply(this,arguments);setTimeout(()=>{
    const c=document.querySelector('#requestcard'); if(!c)return;
    replaceText(c,"is the operator's transportation price due on the day of service",'is the remaining trip cost due at pickup');
    replaceText(c,'Operator price','Remaining at pickup');
    replaceText(c,'Red Rocks DD reservation','Due to reserve');
  },0);}}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(patchHome,0));
})();