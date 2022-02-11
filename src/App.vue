<!--
 * @Author: qz
 * @Date: 2021-11-01 10:45:13
 * @LastEditTime: 2021-11-15 11:38:06
 * @LastEditors: qz
 * @Description: 
 * @FilePath: \new-lesson-admin\src\App.vue
-->
<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view v-if="isRouterAlive" />
		</transition>
	</div>
</template>

<script>
	export default {
		name: 'App',
		provide() {
			return {
				reload: this.reload,
			};
		},
		data() {
			return {
				isRouterAlive: true,
			};
		},
		mounted() {},
		methods: {
			reload() {
				this.isRouterAlive = false;
				this.$nextTick(() => {
					this.isRouterAlive = true;
				});
			},
		},
	};
</script>
<style>
	/* 在这里操作弹窗 */
	.custom-message-box {
		width: 360px !important;
		padding-bottom: 22px;
	}

	.tooltip-box {
		width: 524px !important;
	}

	.custom-message-box > .el-message-box__header {
		height: 0 !important;
		padding: 0 !important;
	}
	.custom-message-box .el-message-box__content {
		padding: 30px;
		height: 180px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.custom-message-box .el-message-box__content p {
		line-height: 26px;
		font-size: 20px;
		font-family: Microsoft YaHei;
		color: #333;
	}

	.custom-message-box .plain-btn,
	.custom-message-box .primary-btn {
		border-radius: 4px;
		width: 100px;
		height: 36px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.custom-message-box .plain-btn {
		color: #2196f3;
		border: solid 1px #2196f3;
		background-color: #fff;
	}

	.custom-message-box .primary-btn {
		color: #fff;
		background-color: #2196f3;
	}

	

	.el-message-box__btns .plain-btn:nth-child(2) {
		margin-left: 40px;
	}
</style>
