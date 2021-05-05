window.onload = async function () {
    const state = {
        reloadTime: 0,
        data: null,
        selected: null,
        spinner: `
        <div class="spinner">
            <div class="spinner__ring spinner-border text-warning" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="spinner__text">Loading...</p>
        </div>`,
    }
    setInputDOMs(state);
    // let parcelList = localStorage.getItem('parcelList'); // delete when deploy
    // state.data = JSON.parse(parcelList); // delete when deploy
    // const lastUpdate = Date.parse(localStorage.getItem('lastUpdate'));
    // if (!parcelList || ((new Date() - lastUpdate) > (1000 * 60 * 10))) {
    //     await timeoutReload(state.reloadTime, state);
    // }

    // parcelList = JSON.parse(parcelList);
    // if (!('parcelsToSort' in parcelList)) {
    //     await timeoutReload(state.reloadTime, state);
    //     parcelList = JSON.parse(localStorage.getItem('parcelList'));
    // }

    if (!state.data) {
        await timeoutReload(state.reloadTime, state);
    }

    console.log(state.data);
    if (state.data.parcels.count) {
        createOptions(state.data);
        renderResult(state);
    }
}

function createOptions(data) {
    const { parcels, shipments, accounts } = data;
    const datalist = document.querySelector('#destinations');
    let optionsHTML = Object.entries(parcels).reduce((options, parcel) => {
        options += `
        <option value='${parcel[0]}${String.fromCharCode(8218)} ${parcel[1].receiver_name}${String.fromCharCode(8218)} ${parcel[1].receiver_phone}${String.fromCharCode(8218)} ${parcel[1].car_plate}${String.fromCharCode(8218)} ${parcel[1].assigned_driver}${String.fromCharCode(8218)} ${shipments[parcel[0]]['dropAddress']}'></option>
        `;
        return options;
    }, '');
    datalist.innerHTML = optionsHTML;
}

function renderResult(data) {
    if (data.selected) {
        const searchResult = document.querySelector('#sorting__search_result');
        const trackingId = data.selected[0];
        const receiverName = data.selected[1];
        const receiverPhone = data.selected[2];
        const carPlate = data.selected[3];
        const assignedDriver = data.selected[4];
        const address = data.selected[5];
        searchResult.innerHTML = `
        <div id="sorting__search_result--list">
            <p>Receiver Name: ${receiverName}</p>
            <h3>Car Plate: ${carPlate} ${assignedDriver}</h3>
            <p>Receiver Phone: ${receiverPhone}</p>
            <p>Address: ${address}</p>
            <p>Tracking ID: ${trackingId}</p>
            <!-- <button class="btn btn-warning">Transfer</button> -->
        </div>
        `;
        // confirmTransfer(data);
    }
}

async function timeoutReload(reloadCount, state) {
    const searchResult = document.querySelector('#sorting__search_result');
    if (reloadCount > 2) {
        searchResult.innerHTML = `
        <div class="timeout">
            <h3>Sorry...</h3>
            <p>Server is down...</p>
            <p>Please try again later</p>
        </div>
        `;
        return;
    }

    let timer = setTimer(state);
    const data = await fetchData();
    if ('shipments' in data) {
        state.data = data;
        clearTimeout(timer);
        searchResult.innerHTML = `
            <h1>Choose a parcel from the list </h1>
        `;
    }
}

function setTimer(state) {
    const searchResult = document.querySelector('#sorting__search_result');
    const spinner = searchResult.innerHTML;
    let timer = setTimeout(async function () {
        searchResult.innerHTML = `
        <div class="timeout">
            <h3>Sorry...</h3>
            <button>Reload Page</button>
        </div>
        `;
        const reloadBtn = searchResult.querySelector('button');
        reloadBtn.onclick = function () {
            state.reloadTime += 1;
            searchResult.innerHTML = spinner;
            timeoutReload(state.reloadTime, state);
        }
    }, (1000 * 60 * 10));

    return timer;
}

async function fetchData() {
    const url = 'https://makesend-driver.herokuapp.com/sorting';
    // const url = 'http://localhost:8080/sorting';
    const options = {
        method: 'post',
        mode: 'cors',
        headers: {
            'content-type': 'application/json',
        }
    }

    const data = await fetch(url, options).then(res => res.json()).then(data => data).catch(err => err);
    const list = Object.keys(data).reduce((sumList, key) => {
        if (key === 'accountList') {
            let accounts = data['accountList'].reduce((sumObj, accountArr) => {
                const account = accountArr.reduce((sum, item, index) => {
                    sum[data['accountListHeaders'][index]] = item;
                    return sum;
                }, {});
                sumObj[account.nickname] = account;
                return sumObj;
            }, {});
            accounts.count = Object.values(accounts).length;
            sumList.accounts = accounts;
        } else if (key === 'parcelsToSort') {
            let parcels = data['parcelsToSort'].reduce((sumObj, parcelArr) => {
                const parcel = parcelArr.reduce((sum, item, index) => {
                    sum[data['parcelsToSortHeaders'][index]] = item;
                    return sum;
                }, {});
                sumObj[parcel.tracking_id] = parcel;
                return sumObj;
            }, {});
            parcels.count = Object.values(parcels).length;
            sumList.parcels = parcels;
        } else if (key === 'shipmentList') {
            let shipments = data['shipmentList'].reduce((sumObj, shipmentArr) => {
                const shipment = shipmentArr.reduce((sum, item, index) => {
                    sum[data['shipmentListHeaders'][index]] = item;
                    return sum;
                }, {});
                sumObj[shipment.trackingID] = shipment;
                return sumObj;
            }, {});
            shipments.count = Object.values(shipments).length;
            sumList.shipments = shipments;
        }
        return sumList;
    }, {});
    localStorage.setItem('lastUpdate', (new Date()));
    localStorage.setItem('parcelList', JSON.stringify(list));
    return list;
}

function setInputDOMs(state) {
    const listInput = document.querySelector('#sorting__form input');
    listInput.onchange = function (event) {
        const inputValue = event.target.value;
        const commaEx = String.fromCharCode(8218);
        if (inputValue.includes(commaEx)) {
            const parcelDetail = event.target.value.split(commaEx);
            state.selected = parcelDetail;
            renderResult(state);
        }
    }
    const removeInputBtn = document.querySelector('.input_container--remove');
    removeInputBtn.onclick = clearInputs;
}

function clearInputs() {
    const listInput = document.querySelector('#sorting__form input');
    const searchResult = document.querySelector('#sorting__search_result');
    listInput.value = '';
    searchResult.innerHTML = ``;
}

function confirmTransfer(state = null) {
    if (state) {
        const searchResult = document.querySelector('#sorting__search_result');
        const confirmBtn = searchResult.querySelector('button');
        // const searchResultList = document.querySelector('#sorting__search_result--list button');
        confirmBtn.onclick = async function () {
            clearInputs();
            searchResult.innerHTML = state.spinner;
            setTimeout(function () { // simulate async request to confirm
                searchResult.innerHTML = ``;
            }, 3000);
        }
    }
}