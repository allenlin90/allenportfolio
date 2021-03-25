import { fetchHeader, userLogin, getParameterByName } from '../main.js';
const state = {
    redirectCountdownTimer: null,
    id: '',
    trackingId: ''
}

window.location.hash = '#registerqr?id=PP0123456789012&trackingId=EX2103211733231'; // valid IDs
// window.location.hash = '#registerqr?id=PP21032222593&trackingId=EX03211733231'; // invalid IDs

state.id = getParameterByName('id'); // PP2103222259363
console.log(`id: ${state.id}`);
state.trackingId = getParameterByName('trackingId'); // EX2103211733231
console.log(`trackingId: ${state.trackingId}`);

const preprintIdInput = document.querySelector('#preprint_id_register');
const trackingIdInput = document.querySelector('#tracking_id_register');
preprintIdInput.addEventListener('input', removeInvalidClass);
trackingIdInput.addEventListener('input', removeInvalidClass);
if (state.id) {
    preprintIdInput.value = state.id;
}
if (state.id) {
    trackingIdInput.value = state.trackingId;
}

const registerQRDiv = document.querySelector('#register_qr');
const searchSettingForm = registerQRDiv.querySelector('form');
searchSettingForm.onsubmit = mapIds;

async function mapIds(event) {
    event.preventDefault();
    const preprintIdInput = document.querySelector('#preprint_id_register');
    const trackingIdInput = document.querySelector('#tracking_id_register');
    state.id = preprintIdInput.value.trim().toLowerCase()
    const idToRegister = state.id;
    state.trackingId = trackingIdInput.value.trim().toLowerCase();
    const trackingIdToRegister = state.trackingId;
    registerQRDiv.innerHTML = loaderTag();
    if (/^p{2}\d{13}$/g.test(idToRegister) && /^ex\d{13}$/g.test(trackingIdToRegister)) {
        const resCode = idToRegister === 'pp0123456789012' ? 200 : 400;
        const message = resCode === 200 ? 'success' : 'register failed'
        const response = {
            resCode,
            message
        }
        setTimeout(function () {
            if (response.resCode === 200) {
                console.log('registered');
                registerQRDiv.innerHTML = successAnimation(3);
                redirectCountdown(3);
                setTimeout(function(){
                    window.location.reload();
                }, 3000)
            } else {
                console.log(response.message);
                alert(response.message);
                invalidForm();
            }
        }, 1500);
    } else {
        invalidForm();
    }
}

function invalidForm() {
    const registerQRDiv = document.querySelector('#register_qr');
    registerQRDiv.innerHTML = `
        <div>
            <form action="" autocomplete="off">
                <div class="mb-3">
                    <label for="preprint_id_register" class="form-label">Prerint QR ID</label>
                    <input type="text" class="form-control" id="preprint_id_register" autocomplete="off"
                        placeholder="#PP0123456789012">
                    <div class="invalid-feedback">Preprint ID starts with "PP"</div>
                </div>
                <div class="mb-3">
                    <label for="tracking_id_register" class="form-label">Parcel Tracking ID</label>
                    <input type="text" class="form-control" id="tracking_id_register"
                        placeholder="#EX0123456789012">
                    <div class="invalid-feedback">Parcel Tracking ID starts with "EX"</div>
                </div>
                <button type="submit" class="btn btn-warning">Register Parcel ID</button>
            </form>
        </div>
        `;
    const preprintIdInput = document.querySelector('#preprint_id_register');
    const trackingIdInput = document.querySelector('#tracking_id_register');
    preprintIdInput.value = state.id;
    trackingIdInput.value = state.trackingId;
    preprintIdInput.classList.add('is-invalid');
    trackingIdInput.classList.add('is-invalid');
    preprintIdInput.addEventListener('input', removeInvalidClass);
    trackingIdInput.addEventListener('input', removeInvalidClass);
    const searchSettingForm = document.querySelector('#register_qr form');
    searchSettingForm.onsubmit = mapIds;
}

function loaderTag() {
    return `
        <div id="loader">
            <div class="spinner-border text-warning" style="width:3rem; height:3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h4>Loading...</h4>
        </div>
    `;
}

function successAnimation(duration = '10') {
    return `
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
            <img style="display:block; width: 50%; border-radius: 10px;" src="https://i.pinimg.com/originals/e8/06/52/e80652af2c77e3a73858e16b2ffe5f9a.gif">
            <div>
                <h2 style="text-align: center;">Success!</h2>
            </div>
            <div>
                <p style="text-align: center;">Page redirect in <span id="redirect_countdown">${duration}</span> seconds...</p>
            </div>
        </div>
    `;
}

function redirectCountdown(duration = 10) {
    const redirect = document.querySelector('#redirect_countdown');
    if (duration > 0) {
        state.redirectCountdownTimer = setTimeout(function () {
            redirect.innerText = duration - 1;
            redirectCountdown(duration - 1)
        }, 1000);
    } else {
        if (state.redirectCountdownTimer) {
            clearTimeout(state.redirectCountdownTimer);
        }
    }
}

function removeInvalidClass() {
    if (this.id.includes('tracking_id')) {
        state.id = this.value;
    } else if (this.id.includes('preprint_id')) {
        state.trackingId = this.value;
    }
    const inputs = document.querySelectorAll('input');
    [...inputs].forEach(input => {
        input.classList.remove('is-invalid');
    });
}