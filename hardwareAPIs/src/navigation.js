const qrcodeScannerNavBtn = document.querySelector('#qrcode_scanner_nav');
const podNavBtn = document.querySelector('#pod_nav');
const qrcodeScannerPanel = document.querySelector('#qrcode_scanner');
const podPanel = document.querySelector('#pod')

podNavBtn.onclick = () => {
    qrcodeScannerPanel.style.display = 'none';
    podPanel.style.display = 'block';
}

qrcodeScannerNavBtn.onclick = () => {
    qrcodeScannerPanel.style.display = 'block';
    podPanel.style.display = 'none';
}