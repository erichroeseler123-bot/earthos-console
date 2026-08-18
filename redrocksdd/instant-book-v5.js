(function(){
  const oldHome=window.home;
  const oldSearch=window.searchDrivers;

  function patchHome(){
    const app=document.querySelector('#app'); if(!app)return;
    const h1=app.querySelector('h1');
    if(h1) h1.textContent='EVERY RED ROCKS GROUP SHOULD HAVE A DD.';
    const heroP=app.querySelector('.rr-hero p');
    if(heroP) heroP.textContent='Book your $299 Red Rocks night now. We match a licensed DD and vehicle that fits your group, pick you up at home, tailgate with you, stay parked during the show, and drive you home.';
    const primary=app.querySelector('.hero-actions .btn.red');
    if(primary){primary.textContent='Book My DD · $49 Today';primary.setAttribute('href','#/find')}

    const math=app.querySelector('.math-card');
    if(math) math.innerHTML='<div class="math-big">$299</div><div><b>one trip total</b><br><span class="muted">$49 today · $250 at pickup</span></div>';
    const calcLabel=document.querySelector('#calcgroup')?.parentElement?.querySelector('label');
    if(calcLabel) calcLabel.textContent='People in your group';
    const calc=document.querySelector('.costcalc');
    if(calc && !calc.querySelector('.capacity-note')) calc.insertAdjacentHTML('afterend','<p class="capacity-note"><b>Vehicle capacities vary.</b> Tell us your group size and we only match a vehicle that can legally seat everyone. The $299 trip price stays the same.</p>');

    const compare=app.querySelector('.compare-wrap');
    if(compare && !document.querySelector('.jurassic-callout')){
      compare.insertAdjacentHTML('beforebegin',`<div class="jurassic-callout"><div><div class="eyebrow">THE POST-SHOW PROBLEM</div><h3>RIDESHARE PICKUP IS IN THE JURASSIC LOT. YOUR DD IS ALREADY PARKED.</h3><p>Red Rocks directs end-of-show pickup for private vehicles, taxis and Uber/Lyft to the Jurassic Lot near Entrance 2. That means leaving the venue, walking downhill and joining the pickup crush. With Red Rocks DD, your driver stays onsite during the show, so there is no last-minute app request and no wondering whether a car is coming.</p></div><div class="jurassic-big">STAY.<br>TAILGATE.<br>RIDE HOME.</div></div>`);
    }

    const steps=[...app.querySelectorAll('.sec.white .card h3')];
    if(steps.length>=3){
      steps[0].textContent='1. Book your trip now';steps[0].nextElementSibling.textContent='$49 secures your $299 Red Rocks DD trip immediately. No waiting for a driver to accept before checkout.';
      steps[1].textContent='2. We match the right vehicle';steps[1].nextElementSibling.textContent='Passenger capacities vary. We match a licensed driver and vehicle that fits your group and show date.';
      steps[2].textContent='3. Your DD stays through the show';steps[2].nextElementSibling.textContent='$250 is due at pickup. Tailgate, enjoy the show, then return to the same waiting driver for the ride home.';
    }

    const feeHead=[...app.querySelectorAll('.fee-sec .eyebrow')][0]; if(feeHead) feeHead.textContent='WHAT YOUR RESERVATION INCLUDES';
    const feeLead=app.querySelector('.fee-sec .lead'); if(feeLead) feeLead.textContent='$49 secures the trip now. We handle matching, booking records, support and replacement help if a driver has an issue.';
    const feeItems=[...app.querySelectorAll('.fee-list p')];
    if(feeItems[0]) feeItems[0].innerHTML='<b>Your trip is reserved now.</b><br><small>You do not wait for an individual driver to accept before paying the $49 reservation.</small>';
    if(feeItems[1]) feeItems[1].innerHTML='<b>Driver replacement support.</b><br><small>If the assigned driver has an issue, we work to move the trip to another approved driver with a vehicle that fits. If we cannot cover the trip, the $49 is refunded.</small>';
  }

  window.home=function(){ if(oldHome) oldHome(); setTimeout(patchHome,0); };

  window.find=function(){
    $('#app').innerHTML=`<section class="sec white"><div class="w"><div class="eyebrow darktext">BOOK AT LEAST 24 HOURS AHEAD</div><h2>BOOK YOUR RED ROCKS DD</h2><p class="lead"><b>$299 total.</b> Pay $49 now to reserve. Pay $250 at pickup. Tell us how many people are going and we match a licensed driver with a vehicle that fits your group.</p><div class="form"><div class="fg"><div class="f"><label>Date</label><select id="fd">${days().filter(x=>!soon(x.v)).map(x=>`<option value="${x.v}">${x.l}</option>`).join('')}</select></div><div class="f"><label>Group size</label><select id="fg">${[1,2,3,4,5,6,7,8,9,10,11,12].map(x=>`<option>${x}</option>`).join('')}</select></div><div class="f"><label>Pickup area</label><select id="fa"><option>Denver / Downtown</option><option>Capitol Hill</option><option>RiNo / Five Points</option><option>Highlands / LoHi</option><option>Lakewood</option><option>Golden</option><option>Boulder</option><option>Arvada / Wheat Ridge</option><option>Other</option></select></div><div class="f"><label>Artist / show (optional)</label><input id="far" placeholder="Artist or show"></div></div><div class="instant-note"><b>Vehicle capacities vary.</b> We will only assign a vehicle that can seat your group.</div><button class="btn red" onclick="bookInstant()">Book My $299 Trip · Pay $49 Now</button> <button class="btn ghost" onclick="browseDrivers()">Browse Drivers First</button><div id="fm"></div></div><div id="res" class="results"></div><div class="jurassic-mini"><b>Why have a waiting DD?</b> Red Rocks says end-of-show passenger pickup for private cars, taxis and Uber/Lyft is in the Jurassic Lot near Entrance 2. Your Red Rocks DD stays onsite during the event instead of being summoned into that pickup mess after the encore.</div></div></section>`;
  };

  window.browseDrivers=async function(){
    if(oldSearch) await oldSearch();
    const res=document.querySelector('#res'); if(res) res.insertAdjacentHTML('afterbegin','<div class="browse-head"><b>Prefer a specific driver?</b> These currently listed vehicles fit your selected group. You can choose one, but your $49 reservation still happens immediately and Red Rocks DD can rematch the trip if needed.</div>');
  };

  window.bookInstant=function(preferred){
    const d=$('#fd')?.value,g=+($('#fg')?.value||0),a=$('#fa')?.value||'',r=$('#far')?.value||'';
    if(!d||!g)return;
    if(soon(d))return msg('#fm','Reservations close 24 hours before pickup.','bad');
    const p=preferred||null;
    $('#modal').innerHTML=`<div class="modalb"><div class="modal"><button class="btn ghost close" onclick="$('#modal').innerHTML=''">✕</button><div class="status">RESERVE NOW</div><h2>${p?'BOOK WITH '+esc(p.n):'BOOK YOUR RED ROCKS DD'}</h2><p><b>$299 total</b> · $49 due now · $250 due at pickup</p>${p?`<p class="muted">Preferred: ${esc(p.n)} · ${esc(p.v)}. If that driver cannot perform, Red Rocks DD may rematch you with another approved driver and vehicle that fits your group.</p>`:'<p class="muted">We will assign an approved driver and a vehicle that fits your group. Vehicle passenger capacities vary.</p>'}<div class="fg"><div class="f"><label>Name</label><input id="bn"></div><div class="f"><label>Phone</label><input id="bp"></div><div class="f"><label>Email</label><input id="be"></div><div class="f"><label>Pickup address</label><input id="ba"></div></div><div class="f"><label>Notes</label><textarea id="bno" placeholder="Anything we should know?"></textarea></div><label class="consent"><input type="checkbox" id="termsok"> I agree to the <a href="#/terms" target="_blank">Terms</a> and understand $49 is due now toward the $299 trip, with $250 due at pickup.</label><div id="bm"></div><button class="btn red" onclick='createInstantBooking(${JSON.stringify(p?JSON.stringify(p):'')})'>Continue to $49 Checkout</button><p class="muted small">Your reservation is created before checkout. If we cannot provide a suitable licensed driver for the trip, the $49 reservation is refunded.</p></div></div>`;
  };

  window.createInstantBooking=async function(preferredJson){
    if(!$('#termsok')?.checked)return msg('#bm','Please agree to the Terms before booking.','bad');
    const p=preferredJson?JSON.parse(preferredJson):null;
    const args={p_service_date:$('#fd').value,p_artist:$('#far').value||'',p_group_size:+$('#fg').value,p_pickup_area:$('#fa').value||'',p_pickup_address:$('#ba').value.trim(),p_customer_name:$('#bn').value.trim(),p_customer_email:$('#be').value.trim(),p_customer_phone:$('#bp').value.trim(),p_notes:$('#bno').value.trim(),p_preferred_operator_id:p?.id||null};
    if(!args.p_customer_name||!args.p_customer_email||!args.p_customer_phone)return msg('#bm','Name, email and phone are required.','bad');
    msg('#bm','Creating your reservation…','good');
    const z=await sb.rpc('create_red_rocks_dd_booking',args);
    if(z.error)return msg('#bm',z.error.message,'bad');
    const row=z.data?.[0];if(!row)return msg('#bm','Unable to create reservation.','bad');
    localStorage.setItem('rrdd_request',JSON.stringify({id:row.request_id,token:row.guest_token}));
    const btn=document.querySelector('#modal .btn.red');if(btn){btn.disabled=true;btn.textContent='Opening secure checkout…'}
    try{
      const resp=await fetch(PAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:row.request_id,guestToken:row.guest_token})});
      const j=await resp.json().catch(()=>({}));if(!resp.ok||!j.checkoutUrl)throw Error(j.error||'Unable to start checkout.');
      location.href=j.checkoutUrl;
    }catch(e){location.hash=`#/request?id=${encodeURIComponent(row.request_id)}&token=${encodeURIComponent(row.guest_token)}`;alert(e.message||'Reservation created. Checkout can be retried from your reservation page.')}
  };

  window.book=function(q){
    const c=JSON.parse(q);
    window.bookInstant({id:c.id,n:c.n,v:c.v});
  };

  const oldRefresh=window.refreshRequest;
  window.refreshRequest=async function(id,token,paymentFlag){
    const z=await sb.rpc('get_red_rocks_dd_request',{p_request_id:id,p_guest_token:token});
    const r=z.data?.[0];
    if(z.error||!r){$('#requestcard').innerHTML='<h2>RESERVATION NOT FOUND</h2><p class="muted">This secure reservation link is invalid or expired.</p>';return}
    const paid=r.reservation_fee_status==='paid';
    let title=paid?'TRIP RESERVED':'FINISH YOUR RESERVATION';
    let text=paid?'Your $49 reservation is recorded. We are confirming the licensed DD and vehicle that fits your group.':'Your trip record is created. Pay $49 now to reserve your $299 Red Rocks DD trip.';
    let action=paid?'<div class="note good"><b>Reserved.</b> $250 is due at pickup.</div>':`<button class="btn red" onclick="payRequest('${id}','${token}')">Pay $49 & Reserve</button>`;
    if(r.status==='confirmed'){title='DRIVER CONFIRMED';text=`Your Red Rocks DD trip is confirmed. ${esc(r.driver_name||'Your driver')} is assigned. $250 is due at pickup.`;action='<div class="note good"><b>Confirmed.</b> Your DD is assigned and your reservation is paid.</div>'}
    if(r.status==='declined'){title=paid?'WE ARE REMATCHING YOUR TRIP':'DRIVER UNAVAILABLE';text=paid?'The first driver could not perform the trip. Your reservation remains in our system while Red Rocks DD works to rematch you with another suitable driver.':'That driver could not take the trip. You can still reserve the trip and let us match another driver.';action=paid?'<div class="note"><b>Reservation still active.</b> We will work on a replacement. If we cannot cover the trip, the $49 is refunded.</div>':`<button class="btn red" onclick="payRequest('${id}','${token}')">Pay $49 & Let Us Match It</button>`}
    if(paymentFlag==='cancelled'&&!paid)text='Checkout was not completed. Your trip record is saved; you can pay the $49 reservation now.';
    $('#requestcard').innerHTML=`<div class="status">${esc(r.status)}</div><h2>${title}</h2><p class="lead">${text}</p><div class="summary"><div><span>Date</span><b>${esc(r.service_date)}</b></div><div><span>Driver</span><b>${esc(r.driver_name||'Being matched')}</b></div><div><span>Vehicle</span><b>${esc(r.vehicle_name||'Matched to group size')}</b></div><div><span>Group</span><b>${r.group_size}</b></div><div><span>Total trip</span><b>$299</b></div><div><span>Due at pickup</span><b>$250</b></div></div>${action}<p class="muted small">Email + text support is included with your reservation. If an assigned driver has an issue, Red Rocks DD works to rematch the trip with another approved operator whose vehicle fits your group.</p>`;
  };

  const oldTerms=window.terms;
  window.terms=function(){if(oldTerms)oldTerms();setTimeout(()=>{
    const legal=document.querySelector('.legal');if(!legal)return;
    legal.innerHTML=legal.innerHTML.replace(/A customer first sends a request to an operator\. No Red Rocks DD reservation payment is due until the operator accepts\. After acceptance, the customer may pay a \$49 Red Rocks DD reservation to secure the booking\./g,'A customer may reserve a Red Rocks DD trip immediately by paying $49 toward the fixed $299 trip total. Red Rocks DD then confirms or assigns an approved operator and a vehicle that fits the stated group size.').replace(/If the operator cannot perform an accepted booking and no replacement operator is provided, the Red Rocks DD reservation will be refunded\./g,'If an assigned operator cannot perform, Red Rocks DD may rematch the reservation to another approved operator with suitable vehicle capacity. If Red Rocks DD cannot cover the trip, the $49 reservation is refunded.');
  },0)};

  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{if(location.hash===''||location.hash==='#/'||location.hash==='#')patchHome()},0));
})();