let requestPoll=null;
async function requestPage(){
  clearInterval(requestPoll);
  const q=hashParams(),id=q.get('id'),token=q.get('token');
  if(!id||!token){$('#app').innerHTML='<section class="sec white"><div class="w"><div class="card">This request link is incomplete.</div></div></section>';return}
  $('#app').innerHTML='<section class="sec white"><div class="w"><div id="requestcard" class="card request-card">Loading request…</div></div></section>';
  await refreshRequest(id,token,q.get('payment'));
  requestPoll=setInterval(()=>refreshRequest(id,token,null),15000)
}

async function refreshRequest(id,token,paymentFlag){
  const z=await sb.rpc('get_red_rocks_dd_request',{p_request_id:id,p_guest_token:token});
  const r=z.data?.[0];
  if(z.error||!r){$('#requestcard').innerHTML='<h2>REQUEST NOT FOUND</h2><p class="muted">This secure request link is invalid or expired.</p>';clearInterval(requestPoll);return}
  let title='REQUEST SENT';let text=`${esc(r.driver_name||'Your operator')} has not accepted yet. No payment has been taken.`;let action='';
  if(r.status==='accepted'&&r.reservation_fee_status!=='paid'){
    title='DRIVER ACCEPTED';text='Your driver accepted the request. Pay the $59 reservation now to confirm the booking.';action=`<button class="btn red" onclick="payRequest('${id}','${token}')">Reserve for $59</button>`
  } else if(r.status==='confirmed'||r.reservation_fee_status==='paid'){
    title='BOOKING CONFIRMED';text=`Your $59 reservation is recorded. ${money(r.operator_price_cents)} is the operator's transportation price due on the day of service.`;action='<div class="note good"><b>Confirmed.</b> Save this page for your records.</div>';clearInterval(requestPoll)
  } else if(r.status==='declined'){
    title='DRIVER DECLINED';text='This operator could not take the trip. No payment was taken.';action='<a class="btn dark" href="#/find">Choose Another Driver</a>';clearInterval(requestPoll)
  }
  if(paymentFlag==='cancelled'&&r.reservation_fee_status!=='paid') text='Checkout was not completed. Your driver is still accepted; you can try the $59 reservation again.';
  $('#requestcard').innerHTML=`<div class="status">${esc(r.status)}</div><h2>${title}</h2><p class="lead">${text}</p><div class="summary"><div><span>Date</span><b>${esc(r.service_date)}</b></div><div><span>Driver</span><b>${esc(r.driver_name||'Pending')}</b></div><div><span>Vehicle</span><b>${esc(r.vehicle_name||'')}</b></div><div><span>Group</span><b>${r.group_size}</b></div><div><span>Operator price</span><b>${money(r.operator_price_cents)}</b></div><div><span>Red Rocks DD reservation</span><b>$59</b></div></div>${action}<p class="muted small">This page checks for driver acceptance automatically while it is open. Bookmark it until your booking is confirmed.</p>`
}

async function payRequest(id,token){
  const btn=event?.target;if(btn){btn.disabled=true;btn.textContent='Opening secure checkout…'}
  try{
    const r=await fetch(PAY,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:id,guestToken:token})});
    const j=await r.json().catch(()=>({}));
    if(!r.ok||!j.checkoutUrl) throw Error(j.error||'Unable to start checkout.');
    location.href=j.checkoutUrl
  }catch(e){if(btn){btn.disabled=false;btn.textContent='Reserve for $59'};alert(e.message||'Unable to start checkout.')}
}

function terms(){
  $('#app').innerHTML=`<section class="sec white"><div class="w legal"><h2>TERMS OF USE</h2><p class="muted">Effective August 18, 2026</p><h3>Marketplace role</h3><p>Red Rocks DD provides a marketplace that helps customers find and request transportation from independent licensed transportation operators. Red Rocks DD is not the transportation carrier and does not operate the driver's vehicle.</p><h3>Reservations and operator price</h3><p>A customer first sends a request to an operator. No Red Rocks DD reservation payment is due until the operator accepts. After acceptance, the customer may pay a $59 Red Rocks DD reservation to secure the booking. The operator's listed transportation price is separate and is due on the day of service.</p><h3>24-hour cutoff</h3><p>Online requests must be submitted at least 24 hours before the standard 4:30 PM pickup window.</p><h3>Standard service</h3><p>Participating operators agree that the Red Rocks DD service includes round-trip transportation, pickup at 4:30 PM or later, chairs, cooler, ice, Bluetooth speaker, the driver remaining at Red Rocks during the event, and up to 8 hours total service, subject to safety, venue rules, road conditions and lawful operating requirements.</p><h3>Cancellations</h3><p>The $59 reservation is for marketplace reservation handling and is separate from the operator's transportation charge. If the operator cannot perform an accepted booking and no replacement operator is provided, the Red Rocks DD reservation will be refunded. Customer-requested cancellations are reviewed case by case; any operator transportation cancellation terms are the operator's responsibility and should be confirmed with the operator.</p><h3>Operator responsibility</h3><p>Operators are responsible for maintaining all licenses, permits, insurance and legal authority required for their transportation services and for operating safely and lawfully.</p><h3>Venue independence</h3><p>Red Rocks DD is independent and is not affiliated with, endorsed by, or operated by Red Rocks Amphitheatre, the City of Denver, or the City of Morrison.</p></div></section>`
}

function privacy(){
  $('#app').innerHTML=`<section class="sec white"><div class="w legal"><h2>PRIVACY</h2><p class="muted">Effective August 18, 2026</p><h3>Information we collect</h3><p>We collect information needed to operate the marketplace, including names, email addresses, phone numbers, pickup details, group size, requested dates, booking notes, operator profile information, vehicle information and availability.</p><h3>How we use it</h3><p>We use customer information to route transportation requests, administer reservations, communicate about bookings, support safety and resolve service issues. We use operator information to review applications, display approved profiles and manage trip requests.</p><h3>Sharing</h3><p>Booking details are shared with the independent operator selected for the requested trip. Payment card information is handled by the payment provider and is not stored by Red Rocks DD in the browser application.</p><h3>Retention and security</h3><p>We retain booking and operator records as reasonably necessary for operations, support, compliance and dispute handling. No internet system is perfectly secure, but access controls are used to limit booking and operator data to the appropriate parties.</p><h3>Contact</h3><p>For privacy or booking questions, use the contact information provided with your Red Rocks DD reservation or operator communication.</p></div></section>`
}
