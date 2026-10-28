import { products, calculate, validCount } from './calculator.js';

const euro = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' });
const integer = new Intl.NumberFormat('nl-NL');
const monthInput = document.querySelector('#month');
const status = document.querySelector('#save-status');
const now = new Date();
monthInput.value = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Amsterdam', year: 'numeric', month: '2-digit' }).format(now);
let activeMonth = monthInput.value;
let counts = {};
let hasStorageError = false;
const storageKey = () => `sales-salaris:v1:${activeMonth}`;
const monthName = () => new Intl.DateTimeFormat('nl-NL', { month: 'long', year: 'numeric' }).format(new Date(`${activeMonth}-01T12:00:00`));

for (const product of products) {
  const row = document.createElement('div');
  row.className = 'sales-row';
  const label = `${product.provider === 'ziggo' ? 'Ziggo' : 'Vodafone'} ${product.name} ${product.duration}`;
  row.innerHTML = `<div><label class="product-name" for="${product.id}">${product.name}</label><br><span class="duration">${product.duration}</span></div>
    <span class="product-rate">${euro.format(product.rate)}</span>
    <div class="stepper"><button type="button" data-step="-1" aria-label="Eén minder: ${label}">−</button><input id="${product.id}" type="number" min="0" max="1000000" step="1" inputmode="numeric" value="0" aria-label="Aantal ${label}"><button type="button" data-step="1" aria-label="Eén meer: ${label}">+</button></div>
    <span class="row-total" id="amount-${product.id}">${euro.format(0)}</span>`;
  const input = row.querySelector('input');
  input.addEventListener('input', () => {
    // An empty field is treated as zero while editing. Invalid values never enter the totals.
    if (input.value !== '' && !validCount(input.value)) {
      input.setCustomValidity('Vul een heel aantal in tussen 0 en 1.000.000.');
      input.reportValidity();
      return;
    }
    input.setCustomValidity('');
    counts[product.id] = Number(input.value);
    update();
    save();
  });
  input.addEventListener('blur', () => {
    input.setCustomValidity('');
    input.value = counts[product.id] ?? 0;
  });
  row.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
    counts[product.id] = Math.min(1000000, Math.max(0, (counts[product.id] ?? 0) + Number(button.dataset.step)));
    input.setCustomValidity('');
    input.value = counts[product.id];
    update();
    save();
  }));
  document.querySelector(`#${product.provider}-rows`).append(row);
}

function update() {
  const totals = calculate(counts);
  document.querySelector('#total-sales').textContent = integer.format(totals.sales);
  for (const [id, value] of Object.entries({ gross: totals.gross, payout: totals.payout, 'summary-gross': totals.gross, 'summary-payout': totals.payout, 'ziggo-total': totals.ziggo, 'vodafone-total': totals.vodafone })) {
    document.getElementById(id).textContent = euro.format(value);
  }
  document.querySelector('#summary-month').textContent = monthName();
  for (const product of products) {
    const count = counts[product.id] ?? 0;
    document.getElementById(`amount-${product.id}`).textContent = euro.format(count * product.rate);
    const stepper = document.getElementById(product.id).parentElement;
    stepper.querySelector('[data-step="-1"]').disabled = count === 0;
    stepper.querySelector('[data-step="1"]').disabled = count === 1000000;
  }
  document.querySelector('#tip-text').textContent = totals.gross >= 70
    ? 'Je licentiekosten zijn terugverdiend. Elke volgende sale telt direct mee voor jouw verdiensten deze maand.'
    : 'Met één Ziggo-abonnement van 2 jaar heb je je maandelijkse licentiekosten al terugverdiend.';
}

function load() {
  counts = {};
  hasStorageError = false;
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey()) ?? '{}');
    for (const product of products) {
      counts[product.id] = stored && validCount(stored[product.id]) ? Number(stored[product.id]) : 0;
    }
    status.textContent = 'Automatisch bewaard op dit apparaat';
  } catch {
    hasStorageError = true;
    status.textContent = 'Opslag niet beschikbaar. Houd deze pagina open.';
  }
  for (const product of products) {
    const input = document.getElementById(product.id);
    input.value = counts[product.id] ?? 0;
    input.setCustomValidity('');
  }
  update();
}

function save() {
  try {
    localStorage.setItem(storageKey(), JSON.stringify(counts));
    hasStorageError = false;
    status.textContent = 'Automatisch bewaard op dit apparaat';
  } catch {
    hasStorageError = true;
    status.textContent = 'Opslaan mislukt. Houd deze pagina open.';
  }
}

monthInput.addEventListener('change', () => {
  if (!/^\d{4}-\d{2}$/.test(monthInput.value) || !monthInput.checkValidity()) {
    monthInput.value = activeMonth;
    return;
  }
  if (hasStorageError && !window.confirm('Je aantallen konden niet worden bewaard. Bij het wisselen van maand gaan ze verloren. Toch doorgaan?')) {
    monthInput.value = activeMonth;
    return;
  }
  activeMonth = monthInput.value;
  load();
});

const resetDialog = document.querySelector('#reset-dialog');
document.querySelector('#reset').addEventListener('click', () => {
  document.querySelector('#reset-month').textContent = monthName();
  resetDialog.returnValue = '';
  resetDialog.showModal();
});
resetDialog.addEventListener('close', () => {
  if (resetDialog.returnValue !== 'confirm') return;
  counts = {};
  for (const product of products) document.getElementById(product.id).value = 0;
  update();
  save();
});

load();
