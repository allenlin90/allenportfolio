window.onload = function () {
    const body = document.querySelector('body');
    const spinner = document.querySelector('.spinner');
    const sender = document.querySelector('#sender');
    const receiver = document.querySelector('#receiver');
    const collapse = document.querySelector('#collapse-btn');
    const loginPanel = document.querySelector('.login_panel');
    const loginForm = document.querySelector('.login_content');
    const loginBtn = document.querySelector('#driver-login');
    const subLogin = document.querySelector('#submitLogin');
    const deliveryDetails = document.querySelector('#delivery_details');
    const loginBtnDiv = document.querySelector('.login_button');
    const deliveryImage = document.querySelector('#delivery_image');
    const navigation = document.querySelector('.navigation');
    const orderInfoBtn = document.querySelector('#order_info');
    const instructionBtn = document.querySelector('#instruction');
    const logoutBtn = document.querySelector('#logout');

    const state = {
        senderShow: true,
        receiverShow: true,
        loggedIn: false,
        seletcedPanel: 'order_info'
    }

    setTimeout(function () {
        spinner.style.display = 'none';
        setTimeout(function () {
            deliveryDetails.style.cssText = `display: block`;
            loginBtnDiv.style.cssText = `display: block`;
        }, 500);
    }, 1500);

    window.addEventListener('resize', function () {
        if (!state.loggedIn) {
            loginBtnDiv.style.position = 'static';
            changeLoginButtonProperty();
        }
    });

    body.addEventListener('click', function () {
        if (loginPanel.style.display === 'none' && loginBtn.style.display === 'none' && !state.loggedIn) {
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
    });

    // show login panel with grey filter background when user clicks 'Driver Login'
    loginBtn.addEventListener('click', function () {
        loginPanel.style.display = "flex";
        if (loginBtn.style.display !== 'none') {
            loginBtn.style.display = 'none';
        }
    });

    // LOGIN. submit and send request server to request token
    subLogin.addEventListener('click', function (e) {
        e.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        if (document.querySelector('#keptLogin').checked && !username && !password) {
            console.log('logged in');
            loginPanel.classList.add('animate__zoomOut');
            deliveryDetails.style.display = 'none';
            spinner.style.display = 'block';
            setTimeout(function () {
                loginPanel.style.display = 'none';
                loginPanel.classList.remove('animate__zoomOut');
                setTimeout(function () {
                    spinner.style.display = 'none';
                    deliveryDetails.style.display = 'block';
                    navigation.style.display = 'grid';
                }, 500);
            }, 1000);
            state.loggedIn = true;
            loginBtn.style.display = 'none';
        }
    });


    // show sender details when users clicks 'sender'
    sender.addEventListener('click', function () {
        hideCardAndShowButton('receiverShow', 'senderShow', receiver, sender, this);
        this.children[1].children[3].style.display = 'block';

        changeLoginButtonProperty();
    });

    // show receiver details when users clicks 'receiver'
    receiver.addEventListener('click', function () {
        hideCardAndShowButton('senderShow', 'receiverShow', sender, receiver, this);
        this.children[1].children[3].style.display = 'block';

        changeLoginButtonProperty();
    });

    /* switch selected panel in navigation */
    orderInfoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        state.selectedPanel = 'order_info';
        orderInfoBtn.classList.add('selected');
        instructionBtn.classList.remove('selected');
        logoutBtn.classList.remove('selected');
        console.log(state);
    });

    instructionBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        state.selectedPanel = 'instruction';
        orderInfoBtn.classList.remove('selected');
        instructionBtn.classList.add('selected');
        logoutBtn.classList.remove('selected');
        console.log(state);
    });

    logoutBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        state.loggedIn = false;
        navigation.style.display = 'none';
        loginBtn.style.cssText = `display: block`;
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

        if (deliveryDetails.clientHeight >= (window.innerHeight - loginBtnDiv.clientHeight)) {
            loginBtnDiv.style.position = 'static';
        }

        if (deliveryDetails.clientHeight < (window.innerHeight - loginBtnDiv.clientHeight)) {
            loginBtnDiv.style.position = 'absolute';
        }
    }
}