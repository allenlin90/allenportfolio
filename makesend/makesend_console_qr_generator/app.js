import { fetchHeader, userLogin } from '../makesend_driver_app/main.js';
const preprintEndpoint = `https://api.airportels.ninja/api/google/makesend/trackingID/substitute/generate`;
// const preprintEndpoint = `https://api.airportels.ninja/api/msd/qr/preprint/generate`;

qrFormInput();
function qrFormInput() {
    const container = document.querySelector('.container');
    container.innerHTML = `
        <div id="qr_form">
            <form action="">
                <div>
                    <label for="number" class="form-label">How many QR Code?</label>
                    <input type="number" class="form-control" id="number" autocomplete="off">
                </div>
                <button type="submit" class="btn">Create</button>
            </form>
        </div>
    `;

    const qrForm = document.querySelector('#qr_form');
    qrForm.addEventListener('submit', (event) => {
        event.stopPropagation();
        event.preventDefault();
        const quantity = event.target.querySelector('input').value;
        const endpoint = preprintEndpoint;
        prePrintQRCode(quantity, endpoint);
    });
}

async function prePrintQRCode(quantity = 1, endpoint = `https://api.airportels.ninja/api/google/makesend/trackingID/substitute/generate`) {
    // const token = await userLogin('linmting@airportels.asia', 'black123', true);
    const token = '';
    const headers = await fetchHeader();
    const options = {
        method: 'post',
        mod: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Client-Token': headers.clientToken,
            'Time-Stamp': headers.timeStamp,
            'Time-Signature': headers.timeSignature,
            'User-Token': `${token}`,
        },
        body: JSON.stringify({
            quantity
        })
    };

    const data = await fetch(endpoint, options).then(res => res.json()).catch(err => err);
    if (data.resCode === 200 && data.trackingID.length) {
        const trackingIds = data.trackingID;

        const timeString = new Date().toISOString().slice(0, 19).split('T');
        const now = `${timeString[0]} ${timeString[1]}`;

        const container = document.querySelector('.container');
        const printBtnTemplate = `
        <header>
            <div class="btn btn-default" id="printBtn">Print</div>
            <div class="btn btn-default" id="generateBtn">Create More</div>
        </header>
    `;
        const stickerTemplate = `
        <div class="shipment">
            <div class="parcel">
                <div class="qr_code">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png" alt="QRCode">
                    <p>EX2011159384234</p>
                </div>
                <div class="extra_service">
                    <div>
                        <img src="https://www.makesend.asia/wp-content/uploads/2018/06/logo-makesend.png" alt="ms_logo">
                    </div>
                    <div>
                        <input type="checkbox" name="temp" id="temp">
                        <label for="temp"><b>ควบคุมความเย็น</b></label>
                    </div>
                    <div>
                        <input type="checkbox" name="express" id="express">
                        <label for="express"><b>ส่งด่วน 17:00</b></label>
                    </div>
                    <div>
                        <input type="checkbox" name="COD" id="COD">
                        <label for="COD"><b>เก็บเงินปลายทาง</b></label>
                        <p>___________ ฿</p>
                    </div>
                </div>
                <div class="note">
                    <h4><b>Note:</b></h4>
                </div>
            </div>
            <p>Generated at ${now}</p>
        </div>
    `;

        let content = ``;
        for (let i = 0; i < quantity; i++) {
            content = content + stickerTemplate;
        }

        container.innerHTML = printBtnTemplate + content;

        const printBtn = document.querySelector('#printBtn');
        const header = document.querySelector('header');
        printBtn.onclick = function () {
            header.style.display = 'none';
            setTimeout(function () {
                window.print();
                setTimeout(function () {
                    header.style.display = 'flex';
                }, 500);
            }, 500);
        }

        const generateBtn = document.querySelector('#generateBtn');
        generateBtn.onclick = qrFormInput;

        const images = document.querySelectorAll('.qr_code');
        images.forEach((image, index) => {
            const typeNumber = 0;
            const errorCorrectionLevel = 'L';
            const qr = qrcode(typeNumber, errorCorrectionLevel);
            qr.addData(`https://app.makesend.asia/tracking?t=${trackingIds[index]}`);
            qr.make();
            image.innerHTML = qr.createImgTag(6, 0, 'qr_code');
            const p = document.createElement('p');
            p.innerText = trackingIds[index];
            image.appendChild(p);
        });
    } else {
        console.log(`Something went wrong: ${data}`);
        alert(`Something went wrong: ${data}`);
    }
}