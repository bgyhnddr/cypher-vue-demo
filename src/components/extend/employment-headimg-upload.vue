<template>
<div>
	<input v-model="file" @change="upload" v-el:uploadinput v-show="false" type="file" />
	<div v-if="!readonly">
		<button @click="chooseFile" class="btn btn-default btn-xs">
			<img :src="href" />
		</button>
	</div>
</div>
</template>
<script>
import Vue from 'vue'
var request = require('../../extend/http-request')

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
			href: "/static/TestIMG/default_headImg.png"
		}
	},
	computed: {
		href() {
			if (this.fileId > 0) {
				return "/service/public/upload/getAttachment?id=" + this.fileId
			} else {
				return "/static/TestIMG/upload.png"
			}
		},
		isWechat() {
			var ua = window.navigator.userAgent
			return /micromessenger/i.test(ua)
		}
	},
	methods: {
		chooseFile() {
			if (this.isWechat) {
				this.weChatUpload()
			} else {
				this.$els.uploadinput.click()
			}
		},
		weChatUpload() {
			var that = this
			wx.chooseImage({
				count: 1, // 默认9
				sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
				success: function(res) {
					that.imgId = res.localIds[0]; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
					wx.uploadImage({
						localId: that.imgId, // 需要上传的图片的本地ID，由chooseImage接口获得
						isShowProgressTips: 1, // 默认为1，显示进度提示
						success: function(res) {
							var serverId = res.serverId; // 返回图片的服务器端ID
							request.post('/wechat/saveAttachment', {
								media_id: serverId
							}).then((result) => {
								that.fileId = result.id
								that.$emit("uploaded", that.fileId)
							})
						}
					})
				}
			})
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
					that.$emit("uploaded", that.fileId)
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
		},
		getJsConfig() {
			request.post('/wechat/getJsConfig', {
				list: ['scanQRCode', 'chooseImage', 'uploadImage'],
				url: /micromessenger/i.test(window.navigator.userAgent) &&
					/(iPhone\sOS)\s([\d_]+)/.test(window.navigator.userAgent) ? 
					window.location.origin + window.location.hash : window.location.href
			}).then((result) => {
				window.wx.config(result)
				wx.error(function(res) {
					window.alert(JSON.stringify(res))
				})
			}).catch((err) => {
				window.alert(err)
			})
		}
	},
	ready() {
		window.location.href = location.origin + location.hash
		this.getJsConfig()
	}
}
</script>
