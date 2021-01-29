"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}

function _asyncToGenerator(fn) {
    return function () {
        var self = this,
            args = arguments;
        return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}

window.addEventListener("load", function () {
    var video = document.createElement("video");
    var canvasElement = document.getElementById("qr-canvas");
    var canvas = canvasElement.getContext("2d");
    var qrResult = document.getElementById("qr-result");
    var outputData = document.getElementById("outputData");
    var btnScanQR = document.getElementById("btn-scan-qr");
    var qrScaneBtn = document.getElementById("qr_scan_btn");
    var btnCancelScanning = document.getElementById("btn-cancel-scanning");
    var cancelBtnDiv = document.getElementById("cancel-button");
    var videoSelectDiv = document.querySelector("#videoSelect");
    var videoSelect = document.querySelector("#videoSource");
    var scanning = false;
    var state = {
        rearCamera: null
    }; // checkDevices();

    videoSelect.addEventListener("change", start);

    function start() {
        return _start.apply(this, arguments);
    }

    function _start() {
        _start = _asyncToGenerator(
      /*#__PURE__*/ regeneratorRuntime.mark(function _callee() {
            var devices, videoInputs, videoSource, constraints;
            return regeneratorRuntime.wrap(
                function _callee$(_context) {
                    while (1) {
                        switch ((_context.prev = _context.next)) {
                            case 0:
                                _context.prev = 0;

                                if (window.stream) {
                                    window.stream.getTracks().forEach(function (track) {
                                        track.stop();
                                    });
                                }

                                _context.next = 4;
                                return checkDevices();

                            case 4:
                                devices = _context.sent;
                                videoInputs = devices.filter(function (device) {
                                    return (
                                        device.kind === "videoinput" &&
                                        /(back|rear)/g.test(device.label.toLowerCase())
                                    );
                                });
                                console.log(videoInputs);
                                videoSource = videoSelect.value;
                                constraints = null;

                                if (videoInputs.length) {
                                    constraints = {
                                        video: {
                                            deviceId: videoSource
                                                ? {
                                                    exact: videoSource
                                                }
                                                : {
                                                    exact:
                                                        videoInputs[videoInputs.length - 1].deviceId
                                                }
                                        }
                                    };
                                } else {
                                    constraints = {
                                        video: {
                                            deviceId: undefined
                                        }
                                    };
                                }

                                console.log(constraints);
                                navigator.mediaDevices
                                    .getUserMedia(constraints)
                                    .then(function (stream) {
                                        console.log("stream in start func: ", stream);
                                        gotStream(stream);
                                    })
                                ["catch"](function (err) {
                                    console.log(err);
                                    errorHandler();
                                });
                                _context.next = 17;
                                break;

                            case 14:
                                _context.prev = 14;
                                _context.t0 = _context["catch"](0);
                                console.log(_context.t0);

                            case 17:
                            case "end":
                                return _context.stop();
                        }
                    }
                },
                _callee,
                null,
                [[0, 14]]
            );
        })
        );
        return _start.apply(this, arguments);
    }

    function checkDevices() {
        return _checkDevices.apply(this, arguments);
    }

    function _checkDevices() {
        _checkDevices = _asyncToGenerator(
      /*#__PURE__*/ regeneratorRuntime.mark(function _callee3() {
            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                while (1) {
                    switch ((_context3.prev = _context3.next)) {
                        case 0:
                            _context3.next = 2;
                            return navigator.mediaDevices
                                .getUserMedia({
                                    video: true
                                })
                                .then(
                    /*#__PURE__*/(function () {
                                        var _ref = _asyncToGenerator(
                        /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(
                                            res
                                        ) {
                                            var devices, videoInputs, videoSelectedValue;
                                            return regeneratorRuntime.wrap(function _callee2$(
                                                _context2
                                            ) {
                                                while (1) {
                                                    switch ((_context2.prev = _context2.next)) {
                                                        case 0:
                                                            _context2.next = 2;
                                                            return navigator.mediaDevices.enumerateDevices();

                                                        case 2:
                                                            devices = _context2.sent;

                                                            if (!devices.length) {
                                                                _context2.next = 15;
                                                                break;
                                                            }

                                                            videoSelectDiv.style.display = "block";
                                                            videoSelectDiv.style.width =
                                                                canvasElement.width;
                                                            videoSelectDiv.style.margin = "1rem auto";
                                                            videoInputs = devices.filter(function (
                                                                device
                                                            ) {
                                                                return device.kind === "videoinput";
                                                            });
                                                            videoSelectedValue = videoSelect.value;
                                                            videoSelect.innerHTML = "";
                                                            videoInputs.forEach(function (
                                                                videoInput,
                                                                index
                                                            ) {
                                                                var option = document.createElement(
                                                                    "option"
                                                                );
                                                                option.value = videoInput.deviceId;
                                                                option.text =
                                                                    videoInput.label ||
                                                                    "camera ".concat(index + 1);
                                                                videoSelect.appendChild(option);
                                                            });
                                                            videoSelect.value = videoSelectedValue; // const rearInputs = devices.filter(device => device.kind === 'videoinput' && /(back|rear)/g.test(device.label.toLowerCase()));
                                                            // const rearCamera = rearInputs[rearInputs.length - 1];
                                                            // state.rearCamera = rearCamera;
                                                            // return rearCamera;

                                                            return _context2.abrupt("return", devices);

                                                        case 15:
                                                            errorHandler();
                                                            console.log("trigger");

                                                        case 17:
                                                        case "end":
                                                            return _context2.stop();
                                                    }
                                                }
                                            },
                                                _callee2);
                                        })
                                        );

                                        return function (_x) {
                                            return _ref.apply(this, arguments);
                                        };
                                    })()
                                )
                            ["catch"](function (err) {
                                console.log(err);
                                errorHandler();
                            });

                        case 2:
                            return _context3.abrupt("return", _context3.sent);

                        case 3:
                        case "end":
                            return _context3.stop();
                    }
                }
            }, _callee3);
        })
        );
        return _checkDevices.apply(this, arguments);
    }

    function gotStream(stream) {
        window.stream = stream; // make stream available to console

        console.log("stream arg in getStream: ", stream);
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
        cancelBtnDiv.style.display = "block"; // Refresh button list in case labels have become available
        // return navigator.mediaDevices.enumerateDevices();
    }

    function errorHandler() {
        var message =
            '<h1>App can\'t start camera!</h1>\n            <div style="width: 100%; max-width: 700px; margin: 0 auto; color: white; text-align: left;">\n                <ol>\n                    <li>Andriod Google Chrome</li>\n                    <ol>\n                        <li>Go to Settings</li>\n                        <li>Select Site setting</li>\n                        <li>Select Camera</li>\n                        <li>Check https://app.makesend.asia/</li>\n                        <li>Select Camera</li>\n                        <li>Select \'Allow\'</li>\n                    </ol>\n                    <li>iPhone Safari</li>\n                </ol>\n            </div>\n            <div id="refresh_page" class="btn btn-light" style="margin: 0 auto;">Reload Page</div>';
        document.querySelector("#qrcode_scanner").innerHTML = message;
        document
            .querySelector("#refresh_page")
            .addEventListener("click", function (e) {
                e.stopPropagation();
                location.reload();
            });
    }

    qrcode.callback = function (res) {
        if (res) {
            outputData.innerText = res;
            scanning = false;
            video.srcObject.getTracks().forEach(function (track) {
                track.stop();
            });
            qrResult.hidden = false;
            canvasElement.hidden = true;
            btnScanQR.hidden = false;
            qrScaneBtn.hidden = false;
            cancelBtnDiv.style.display = "none";
        }
    };

    btnScanQR.addEventListener("click", start);
    qrScaneBtn.addEventListener("click", start);

    function scanningFunc() {
        navigator.mediaDevices
            .getUserMedia({
                video: {
                    facingMode: "environment"
                }
            })
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
                cancelBtnDiv.style.display = "block";
            })
        ["catch"](errorHandler);
    }

    btnCancelScanning.onclick = cancelScanning;

    function cancelScanning() {
        scanning = false;
        qrResult.hidden = true;
        btnScanQR.hidden = false;
        qrScaneBtn.hidden = false;
        canvasElement.hidden = true;
        cancelBtnDiv.style.display = "none";
        videoSelectDiv.style.display = "none";
        video.srcObject.getTracks().forEach(function (track) {
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
