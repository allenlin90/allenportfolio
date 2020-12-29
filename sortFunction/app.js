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

    document.querySelector('#sender').addEventListener('click', function () {
        hideCardAndShowButton('receiverShow', 'senderShow', receiver, sender, this);
        this.children[1].children[3].style.display = 'block';
    });

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