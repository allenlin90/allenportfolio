window.addEventListener('load', function () {
    const video = document.createElement("video");
    const canvasElement = document.getElementById("qr-canvas");
    const canvas = canvasElement.getContext("2d");

    const qrResult = document.getElementById("qr-result");
    const outputData = document.getElementById("outputData");
    const btnScanQR = document.getElementById("btn-scan-qr");
    const qrScaneBtn = document.getElementById("qr_scan_btn");
    const btnCancelScanning = document.getElementById("btn-cancel-scanning");
    const cancelBtnDiv = document.getElementById("cancel-button");

    const state = {
        qrCodeContent: ''
    }

    let scanning = false;

    qrcode.callback = res => {
        if (res) {
            outputData.innerText = res;
            state.qrCodeContent = res;
            scanning = false;

            video.srcObject.getTracks().forEach(track => {
                track.stop();
            });

            qrResult.hidden = false;
            canvasElement.hidden = true;
            btnScanQR.hidden = false;
            qrScaneBtn.hidden = false;
            cancelBtnDiv.style.display = 'none';
        }
    };

    btnScanQR.addEventListener('click', scanningFunc);
    qrScaneBtn.addEventListener('click', scanningFunc);
    function scanningFunc() {
        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "environment" } })
            .then(function (stream) {
                scanning = true;
                qrResult.hidden = true;
                btnScanQR.hidden = true;
                qrScaneBtn.hidden = true;
                canvasElement.hidden = false;
                video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                video.srcObject = stream;
                video.play();
                tick();
                scan();
                cancelBtnDiv.style.display = 'block';
            })
            .catch(function () {
                let message =
                    `<h1>App can't start camera!</h1>
                    <div style="width: 100%; max-width: 700px; margin: 0 auto; color: white; text-align: left;">
                        <ol>
                            <li>Andriod Google Chrome</li>
                            <ol>
                                <li>Go to Settings</li>
                                <li>Select Site setting</li>
                                <li>Select Camera</li>
                                <li>Check https://app.makesend.asia/</li>
                                <li>Select Camera</li>
                                <li>Select 'Allow'</li>
                            </ol>
                            <li>iPhone Safari</li>
                        </ol>
                    </div>
                    <div id="refresh_page" class="btn btn-light" style="margin: 0 auto;">Reload Page</div>`;
                document.querySelector('#qrcode_scanner').innerHTML = message;
                document.querySelector('#refresh_page').addEventListener('click', function (e) {
                    e.stopPropagation();
                    location.reload();
                });
            });
    };


    btnCancelScanning.onclick = cancelScanning;

    function cancelScanning() {
        scanning = false;
        qrResult.hidden = true;
        btnScanQR.hidden = false;
        qrScaneBtn.hidden = false;
        canvasElement.hidden = true;
        cancelBtnDiv.style.display = 'none';
        video.srcObject.getTracks().forEach(track => {
            track.stop();
        });
    }

    function tick() {
        canvasElement.height = video.videoHeight;
        canvasElement.width = video.videoWidth;
        canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

        scanning && requestAnimationFrame(tick);
    }

    function scan() {
        try {
            qrcode.decode();
        } catch (e) {
            setTimeout(scan, 300);
        }
    }
});