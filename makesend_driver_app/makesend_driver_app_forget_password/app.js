const defaultPendingTime = 60;
const state = {
    otp: '',
    pending: defaultPendingTime,
    driverPhone: null,
    timeStamp: null,
    countdownTimer: null
}

resetPassword();

function resetPassword() {
    const otpInput = document.querySelector('#phone_otp_input');
    if (otpInput) {
        otpInput.innerHTML = `
        <form action="" method="post" id="submit_phone">
            <label for="driver_phone" class="form-label">Please enter your phone</label>
            <div>
                <input class="form-control" id="driver_phone" type="tel" name="receiver_phone" value=""
                    inputmode="numeric" placeholder="E.g. 0632166699" autocomplete="off" pattern="[0-9]{10}">
                <button type="submit"><i class="fa fa-search"></i></button>
                <div id="error_hint" class="invalid-feedback">Phone number starts with 0 and has 10 digits!</div>
            </div>
        </form>
        `;
        const form = otpInput.querySelector('#submit_phone');

        if (otpInput && form) {
            form.onsubmit = async function (event) {
                event.stopPropagation();
                event.preventDefault();
                const input = event.target.querySelector('input');
                input.oninput = function () {
                    this.classList.remove('is-invalid');
                }
                const driverPhone = input.value;
                if (/^0\d{9}/g.test(driverPhone)) {
                    state.driverPhone = driverPhone;
                    otpInput.innerHTML = loaderTag();
                    setTimeout(function () {
                        state.timeStamp = new Date().getTime();
                        otpInput.innerHTML = otpForm(state.driverPhone);
                        countdown();
                        inputHandler();
                    }, 300);
                } else {
                    input.classList.add('is-invalid');
                }
            }
        }
    }
}

function countdown(duration = 60) {
    if (state.countdownTimer) {
        clearTimeout(state.countdownTimer);
    }
    const clock = document.querySelector('#countdown');
    if (clock) {
        let second = state.pending ?? duration;
        if (second > 0) {
            state.pending = second - 1;
            clock.innerText = state.pending ?? duration;
            state.countdownTimer = setTimeout(function () {
                countdown(state.pending ?? duration);
            }, 1000);
        } else {
            const requestOTP = document.querySelector('#insert_otp button');
            requestOTP.removeAttribute('disabled');
            clock.parentNode.innerHTML = ``;
            requestOTP.onclick = function (event) {
                event.preventDefault();
                state.pending = defaultPendingTime;
                requestOTP.setAttribute("disabled", true);
                document.querySelector('#insert_otp button span').innerHTML = `(<span id="countdown">${state.pending ?? duration}</span> sec)`;
                countdown(state.pending ?? duration);
            }
        }
    }
}

function inputHandler() {
    const otpInput = document.querySelector('#phone_otp_input');

    const inputs = document.querySelector('.digit-group').querySelectorAll('input');
    if (inputs.length) {
        inputs[0].focus();

        inputs.forEach((input) => {
            input.onchange = async function (e) {
                const parent = this.parentNode;
                const value = e.target.value;
                const errorMsg = document.querySelector('#invalid_otp');
                errorMsg.innerText = ``;
                if (value) {
                    const next = parent.querySelector(`input#${this.dataset.next}`);
                    if (next) {
                        next.focus();
                    }
                } else if (!value) {
                    const prev = parent.querySelector(`input#${this.dataset.previous}`);
                    if (prev) {
                        prev.focus();
                    }
                } else {
                    state.otp = '';
                    formTag.querySelectorAll('input').forEach(input => {
                        state.otp += input.value;
                    });
                    if (state.otp.length === 4) {
                        console.log('check OTP');
                        const otpCode = state.otp;
                        console.log(otpCode);
                        otpInput.innerHTML = loaderTag();
                        const timer = setTimeout(function () {
                            if (state.otp === '0000') {
                                resetPasswordForm();
                            } else {
                                otpInput.innerHTML = otpForm(state.driverPhone, state.pending);
                                const errorMsg = document.querySelector('#invalid_otp')
                                errorMsg.innerText = `Invalid OTP Code!`;
                                clearTimeout(timer);
                                inputHandler();
                                countdown();
                            }
                        }, 500)
                    }
                }
            }

            input.onkeyup = async function (e) {
                const parent = this.parentNode;
                const formTag = parent.parentNode;
                const errorMsg = document.querySelector('#invalid_otp');
                errorMsg.innerText = ``;
                if (e.keyCode === 8 || e.keyCode === 37) {
                    const prev = parent.querySelector(`input#${this.dataset.previous}`);
                    if (prev) {
                        prev.focus();
                    }
                } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
                    const next = parent.querySelector(`input#${this.dataset.next}`);
                    if (next) {
                        next.focus();
                    } else {
                        state.otp = '';
                        formTag.querySelectorAll('input').forEach(input => {
                            state.otp += input.value;
                        });
                        if (state.otp.length === 4) {
                            console.log('check OTP');
                            const otpCode = state.otp;
                            console.log(otpCode);
                            otpInput.innerHTML = loaderTag();
                            const timer = setTimeout(function () {
                                if (state.otp === '0000') {
                                    resetPasswordForm();
                                } else {
                                    otpInput.innerHTML = otpForm(state.driverPhone, state.pending);
                                    const errorMsg = document.querySelector('#invalid_otp')
                                    errorMsg.innerText = `Invalid OTP Code!`;
                                    clearTimeout(timer);
                                    inputHandler();
                                    countdown();
                                }
                            }, 500)
                        }
                    }
                }
            }
        });
    }
}

function loaderTag() {
    return `
        <div id="otp_loader">
            <div class="spinner-border text-warning" style="width:3rem; height:3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h4>Loading...</h4>
        </div>
    `;
}

function otpForm(driverPhone = null, pendingTime = 60) {
    return `
    <form class="digit-group" data-group-name="digits" autocomplete="off" id="insert_otp">
        <div>
            <h3>Enter OTP Code</h3>
            <h3>Phone: ${driverPhone}</h3>
        </div>
        <div>
            <input autocomplete="off" type="text" inputmode="numeric" id="digit-1" name="digit-1" data-next="digit-2" maxlength="1" />
            <input autocomplete="off" type="text" inputmode="numeric" id="digit-2" name="digit-2" data-next="digit-3" data-previous="digit-1"
                maxlength="1" />
            <input autocomplete="off" type="text" inputmode="numeric" id="digit-3" name="digit-3" data-next="digit-4" data-previous="digit-2"
                maxlength="1" />
            <input autocomplete="off" type="text" inputmode="numeric" id="digit-4" name="digit-4" data-previous="digit-3" maxlength="1" />
        </div>
        <div id="invalid_otp"></div>
        <div>
            <button class="btn btn-warning" type="submit" disabled>Request OTP <span>(<span id="countdown">${pendingTime}</span> sec)</span></button>
        </div>
    </form>
    `;
}

function resetPasswordForm() {
    const otpInput = document.querySelector('#phone_otp_input');
    otpInput.innerHTML = `
        <form action="" autocomplete="off" id="reset_password_form">
            <div class="mb-3">
                <label for="password" class="form-label">New Password</label>
                <input type="password" class="form-control" id="password" required>
                <div class="invalid-feedback">Your password do not match</div>
            </div>
            <div class="mb-3">
                <label for="password_repeat" class="form-label">Confirm password</label>
                <input type="password" class="form-control" id="password_repeat" required>
                <div class="invalid-feedback">Your password do not match</div>
            </div>
            <div>
                <button type="submit" class="btn btn-warning">Reset Password</button>
            </div>
        </form>
    `;
    const resetForm = document.querySelector('#reset_password_form');
    const submitBtn = resetForm.querySelector('button');
    const inputs = [...resetForm.querySelectorAll('input')];
    inputs.forEach(input => {
        input.oninput = function () {
            inputs.forEach(input => {
                input.classList.remove('is-invalid');
            });
        }
    });

    submitBtn.onclick = async function (event) {
        event.preventDefault();
        const values = inputs.map(input => {
            if (!input.value) return null;
            return input.value;
        });
        if (values[0] === values[1] && !!values[0]) {
            console.log('change passwords');
            if (true) {
                window.location.hash = '';
            }
        } else {
            inputs.forEach(input => {
                input.classList.add('is-invalid');
            });
        }
    }
}