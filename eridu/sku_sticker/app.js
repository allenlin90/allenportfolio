const inputs = document.getElementById('inputs');
inputs.addEventListener('click', () => {
    inputs.style.display = 'none';
    setTimeout(function () {
        window.print();
        setTimeout(function () {
            inputs.style.display = 'block';
        }, 300);
    }, 300);
});

const typeNumber = 0;
const errorCorrectionLevel = 'L';
const qr = qrcode(typeNumber, errorCorrectionLevel);
qr.addData(``);
qr.make();
// document.querySelector('#qr_code').innerHTML = qr.createImgTag(10, 0, 'qr_code');