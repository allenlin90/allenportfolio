window.addEventListener('load', function () {
    const podOptions = document.querySelector('#pod_options');
    const podMedia = document.querySelector('#pod_media');
    // switch between signature and photo upload
    [...podOptions.children].forEach((child) => {
        child.addEventListener('click', function (e) {
            e.stopPropagation();
            switchPanel(this); // this is from app.js
            [...podMedia.children].forEach(childNode => {
                if (childNode.id !== `${this.id.split('_')[0]}_upload`) {
                    childNode.style.display = 'none';
                } else {
                    childNode.style.display = 'flex';
                }
            });
        });
    });

    // section for signature pad
    var wrapper = document.getElementById("signature_upload");
    var clearButton = wrapper.querySelector("[data-action=clear]");
    var undoButton = wrapper.querySelector("[data-action=undo]");
    var savePNGButton = wrapper.querySelector("[data-action=save-png]");
    var saveJPGButton = wrapper.querySelector("[data-action=save-jpg]");
    var saveSVGButton = wrapper.querySelector("[data-action=save-svg]");
    var signatureCanvas = wrapper.querySelector("#signature_canvas");
    var signaturePad = new SignaturePad(signatureCanvas, {
        // It's Necessary to use an opaque color when saving image as JPEG;
        // this option can be omitted if only saving as PNG or SVG
        backgroundColor: 'rgb(255, 255, 255)'
    });
    // Adjust canvas coordinate space taking into account pixel ratio,
    // to make it look crisp on mobile devices.
    // This also causes canvas to be cleared.
    function resizeCanvas() {
        // When zoomed out to less than 100%, for some very strange reason,
        // some browsers report devicePixelRatio as less than 1
        // and only part of the canvas is cleared then.
        // var ratio = Math.max(window.devicePixelRatio || 1, 1);

        // This part causes the canvas to be cleared
        const podDiv = document.querySelector('#pod');
        if (podDiv.style.display === 'none') {
            podDiv.style.display = 'block';
            signatureCanvas.width = signatureCanvas.offsetWidth //* ratio;
            signatureCanvas.height = signatureCanvas.offsetHeight //* ratio;
            signatureCanvas.clientHeight = signatureCanvas.offsetHeight //* ratio;
            podDiv.style.display = 'none';
        } else if (!podDiv.style.display) {
            podDiv.style.display = 'block';
            signatureCanvas.width = signatureCanvas.offsetWidth //* ratio;
            signatureCanvas.height = signatureCanvas.offsetHeight //* ratio;
            signatureCanvas.clientHeight = signatureCanvas.offsetHeight //* ratio;
            podDiv.style.display = 'none';
        } else {
            signatureCanvas.width = signatureCanvas.offsetWidth
            signatureCanvas.height = signatureCanvas.offsetHeight //* ratio;
            signatureCanvas.clientHeight = signatureCanvas.offsetHeight //* ratio;
        }
        signatureCanvas.getContext("2d")//.scale(2, 2);

        // This library does not listen for canvas changes, so after the canvas is automatically
        // cleared by the browser, SignaturePad#isEmpty might still return false, even though the
        // canvas looks empty, because the internal data of this library wasn't cleared. To make sure
        // that the state of this library is consistent with visual state of the canvas, you
        // have to clear it manually.
        signaturePad.clear();
    }

    // On mobile devices it might make more sense to listen to orientation change,
    // rather than window resize events.
    // window.onresize = resizeCanvas;
    window.addEventListener('resize', resizeCanvas);
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

    // One could simply use Canvas#toBlob method instead, but it's just to show
    // that it can be done using result of SignaturePad#toDataURL.
    function dataURLToBlob(dataURL) {
        // Code taken from https://github.com/ebidel/filer.js
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

    clearButton.addEventListener("click", function (event) {
        signaturePad.clear();
    });

    undoButton.addEventListener("click", function (event) {
        var data = signaturePad.toData();

        if (data) {
            data.pop(); // remove the last dot or line
            signaturePad.fromData(data);
        }
    });

    // changeColorButton.addEventListener("click", function (event) {
    //     var r = Math.round(Math.random() * 255);
    //     var g = Math.round(Math.random() * 255);
    //     var b = Math.round(Math.random() * 255);
    //     var color = "rgb(" + r + "," + g + "," + b + ")";

    //     signaturePad.penColor = color;
    // });

    savePNGButton.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
            alert("Please provide a signature first.");
        } else {
            var dataURL = signaturePad.toDataURL();
            download(dataURL, "signature.png");
        }
    });

    saveJPGButton.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
            alert("Please provide a signature first.");
        } else {
            var dataURL = signaturePad.toDataURL("image/jpeg");
            download(dataURL, "signature.jpg");
        }
    });

    saveSVGButton.addEventListener("click", function (event) {
        if (signaturePad.isEmpty()) {
            alert("Please provide a signature first.");
        } else {
            var dataURL = signaturePad.toDataURL('image/svg+xml');
            download(dataURL, "signature.svg");
        }
    });

    // section for multiple photo upload
    let upload = new FileUploadWithPreview("myUniqueUploadId");
    const photoUploadBtn = document.querySelector('#photo_upload_btn');
    photoUploadBtn.addEventListener('click', function () { // upload for ajax later when backend is ready
        console.log(upload.cachedFileArray);
    });
});