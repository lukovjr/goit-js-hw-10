import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const infoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onSearchCountryInput, DEBOUNCE_DELAY));

function onSearchCountryInput (event) {
  const valueInput = event.target.value.trim();

  if (valueInput === '') {
    return (listEl.innerHTML = ''), (infoEl.innerHTML = '');
  }

  fetchCountries(valueInput)
    .then(makeCountry)
    .catch(err => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
};

function makeCountry(data) {
  listEl.innerHTML = '';
  infoEl.innerHTML = '';
  if (data.length >= 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (data.length === 1) {
    infoEl.insertAdjacentHTML('beforeend', makeCountryMurkup(data));
  } else {
    listEl.insertAdjacentHTML('beforeend', makeAllCountriesMurkup(data));
  }
};

function makeCountryMurkup(country) {
    let oneCountry = country
      .map(({ name, population, capital, flags, languages }) => {
        return `<img class="flags-list" src="${flags.svg}" alt="Country width="150" height="150">
          <h3>${name.official}</h3>
          <p>Population:"${population}"</p>
          <p>Capital:"${capital}"</p>
          <p>Language:"${Object.values(languages)}"</p>`;})
      .join('');

    return oneCountry;
  };

function makeAllCountriesMurkup(countries) {
  const listCountries = countries
    .map(({ name, flags }) => {
      return `<img src="${flags.svg}" alt="${name.official} with="30" height="30"><h2>${name.official}</h2>`;})
    .join('');

  return listCountries;
};
