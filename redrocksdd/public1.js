function home(){
  const saved=JSON.parse(localStorage.getItem('rrdd_request')||'null');
  $('#app').innerHTML=`
  <section class="hero"><div class="w"><div class="eyebrow">RED ROCKS DD · DESIGNATED DRIVER MARKETPLACE</div><h1>YOUR RED ROCKS DESIGNATED DRIVER.</h1><p>Choose a licensed local taxi, limo or private transportation operator by the actual driver, actual vehicle, available date and price.</p><a class="btn red" href="#/find">Find My Driver</a> <a class="btn ghost hero-ghost" href="#/company">List Your Company</a><div class="pills"><span class="pill">🪑 Chairs</span><span class="pill">🧊 Cooler + ice</span><span class="pill">🔊 Speaker</span><span class="pill">🕟 Pickup 4:30 PM+</span><span class="pill">⏱ Up to 8 hours</span><span class="pill">🚘 Driver stays</span></div></div></section>
  <section class="sec white"><div class="w"><h2>THE WHOLE NIGHT, HANDLED.</h2><p class="lead">Round-trip transportation, tailgating setup, your driver waiting at Red Rocks, and the ride home.</p><div class="grid"><div class="card"><h3>1. Request your driver</h3><p class="muted">Pick the actual licensed operator, vehicle and listed transportation price.</p></div><div class="card"><h3>2. Driver accepts</h3><p class="muted">No reservation payment is taken until that operator accepts your request.</p></div><div class="card"><h3>3. Reserve for $59</h3><p class="muted">Once accepted, pay $59 to secure the reservation. The operator's listed transportation price remains due on the day of service.</p></div></div><div class="service-strip"><b>Every Red Rocks DD service includes:</b> pickup at 4:30 PM or later · round trip · chairs · cooler · ice · Bluetooth speaker · driver waits at Red Rocks · up to 8 hours.</div>${saved?`<p><a class="btn ghost hero-ghost" href="#/request?id=${encodeURIComponent(saved.id)}&token=${encodeURIComponent(saved.token)}">View My Request</a></p>`:''}</div></section>`
}

function find(){
  $('#app').innerHTML=`<section class="sec white"><div class="w"><div class="eyebrow darktext">BOOK AT LEAST 24 HOURS AHEAD</div><h2>FIND YOUR DRIVER</h2><p class="lead">Pick a date and group size. We only show approved operators who marked that date available and have a vehicle that fits your group.</p><div class="form"><div class="fg"><div class="f"><label>Date</label><select id="fd">${days().filter(x=>!soon(x.v)).map(x=>`<option value="${x.v}">${x.l}</option>`)}</select></div><div class="f"><label>Group size</label><select id="fg">${[1,2,3,4,5,6,7,8,9,10,11,12].map(x=>`<option>${x}</option>`)}</select></div><div class="f"><label>Pickup area</label><select id="fa"><option>Denver / Downtown</option><option>Capitol Hill</option><option>RiNo / Five Points</option><option>Highlands / LoHi</option><option>Lakewood</option><option>Golden</option><option>Boulder</option><option>Arvada / Wheat Ridge</option><option>Other</option></select></div><div class="f"><label>Artist (optional)</label><input id="far" placeholder="Artist or show"></div></div><button class="btn red" onclick="searchDrivers()">See Available Drivers</button><div id="fm"></div></div><div id="res" class="results"></div></div></section>`
}

async function searchDrivers(){
  const d=$('#fd').value,g=+$('#fg').value;
  if(soon(d)) return msg('#fm','Reservations close 24 hours before pickup.','bad');
  $('#res').innerHTML='<div class="card">Checking availability…</div>';
  const a=(await sb.from('caddy_availability').select('operator_id').eq('service_date',d).eq('available',true)).data||[];
  const ids=[...new Set(a.map(x=>x.operator_id))];
  if(!ids.length) return showUnmatched(d,g);
  const o=(await sb.from('caddy_operators').select('*').in('id',ids).eq('approved',true).eq('active',true)).data||[];
  const v=(await sb.from('caddy_vehicles').select('*').in('operator_id',ids).eq('active',true)).data||[];
  const L=o.map(x=>({o:x,v:v.find(y=>y.operator_id===x.id&&y.capacity>=g)})).filter(x=>x.v).sort((a,b)=>a.o.price_cents-b.o.price_cents);
  if(!L.length) return showUnmatched(d,g);
  $('#res').innerHTML=L.map(x=>`<div class="op"><div class="pic" style="background-image:url('${esc(x.v.vehicle_photo_url||x.v.driver_photo_url||'')}')"></div><div class="body"><div class="status">LICENSED OPERATOR</div><h3>${esc(x.o.driver_name)}</h3><div class="muted">${esc(x.o.company_name)} · ${esc(x.v.make_model)} ${esc(x.v.year_color||'')} · ${x.v.capacity} passengers</div><p>✓ Chairs · ✓ Cooler + ice · ✓ Speaker · ✓ Driver stays</p><div class="row"><div><div class="price">${money(x.o.price_cents)}</div><div class="muted">operator transportation price · paid service day</div></div><div class="action-col"><b class="rust">$59 only after acceptance</b><br><button class="btn dark" onclick='book(${JSON.stringify(JSON.stringify({id:x.o.id,n:x.o.driver_name,c:x.o.company_name,v:x.v.make_model,d,g,p:x.o.price_cents,a:$("#fa").value,r:$("#far").value}))})'>Request This Driver</button></div></div></div></div>`).join('')
}

function book(q){
  const c=JSON.parse(q);
  $('#modal').innerHTML=`<div class="modalb"><div class="modal"><button class="btn ghost close" onclick="$('#modal').innerHTML=''">✕</button><div class="status">STEP 1 OF 2</div><h2>REQUEST ${esc(c.n)}</h2><p>${esc(c.c)} · ${esc(c.v)} · ${esc(c.d)}</p><div class="grid two"><div class="card"><b>No charge now</b><br><span class="muted">First, the operator accepts.</span></div><div class="card"><b>${money(c.p)}</b><br><span class="muted">operator transportation price due service day</span></div></div><div class="fg"><div class="f"><label>Name</label><input id="bn"></div><div class="f"><label>Phone</label><input id="bp"></div><div class="f"><label>Email</label><input id="be"></div><div class="f"><label>Pickup address</label><input id="ba"></div></div><div class="f"><label>Notes</label><textarea id="bno" placeholder="Anything the operator should know?"></textarea></div><label class="consent"><input type="checkbox" id="termsok"> I agree to the <a href="#/terms" target="_blank">Terms</a> and understand the operator's listed transportation price is separate from the $59 Red Rocks DD reservation.</label><div id="bm"></div><button class="btn red" onclick='sendRequest(${JSON.stringify(q)})'>Send Driver Request</button><p class="muted small">If the driver accepts, your secure request page will unlock the $59 reservation checkout.</p></div></div>`
}

async function sendRequest(q){
  const c=JSON.parse(q);
  if(!$('#termsok').checked) return msg('#bm','Please agree to the Terms before sending the request.','bad');
  const args={p_operator_id:c.id,p_service_date:c.d,p_artist:c.r||'',p_group_size:c.g,p_pickup_area:c.a,p_pickup_address:$('#ba').value.trim(),p_customer_name:$('#bn').value.trim(),p_customer_email:$('#be').value.trim(),p_customer_phone:$('#bp').value.trim(),p_notes:$('#bno').value.trim()};
  if(!args.p_customer_name||!args.p_customer_email||!args.p_customer_phone) return msg('#bm','Name, email and phone are required.','bad');
  msg('#bm','Sending request…','good');
  const z=await sb.rpc('create_red_rocks_dd_request',args);
  if(z.error) return msg('#bm',z.error.message,'bad');
  const row=z.data?.[0];
  if(!row) return msg('#bm','Unable to create request.','bad');
  localStorage.setItem('rrdd_request',JSON.stringify({id:row.request_id,token:row.guest_token}));
  $('#modal').innerHTML='';
  location.hash=`#/request?id=${encodeURIComponent(row.request_id)}&token=${encodeURIComponent(row.guest_token)}`
}

function showUnmatched(d,g){
  const area=esc($('#fa')?.value||'');
  const artist=esc($('#far')?.value||'');
  $('#res').innerHTML=`<div class="card unmatched"><div class="status">NO MATCH YET</div><h3>We don't have an approved operator open for this request yet.</h3><p class="muted">Leave the request and we'll have the trip details in the system instead of sending you to a dead end.</p><div class="fg"><div class="f"><label>Name</label><input id="un"></div><div class="f"><label>Email</label><input id="ue"></div><div class="f"><label>Phone</label><input id="up"></div><div class="f"><label>Notes</label><input id="uno" placeholder="Pickup details or special needs"></div></div><button class="btn dark" onclick="sendUnmatched('${esc(d)}',${g},'${area.replace(/'/g,"&#39;")}','${artist.replace(/'/g,"&#39;")}')">Request a Match</button><div id="um"></div></div>`
}

async function sendUnmatched(d,g,a,r){
  const args={p_service_date:d,p_artist:r||'',p_group_size:g,p_pickup_area:a||'',p_customer_name:$('#un').value.trim(),p_customer_email:$('#ue').value.trim(),p_customer_phone:$('#up').value.trim(),p_notes:$('#uno').value.trim()};
  if(!args.p_customer_name||!args.p_customer_email||!args.p_customer_phone) return msg('#um','Name, email and phone are required.','bad');
  const z=await sb.rpc('create_red_rocks_dd_unmatched_request',args);
  if(z.error) return msg('#um',z.error.message,'bad');
  $('#res').innerHTML='<div class="card"><div class="note good"><b>Request received.</b><br>We saved your Red Rocks date, group and contact information. No payment was taken.</div></div>'
}
