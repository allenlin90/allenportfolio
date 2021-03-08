window.addEventListener('load', async function () {
    const container = document.querySelector(".container");
    container.style.justifyContent = `space-between`;

    const video = document.createElement("video");
    const canvasElement = document.querySelector("#qr-canvas");
    const canvas = canvasElement.getContext("2d");

    const qrResult = document.querySelector("#qr-result");
    const outputData = document.querySelector("#outputData");
    const videoSelect = document.querySelector('#videoSource');

    const startScanBtn = document.querySelector('#startScanBtn');

    let scanning = false;
    const state = {
        rearCameras: []
    }

    videoSelect.onchange = start;
    await checkDevices();
    start();

    qrcode.callback = readResult;

    startScanBtn.onclick = start;

    function readResult(res) {
        if (res) {
            qrResult.style.display = `block`;
            outputData.innerText = res;
            startScanBtn.style.display = `block`;
            scanning = false;

            video.srcObject.getTracks().forEach(track => {
                track.stop();
            });

            canvasElement.hidden = true;
        }
    };

    async function start() {
        qrResult.style.display = `none`;
        startScanBtn.style.display = `none`;
        canvasElement.hidden = false;
        if (/iphone|ipad|mac|apple|os\sx/.test(deviceAgent().toLowerCase())) {
            try {
                if (window.stream) {
                    window.stream.getTracks().forEach(track => {
                        track.stop();
                    });
                }

                const devices = await getDevices();
                const rearCameras = devices.filter(device => device.kind === 'videoinput' && /(back|rear)/g.test(device.label.toLowerCase()));
                let constraints = {}
                const videoSource = videoSelect.value;
                if (rearCameras.length) {
                    constraints = {
                        video: { deviceId: videoSource ? { exact: videoSource } : rearCameras[rearCameras.length - 1].deviceId }
                    };
                } else {
                    constraints = {
                        video: { deviceId: { exact: undefined } }
                    }
                }
                console.log(constraints);
                navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(checkDevices).catch(errorHandler);
            } catch (err) {
                errorHandler(err);
            }

            async function getDevices() {
                return await navigator.mediaDevices.getUserMedia({ video: true })
                    .then(async (res) => {
                        const devices = await navigator.mediaDevices.enumerateDevices();
                        if (devices.length) {
                            const videoInputs = devices.filter(device => device.kind === 'videoinput');
                            const videoSelectedValue = videoSelect.value;
                            videoSelect.innerHTML = '';
                            videoInputs.forEach((videoInput, index) => {
                                console.log(videoInput);
                                const option = document.createElement('option');
                                option.value = videoInput.deviceId;
                                option.text = videoInput.label || `camera ${index + 1}`;
                                videoSelect.appendChild(option);
                            });
                            videoSelect.value = videoSelectedValue;
                            return devices;
                        } else {
                            errorHandler();
                            console.log('trigger')
                        }
                    })
                    .catch(errorHandler);
            }
        } else {
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
                        constraints = { video: { facingMode: 'environment' } };
                        navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(checkDevices).catch(errorHandler);
                    } catch (err) {
                        console.log('no rear camera');
                        constraints = { video: true };
                        navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(checkDevices).catch(errorHandler);
                    }
                }
                console.log(constraints);

            } catch (err) {
                console.log(err);
            }
        }
    }

    async function checkDevices() {
        const devices = await navigator.mediaDevices.enumerateDevices().then((devices) => devices).catch(err => err);
        const videoInputs = devices.filter(device => device.kind === 'videoinput');
        if (videoInputs.length) {
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
            errorHandler('This device has no available camera');
        }
    }

    function gotStream(stream) {
        window.stream = stream; // make stream available to console
        scanning = true;

        video.setAttribute("playsinline", true);
        video.srcObject = stream;
        video.play();
        tick();
        scan();
    }

    function errorHandler(err) {
        let message =
            `<h1>App can't start camera because </h1>
            <p>"${err}"</p>
            <div id="refresh_page" class="btn btn-light" style="margin: 0 auto;">Reload Page</div>`;
        document.querySelector('#qrcode_scanner').innerHTML = message;
        document.querySelector('#refresh_page').addEventListener('click', function (e) {
            e.stopPropagation();
            location.reload();
        });
        console.log(err);
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

    function deviceAgent() {
        let re = /\((.*?)\)/g;
        let userAgent = navigator.userAgent.match(re)[0];
        userAgent = userAgent.slice(1, (userAgent.length - 1));
        return userAgent;
    }
});