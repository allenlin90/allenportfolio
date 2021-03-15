
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
                    <form action="" method="get" class="digit-group" data-group-name="digits" data-autosubmit="false" autocomplete="off" id="insert_otp">
                        <div>
                            <input type="text" id="digit-1" name="digit-1" data-next="digit-2" />
                            <input type="text" id="digit-2" name="digit-2" data-next="digit-3" data-previous="digit-1" />
                            <input type="text" id="digit-3" name="digit-3" data-next="digit-4" data-previous="digit-2" />
                            <input type="text" id="digit-4" name="digit-4" data-previous="digit-3" />
                        </div>
                        <div>
                            <button class="btn btn-warning" type="submit">Check OTP</button>
                        </div>
                    </form>
                    `;
                }, 500);
            } else {
                input.classList.add('is-invalid');
            }
        }
    }
}