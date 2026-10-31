const {chromium}=require('playwright');
const fs=require('node:fs');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const checks=[],errors=[];
 const base='http://127.0.0.1:8000/';
 const files=fs.readdirSync('.').filter(f=>f.endsWith('.html'));
 const ctx=await browser.newContext();
 const page=await ctx.newPage();
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 page.on('response',r=>{if(r.status()>=400) errors.push(`${r.status()} ${r.url()}`);});
 for(const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844],['small-mobile',320,740]]){
  await page.setViewportSize({width,height});
  for(const file of files){
   await page.goto(base+file);await page.waitForLoadState('networkidle');
   assert.equal(await page.locator('h1').count(),1,`${name} ${file}: one h1`);
   assert.equal(await page.locator('main').count(),1,`${name} ${file}: main`);
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
   assert.ok(!overflow,`${name} ${file}: horizontal overflow`);
   assert.equal(await page.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.complete||i.naturalWidth===0).length),0);
   assert.ok(await page.locator('body').innerText().then(t=>!/(Serinic|Spinergy|Lorem ipsum|biogas|dental|\bServices?\b)/i.test(t)),`${file}: template wording`);
   const badHome=await page.locator('a').evaluateAll(as=>as.filter(a=>(a.textContent.trim()==='Home'||a.getAttribute('aria-label')==='Maritama Solar Tech home')&&!a.getAttribute('href').startsWith('index-2-dark.html')).length);
   assert.equal(badHome,0);
   assert.equal(await page.locator('nav a[href="index.html"],nav a[href="index-2.html"],nav a[href="index-dark.html"],nav a[href="index-3.html"]').count(),0);
   if(width<=1250){await page.getByRole('button',{name:'Menu',exact:true}).click();assert.equal(await page.getByRole('button',{name:'Menu',exact:true}).getAttribute('aria-expanded'),'true');}
   await page.locator('.product-menu summary').click();await page.getByRole('link',{name:'Commercial & industrial products',exact:true}).waitFor({state:'visible'});
   assert.ok(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),`${name} ${file}: menu overflow`);
   await page.keyboard.press('Escape');assert.equal(await page.locator('.product-menu').getAttribute('open'),null);
   assert.ok(await page.locator(':focus').isVisible(),`${name} ${file}: Escape focus remains visible`);
   checks.push(`${name}: ${file}`);
  }
 }
 // Link and fragment audit after redirects, including every local resource.
 for(const file of files){
  await page.goto(base+file);await page.waitForLoadState('networkidle');
  const refs=await page.locator('a[href],script[src],link[href]').evaluateAll(els=>els.map(e=>e.href||e.src).filter(Boolean));
  for(const url of new Set(refs)){
   if(!url.startsWith(base))continue;
   const response=await ctx.request.get(url);assert.equal(response.status(),200,`${file}: ${url}`);
   const parsed=new URL(url);
   if(parsed.hash){const target=await ctx.newPage();await target.goto(url);assert.equal(await target.locator(`[id="${parsed.hash.slice(1)}"]`).count(),1,`${file}: fragment ${url}`);await target.close();}
  }
 }
 await page.setViewportSize({width:1440,height:1000});
 await page.goto(base+'products.html');await page.locator('#q').fill('batteries');await page.getByRole('button',{name:'Search',exact:true}).click();await page.waitForURL('**/products.html?**');assert.equal(await page.locator('.product-card:visible').count(),1);
 await page.goto(base+'products.html?q=does-not-exist');assert.equal(await page.locator('.product-card:visible').count(),0);assert.ok(await page.locator('#no-results').isVisible());
 for(const application of ['residential','commercial']){await page.goto(base+`products.html?application=${application}`);assert.ok(await page.locator('.product-card:visible').count()>0);assert.ok(await page.locator('.product-card:visible').evaluateAll((els,a)=>els.every(e=>e.dataset.application.includes(a)),application));}
 await page.goto(base+'products-details.html?product=solar-panels');assert.equal(await page.locator('h1').innerText(),'Solar Panels');
 await page.getByRole('button',{name:'Add to enquiry cart'}).click();assert.equal(await page.locator('[data-cart-count]').innerText(),'1');
 await page.goto(base+'cart.html');await page.reload();assert.equal(await page.locator('.cart-item').count(),1);
 await page.getByRole('spinbutton').fill('3');await page.getByRole('spinbutton').press('Tab');assert.equal(await page.locator('[data-cart-count]').innerText(),'3');
 await page.getByRole('link',{name:'Enquire about these products'}).click();assert.match(await page.locator('#message').inputValue(),/Solar Panels — quantity 3/);
 await page.getByRole('button',{name:'Prepare enquiry email'}).click();assert.equal(await page.locator('#email-preview').isVisible(),false);
 await page.locator('#name').fill('Review Tester');await page.locator('#email').fill('review@example.test');await page.getByRole('button',{name:'Prepare enquiry email'}).click();assert.ok(await page.locator('#email-preview').isVisible());
 const mail=await page.locator('#open-email').getAttribute('href');assert.ok(mail.startsWith('mailto:contact@maritamatrading.com?'));assert.match(decodeURIComponent(mail),/Solar Panels — quantity 3/);assert.match(await page.locator('#enquiry-status').innerText(),/not sent/);
 await page.locator('#message').fill('Changed requirements');assert.ok(await page.locator('#email-preview').isHidden());await page.getByRole('button',{name:'Prepare enquiry email'}).click();assert.match(decodeURIComponent(await page.locator('#open-email').getAttribute('href')),/Changed requirements/);
 await page.goto(base+'products-details.html?product=commercial-storage');await page.getByRole('link',{name:'Order Now',exact:true}).click();assert.equal(await page.locator('#request').inputValue(),'order');assert.match(await page.locator('#message').inputValue(),/Commercial & Industrial Energy Storage/);
 await page.goto(base+'contact.html?request=quote#enquiry');assert.equal(await page.locator('#request').inputValue(),'quote');
 await page.goto(base+'cart.html');await page.getByRole('button',{name:'Remove Solar Panels'}).click();assert.equal(await page.locator('.cart-item').count(),0);assert.ok(await page.locator('#cart-enquiry').isHidden());
 await page.evaluate(()=>localStorage.setItem('maritama.enquiryCart','broken'));await page.reload();assert.equal(await page.locator('.cart-item').count(),0);
 await page.goto(base+'products-details.html?product=invalid');assert.match(await page.locator('#product-detail').innerText(),/Product not found/);
 await page.goto(base+'product-details.html?product=lithium-batteries');await page.waitForURL('**/products-details.html?product=lithium-batteries');assert.equal(await page.locator('h1').innerText(),'Lithium Batteries');
 await page.goto(base+'faq.html');await page.locator('.faq summary').first().click();assert.ok(await page.locator('.faq').first().getAttribute('open')!==null);
 await page.emulateMedia({reducedMotion:'reduce'});assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto');
 fs.mkdirSync('/tmp/maritama-review',{recursive:true});
 for(const [name,width,height] of [['desktop',1440,1000],['tablet',768,1024],['mobile',390,844]]){
  await page.setViewportSize({width,height});for(const file of ['index-2-dark.html','about.html','products.html','contact.html']){await page.goto(base+file);await page.screenshot({path:`/tmp/maritama-review/${name}-${file}.png`,fullPage:true});}
 }
 assert.deepEqual(errors,[],'Browser or resource errors');
 const report={pageViewportChecks:checks.length,pages:files.length,widths:[1440,768,390,320],checks,errors,flows:['search','empty search','residential/commercial filters','product detail','cart add/persist/quantity/remove','cart enquiry handoff','form required validation','prepared email recipient/body','order handoff','quote handoff','invalid product','corrupted storage','legacy query redirect','FAQ','reduced motion','local links and fragments'],limitations:['No email was sent or delivery verified.','No original images or logo were available.','No payment processing or inventory backend.']};
 fs.writeFileSync('/tmp/maritama-review/results.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
