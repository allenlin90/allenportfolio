init();

function init() {
    const otpInput = document.querySelector('#phone_otp_input');
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
                otpInput.innerHTML = `
                    <div id="otp_loader">
                        <div class="spinner-border text-warning" style="width:3rem; height:3rem;" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <h4>Loading...</h4>
                    </div>
                `;
                setTimeout(function () {
                    otpInput.innerHTML = `
                    <form class="digit-group" data-group-name="digits" autocomplete="off" id="insert_otp">
                        <div>
                            <h3>Enter OTP Code</h3>
                        </div>
                        <div>
                            <input type="text" inputmode="numeric" id="digit-1" name="digit-1" data-next="digit-2" maxlength="1" />
                            <input type="text" inputmode="numeric" id="digit-2" name="digit-2" data-next="digit-3" data-previous="digit-1"
                                maxlength="1" />
                            <input type="text" inputmode="numeric" id="digit-3" name="digit-3" data-next="digit-4" data-previous="digit-2"
                                maxlength="1" />
                            <input type="text" inputmode="numeric" id="digit-4" name="digit-4" data-previous="digit-3" maxlength="1" />
                        </div>
                        <div>
                            <button class="btn btn-warning" type="submit" disabled>Request OTP <span>(<span id="countdown">60</span> sec)</span></button>
                        </div>
                    </form>
                    `;
                    countdown();
                    inputHandler();
                }, 500);
            } else {
                input.classList.add('is-invalid');
            }
        }
    }
}

function countdown() {
    const clock = document.querySelector('#countdown');
    let second = parseInt(clock.innerText);
    if (second > 0) {
        clock.innerText = second - 1;
        setTimeout(function () {
            countdown();
        }, 1000)
    } else {
        const requestOTP = document.querySelector('#insert_otp button');
        requestOTP.removeAttribute('disabled');
        clock.parentNode.innerHTML = ``;
        requestOTP.onclick = function () {
            requestOTP.setAttribute("disabled", true);
            document.querySelector('#insert_otp button span').innerHTML = `(<span id="countdown">60</span> sec)`;
            countdown();
        }
    }
}

function inputHandler() {
    const state = {
        otp: ''
    };
    const inputs = document.querySelector('.digit-group').querySelectorAll('input');
    inputs[0].focus();

    inputs.forEach((input) => {
        input.onchange = function (e) {
            const parent = this.parentNode;
            const value = e.target.value;
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
                    console.log(state.otp);
                }
            }
        }

        input.onkeyup = function (e) {
            const parent = this.parentNode;
            const formTag = parent.parentNode;
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
                        console.log(state.otp);
                    }
                }
            }
        }
    });
}