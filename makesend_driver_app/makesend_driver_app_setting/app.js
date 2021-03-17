import { requestOTP } from '../app.js';

// requestOTP();

const searchSettingForm = document.querySelector('#search_setting form');
searchSettingForm.onsubmit = function (event) {
    event.preventDefault();
}