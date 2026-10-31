'use strict';
(() => {
 const products = window.MARITAMA_PRODUCTS;
 const byId = id => products.find(p => p.id === id);
 const params = new URLSearchParams(location.search);
 const status = document.getElementById('site-status');
 let timer;
 function announce(message) { status.textContent = message; status.hidden = false; clearTimeout(timer); timer = setTimeout(() => { status.textContent = ''; status.hidden = true; }, 5000); }
 const header = document.querySelector('.mt-header');
 const toggle = document.querySelector('.mt-toggle');
 const dropdown = document.querySelector('.product-menu');
 function closeMenus() { header.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); dropdown.open = false; }
 toggle.addEventListener('click', () => { const open = header.classList.toggle('is-open'); toggle.setAttribute('aria-expanded', String(open)); });
 document.addEventListener('keydown', e => { if(e.key === 'Escape') { const returnTo = header.classList.contains('is-open') ? toggle : dropdown.open ? dropdown.querySelector('summary') : null; closeMenus(); if(returnTo) returnTo.focus(); } });
 document.addEventListener('click', e => { if(!header.contains(e.target)) closeMenus(); });
 matchMedia('(min-width:1251px)').addEventListener('change', closeMenus);
 let cart = [];
 try { const saved = JSON.parse(localStorage.getItem('maritama.enquiryCart') || '[]'); if(Array.isArray(saved)) cart = saved.filter(x => x && byId(x.id) && Number.isInteger(x.quantity) && x.quantity > 0 && x.quantity <= 99).filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i); } catch { /* A blocked or damaged store starts an empty cart. */ }
 function updateCount() { document.querySelectorAll('[data-cart-count]').forEach(el => el.textContent = String(cart.reduce((sum,x) => sum+x.quantity,0))); }
 function save() { try { localStorage.setItem('maritama.enquiryCart',JSON.stringify(cart)); return true; } catch { announce('This browser cannot save the cart. Use Order Now to enquire about a product directly.'); return false; } finally { updateCount(); } }
 updateCount();
 document.addEventListener('click', e => {
  const add=e.target.closest('[data-add]'); if(!add) return;
  const p=byId(add.dataset.add); if(!p) return;
  const item=cart.find(x=>x.id===p.id); if(item) item.quantity=Math.min(99,item.quantity+1); else cart.push({id:p.id,quantity:1});
  if(save()) announce(`${p.name} added to enquiry cart.`);
 });
 const grid=document.getElementById('product-grid');
 if(grid) {
  const q=(params.get('q')||'').trim().slice(0,200), application=['residential','commercial'].includes(params.get('application'))?params.get('application'):'';
  document.getElementById('q').value=q; document.getElementById('application').value=application;
  let count=0;
  grid.querySelectorAll('[data-product]').forEach(card=>{const p=byId(card.dataset.product);const match=(!application||p.application.includes(application))&&`${p.name} ${p.description} ${p.application}`.toLowerCase().includes(q.toLowerCase()); card.hidden=!match;if(match)count++;});
  document.getElementById('results-status').textContent=`${count} product ${count===1?'family':'families'} found`;
  document.getElementById('no-results').hidden=count!==0;
 }
 function element(tag,text,cls) { const el=document.createElement(tag);if(text)el.textContent=text;if(cls)el.className=cls;return el; }
 function link(text,url,cls) { const a=element('a',text,cls);a.href=url;return a; }
 const detail=document.getElementById('product-detail');
 if(detail && params.has('product')) {
  const p=byId(params.get('product'));
  if(!p) { detail.replaceChildren(element('h2','Product not found'),element('p','Choose a product from the catalogue to continue.'),link('Browse products','products.html','mt-button')); }
  else {
   document.querySelector('h1').textContent=p.name;document.title=`${p.name} | Maritama Solar Tech`;
   const actions=element('div',null,'actions'),add=element('button','Add to enquiry cart');add.type='button';add.dataset.add=p.id;
   actions.append(add,link('Order Now',`contact.html?request=order&product=${p.id}#enquiry`,'mt-button'),link('Request a Quote',`contact.html?request=quote&product=${p.id}#enquiry`,'mt-button'));
   detail.replaceChildren(element('h2',p.description),element('p',p.details),element('h3','Confirm the right configuration'),element('p','Ask our team for available models, current pricing, technical datasheets and warranty terms. Order Now prepares an enquiry; it does not confirm an order or take payment.'),actions);
  }
 }
 const cartItems=document.getElementById('cart-items');
 function renderCart() {
  cartItems.replaceChildren();document.getElementById('cart-enquiry').hidden=!cart.length;
  if(!cart.length) { cartItems.append(element('h2','Your enquiry cart is empty'),element('p','Browse products and add the items you would like to discuss.'));return; }
  cart.forEach(item=>{
   const p=byId(item.id),row=element('article',null,'cart-item'),title=element('h2');title.append(link(p.name,`products-details.html?product=${p.id}`));
   const label=element('label','Quantity'),input=element('input');input.type='number';input.min='1';input.max='99';input.step='1';input.value=item.quantity;input.setAttribute('aria-label',`Quantity for ${p.name}`);label.append(input);
   input.addEventListener('change',()=>{const n=Number(input.value);if(!Number.isInteger(n)||n<1||n>99){input.value=item.quantity;announce('Enter a whole quantity between 1 and 99.');return;}item.quantity=n;save();});
   const remove=element('button','Remove');remove.type='button';remove.setAttribute('aria-label',`Remove ${p.name}`);remove.addEventListener('click',()=>{cart=cart.filter(x=>x.id!==item.id);save();renderCart();announce(`${p.name} removed.`);(cartItems.querySelector('button')||document.querySelector('a[href="products.html"].mt-button')).focus();});
   row.append(title,label,remove);cartItems.append(row);
  });
 }
 if(cartItems) renderCart();
 const form=document.getElementById('enquiry-form');
 if(form) {
  const request=params.get('request');if(['quote','order','cart','support'].includes(request)) form.elements.request.value=request;
  const p=byId(params.get('product'));if(p)form.elements.message.value=`I would like to enquire about ${p.name}.\n\nMy requirements:\n`;
  if(request==='cart' && cart.length) form.elements.message.value='Please provide information and a quotation for:\n'+cart.map(x=>`${byId(x.id).name} — quantity ${x.quantity}`).join('\n')+'\n\nMy requirements:\n';
  form.addEventListener('input',()=>{ document.getElementById('email-preview').hidden=true; document.getElementById('enquiry-status').textContent=''; });
  form.addEventListener('submit',e=>{
   e.preventDefault();if(!form.reportValidity())return;
   const data=new FormData(form), kind=form.elements.request.selectedOptions[0].textContent;
   const body=`${kind}\n\nName: ${String(data.get('name')).trim()}\nEmail: ${data.get('email')}\nPhone: ${String(data.get('phone')).trim()||'Not provided'}\n\n${String(data.get('message')).trim()}`;
   document.getElementById('enquiry-copy').value=body;
   document.getElementById('open-email').href=`mailto:contact@maritamatrading.com?subject=${encodeURIComponent('Maritama Solar Tech — '+kind)}&body=${encodeURIComponent(body)}`;
   document.getElementById('email-preview').hidden=false;
   document.getElementById('enquiry-status').textContent='Your enquiry is prepared, not sent. Open your email application, review it and send, or copy it into your email.';
   document.getElementById('open-email').focus();
  });
  document.getElementById('copy-enquiry').addEventListener('click',async()=>{const copy=document.getElementById('enquiry-copy');try{await navigator.clipboard.writeText(copy.value);document.getElementById('enquiry-status').textContent='Enquiry copied. Paste it into your email and send to contact@maritamatrading.com.';}catch{copy.focus();copy.select();document.getElementById('enquiry-status').textContent='Select and copy the prepared enquiry, then paste it into your email.';}});
 }
})();
