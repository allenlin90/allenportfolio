const container = document.querySelector('.container');
const qrcodeScannerNavBtn = document.querySelector('#qrcode_scanner_nav');
const deviceSystemNavBtn = document.querySelector('#device_system_nav');
const podNavBtn = document.querySelector('#pod_nav');
const qrcodeScannerPanel = document.querySelector('#qrcode_scanner');
const deviceSystemPanel = document.querySelector('#device_system');
const podPanel = document.querySelector('#pod');

[...document.querySelector('nav').children].forEach(child => {
    child.addEventListener('click', function (e) {
        e.stopPropagation();
        switchPanel(this);
        selectDefault(child.dataset.value);
    });
});

function switchPanel(node) {
    node.classList.add('btn-warning');
    node.classList.remove('btn-secondary');
    [...node.parentNode.children].forEach(child => {
        if (node !== child) {
            child.classList.add('btn-secondary');
            child.classList.remove('btn-warning');
        }
    });
}

function selectDefault(option) {
    switchPanel(document.querySelector(`#${option}_nav`));
    [...container.children].forEach(child => {
        if (child.id === option) {
            child.style.display = 'grid';
        } else {
            child.style.display = 'none';
        }
    })
}