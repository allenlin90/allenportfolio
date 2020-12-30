window.onload = function () {
    setTimeout(function () {
        document.querySelector('.spinner').style.display = 'none';
        setTimeout(function () {
            // document.querySelector('.order_details').style.cssText = `display: flex; justify-content: space-between;`;
            document.querySelector('.delivery').style.cssText = `display: block`;
        }, 500);
    }, 1500);

    const state = {
        senderShow: true,
        receiverShow: true
    }

    const sender = document.querySelector('#sender');
    const receiver = document.querySelector('#receiver');
    const collapse = document.querySelector('#collapse-btn');
    const loginPanel = document.querySelector('.login_panel');
    const loginForm = document.querySelector('.login_content');
    const loginBtn = document.querySelector('#driver-login');
    const subLogin = document.querySelector('#submitLogin');

    // hide login panel if user clicks any where out of the login form
    loginPanel.addEventListener('click', function (e) {
        if (e.target.contains(loginForm)) {
            loginPanel.classList.add('animate__slideOutDown');
            setTimeout(function () {
                loginPanel.style.display = 'none';
                loginPanel.classList.remove('animate__slideOutDown');
            }, 1000);
        }
    })

    // show login panel with grey filter background when user clicks 'Driver Login'
    loginBtn.addEventListener('click', function () {
        loginPanel.style.display = "flex";
    });

    // submit and send request server to request token
    subLogin.addEventListener('click', function (e) {
        e.preventDefault();
    });

    // show sender details when users clicks 'sender'
    document.querySelector('#sender').addEventListener('click', function () {
        hideCardAndShowButton('receiverShow', 'senderShow', receiver, sender, this);
        this.children[1].children[3].style.display = 'block';
    });

    // show receiver details when users clicks 'receiver'
    document.querySelector('#receiver').addEventListener('click', function () {
        hideCardAndShowButton('senderShow', 'receiverShow', sender, receiver, this);
        this.children[1].children[3].style.display = 'block';
    });

    function hideCardAndShowButton(updateStateTo, currentObjState, partyToHide, partyToShow, jsNode) {
        state[updateStateTo] = false;
        partyToHide.style.cssText = 'display: none';
        partyToShow.style.width = `80%`;

        // show return button
        collapse.style.display = 'block';
        collapse.innerText = 'Return';
        collapse.addEventListener('click', function () {
            if (!state[updateStateTo] && state[currentObjState]) {
                console.log(`${updateStateTo} is returned`)
                state[updateStateTo] = true;
                partyToHide.style.cssText = 'display: block';
                partyToShow.style.width = '40%';
                collapse.style.display = 'none';
                jsNode.children[1].children[3].style.display = 'none';
            }
        });
    }
}