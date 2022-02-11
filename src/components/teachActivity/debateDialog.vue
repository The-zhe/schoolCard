<!-- 
      name:分组辩论弹窗
      author:覃祯
      date:2021年11月4日 14点53分
   -->
<template>
	<el-dialog
		width="690px"
		title="分组辩论"
		:visible.sync="visible"
		:close-on-click-modal="false"
		append-to-body
		@close="handleClose()"
		class="teaching-popup"
	>
		<el-form :model="form" :rules="rules" ref="form">
			<el-form-item label="活动名称" prop="activityName">
				<el-input v-model="form.activityName" maxlength="20"></el-input>
			</el-form-item>
			<el-form-item label="辩题" prop="debateBackground">
				<br />
				<latex-wang-editor
					id="debateBackground"
					v-model="form.debateBackground"
				></latex-wang-editor>
			</el-form-item>
			<el-form-item label="辩论观点(正方)" prop="debateZ">
				<br />
				<latex-wang-editor
					id="debateZ"
					v-model="form.debateZ"
				></latex-wang-editor>
			</el-form-item>
			<el-form-item label="辩论观点(反方)" prop="debateF">
				<br />
				<latex-wang-editor
					id="debateF"
					v-model="form.debateF"
				></latex-wang-editor>
			</el-form-item>
			<el-form-item label="备注" prop="remark">
				<el-input placeholder="请输入内容" v-model="form.remark"> </el-input>
			</el-form-item>

			<footer-btn
				@confirm="submitForm('form')"
				@cancel="resetForm('form')"
			></footer-btn>
		</el-form>
	</el-dialog>
</template>

<script>
	import activityDialogMixin from './activityDialogMixin';
	export default {
		mixins: [activityDialogMixin],
		data() {
			return {
				visible: false,
				form: {
					activityName: '',
					debateBackground: '',
					debateZ: '',
					debateF: '',
					remark: '',
					activityType: 2,
					createdBy: '',
				},
				rules: {
					activityName: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' },
					],
					debateBackground: [
						{
							required: true,
							message: '请输入讨论的背景介绍',
							trigger: 'blur',
						},
					],
					debateZ: [
						{
							required: true,
							message: '请输入辩论观点(正方)',
							trigger: 'blur',
						},
					],
					debateF: [
						{
							required: true,
							message: '请输入辩论观点(反方)',
							trigger: 'blur',
						},
					],
				},
			};
		},

		methods: {},
	};
</script>

<style lang="less" scoped>
	@import url('~@/assets/css/activeDialog.less');
</style>
