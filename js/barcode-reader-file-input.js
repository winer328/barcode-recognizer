const FileInput = {
    template: '\n    <div>\n      <div class="controls">\n        <b-form inline>\n          <b-form-file\n            class=""\n            v-model="file"\n            @change="onFileChange"\n            :state="Boolean(file)"\n            placeholder="Choose a file..."\n            accept=".jpg, .png, .gif">\n          </b-form-file>\n          <label class="mt-sm-2 mr-sm-2" for="barcodeTypes">Barcode Type</label>\n          <b-form-select          \n            class="mb-2 mt-sm-2 mr-sm-2 mb-sm-0"            \n            id="barcodeTypes"\n            v-model="decoderReaders"\n            :options="codeTypes">\n          </b-form-select>\n          \x3c!-- <label class="mt-sm-2 mr-sm-2" for="streamSizes">Resolution</label> --\x3e\n          <b-form-select\n            class="mb-2 mt-sm-2 mr-sm-2 mb-sm-0"\n            style="visibility: hidden; display:none;"\n            id="streamSizes"\n            v-model="inputStreamSize"\n            :options="streamSizes">\n          </b-form-select>\n          \x3c!-- <label class="mt-sm-2 mr-sm-2" for="patchSizes"> Patch Size </label> --\x3e\n          <b-form-select\n            style="visibility: hidden; display:none;"\n            class="mb-2 mt-sm-2 mr-sm-2 mb-sm-0"\n            id="patchSizes"\n            v-model="locatorPatchSize"\n            :options="patchSizes">\n          </b-form-select>\n          \n          <b-form-checkbox \n          style="visibility: hidden; display:none;"\n          v-model="locatorHalfSample" class="mb-2 mt-sm-2 mr-sm-4 mb-sm-0">Half-Sample</b-form-checkbox>\n          \n          <b-form-checkbox \n          style="visibility: hidden; display:none;"\n          v-model="inputStreamSingleChannel" class="mb-2 mt-sm-2 mr-sm-4 mb-sm-0">Single Channel</b-form-checkbox>\n        </b-form>\n      </div>\n      <b-card v-if="state.src" class="m-2">\n        <div id="interactive" class="viewport"></div>        \n      </b-card>\n      \n    </div>\n  ',
    data: ()=>({
        file: null,
        url: null,
        codeTypes: CODE_TYPES,
        streamSizes: STREAM_SIZES,
        patchSizes: PATCH_SIZES,
        decoderReaders: "qrcode",
        inputStreamSize: 640,
        locatorPatchSize: "medium",
        locatorHalfSample: !1,
        inputStreamSingleChannel: !1,
        state: {
            inputStream: {
                size: 800,
                singleChannel: !1
            },
            locator: {
                patchSize: "medium",
                halfSample: !0
            },
            decoder: {
                readers: [{
                    format: "code_128_reader",
                    config: {}
                }]
            },
            locate: !0,
            src: null
        },
        barcode: null,
        caches: ""
    }),
    computed: {
        savedCodes() {
            return this.$store.getters.savedCodes
        }
    },
    watch: {
        decoderReaders(e) {
            let t;
            t = "ean_extended" === e ? [{
                format: "ean_reader",
                config: {
                    supplements: ["ean_5_reader", "ean_2_reader"]
                }
            }] : [{
                format: `${e}_reader`,
                config: {}
            }],
                this.state.decoder = {
                    readers: t
                },
                this.decode()
        },
        inputStreamSize(e) {
            e > 0 && (this.state.inputStream.size = e,
                this.decode())
        },
        locatorPatchSize(e) {
            e && (this.state.locator.patchSize = e,
                this.decode())
        },
        locatorHalfSample(e) {
            this.state.locator.halfSample = !!e,
                this.decode()
        },
        inputStreamSingleChannel(e) {
            this.state.inputStream.singleChannel = !!e,
                this.decode()
        }
    },
    methods: {
        decode() {
            this.state.src && Quagga.decodeSingle(Object.assign({}, this.state), e=>{
                    console.log("decodeSingle() result:", e)
                }
            )
        },
        onFileChange(e) {
            const t = e.target.files[0];
            this.url = URL.createObjectURL(t),
                this.barcode = null,
            this.url && (this.state.src = this.url,
                this.decode())
        }
    },
    created() {
        Quagga.onProcessed(e=>{
                const t = Quagga.canvas.ctx.overlay
                    , a = Quagga.canvas.dom.overlay;
                let s;
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
                }),
                this.state.inputStream.area && (s = calculateRectFromArea(a, App.state.inputStream.area),
                    t.strokeStyle = "#0F0",
                    t.strokeRect(s.x, s.y, s.width, s.height)))
            }
        ),
            Quagga.onDetected(e=>{
                    this.barcode = e.codeResult.code,
                        this.caches.length > 0 ? this.caches.indexOf(this.barcode) < 0 && (this.caches = this.caches + "\n" + this.barcode) : this.caches = this.barcode,
                        this.$store.dispatch("saveCode", {
                            code: this.barcode,
                            format: e.codeResult.format,
                            scannedAt: moment().format("MMM DD YYYY HH:mm")
                        })
                }
            ),
            console.log("file-input created")
    }
};
