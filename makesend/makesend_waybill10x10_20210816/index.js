window.onload = () => {
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

    const typeNumber = 0;
    const errorCorrectionLevel = 'L';
    const qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(`https://app.makesend.asia/tracking?t=${'EX2021060817089'}`);
    qr.make();
    const qrWrapper = document.querySelectorAll('.tracking__qr');
    [...qrWrapper].forEach(node => {
        node.innerHTML = qr.createImgTag(8, 0, 'qr_code');
    });
};