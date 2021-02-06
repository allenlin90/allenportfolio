window.onload = function () {
    const localStorage = window.localStorage;
    const transitionTime = 1000;
    const body = document.querySelector('body');
    const spinner = document.querySelector('.spinner');
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

    // endpoitnt
    const server = 'ninja'
    const waybillEndpoint = `https://api.airportels.${server}/api/waybill/detail`;

    // app state object
    const state = {
        senderShow: true,
        receiverShow: true,
        loggedIn: false,
        selectedPanel: '',
        deliveryImageHeight: 0,
        deliveryImageWidth: 0,
        fetchedShipment: null,
        trackingId: ''
    }

    // query string
    const urlParams = new URLSearchParams(window.location.search);
    state.trackingId = urlParams.get('trackingid') ? urlParams.get('trackingid') : 'EX2101181126620';

    console.log(localStorage)

    pageStartup();
    async function pageStartup() {
        await fetchParcelDetails(waybillEndpoint, state.trackingId);
        const solution = `<div><h3 style="text-align: center;">Please contact <a href="tel: 0632166655">0632166655</a><br>OR</h3></div>`
        const resetBtn = `<button id="reset_button" style="display: block; margin: 25px auto;" class="btn btn-danger">Reload the Page</button>`;
        const reload = setTimeout(function () { // timeout the process as the server is too slow
            spinner.style.display = 'none';
            const fetchFailed = `<div><h3 style="text-align: center; margin-top: 20px;">Server is not responding...</h3></div>`;
            spinner.insertAdjacentHTML('afterend', fetchFailed + solution + resetBtn);
            document.querySelector('#reset_button').addEventListener('click', function (e) {
                e.stopPropagation();
                location.reload();
            });
        }, 10000); // 10 seconds to timeout
        if (state.fetchedShipment.results.length) {
            clearTimeout(reload);
            spinner.style.display = 'none';
            updateDetails();
            deliveryDetails.style.cssText = `display: block`;
            loginBtnDiv.style.cssText = `display: block`;
        } else {
            if (state.fetchedShipment.resCode === 200) {
                clearTimeout(reload);
                spinner.style.display = 'none';
                const noResult = `<div><h3 style="text-align: center; margin-top: 20px;">The Tracking ID is invalid</h3></div>`;
                spinner.insertAdjacentHTML('afterend', noResult);
            }
        }
        // check if the user has logged in
        JSON.parse(localStorage.getItem('loginState')) === true ? isLoggedIn() : localStorage.setItem('loginState', JSON.stringify(false));
        function isLoggedIn() {
            deliveryDetails.style.display = 'block';
            loginBtnDiv.style.display = 'none';
            navigation.style.display = 'grid';
            state.loggedIn = true;
        }
    }

    function updateDetails() {
        document.querySelector('#parcel_id').innerText = state.fetchedShipment.waybills[0].shipmentID;
        document.querySelector('#parcel_size').innerText = state.fetchedShipment.waybills[0].size; // this should be updated because the endpoint has not size
        document.querySelector('.temp').style.display = state.fetchedShipment.waybills[0].temp ? 'flex' : 'none';
        document.querySelector('.cod').style.display = state.fetchedShipment.waybills[0].cod ? 'flex' : 'none';
        document.querySelector('#cod_amount').innerText = `${state.fetchedShipment.waybills[0].cod} Baht`;
        document.querySelector('.express').style.display = state.fetchedShipment.waybills[0].express ? 'flex' : 'none';
        document.querySelector('#sender_name').innerText = state.fetchedShipment.waybills[0].sender.name;
        document.querySelector('#sender_phone').innerHTML = `<a href=tel:${state.fetchedShipment.waybills[0].sender.contact}>${state.fetchedShipment.waybills[0].sender.contact}</a>`;
        document.querySelector('#sender_address').innerText = state.fetchedShipment.waybills[0].sender.address;
        document.querySelector('#receiver_name').innerText = state.fetchedShipment.waybills[0].receiver.name;
        document.querySelector('#receiver_phone').innerHTML = `<a href=tel:${state.fetchedShipment.waybills[0].receiver.contact}>${state.fetchedShipment.waybills[0].receiver.contact}</a>`;
        document.querySelector('#receiver_address').innerText = state.fetchedShipment.waybills[0].receiver.address;
    }

    async function fetchParcelDetails(url = '', shipmentId = 'EX2101181126620') {
        const options = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shipmentIDs: [shipmentId]
            })
        };

        const data = await fetch(url, options)
            .then(res => res.json())
            .then(data => data);

        state.fetchedShipment = data;
        console.log(data);
    }

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
            }, transitionTime);
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
    subLogin.addEventListener('click', loginIn);

    function loginIn(e) {
        e.preventDefault();
        const username = document.querySelector('#username').value;
        const password = document.querySelector('#password').value;
        if (document.querySelector('#keptLogin').checked && !username && !password) {
            localStorage.setItem('loginState', JSON.stringify(true));
            freezeScreen();
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
                }, (transitionTime / 2));
            }, transitionTime);
            state.loggedIn = true;
            loginBtnDiv.style.display = 'none';
        }
    }


    // show sender details when users clicks 'sender'
    sender.addEventListener('click', function (e) {
        e.stopPropagation();
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
        changeLoginButtonProperty();
    });

    // show receiver details when users clicks 'receiver'
    receiver.addEventListener('click', function (e) {
        e.stopPropagation();
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
        changeLoginButtonProperty();
    });

    /* switch selected panel in navigation */
    orderInfoBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        freezeScreen();
        if (state.selectedPanel !== 'order_info') {
            state.selectedPanel = 'order_info';
            orderInfoBtn.classList.add('selected');
            instructionBtn.classList.remove('selected');
            logoutBtn.classList.remove('selected');
            deliveryDetails.classList.add('animate__slideInLeft');
            deliveryDetails.style.display = 'block';
            setTimeout(function () {
                deliveryDetails.classList.remove('animate__slideInLeft');
            }, transitionTime);
        }
    });

    instructionBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        freezeScreen();
        state.selectedPanel = 'instruction';
        orderInfoBtn.classList.remove('selected');
        instructionBtn.classList.add('selected');
        logoutBtn.classList.remove('selected');
        deliveryDetails.classList.add('animate__slideOutLeft');
        setTimeout(function () {
            deliveryDetails.style.display = 'none';
            deliveryDetails.classList.remove('animate__slideOutLeft');
        }, transitionTime);
    });

    logoutBtn.addEventListener('click', logout);

    function logout(e) {
        e.stopPropagation();
        freezeScreen();
        localStorage.setItem('loginState', JSON.stringify(false));
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
                }, transitionTime);
            }, transitionTime);
        }, transitionTime);
    }

    /* functions */
    function hideCardAndShowButton(updateStateTo, currentObjState, partyToHide, partyToShow, jsNode) {
        freezeScreen();
        scrollToTop(true);
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
            changeLoginButtonProperty();
        }, transitionTime);
        /* hide delivery image ends */

        // show return button
        collapse.style.display = 'block';
        collapse.innerText = 'Return';
        collapse.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!state[updateStateTo] && state[currentObjState]) {
                freezeScreen();
                // console.log(`${updateStateTo} is returned`)
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
                    }, transitionTime);
                    /* show image ends */

                }, transitionTime);
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
            }, transitionTime);
        }, transitionTime);
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

    function scrollToTop(smooth = false) {
        const config = { top: 0, left: 0, behavior: 'smooth' };
        if (!smooth) {
            delete config.behavior;
        }
        window.scroll(config);
    }
}