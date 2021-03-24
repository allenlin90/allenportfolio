const state = {
    name: '',
    email: '',
    phone: '',
}

signupForm();
export function signupForm() {
    const container = document.querySelector('.container');
    container.innerHTML = registraionForm(state.name, state.email, state.phone);
    togglePassword();
    const form = container.querySelector('form');
    form.onsubmit = signUpUser;
}

async function signUpUser(event) {
    event.preventDefault();
    const inputs = [...document.querySelectorAll('input')];
    const userProfile = inputs.reduce((profile, input) => {
        profile[input.dataset.type] = input.value;
        return profile;
    }, {});
    const formWrapper = document.querySelector('#form_wrapper');
    formWrapper.innerHTML = loaderTag();
    const buttons = document.querySelector('#signup_form > div:last-child');
    buttons.style.display = 'none';
    // let response = {
    //     resCode: 200,
    //     message: 'success'
    // }

    let response = {
        resCode: 400,
        message: 'registration failed...'
    }
    /*
        1. Request to register
        2. Check server response
        3. Show result
        3.1 Successful
        3.2 Invalid Input
        3.3 Server Error
    */
    setTimeout(function () {
        if (response.resCode === 200) {
            console.log('success');
        } else {
            console.log(response.message);
            alert(response.message);
            document.querySelector('.container').innerHTML = registraionForm(state.name, state.email, state.phone);
        }
    }, 1500);
}

function registraionForm(name = '', email = '', phone = '') {
    return `
    <div id="signup_form">
        <div>
            <a href="#"><img src="../images/eridu_logo.png" alt="eridu_logo"></a>
        </div>
        <h1>Register Account</h1>
        <div id="form_wrapper">
            <form action="" id="eridu_signup_form" class="form-group">
                <div class="input-group mb-3">
                    <span class="input-group-text"><i class="fas fa-user"></i></span>
                    <input data-type="name" value="${name}" type="text" class="form-control" aria-label="name" placeholder="Your Name" required>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text"><i class="fas fa-envelope"></i></span>
                    <input data-type="email" value="${email}" type="email" inputmode="email" class="form-control" aria-label="email"
                        placeholder="Email" required>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text"><i class="fas fa-phone-alt"></i></span>
                    <input data-type="phone" value="${phone}" type="number" inputmode="numeric" class="form-control" aria-label="phone number"
                        placeholder="Phone Number" required>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text"><i class="fas fa-lock"></i></span>
                    <input data-type="password" type="password" class="form-control" aria-label="new password" placeholder="New Password"
                        required>
                    <span class="input-group-text"><i class="fas fa-eye"></i></span>
                </div>
                <div class="input-group mb-3">
                    <span class="input-group-text"><i class="fas fa-lock"></i></span>
                    <input data-type="confirm_password" type="password" class="form-control" aria-label="confirm password"
                        placeholder="Confirm Password" required>
                    <span class="input-group-text"><i class="fas fa-eye"></i></span>
                </div>                
            </form>
        </div>
        <div>
            <input value="Sign Up" type="submit" class="btn btn-warning" id="submit_signup_form" form="eridu_signup_form">
            <div><a class="btn btn-primary" href="#">Back to Login</a></div>
        </div>
    </div>
    `
}

function togglePassword() {
    const passwordInputs = document.querySelectorAll('input[type=password]');
    [...passwordInputs].forEach(passwordInput => {
        const eyeBtn = passwordInput.parentNode.querySelectorAll('span')[1];
        eyeBtn.onclick = function (event) {
            event.stopPropagation();
            const inputTag = this.parentNode.querySelector('input');
            const inputType = inputTag.type;
            if (inputType === 'password') {
                this.innerHTML = `<i class="fas fa-eye-slash"></i>`;
                inputTag.type = 'text';
            } else {
                this.innerHTML = `<i class="fas fa-eye"></i>`;
                inputTag.type = 'password';
            }
        }
    });
}

function loaderTag() {
    return `
        <div id="regiser_form_loader">
            <div class="spinner-border text-warning" style="width:3rem; height:3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <h4>Loading...</h4>
        </div>
    `;
}