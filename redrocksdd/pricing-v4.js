(function(){
  const TOTAL=299, DUE_NOW=49, DUE_PICKUP=250;
  function replaceText(root, from, to){
    if(!root) return;
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[]; while(w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(n=>{if(n.nodeValue&&n.nodeValue.includes(from)) n.nodeValue=n.nodeValue.split(from).join(to)});
  }
  function patchMoney(root=document){
    [
      ['$59','$49'],['$309','$299'],['$51.50','$49.83'],
      ['$250 driver + $59 reservation ÷ 6','$299 total ÷ 6'],
      ['$59 reservation','$49 reservation'],['$59 Red Rocks DD reservation','$49 Red Rocks DD reservation'],
      ['$59 only after acceptance','$49 to reserve after acceptance'],
      ['$59 to reserve after acceptance','$49 to reserve after acceptance'],
      ['Reserve for $59','Reserve for $49']
    ].forEach(([a,b])=>replaceText(root,a,b));
  }
  function patchHome(){
    const app=document.querySelector('#app'); if(!app) return;
    patchMoney(app);
    replaceText(app,"selected driver's transportation price + separate $49 Red Rocks DD reservation, divided by group size",'the fixed $299 total trip cost, divided by group size');
    replaceText(app,"selected driver's transportation price + separate $59 Red Rocks DD reservation, divided by group size",'the fixed $299 total trip cost, divided by group size');
    replaceText(app,"You still pay the driver's full listed transportation price separately on service day. The $49 is what secures the accepted Red Rocks DD booking.",'Your Red Rocks DD trip is $299 total: $49 when you reserve after acceptance, then $250 at pickup.');
    replaceText(app,"You still pay the driver's full listed transportation price separately on service day. The $59 is what secures the accepted Red Rocks DD booking.",'Your Red Rocks DD trip is $299 total: $49 when you reserve after acceptance, then $250 at pickup.');
    replaceText(app,'WHAT YOUR $49 RESERVATION GETS','WHAT YOUR RESERVATION INCLUDES');
    replaceText(app,'WHAT YOUR $59 RESERVATION GETS','WHAT YOUR RESERVATION INCLUDES');
    replaceText(app,"The driver's full transportation price stays separate and is paid on service day. Tips are optional and go directly to your driver.",'Your trip is $299 total: $49 to reserve after acceptance and $250 at pickup. Tips are optional.');
    const feeList=app.querySelector('.fee-list');
    if(feeList && !feeList.querySelector('.support-benefit')){
      const d=document.createElement('div'); d.className='support-benefit';
      d.innerHTML='<span>✓</span><p><b>Email + text support around your booking.</b><br><small>If plans change or something goes wrong, Red Rocks DD support can help with the reservation and replacement process.</small></p>';
      feeList.prepend(d);
    }
    const calcPrice=document.querySelector('#calcprice');
    if(calcPrice){const wrap=calcPrice.parentElement;if(wrap)wrap.innerHTML='<label>Transportation</label><div class="fixed-price">$250 fixed</div>';}
    const mathBig=app.querySelector('.math-card .math-big'); if(mathBig) mathBig.textContent='$49.83';
    const math=app.querySelector('.math-card .muted'); if(math) math.textContent='$299 total ÷ 6';
    const fine=app.querySelector('.fineprint'); if(fine) fine.textContent='$299 total trip cost. $49 is due only after your DD accepts; $250 is due at pickup. Divide $299 by your group size to compare per-person cost.';
  }
  function patchOperator(root=document){
    patchMoney(root);
    replaceText(root,'Your transportation price: $250','Trip pay: $250');
    replaceText(root,'Your transportation price','Trip pay');
    replaceText(root,'Your transportation price does not change.','Every Red Rocks DD trip pays $250 at pickup, plus any optional tip.');
    replaceText(root,'operator price','$250 trip pay');
    replaceText(root,'operator transportation price','$250 trip pay');
    const pp=document.querySelector('#pp');
    if(pp){pp.value='250';pp.disabled=true;const label=pp.closest('.f')?.querySelector('label');if(label)label.textContent='Trip pay (fixed)';}
  }
  const oldHome=window.home;
  if(oldHome){window.home=function(){oldHome();patchHome();updateCostCalc();}}
  window.updateCostCalc=function(){
    const g=+(document.querySelector('#calcgroup')?.value||6),per=TOTAL/g;
    const out=document.querySelector('#calcper'),cmp=document.querySelector('#calccompare');
    if(out)out.textContent='$'+per.toFixed(2);
    if(cmp){if(per<55)cmp.textContent='Below current $55 and $65 shared-shuttle examples.';else if(per<65)cmp.textContent='Below the current $65 shared-shuttle example.';else cmp.textContent='Private door-to-door transportation with your own waiting DD and tailgate setup.'}
    const fine=document.querySelector('.fineprint');if(fine)fine.textContent='$299 total trip cost. $49 is due only after your DD accepts; $250 is due at pickup. Divide $299 by your group size to compare per-person cost.';
  };
  const oldSearch=window.searchDrivers;
  if(oldSearch){window.searchDrivers=async function(){await oldSearch();setTimeout(()=>{
    document.querySelectorAll('.op').forEach(card=>{
      patchMoney(card);
      const price=card.querySelector('.price'); if(price) price.textContent='$299 total';
      const muted=[...card.querySelectorAll('.muted')].find(x=>/transportation price|remaining trip cost/i.test(x.textContent));
      if(muted) muted.textContent='$250 due at pickup';
      const action=card.querySelector('.action-col b'); if(action) action.textContent='$49 to reserve after acceptance';
    });
  },0);}}
  const oldBook=window.book;
  if(oldBook){window.book=function(){oldBook.apply(this,arguments);setTimeout(()=>{
    const m=document.querySelector('#modal');if(!m)return;patchMoney(m);
    replaceText(m,'operator transportation price due service day','$250 due at pickup');
    replaceText(m,"operator's listed transportation price is separate from the $49 Red Rocks DD reservation",'total trip cost is $299: $49 to reserve after acceptance and $250 at pickup');
    replaceText(m,"operator's listed transportation price is separate from the $59 Red Rocks DD reservation",'total trip cost is $299: $49 to reserve after acceptance and $250 at pickup');
  },0);}}
  const oldRequest=window.refreshRequest;
  if(oldRequest){window.refreshRequest=async function(){await oldRequest.apply(this,arguments);setTimeout(()=>{
    const c=document.querySelector('#requestcard'); if(!c)return; patchMoney(c);
    replaceText(c,"is the operator's transportation price due on the day of service",'is due at pickup');
    replaceText(c,'Operator price','Due at pickup');
    replaceText(c,'Remaining at pickup','Due at pickup');
    replaceText(c,'Red Rocks DD reservation','Due to reserve');
  },0);}}
  const oldCompany=window.company;
  if(oldCompany){window.company=async function(){await oldCompany();setTimeout(()=>{
    const app=document.querySelector('#app');if(!app)return;patchMoney(app);
    replaceText(app,'You choose your vehicle, your price, and the nights you want to work.','You choose your vehicle and the nights you want to work. Every founding Red Rocks DD trip pays $250 plus tips.');
    replaceText(app,'You set your price','Fixed $250 trip');
    replaceText(app,'$200, $250, $300 — whatever makes sense for your vehicle and the night.','$250 for the transportation service on every Red Rocks DD booking, plus any tip the customer chooses to give you.');
    replaceText(app,'You keep your full transportation price and any tips.','Every completed trip pays you $250 at pickup, plus any tip. Founding drivers also receive the $100 bonus after their first successfully completed Red Rocks DD trip.');
    const priceInput=document.querySelector('#cpr');
    if(priceInput){priceInput.value='250';priceInput.disabled=true;const label=priceInput.closest('.f')?.querySelector('label');if(label)label.textContent='Trip pay (fixed)';}
    const banner=app.querySelector('.founding-banner p');if(banner && !/\$250/.test(banner.textContent)) banner.insertAdjacentHTML('beforeend',' <b>Every accepted trip pays $250 at pickup, plus tips.</b>');
    const season=app.querySelector('.season-note');if(season && !document.querySelector('.wait-economics')) season.insertAdjacentHTML('afterend','<div class="service-strip wait-economics"><b>The job:</b> one pickup, one Red Rocks tailgate, wait through the show, one ride home. Up to 8 hours total. You are not chasing fares all night.</div>');
  },0);}}
  const oldSignup=window.signup;
  if(oldSignup){window.signup=async function(){const p=document.querySelector('#cpr');if(p){p.disabled=false;p.value='250'};try{return await oldSignup.apply(this,arguments)}finally{if(p){p.value='250';p.disabled=true}}}}
  const oldDashboard=window.dashboard;
  if(oldDashboard){window.dashboard=async function(){const r=await oldDashboard.apply(this,arguments);setTimeout(()=>patchOperator(document),0);return r;}}
  const oldTab=window.tab;
  if(oldTab){window.tab=function(){const r=oldTab.apply(this,arguments);setTimeout(()=>patchOperator(document),0);return r;}}
  const oldSave=window.saveprof;
  if(oldSave){window.saveprof=async function(){const p=document.querySelector('#pp');if(p){p.disabled=false;p.value='250'};try{return await oldSave.apply(this,arguments)}finally{if(p){p.value='250';p.disabled=true}}}}
  const oldTerms=window.terms;
  if(oldTerms){window.terms=function(){oldTerms();setTimeout(()=>{
    const a=document.querySelector('#app');if(!a)return;patchMoney(a);
    replaceText(a,"The operator's listed transportation price is separate and is due on the day of service.",'The Red Rocks DD trip price is $299 total: $49 to reserve after driver acceptance and $250 due at pickup.');
    replaceText(a,'The $49 reservation is for marketplace reservation handling and is separate from the operator\'s transportation charge.','The $49 reservation secures the accepted booking and includes booking support. The remaining $250 is due at pickup.');
    replaceText(a,'The $59 reservation is for marketplace reservation handling and is separate from the operator\'s transportation charge.','The $49 reservation secures the accepted booking and includes booking support. The remaining $250 is due at pickup.');
  },0);}}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{patchHome();patchMoney(document)},0));
})();