window.onload = function () {
    const body = document.querySelector('body');
    const spinner = document.querySelector('.spinner');
    const sender = document.querySelector('#sender');
    const receiver = document.querySelector('#receiver');
    const collapse = document.querySelector('#collapse-btn');
    const loginPanel = document.querySelector('.login_panel');
    const loginForm = document.querySelector('.login_content');
    const subLogin = document.querySelector('#submitLogin');
    const deliveryDetails = document.querySelector('#delivery_details');
    const loginBtnDiv = document.querySelector('.login_button');
    const loginBtn = document.querySelector('#driver-login');
    const deliveryImage = document.querySelector('#delivery_image');
    const navigation = document.querySelector('.navigation');
    const orderInfoBtn = document.querySelector('#order_info');
    const instructionBtn = document.querySelector('#instruction');
    const logoutBtn = document.querySelector('#logout');

    const state = {
        senderShow: true,
        receiverShow: true,
        loggedIn: false,
        selectedPanel: ''
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
        if (loginPanel.style.display === 'none' && loginBtnDiv.style.display === 'none' && !state.loggedIn) {
            loginBtnDiv.style.display = 'block';
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
            loginBtnDiv.style.display = 'block';
        }
    });

    // show login panel with grey filter background when user clicks 'Driver Login'
    loginBtn.addEventListener('click', function () {
        loginPanel.style.display = "flex";
        if (loginBtnDiv.style.display !== 'none') {
            loginBtnDiv.style.display = 'none';
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
            instructionBtn.classList.remove('selected');
            orderInfoBtn.classList.add('selected');
            setTimeout(function () {
                loginPanel.style.display = 'none';
                loginPanel.classList.remove('animate__zoomOut');
                navigation.classList.add('animate__slideInUp');
                setTimeout(function () {
                    spinner.style.display = 'none';
                    deliveryDetails.style.display = 'block';
                    navigation.style.display = 'grid';
                }, 500);
            }, 1000);
            state.loggedIn = true;
            loginBtnDiv.style.display = 'none';
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
        console.log(state);
        if (state.selectedPanel !== 'order_info') {
            state.selectedPanel = 'order_info';
            orderInfoBtn.classList.add('selected');
            instructionBtn.classList.remove('selected');
            logoutBtn.classList.remove('selected');
            deliveryDetails.classList.add('animate__slideInLeft');
            deliveryDetails.style.display = 'block';
            setTimeout(function () {
                deliveryDetails.classList.remove('animate__slideInLeft');
            }, 1000);
        }
    });

    instructionBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        state.selectedPanel = 'instruction';
        console.log(state);
        orderInfoBtn.classList.remove('selected');
        instructionBtn.classList.add('selected');
        logoutBtn.classList.remove('selected');
        deliveryDetails.classList.add('animate__slideOutLeft');
        setTimeout(function () {
            deliveryDetails.style.display = 'none';
            deliveryDetails.classList.remove('animate__slideOutLeft');
        }, 1000);
    });

    logoutBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        state.loggedIn = false;
        deliveryDetails.style.display = 'none';
        spinner.style.display = 'block';
        if (window.innerWidth > 500) {
            navigation.style.display = 'none';
        }
        navigation.classList.add('animate__slideOutDown');
        setTimeout(function () {
            loginBtnDiv.classList.add('animate__slideInUp');
            navigation.style.display = 'none';
            spinner.style.display = 'none';
            deliveryDetails.style.display = 'block';
            setTimeout(function () {
                loginBtnDiv.style.display = 'block';
                changeLoginButtonProperty();
                navigation.classList.remove('animate__slideOutDown');
                setTimeout(function () {
                    loginBtnDiv.classList.remove('animate__slideInUp');
                }, 1000);
            }, 1000);
        }, 1000);
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
        });
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