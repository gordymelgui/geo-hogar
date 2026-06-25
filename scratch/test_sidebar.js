const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

const dom = new JSDOM(html, {
  url: 'http://localhost/',
  runScripts: 'dangerously',
  resources: 'usable'
});

const { window } = dom;
global.window = window;
global.document = window.document;
global.navigator = window.navigator;
global.localStorage = {
  store: {},
  getItem(key) { return this.store[key] || null; },
  setItem(key, value) { this.store[key] = String(value); },
  removeItem(key) { delete this.store[key]; },
  clear() { this.store = {}; }
};
window.localStorage = global.localStorage;

// Load currency.js and i18n.js
const currencyJs = fs.readFileSync(path.join(__dirname, '../js/currency.js'), 'utf8');
const i18nJs = fs.readFileSync(path.join(__dirname, '../js/i18n.js'), 'utf8');

try {
  // Mock some methods/objects if needed
  window.t = (key) => key;
  
  // Run scripts
  const scriptEl1 = window.document.createElement('script');
  scriptEl1.textContent = currencyJs;
  window.document.body.appendChild(scriptEl1);

  const scriptEl2 = window.document.createElement('script');
  scriptEl2.textContent = i18nJs;
  window.document.body.appendChild(scriptEl2);

  // Trigger DOMContentLoaded
  const event = window.document.createEvent('Event');
  event.initEvent('DOMContentLoaded', true, true);
  window.document.dispatchEvent(event);

  console.log('DOMContentLoaded fired.');

  const btn = window.document.getElementById('sidebar-lang-btn');
  const dropdown = window.document.getElementById('sidebar-lang-dropdown');
  const container = window.document.getElementById('sidebar-lang-selector');

  console.log('Before click:');
  console.log('Button aria-expanded:', btn.getAttribute('aria-expanded'));
  console.log('Dropdown classes:', dropdown.className);
  console.log('Container classes:', container.className);

  btn.click();

  console.log('After click:');
  console.log('Button aria-expanded:', btn.getAttribute('aria-expanded'));
  console.log('Dropdown classes:', dropdown.className);
  console.log('Container classes:', container.className);

} catch (err) {
  console.error('Error during execution:', err);
}
