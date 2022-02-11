<template>
	<!-- 
        name:弹窗底部按钮
        author:qz
        date:2021年11月3日 17点47分
     -->
	<div class="footer-btns">
		<el-button class="cancel-btn" type="info" @click="$throttle(cancel,500)">{{
			cancelText
		}}</el-button>
		<el-button class="confirm-btn" type="primary" @click="$throttle(confirm,500)">{{
			confirmText
		}}</el-button>
	</div>
</template>

<script>
	export default {
		props: {
			confirmText: {
				type: String,
				default: '确定',
			},
			cancelText: {
				type: String,
				default: '取消',
			},
		},
		methods: {
			cancel() {
				this.$emit('cancel');
			},
			confirm() {
				this.$emit('confirm');
			},
		},
	};
</script>

<style lang="less" scoped>
	.footer-btns {
		display: flex;
		justify-content: flex-end;
		.cancel-btn,
		.confirm-btn {
			width: 150px;
			height: 36px;
			border-radius: 2px;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			border: none;
		}

		.cancel-btn {
			background-color: #bbbbbb;
		}

		.confirm-btn {
			margin-left: 25px;
			background-color: #2196f3;
		}
	}
</style>
