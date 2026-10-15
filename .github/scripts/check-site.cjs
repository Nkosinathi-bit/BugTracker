const { chromium } = require(process.env.PLAYWRIGHT_MODULE_PATH);
const assert = require('node:assert/strict');
const base = 'http://127.0.0.1:8765';
const deadline = setTimeout(() => {console.error('Browser checks timed out'); process.exit(1);}, 150000);
deadline.unref();
async function checkWidth(page, label) {
  const size = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth, viewport: innerWidth,
    wide: Array.from(document.querySelectorAll('body *')).filter(el => el.getBoundingClientRect().right > innerWidth + 1).slice(0,5).map(el => el.tagName+'.'+el.className)
  }));
  assert.ok(size.content <= size.viewport+1, label+': '+JSON.stringify(size));
}
(async () => {
 const browser = await chromium.launch({headless:true});
 try {
  const context = await browser.newContext({viewport:{width:390,height:844}});
  await context.route('**/*', route => ['127.0.0.1','cdn.jsdelivr.net'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  const page = await context.newPage();
  page.setDefaultTimeout(15000);
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(base,{waitUntil:'domcontentloaded'});
  await checkWidth(page,'Login at 390px');
  await page.locator('#admin-user').fill('admin');
  await page.locator('#admin-pass').fill('1234');
  await page.locator('.btn-login').click();
  await page.locator('#main-app').waitFor({state:'visible'});
  await page.locator('#summary').fill('Portfolio browser check');
  await page.locator('#description').fill('Created without loading the sample dataset.');
  await page.locator('#priority').selectOption('high');
  await page.locator('#targetDate').fill('2099-01-02');
  await page.locator('#assignedTo').selectOption('mchen');
  await page.locator('button[onclick="createIssue()"]').click();
  assert.equal(await page.locator('.issue-item').count(),1);
  await page.locator('.issue-item button').filter({hasText:'Edit'}).click();
  await page.locator('#editIssueModal').waitFor({state:'visible'});
  assert.ok(await page.locator('#edit-assignedTo option[value="mchen"]').count());
  await page.locator('#edit-status').selectOption('resolved');
  await page.locator('#edit-resolution').fill('Verified in a browser.');
  await page.locator('.btn-save').click();
  await page.locator('#editIssueModal').waitFor({state:'hidden'});
  await page.reload({waitUntil:'domcontentloaded'});
  assert.equal(await page.locator('.issue-item').count(),1);
  await page.locator('#nav-status').selectOption('resolved');
  assert.equal(await page.locator('.issue-item').count(),1);
  await page.locator('#nav-search').fill('no matching issue');
  assert.equal(await page.locator('.issue-item').count(),0);
  await page.locator('#nav-search').fill('');
  await page.locator('#nav-status').selectOption('');
  await page.locator('button[onclick="seedDatabase()"]').click();
  assert.equal(await page.locator('.issue-item').count(),10);
  for (const width of [390,1440]) {
    await page.setViewportSize({width,height:900});
    await checkWidth(page,'Dashboard at '+width+'px');
  }
  await page.locator('button[onclick="clearDatabase()"]').click();
  assert.equal(await page.locator('.issue-item').count(),0);
  console.log('PASS: login, unseeded creation, assignee editing, resolution, persistence, filters, sample data and responsive layout.');
  assert.deepEqual(errors, []);
 } finally { await browser.close(); }
})().catch(error => {console.error(error.stack);process.exit(1);});
