document.querySelector('.error_message__container__btns--close_btn').onclick = closeErrorIdList;
document.querySelector('.error_message__container__btns--copy_btn').onclick = copyAllErrorIds();

window.onload = async function testRun() {
    const state = {
        reloadTime: 0,
        data: null,
        selected: null,
        errorIds: [],
        spinner: `
        <div class="spinner">
            <div class="spinner__ring spinner-border text-warning" role="status">
                <span class="sr-only">Loading...</span>
            </div>
            <p class="spinner__text">Loading...</p>
        </div>`,
    }

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

    setupAllDOMs(state);

    if (state.data.parcels.count) {
        createOptions(state);
        renderResult(state);
    }
    console.log(state);
}

function createOptions(state) {
    const { parcels, shipments, accounts } = state.data;
    const datalist = document.querySelector('#destinations');
    let optionsHTML = Object.entries(parcels).reduce((options, parcel) => {
        if (!('#REF!' in shipments)) {
            options += `
            <option value='${parcel[0]}${String.fromCharCode(8218)} ${parcel[1].receiver_name}${String.fromCharCode(8218)} ${parcel[1].receiver_phone}${String.fromCharCode(8218)} ${parcel[1].car_plate}${String.fromCharCode(8218)} ${parcel[1].assigned_driver}${String.fromCharCode(8218)} ${shipments[parcel[0]]['dropAddress']}${String.fromCharCode(8218)} ${parcel[1].size}${String.fromCharCode(8218)} ${parcel[1].temp}'></option>
            `;
            return options;
        } else {
            state.errorIds.push(parcel[0]);
        }
    }, '');
    datalist.innerHTML = optionsHTML;
}

function renderResult(data) {
    if (data.selected) {
        const sizes = sizeList();
        const searchResult = document.querySelector('#sorting__search_result');
        const trackingId = data.selected[0].trim();
        const receiverName = data.selected[1].trim();
        const receiverPhone = data.selected[2].trim();
        const carPlate = data.selected[3].trim();
        const assignedDriver = data.selected[4].trim();
        const address = data.selected[5].trim();
        const size = data.selected[6].trim();
        const temp = parseInt(data.selected[7].trim());
        const optionTags = sizes.reduce((tags, item, index) => {
            if (item.toLowerCase().trim() === size.toLowerCase().trim()) {
                tags += `<option selected value="${item}">${item}</option>`;
            } else {
                tags += `<option value="${item}">${item}</option>`;
            }
            return tags;
        }, '');
        searchResult.innerHTML = `
        <div id="sorting__search_result--list">
            <p>Receiver Name: ${receiverName}</p>
            <p>Receiver Phone: ${receiverPhone}</p>
            <h3>Car Plate: ${carPlate} ${assignedDriver}</h3>
            <hr>
            <div id="size_selector">
                <label for="size_select">Size:</label>
                <select id="size_select"> 
                    ${optionTags}
                </select>
                <div id="select_loader">
                    <div class="spinner-border text-secondary" role="status" style="display: none;">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <hr>
            <p class="${temp ? 'temp_control' : ''}">Temperature: ${temp ? 'Yes' : 'No'}</p>
            <p>Address: <a href="https://www.google.com/maps/search/?q=${encodeURI(address)}" target="_blank">${address}</a></p>
            <p>Tracking ID: <a href="https://app.makesend.asia/tracking?t=${trackingId}" target="_blank">${trackingId}</a></p>
            <!-- <button class="btn btn-warning">Transfer</button> -->
        </div>
        `;
        document.querySelector('#size_selector').onchange = updateSize(trackingId, size);
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
            <h1 style="margin: 1rem;">Choose a parcel from the list </h1>
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

function setupAllDOMs(state) {
    document.querySelector('.error_message__container__btns--close_btn').onclick = closeErrorIdList;
    document.querySelector('.error_message__container__btns--copy_btn').onclick = copyAllErrorIds(state);
    document.querySelector('#sorting__form').onsubmit = function (e) { e.preventDefault() };
    if (state.errorIds.length) {
        const errorListBtn = document.querySelector('#sorting__form button');
        errorListBtn.style.display = 'inline-block';
        errorListBtn.onclick = openErrorList;
    }
    setInputDOMs(state);
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

function closeErrorIdList(event) {
    document.querySelector('.error_message').style.display = 'none';
}

function copyAllErrorIds(state = null) {
    if (state) {
        return async function (event) {
            console.log(state.errorIds);
            await navigator.clipboard.writeText(state.errorIds.join(String.fromCharCode(10)));
        }
    }
}

function openErrorList(event) {
    document.querySelector('.error_message').style.display = 'block';
}

function sizeList() {
    return [
        'env',
        'polym',
        'polyl',
        's40',
        's60',
        's80',
        's100',
        's120',
        's140',
        's160',
        's180',
        's200',
    ];
}

function updateSize(shipmentId = '') {
    if (shipmentId) {
        return async function (event) {
            const selectLoader = document.querySelector('#select_loader');
            selectLoader.style.display = 'inline-block';
            const size = document.querySelector('#size_selector select').value;
            const options = {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    trackingID: shipmentId,
                    // size
                }),
            }
            const res = await fetch('https://api.airportels.asia/api/google/makesend/shipment/changeSize', options)
                .then(res => res.json()).then(data => data).catch(err => err);
            if (res.resCode === 200) {
                console.log(res);
                selectLoader.innerHTML = `<i style="color: green" class="fas fa-check"></i>`;
            } else {
                selectLoader.innerHTML = `<i style="color: red" class="fas fa-times-circle"></i>`;
                console.log('Server Error: ' + res.message);
                alert('Server Error: ' + res.message);
            }
        }
    }
    console.warn(`shipmentId or size isn't given to 'updateSize'`);
}