var typeNumber = 0;
var errorCorrectionLevel = 'L';
var qr = qrcode(typeNumber, errorCorrectionLevel);
qr.addData(`Invoice ID: INV2011102018985, Shipment ID: EX2020123456789, Number of parcels: 5`);
qr.make();
document.getElementById('qr_code').innerHTML = qr.createImgTag(8, 0, 'qr_code');

const buttons = document.getElementById('buttonDiv');
buttons.addEventListener('click', () => {
    buttons.style.display = 'none';
    setTimeout(function () {
        window.print();
        setTimeout(function () {
            buttons.style.display = 'block';
        }, 300);
    }, 300);
});