window.onload = function () {
    setTimeout(function () {
        document.querySelector('.spinner').style.display = 'none';
        setTimeout(function () {
            document.querySelector('#delivery_details').style.cssText = `display: block`;
            document.querySelector('.login_button').style.cssText = `display: block`;
        }, 500);
    }, 1500);

    const body = document.querySelector('body');
    const sender = document.querySelector('#sender');
    const receiver = document.querySelector('#receiver');
    const collapse = document.querySelector('#collapse-btn');
    const loginPanel = document.querySelector('.login_panel');
    const loginForm = document.querySelector('.login_content');
    const loginBtn = document.querySelector('#driver-login');
    const subLogin = document.querySelector('#submitLogin');
    const appContents = document.querySelector('.container');
    const loginBtnDiv = document.querySelector('.login_button');
    const deliveryImage = document.querySelector('#delivery_image');

    const state = {
        senderShow: true,
        receiverShow: true,
        loggedIn: false
    }

    window.addEventListener('resize', function () {
        loginBtnDiv.style.position = 'static';
        changeLoginButtonProperty();
    });

    body.addEventListener('click', function () {
        if (loginPanel.style.display === 'none' && loginBtn.style.display === 'none') {
            loginBtn.style.display = 'block';
        }
    });

    // hide login panel if user clicks any where out of the login form
    loginPanel.addEventListener('click', function (e) {
        if (e.target.contains(loginForm)) {
            loginPanel.classList.add('animate__zoomOut');
            setTimeout(function () {
                loginPanel.style.display = 'none';
                loginPanel.classList.remove('animate__zoomOut');
            }, 1000);
            loginBtn.style.display = 'block';
        }
    })

    // show login panel with grey filter background when user clicks 'Driver Login'
    loginBtn.addEventListener('click', function () {
        loginPanel.style.display = "flex";
        loginBtnState = loginBtn.style.display;
        if (loginBtn.style.display !== 'none') {
            loginBtn.style.display = 'none';
        }
    });

    // submit and send request server to request token
    subLogin.addEventListener('click', function (e) {
        e.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        if (document.querySelector('#keptLogin').checked && !username && !password) {
            console.log('logged in');
            state.loggedIn = true;
        }
    });


    // show sender details when users clicks 'sender'
    document.querySelector('#sender').addEventListener('click', function () {
        hideCardAndShowButton('receiverShow', 'senderShow', receiver, sender, this);
        this.children[1].children[3].style.display = 'block';

        changeLoginButtonProperty();
    });

    // show receiver details when users clicks 'receiver'
    document.querySelector('#receiver').addEventListener('click', function () {
        hideCardAndShowButton('senderShow', 'receiverShow', sender, receiver, this);
        this.children[1].children[3].style.display = 'block';

        changeLoginButtonProperty();
    });

    function hideCardAndShowButton(updateStateTo, currentObjState, partyToHide, partyToShow, jsNode) {
        state[updateStateTo] = false;
        partyToHide.style.cssText = 'display: none';
        partyToShow.style.width = `100%`;

        // show return button
        collapse.style.display = 'block';
        collapse.innerText = 'Return';
        collapse.addEventListener('click', function () {
            if (!state[updateStateTo] && state[currentObjState]) {
                console.log(`${updateStateTo} is returned`)
                state[updateStateTo] = true;
                partyToHide.style.cssText = 'display: block';
                partyToShow.style.width = '50%';
                collapse.style.display = 'none';
                jsNode.children[1].children[3].style.display = 'none';
            }

            changeLoginButtonProperty();
            deliveryImage.style.display = 'block';
        });
        deliveryImage.style.display = 'none';
    }


    function changeLoginButtonProperty() {
        if (window.innerWidth > 500) {
            return;
        }

        if (appContents.clientHeight >= (window.innerHeight - loginBtnDiv.clientHeight)) {
            loginBtnDiv.style.position = 'static';
        }

        if (appContents.clientHeight < (window.innerHeight - loginBtnDiv.clientHeight)) {
            loginBtnDiv.style.position = 'absolute';
        }
    }
}