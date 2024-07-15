var  prevBarcode;
var currentRepeat;
var reconfirmCount = 10;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const LiveInput = {
    template: '\n    <div>\n      <div class="controls">\n        <b-form inline>\n\n          <label class="mr-sm-2" for="barcodeTypes">Barcode Type</label>\n          <b-form-select\n            class="mb-2 mr-sm-2 mb-sm-0"\n            id="barcodeTypes"\n            v-model="decoderReaders"\n            :options="codeTypes">\n          </b-form-select>\n          \n          \x3c!-- <label class="mr-sm-2" for="streamConstraints">Resolution</label>  --\x3e\n          <b-form-select\n            class="mb-2 mr-sm-2 mb-sm-0"\n            style="visibility: hidden; display:none;"\n            id="streamConstraints"\n            v-model="constraints"\n            :options="streamConstraints">\n          </b-form-select>\n\n          \x3c!-- <label class="mr-sm-2" for="patchSizes"> Patch Size </label> --\x3e\n          <b-form-select\n            class="mb-2 mr-sm-2 mb-sm-0"\n            style="visibility: hidden; display:none;"\n            id="patchSizes"\n            v-model="locatorPatchSize"\n            :options="patchSizes">\n          </b-form-select>\n\n          <b-form-checkbox v-model="locatorHalfSample" \n          class="mb-2 mr-sm-4 mb-sm-0"\n          style="visibility: hidden; display:none;">Half-Sample</b-form-checkbox>\n          \n          <b-form-checkbox v-model="inputStreamSingleChannel" \n          style="visibility: hidden; display:none;"\n          class="mb-2 mr-sm-4 mb-sm-0">Single Channel</b-form-checkbox>\n          \x3c!-- <label class="mr-sm-2" for="workers"> Workers </label> --\x3e\n          <b-form-select\n            id="workers"\n            style="visibility: hidden; display:none;"\n            class="mb-2 mr-sm-2 mb-sm-0"\n            v-model="numOfWorkers"\n            :options="workers">\n          </b-form-select>\n          \n          <label class="mr-sm-2" for="devices"> Camera </label>\n          <b-form-select\n            id="devices"\n            class="mb-2 mr-sm-2 mb-sm-0"\n            v-model="deviceId"\n            :options="devices">\n          </b-form-select>\n          \n          <div v-if="zoomCapability">\n            <label class="mr-sm-2" for="zoom"> Zoom </label>\n            <b-form-select\n              id="zoom"\n              class="mb-2 mr-sm-2 mb-sm-0"\n              v-model="magnification"\n              :options="magnifications">\n            </b-form-select>\n          </div>\n          <div v-if="torchCapability">\n            <b-form-checkbox v-model="torch" class="mb-2 mr-sm-4 mb-sm-0"> Torch </b-form-checkbox>\n          </div>\n          <div>\n            <b-button variant="warning" @click="handleStop"> Stop </b-button>\n          </div>\n        </b-form>\n      </div>\n      \n      <b-card class="mt-2 mb-2 ml-1 mr-1">\n        <div id="live_interactive" class="viewport"></div>        \n      </b-card>    \n    </div>\n  ',
    data: ()=>({
        barcode: null,
        resultCollector: null,
        codeTypes: CODE_TYPES,
        streamConstraints: STREAM_CONSTRAINTS,
        patchSizes: PATCH_SIZES,
        workers: WORKERS,
        decoderReaders: "ean",
        constraints: "320x240",
        locatorPatchSize: "medium",
        devices: [],
        magnifications: [],
        magnification: 0,
        torch: !1,
        zoomCapability: !1,
        torchCapability: !1,
        deviceId: null,
        locatorHalfSample: !1,
        inputStreamSingleChannel: !1,
        numOfWorkers: 1,
        state: {
            inputStream: {
                type: "LiveStream",
                constraints: {
                    width: {
                        min: 320
                    },
                    height: {
                        min: 240
                    },
                    facingMode: "environment",
                    aspectRatio: {
                        min: 1,
                        max: 2
                    }
                },
                area: {
                    top: "0%",
                    right: "0%",
                    left: "0%",
                    bottom: "0%"
                },
                singleChannel: !1
            },
            locator: {
                patchSize: "medium",
                halfSample: !0
            },
            numOfWorkers: 2,
            frequency: 10,
            decoder: {
                readers: [{
                    format: "ean_reader",
                    config: {}
                }]
            },
            locate: !0
        },
        lastResult: null,
        caches: "",
        quaggaStarted: !1
    }),
    methods: {
        init() {
            this.state.inputStream.target = document.querySelector("#live_interactive.viewport"),
                Quagga.init(Object.assign({}, this.state), e=>{
                        e ? alert(e && e.message || "There was a problem while initializing library") : (this.initCameraSelection(),
                            this.checkCapabilities(),
                            "qrcode" === this.decoderReaders ? this.decodeQRCode() : (Quagga.start(),
                                this.quaggaStarted = !0))
                    }
                )
        },
        checkCapabilities() {
            const e = Quagga.CameraAccess.getActiveTrack();
            let t = {};
            "function" == typeof e.getCapabilities && (t = e.getCapabilities()),
                this.applySettingsVisibility("zoom", t.zoom),
                this.applySettingsVisibility("torch", t.torch)
        },
        applySettingsVisibility(e, t) {
            "zoom" === e ? window.MediaSettingsRange && t instanceof window.MediaSettingsRange && (this.zoomCapability = !0,
                this.updateOptionsForMediaRange(t)) : "torch" === e && (this.torchCapability = !0)
        },
        updateOptionsForMediaRange(e) {
            const t = (e.max - e.min) / 6
                , a = [];
            for (let i = 0; i <= 6; i++) {
                const o = e.min + t * i;
                a.push({
                    text: "" + o,
                    value: o
                })
            }
            this.magnifications = a
        },
        initCameraSelection() {
            const e = Quagga.CameraAccess.getActiveStreamLabel();
            return console.log("streamLabel:", e),
                Quagga.CameraAccess.enumerateVideoDevices().then(t=>{
                        t.length > 0 && (console.log("initCameraSelection() devices:", t),
                            1 === t.length ? (this.deviceId = t[0].deviceId,
                                this.devices = [{
                                    value: this.deviceId,
                                    text: e
                                }]) : this.devices = t.map(t=>{
                                    const a = t.label || t.deviceId || t.id;
                                    return e === t.label && (this.deviceId = t.deviceId),
                                        {
                                            value: t.deviceId,
                                            text: a
                                        }
                                }
                            ))
                    }
                )
        },
        handleStop() {
            this.quaggaStarted && (Quagga.stop(),
                this.quaggaStarted = !1)
        },
        reRun() {
            this.barcode = null,
                this.handleStop(),
                this.init()
        },
        decodeQRCode() {
            this.handleStop();
            const e = document.createElement("video")
                , t = document.querySelector("#live_interactive canvas");
            if (t) {
                const a = t.getContext("2d")
                    , i = (e,t,i)=>{
                        a.beginPath(),
                            a.moveTo(e.x, e.y),
                            a.lineTo(t.x, t.y),
                            a.lineWidth = 4,
                            a.strokeStyle = i,
                            a.stroke()
                    }
                    , o = ()=>{
                        if (e.readyState === e.HAVE_ENOUGH_DATA) {
                            t.hidden = !1,
                                t.height = e.videoHeight,
                                t.width = e.videoWidth,
                                a.drawImage(e, 0, 0, t.width, t.height);
                            var s = a.getImageData(0, 0, t.width, t.height)
                                , n = jsQR(s.data, s.width, s.height);
                            n && (i(n.location.topLeftCorner, n.location.topRightCorner, "#00F"),
                                i(n.location.topRightCorner, n.location.bottomRightCorner, "#00F"),
                                i(n.location.bottomRightCorner, n.location.bottomLeftCorner, "#00F"),
                                i(n.location.bottomLeftCorner, n.location.topLeftCorner, "#00F"),
                                this.showOutput(n.data, "qrcode"))
                        }
                        "qrcode" === this.decoderReaders && requestAnimFrame(o)
                    }
                ;
                navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: "environment"
                    }
                }).then(function(t) {
                    e.srcObject = t,
                        e.setAttribute("playsinline", !0),
                        e.play(),
                        requestAnimFrame(o)
                })
            }
        },
        showOutput(e, t) {

            this.$store.dispatch("saveCode", {
                code:  e.cod_de_bare,
                "product name":  e.name_produs,
                price: e.pret_cu_tva * e.count,
                count: e.count,
                id:t
            })
        }
    },
    watch: {
        decoderReaders(e, t) {

            setTimeout(()=>{
                    "qrcode" === e ? (this.barcode = null,
                        this.decodeQRCode()) : (readers = "ean_extended" === e ? [{
                        format: "ean_reader",
                        config: {
                            supplements: ["ean_13_reader", "ean_2_reader"]
                        }
                    }] : [{
                        format: `${e}_reader`,
                        config: {}
                    }],
                        this.state.decoder = {
                            readers: readers
                        },
                        this.reRun())
                }
                , "qrcode" === e || "qrcode" === t ? 100 : 0)
        },
        constraints(e) {
            if ("qrcode" !== this.decoderReaders && /^(\d+)x(\d+)$/.test(value)) {
                const e = value.split("x");
                this.state.inputStream.constraints = Object.assign({}, this.state.inputStream.constraints, {
                    width: {
                        min: parseInt(e[0])
                    },
                    height: {
                        min: parseInt(e[1])
                    }
                }),
                    this.reRun()
            }
        },
        locatorPatchSize(e) {
            "qrcode" !== this.decoderReaders && e && (this.state.locator.patchSize = e,
                this.reRun())
        },
        locatorHalfSample(e) {
            "qrcode" !== this.decoderReaders && (this.state.locator.halfSample = !!e,
                this.reRun())
        },
        inputStreamSingleChannel(e) {
            "qrcode" !== this.decoderReaders && (this.state.inputStream.singleChannel = !!e,
                this.reRun())
        },
        numOfWorkers(e) {
            "qrcode" !== this.decoderReaders && (this.state.numOfWorkers = e,
                this.reRun())
        },
        deviceId(e, t) {
            "qrcode" !== this.decoderReaders && (this.state.inputStream.constraints.deviceId = e,
            t && this.reRun())
        },
        magnification(e) {
            if ("qrcode" !== this.decoderReaders) {
                const t = Quagga.CameraAccess.getActiveTrack();
                if (t && "function" == typeof t.getCapabilities)
                    return t.applyConstraints({
                        advanced: [{
                            zoom: parseFloat(e)
                        }]
                    });
                this.reRun()
            }
        },
        torch(e) {
            if ("qrcode" !== this.decoderReaders) {
                const t = Quagga.CameraAccess.getActiveTrack();
                if (t && "function" == typeof t.getCapabilities)
                    return t.applyConstraints({
                        advanced: [{
                            torch: !!e
                        }]
                    });
                this.reRun()
            }
        }
    },
    created() {
        this.resultCollector = Quagga.ResultCollector.create({
            capture: !0,
            capacity: 20,
            blacklist: [{
                code: "WIWV8ETQZ1",
                format: "code_93"
            }, {
                code: "EH3C-%GU23RK3",
                format: "code_93"
            }, {
                code: "O308SIHQOXN5SA/PJ",
                format: "code_93"
            }, {
                code: "DG7Q$TV8JQ/EN",
                format: "code_93"
            }, {
                code: "VOFD1DB5A.1F6QU",
                format: "code_93"
            }, {
                code: "4SO64P4X8 U4YUU1T-",
                format: "code_93"
            }],
            filter: e=>(console.log("codeResult:", e),
            !0)
        }),
        Quagga.onProcessed(e=>{
                    const t = Quagga.canvas.ctx.overlay
                        , a = Quagga.canvas.dom.overlay;
                    e && (e.boxes && (t.clearRect(0, 0, parseInt(a.getAttribute("width")), parseInt(a.getAttribute("height"))),
                        e.boxes.filter(t=>t !== e.box).forEach(e=>{
                                Quagga.ImageDebug.drawPath(e, {
                                    x: 0,
                                    y: 1
                                }, t, {
                                    color: "green",
                                    lineWidth: 2
                                })
                            }
                        )),
                    e.box && Quagga.ImageDebug.drawPath(e.box, {
                        x: 0,
                        y: 1
                    }, t, {
                        color: "#00F",
                        lineWidth: 2
                    }),
                    e.codeResult && e.codeResult.code && Quagga.ImageDebug.drawPath(e.line, {
                        x: "x",
                        y: "y"
                    }, t, {
                        color: "red",
                        lineWidth: 3
                    }))
                }
        ),
        Quagga.onDetected(e=>{

                if(e.codeResult.format != "ean_13") return;
                console.log(e.codeResult.code);
                if(prevBarcode != e.codeResult.code)
                {
                    prevBarcode = e.codeResult.code;
                    currentRepeat = 1;
                    return;
                }
                if(currentRepeat < reconfirmCount){ currentRepeat++;return;}
                var code = e.codeResult.code;
                currentRepeat = 0;
                prevBarcode = "";
                beep();
                axios
                    .post('ajax.php',{type:'code-detected',code:e.codeResult.code})
                    .then(response => {
                        var data = response.data;
                        if(typeof data.product == "string"){
                            alert("unregistered product");
                            return;
                        }
                        this.showOutput(data.product,data.insertId);
                    });
                    //this.showOutput(e.codeResult.code, e.codeResult.format)
                }
        ),
        console.log("live-input created")
    },
    mounted() {
        this.init()
    }
};
