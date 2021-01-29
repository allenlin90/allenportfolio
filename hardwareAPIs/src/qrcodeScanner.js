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

    async function start() {
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
                        video: { deviceId: videoSource ? { exact: videoSource } : videoInputs[videoInputs.length - 1].deviceId }
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
                            videoSelectDiv.style.display = 'block';
                            videoSelectDiv.style.width = canvasElement.width;
                            videoSelectDiv.style.margin = '1rem auto';
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

    function deviceAgent() {
        function mobileCheck() {
            let check = false;
            (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
            return check;
        };

        let re = /\((.*?)\)/g;
        let userAgent = navigator.userAgent.match(re)[0];
        userAgent = userAgent.slice(1, (userAgent.length - 1));
        return userAgent;
    }
});