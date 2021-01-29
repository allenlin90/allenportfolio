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


    const videoSelectDiv = document.querySelector('#videoSelect');
    const videoSelect = document.querySelector('#videoSource');

    let scanning = false;
    const state = {
        rearCameras: []
    }

    videoSelect.addEventListener('change', start);

    function start() {
        try {
            if (window.stream) {
                window.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }
            const videoSource = videoSelect.value;
            let constraints = null;
            if (state.rearCameras.length) {
                constraints = {
                    video: { deviceId: videoSource ? { exact: videoSource } : { exact: state.rearCameras[state.rearCameras.length - 1].deviceId } }
                };
                navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(checkDevices).catch(errorHandler);
            } else {
                constraints = {
                    video: { deviceId: undefined }
                };
                try {
                    constrains = { video: { facingMode: 'environment' } };
                    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(checkDevices).catch(errorHandler);
                } catch (err) {
                    console.log('no rear camera');
                    constrains = { video: true };
                    navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(checkDevices).catch(errorHandler);
                }
            }
            console.log(constraints);

        } catch (err) {
            console.log(err);
        }
    }

    checkDevices();
    function checkDevices() {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                const videoInputs = devices.filter(device => device.kind === 'videoinput');
                if (videoInputs.length) {
                    videoSelectDiv.style.display = 'block';
                    videoSelectDiv.style.width = '100%';
                    videoSelectDiv.style.margin = '1rem auto';

                    const videoSelectedValue = videoSelect.value;
                    videoSelect.innerHTML = '';
                    videoInputs.forEach((videoInput, index) => {
                        const option = document.createElement('option');
                        option.value = videoInput.deviceId;
                        option.text = videoInput.label || `camera ${index + 1}`;
                        videoSelect.appendChild(option);
                    });
                    videoSelect.value = videoSelectedValue;
                    const rearCameras = devices.filter(device => /(back|rear)/g.test(device.label.toLowerCase()));
                    state.rearCameras = rearCameras;
                    return devices;
                } else {
                    errorHandler('This device has no media in/output');
                }
            })
            .catch(errorHandler);
    }

    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        scanning = true;
        qrResult.hidden = true;
        btnScanQR.hidden = true;
        qrScaneBtn.hidden = true;
        canvasElement.hidden = false;

        video.setAttribute("playsinline", true);
        video.srcObject = stream;
        video.play();
        tick();
        scan();
        cancelBtnDiv.style.display = 'block';

        // Refresh button list in case labels have become available
        // return navigator.mediaDevices.enumerateDevices();
    }

    function errorHandler(err) {
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
        console.log(err);
    }

    qrcode.callback = res => {
        if (res) {
            outputData.innerText = res;
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

    btnScanQR.addEventListener('click', start);
    qrScaneBtn.addEventListener('click', start);

    // function scanningFunc() {
    //     navigator.mediaDevices
    //         .getUserMedia({ video: { facingMode: "environment" } })
    //         .then(function (stream) {
    //             scanning = true;
    //             qrResult.hidden = true;
    //             btnScanQR.hidden = true;
    //             qrScaneBtn.hidden = true;
    //             canvasElement.hidden = false;
    //             video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    //             video.srcObject = stream;
    //             video.play();
    //             tick();
    //             scan();
    //             cancelBtnDiv.style.display = 'block';
    //         })
    //         .catch(errorHandler);
    // };

    btnCancelScanning.onclick = cancelScanning;

    function cancelScanning() {
        scanning = false;
        qrResult.hidden = true;
        btnScanQR.hidden = false;
        qrScaneBtn.hidden = false;
        canvasElement.hidden = true;
        cancelBtnDiv.style.display = 'none';
        videoSelectDiv.style.display = 'none';
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