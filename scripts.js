/* North Star Bakery: favorites and accessible sample-form validation. */
'use strict';

const catalog = [
  { id: 'signature-loaf', name: 'Signature Loaf', description: 'A hand-shaped loaf for the family table.' },
  { id: 'cookie-box', name: 'Cookie Sharing Box', description: 'A selection of cookies to share with friends.' },
  { id: 'celebration-cake', name: 'Celebration Cake', description: 'Plan a cake for your next special occasion.' }
];
const storageKey = 'northStarBakery.favorites.v1';
let favoriteIds = [];
let storageAvailable = true;

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    favoriteIds = Array.isArray(saved)
      ? [...new Set(saved.filter(id => catalog.some(product => product.id === id)))]
      : [];
  } catch {
    favoriteIds = [];
    storageAvailable = false;
  }
}

function saveFavorites() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(favoriteIds));
    storageAvailable = true;
  } catch {
    storageAvailable = false;
  }
}

function storageMessage(message) {
  document.querySelector('#favorites-status').textContent = storageAvailable
    ? message
    : `${message} Browser storage is unavailable; changes will last only on this page.`;
}

function renderFavorites() {
  const list = document.querySelector('#favorites-list');
  list.replaceChildren();
  const favorites = catalog.filter(product => favoriteIds.includes(product.id));
  favorites.forEach(product => {
    const item = document.createElement('li');
    item.textContent = product.name;
    list.append(item);
  });
  document.querySelector('#favorites-empty').hidden = favorites.length > 0;
  document.querySelector('#favorites-count').textContent = String(favorites.length);
  document.querySelector('#clear-favorites').disabled = favorites.length === 0;
  document.querySelectorAll('[data-favorite]').forEach(button => {
    const selected = favoriteIds.includes(button.dataset.favorite);
    const product = catalog.find(item => item.id === button.dataset.favorite);
    button.setAttribute('aria-pressed', String(selected));
    button.textContent = `${selected ? 'Remove' : 'Save'} ${product.name}`;
  });
}

function toggleFavorite(id) {
  const product = catalog.find(item => item.id === id);
  if (!product) return;
  const removing = favoriteIds.includes(id);
  favoriteIds = removing ? favoriteIds.filter(item => item !== id) : [...favoriteIds, id];
  saveFavorites();
  renderFavorites();
  storageMessage(`${product.name} ${removing ? 'removed from' : 'added to'} your favorites.`);
}

function initializeFavorites() {
  if (!document.querySelector('#favorites-list')) return;
  loadFavorites();
  const choices = document.querySelector('#favorite-choices');
  if (choices) {
    catalog.forEach(product => {
      const card = document.createElement('article');
      const heading = document.createElement('h3');
      heading.textContent = product.name;
      const description = document.createElement('p');
      description.textContent = product.description;
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.favorite = product.id;
      button.addEventListener('click', () => toggleFavorite(product.id));
      card.append(heading, description, button);
      choices.append(card);
    });
  }
  document.querySelector('#clear-favorites').addEventListener('click', () => {
    favoriteIds = [];
    saveFavorites();
    renderFavorites();
    storageMessage('Your favorites list is now empty.');
  });
  document.querySelector('#favorites-panel').hidden = false;
  renderFavorites();
  storageMessage(favoriteIds.length
    ? `Restored ${favoriteIds.length} saved favorite${favoriteIds.length === 1 ? '' : 's'} from this browser.`
    : 'Save products to remember them on your next visit.');
}

function validatePickup(value, requestType) {
  if (!value) return requestType === 'pre-order' ? 'Choose a pickup date for your pre-order inquiry.' : '';
  const parts = value.split('-').map(Number);
  const date = new Date(parts[0], parts[1] - 1, parts[2]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (Number.isNaN(date.getTime()) || date.getFullYear() !== parts[0]
      || date.getMonth() !== parts[1] - 1 || date.getDate() !== parts[2]) return 'Enter a valid pickup date.';
  if (date <= today) return 'Choose a future pickup date.';
  if (date.getDay() === 1) return 'The bakery is closed Monday. Choose Tuesday through Sunday.';
  return '';
}

const validationRules = {
  'full-name': value => !value ? 'Enter your name.'
    : value.length < 2 || value.length > 100 ? 'Use 2 to 100 characters for your name.' : '',
  email: value => !value ? 'Enter your email address.'
    : value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Enter an email such as name@example.com.' : '',
  'request-type': value => ['pre-order', 'general'].includes(value) ? '' : 'Choose a request type.',
  'pickup-date': (value, form) => validatePickup(value, form.elements.request_type.value),
  'item-details': value => value.length < 10 || value.length > 1000 ? 'Enter 10 to 1,000 characters describing your items or question.' : '',
  'allergy-notes': value => value.length > 500 ? 'Keep allergy notes to 500 characters or fewer.' : ''
};

function validateField(field, form) {
  const message = validationRules[field.id](field.value.trim(), form);
  document.querySelector(`#${field.id}-error`).textContent = message;
  field.setAttribute('aria-invalid', String(Boolean(message)));
  return !message;
}

function initializeForm() {
  const form = document.querySelector('#request-form');
  if (!form) return;
  const status = document.querySelector('#form-status');
  let attempted = false;
  Object.keys(validationRules).forEach(id => {
    const field = document.getElementById(id);
    const error = document.createElement('span');
    error.id = `${id}-error`;
    error.className = 'field-error';
    field.after(error);
    field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), error.id].filter(Boolean).join(' '));
    const update = () => {
      status.textContent = '';
      if (attempted) validateField(field, form);
      if (id === 'request-type' && attempted) validateField(form.elements.pickup_date, form);
    };
    field.addEventListener('input', update);
    field.addEventListener('change', update);
  });
  form.noValidate = true; // JavaScript shows inline errors; HTML constraints remain as fallback.
  form.addEventListener('submit', event => {
    event.preventDefault(); // This coursework form has no submission service.
    attempted = true;
    const invalid = Object.keys(validationRules)
      .map(id => document.getElementById(id))
      .filter(field => !validateField(field, form));
    if (invalid.length) {
      status.textContent = `Please correct ${invalid.length} field${invalid.length === 1 ? '' : 's'} below. Your entries have been kept.`;
      invalid[0].focus();
    } else {
      status.textContent = 'Your sample request passed validation. Nothing was sent and no order was placed. Your entries remain available to review.';
      status.focus();
    }
  });
}

initializeFavorites();
initializeForm();
