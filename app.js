'use strict';
// Static prototype: validate locally; no network submission or persistence.
const form = document.querySelector('#workout-form');
if (form) {
  const date = form.elements.date;
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
  date.max = localToday;
  const summary = document.querySelector('#form-errors');
  const result = document.querySelector('#workout-result');
  function clearErrors() {
    form.querySelectorAll('.error').forEach(el => { el.textContent = ''; });
    form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    summary.hidden = true;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();
    result.hidden = true;
    const errors = [];
    function invalid(name, message) {
      errors.push(name);
      form.elements[name].setAttribute('aria-invalid','true');
      document.querySelector(`#${name}-error`).textContent = message;
    }
    if (!form.elements.activity.value) invalid('activity','Choose your activity type.');
    if (!date.value || !date.validity.valid || date.value > localToday) invalid('date','Enter a valid date today or earlier.');
    const duration = Number(form.elements.duration.value);
    if (!Number.isInteger(duration) || duration < 1 || duration > 1440) invalid('duration','Enter a whole number from 1 to 1,440 minutes.');
    const distance = form.elements.distance;
    if (distance.validity.badInput || (distance.value !== '' && (!Number.isFinite(Number(distance.value)) || Number(distance.value) < 0 || !distance.validity.valid))) invalid('distance','Enter a nonnegative distance with up to two decimal places.');
    if (errors.length) {
      summary.textContent = `Please correct ${errors.length === 1 ? 'the highlighted field' : 'the highlighted fields'} before reviewing your workout.`;
      summary.hidden = false;
      form.elements[errors[0]].focus();
      return;
    }
    const formattedDate = new Date(date.value+'T12:00:00').toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'});
    let text = `${form.elements.activity.value} · ${formattedDate} · ${duration} minutes`;
    if (distance.value !== '') text += ` · ${Number(distance.value)} km`;
    const notes = form.elements.notes.value.trim();
    if (notes) text += `. Notes: ${notes}`;
    document.querySelector('#result-text').textContent = text;
    result.hidden = false;
    result.scrollIntoView({block:'nearest'});
  });
  form.addEventListener('reset', () => { clearErrors(); result.hidden = true; });
}
