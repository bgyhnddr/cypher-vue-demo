<template>
    <div>
		<group>
			<cell title="新代理加盟" value=">" inline-desc="查看或生成申请下级代理的分享链接"
                 @click="showChooseBrandRoleModel">
               <span class="demo-icon" slot="icon" style="color:#F70968">&#xe633;
                   <img src="../../static/TestIMG/店铺1头像.jpg"/>
               </span>
			</cell>
		</group>
        <modal :show.sync="showChooseBrandRoleModel" effect="fade" width="400">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">
                    选择新代理级别
                </h4>
            </div>
            <div slot="modal-body" class="modal-body">
                <bs-input v-if="!edit" :value.sync="submitData.good_code" label="商品唯一编码" required  readonly="readonly"></bs-input>
                <bs-input v-else :value.sync="submitData.good_code" label="編碼" readonly readonly="readonly"></bs-input>
                <bs-input :value.sync="submitData.name" label="* 商品名称" required></bs-input>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="showAddGoodModel=false">关闭</button>
            </div>
        </modal>
	</div>
</template>

<script>
    import {
        Cell,
        Group
    } from 'vux'
    import {
        modal,
    } from 'vue-strap'
    export default {
        components: {
            Cell,
            Group
        },
        data() {
            return {
                showChooseBrandRoleModel:false,
            }
        },
        computed:{

        },
        methods:{
            showChooseBrandRoleModel() {
                console.log("打开选择代理弹出层")

            }
        }
    }
</script>