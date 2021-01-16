window.onload = function () {
    const body = document.querySelector('body');
    const spinner = document.querySelector('.spinner');
    const contentPanel = document.querySelector('.delivery');
    const sender = document.querySelector('#sender');
    const receiver = document.querySelector('#receiver');
    const collapse = document.querySelector('#collapse-btn');
    const loginPanel = document.querySelector('.login_panel');
    const loginForm = document.querySelector('.login_content');
    const subLogin = document.querySelector('#submitLogin');
    const orderBody = document.querySelector('#order_body');
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
        selectedPanel: '',
        deliveryImageHeight: 0,
        deliveryImageWidth: 0
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
        freezeScreen();
    });

    // show login panel with grey filter background when user clicks 'Driver Login'
    loginBtn.addEventListener('click', function () {
        loginPanel.style.display = "flex";
        if (loginBtnDiv.style.display !== 'none') {
            loginBtnDiv.style.display = 'none';
        }
        freezeScreen();
    });

    // LOGIN. submit and send request server to request token
    subLogin.addEventListener('click', function (e) {
        e.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        if (document.querySelector('#keptLogin').checked && !username && !password) {
            freezeScreen();
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
        if (state.senderShow && state.receiverShow) {
            freezeScreen();
            hideCardAndShowButton('receiverShow', 'senderShow', receiver, sender, this);
            this.children[1].children[3].style.display = 'block';
            if (state.loggedIn) {
                rerenderBottomBtn(navigation);
            } else {
                rerenderBottomBtn(loginBtnDiv);
            }
        }
    });

    // show receiver details when users clicks 'receiver'
    receiver.addEventListener('click', function () {
        if (state.senderShow && state.receiverShow) {
            freezeScreen();
            hideCardAndShowButton('senderShow', 'receiverShow', sender, receiver, this);
            this.children[1].children[3].style.display = 'block';
            if (state.loggedIn) {
                rerenderBottomBtn(navigation);
            } else {
                rerenderBottomBtn(loginBtnDiv);
            }
        }
    });

    /* switch selected panel in navigation */
    orderInfoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        freezeScreen();
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
        freezeScreen();
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
        freezeScreen();
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
        freezeScreen();
        state[updateStateTo] = false;
        partyToHide.style.cssText = 'display: none';
        partyToShow.style.width = `100%`;
        /* hide delivery image starts */
        if (deliveryImage.height) {
            state.deliveryImageHeight = deliveryImage.height;
            state.deliveryImageWidth = deliveryImage.width;
        }
        deliveryImage.style.visibility = 'hidden';
        climbingAnimation(state.deliveryImageHeight, orderBody);
        setTimeout(function () {
            deliveryImage.style.display = 'none';
            deliveryImage.style.visibility = 'visible';
        }, 1000);
        /* hide delivery image ends */

        // show return button
        collapse.style.display = 'block';
        collapse.innerText = 'Return';
        collapse.addEventListener('click', function () {
            if (!state[updateStateTo] && state[currentObjState]) {
                freezeScreen();
                console.log(`${updateStateTo} is returned`)
                state[updateStateTo] = true;
                partyToHide.style.cssText = 'display: block';
                partyToShow.style.width = '50%';
                collapse.style.display = 'none';
                jsNode.children[1].children[3].style.display = 'none';
                /* show image starts */
                if (state.loggedIn) {
                    navigation.style.display = `none`;
                } else {
                    loginBtnDiv.style.display = `none`;
                }
                climbingAnimation(state.deliveryImageHeight, orderBody, false)
                setTimeout(function () {
                    deliveryImage.classList.add('animate__slideInLeft');
                    deliveryImage.style.display = 'block';
                    setTimeout(function () {
                        deliveryImage.classList.remove('animate__slideInLeft');
                    }, 1000);
                    /* show image ends */

                }, 1000);
                if (state.loggedIn) {
                    rerenderBottomBtn(navigation);
                } else {
                    rerenderBottomBtn(loginBtnDiv);
                }
            }

            changeLoginButtonProperty();
        });
        changeLoginButtonProperty();
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

    function rerenderBottomBtn(obj) {
        obj.style.display = `none`;
        obj.classList.add('animate__slideInUp');
        setTimeout(function () {
            obj.style.display = `grid`;
            setTimeout(function () {
                obj.classList.remove('animate__slideInUp');
            }, 1000);
        }, 1000);
    }

    function climbingAnimation(objSlideOutUpHeight, objClimbUp, rise = true, duration = 1000) {
        if (!objSlideOutUpHeight) {
            return;
        }
        let direction = '';
        rise ? direction = `-` : direction = `+`;
        const objHeight = objSlideOutUpHeight;
        objClimbUp.style.position = `relative`;
        objClimbUp.style.transition = `linear ${duration}ms`;
        objClimbUp.style.transform = `translateY(${direction}${objHeight}px)`;
        setTimeout(function () {
            objClimbUp.style.position = `static`;
            objClimbUp.style.transition = ``;
            objClimbUp.style.transform = ``;
        }, duration);
    }

    function freezeScreen(duration = 1000) {
        body.classList.add(`freeze`);
        setTimeout(function () {
            body.classList.remove(`freeze`);
        }, duration);
    }
}