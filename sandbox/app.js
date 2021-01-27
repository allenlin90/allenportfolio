const canvas = document.querySelector('canvas');
console.log(canvas.parentNode.offsetWidth);
console.log(canvas.parentNode.offsetHeight);
const divWidth = canvas.parentNode.offsetHeight;
const divHeight = canvas.parentNode.offsetHeight;
canvas.width = divWidth;
canvas.height = divHeight;

var signaturePad = new SignaturePad(canvas, {
    backgroundColor: 'rgb(250, 250, 250)'
});

function resizeCanvas() {
    canvas.width = canvas.parentNode.offsetWidth;
    canvas.height = canvas.parentNode.offsetHeight;
    canvas.getContext("2d");

    signaturePad.clear();
}

window.onresize = resizeCanvas;
resizeCanvas();

function download(dataURL, filename) {
    var blob = dataURLToBlob(dataURL);
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
}

function dataURLToBlob(dataURL) {
    var parts = dataURL.split(';base64,');
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;
    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}