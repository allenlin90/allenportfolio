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
        const endpoint = `https://api.airportels.ninja/api/google/makesend/trackingID/substitute/generate`;
        prePrintQRCode(quantity, endpoint);
    });
}

async function prePrintQRCode(quantity = 1, endpoint = `https://api.airportels.ninja/api/google/makesend/trackingID/substitute/generate`) {
    const options = {
        method: 'post',
        mod: 'cors',
        headers: {
            'Content-Type': 'application/json'
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
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1200px-QR_code_for_mobile_English_Wikipedia.svg.png"
                        alt="">
                    <p>EX2011159384234</p>
                </div>
                <div class="extra_service">
                    <div>
                        <input type="checkbox" name="temp" id="temp">
                        <label for="temp"><b>Temp Control</b></label>
                    </div>
                    <div>
                        <input type="checkbox" name="express" id="express">
                        <label for="express"><b>Before 17:00</b></label>
                    </div>
                    <div>
                        <input type="checkbox" name="COD" id="COD">
                        <label for="COD"><b>Cash on Delivery</b></label>
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