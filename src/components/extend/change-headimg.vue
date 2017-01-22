<template>
	<div>
		<!--<a target="_blank" href="{{href}}">{{fileName}}</a>-->
		<input v-model="file" v-el:uploadinput v-show="false" @change="upload" type="file" />
		<div v-if="!readonly">
			<button  @click="chooseFile" class="btn btn-default btn-xs">
                <img v-show="isShowImg" :src.sync="headImg"  />
                <img v-show="!isShowImg" :src.sync="href"  />
            </button>
            <p>点击头像可修改头像</p>
			<!--<button v-if="file" @click="upload" class="btn btn-default btn-xs">确认修改</button>-->
		</div>
	</div>
</template>
<script>
    import Vue from 'vue'
    import employAPI from '../../api/employment'
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
                headImg: ""
            }
        },
        computed: {
            href() {
                return "/service/public/upload/getAttachment?id=" + this.fileId
            }
        },
        methods: {
            getHeadImg() {
                var that = this
                employAPI.changeHeadImg({
                    account: that.$route.params.account
                }).then(function(result) {
                    that.headImg = "/service/public/upload/getAttachment?id=" + result.value
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
            },
            changeHeadImg() {
                var that = this
                employAPI.changeHeadImg({
                    account: that.$route.params.account,
                    ImgID: that.fileId
                }).then(function(result) {
                    console.log(result)
                    that.getHeadImg()
                }).catch(function(err) {
                    console.log(err)
                    that.serveMsg = err
                })
            },
            chooseFile() {
                this.$els.uploadinput.click()
                this.upload()
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
                        that.changeHeadImg()
                        console.log(that.fileId)
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
        },
        ready() {
            this.getHeadImg()
        }
    }
</script>
