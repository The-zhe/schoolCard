<!--
 * @Author: qz
 * @Date: 2021-11-12 09:29:32
 * @LastEditTime: 2021-11-15 13:56:41
 * @LastEditors: qz
 * @Description: 板书
 * @FilePath: \new-lesson-admin\src\views\lessonPreparation\createPlan\components\skateboard.vue
-->
<template>
	<div>
		<latex-wang-editor
			id="skateboard"
			height="260"
			v-model="defValue"
		></latex-wang-editor>
	</div>
</template>

<script>
	import latexWangEditor from '@/plugins/latex-wang-editor/index';
	export default {
		components: {
			latexWangEditor,
		},
		props: {
			value: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				defValue: '',
			};
		},
		watch: {
			value(n) {
				if (n === this.defValue) {
					return;
				}
				this.defValue = n;
			},
			defValue(newValue, oldValue) {
				this.$emit('input', newValue);
			},
		},
	};
</script>

<style lang="less" scoped></style>
