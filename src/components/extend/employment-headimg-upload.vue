<template>
	<div>
		<input v-model="file" @change="upload" v-el:uploadinput v-show="false" type="file" />
		<div v-if="!readonly">
			<button  @click="chooseFile" class="btn btn-default btn-xs">
                <img v-show="isShowImg" src="/static/TestIMG/upload.png"  />
                <img v-show="!isShowImg" :src.sync="href"  />
            </button>
		</div>
	</div>
</template>
<script>
    import Vue from 'vue'

    export default {
        props: {
            fileId: {
                type: Number
            },
            fileName: {
                type: String,
                default: ""
            },
            percent: {
                type: Number,
                default: 0
            },
            msg: {
                type: String,
                default: ""
            },
            uploading: {
                type: Boolean,
                default: false
            },
            readonly: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                file: "",
                uploadRequest: undefined,
                isShowImg: true,
                href: "/static/TestIMG/default_headImg.png"
            }
        },
        computed: {
            href() {
                return "/service/public/upload/getAttachment?id=" + this.fileId
            }
        },
        methods: {
            chooseFile() {
                this.$els.uploadinput.click()
            },
            upload() {
                var that = this
                var formData = new FormData();
                formData.append('ufile', this.$els.uploadinput.files[0])
                that.uploading = true
                Vue.http.post('/service/public/upload/file', formData, {
                    progress: function(event) {
                        that.percent = Math.round((event.loaded / event.total) * 100)
                    },
                    before(request) {
                        that.uploadRequest = request
                    }
                }).then(function(result) {
                    that.clear()
                    console.log(result)
                    if (result.body) {
                        that.fileId = result.body.id
                        that.fileName = result.body.name
                        that.isShowImg = false
                    }
                }).catch(function(error) {
                    that.clear()
                    console.log(error)
                })
            },
            cancelUpload() {
                if (this.uploadRequest) {
                    this.uploadRequest.abort()
                    this.clear()
                }
            },
            clear() {
                this.uploading = false
                this.percent = 0
                this.uploadRequest = undefined
                this.file = ""
            }
        }
    }
</script>
