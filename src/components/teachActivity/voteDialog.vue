<!-- 
      name:在线投票弹窗
      author:覃祯
      date:2021年11月4日 13点40分
   -->
<template>
	<el-dialog
		width="690px"
		title="在线投票"
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

			<el-form-item label="投票标题" prop="voteTitle">
				<br />
				<latex-wang-editor
					id="voteTitle"
					v-model="form.voteTitle"
				></latex-wang-editor>
			</el-form-item>

			<!-- 渲染选项 -->
			<el-form-item
				v-for="(item, index) in form.options"
				:label="optionsLabels[index]"
				:key="index"
				prop="options"
				:rules="[
					{ required: true, message: '请输入选项内容', trigger: 'blur' },
				]"
			>
				<br />
				<!-- 第二个以后才显示删除按钮 -->
				<el-button
					v-if="index > 1"
					class="options-del"
					type="danger"
					@click="handleDeleteOptions(index)"
					>删除</el-button
				>
				<latex-wang-editor
					:id="`voteOptions${index}`"
					v-model="item.content"
				></latex-wang-editor>
			</el-form-item>

			<!-- 渲染选项 -->
			<div style="margin-top: 13px">
				<el-button
					type="primary"
					icon="el-icon-plus"
					style="width: 300px; border-radius: 2px"
					@click="addOptions()"
					>新增选项</el-button
				>
			</div>
			<!-- v-if="args_type == 'test' || args_type == 'dev'" -->
			<el-form-item label="投票规则">
				<el-form-item prop="voteMax">
					<br />最多选择<el-input
						v-model.number="form.voteMax"
						type="number"
						:min="1"
						:max="form.options.length || 3"
						class="m-0-5"
						style="width: 64px"
					></el-input
					>个
				</el-form-item>
				<el-form-item prop="voteMin">
					最少选择<el-input
						v-model.number="form.voteMin"
						type="number"
						:min="1"
						:max="form.options.length || 3"
						class="m-0-5"
						style="width: 64px; margin-top: 10px"
					></el-input
					>个
				</el-form-item>
			</el-form-item>

			<footer-btn
				@confirm="submitForm('form')"
				@cancel="resetForm('form')"
			></footer-btn>
		</el-form>
	</el-dialog>
</template>

<script>
	import { number } from 'echarts';
	import activityDialogMixin from './activityDialogMixin';
	export default {
		mixins: [activityDialogMixin],

		data() {
			return {
				visible: false,
				form: {
					activityName: '',
					activityType: 3,
					voteMax: 2,
					voteMin: 1,
					voteTitle: '',
					options: [{ content: '' }, { content: '' }],
					createdBy: '',
					remark: '',
				},
				rules: {
					activityName: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' },
					],
					// 这里要加上自定义校验
					voteMax: [
						{
							required: true,
							type: 'number',
							message: '请输入最多选数量',
						},
						{
							pattern: /^\+?[1-9][0-9]*$/,
							message: '请输入正整数',
							type: 'number',
						},
						{ validator: this.validMax, type: 'number' },
					],

					voteMin: [
						{
							required: true,
							message: '请输入最少选数量',
						},
						{
							pattern: /^\+?[1-9][0-9]*$/,
							message: '请输入正整数',
							type: 'number',
						},
						{ validator: this.validMin, type: 'number' },
					],
					voteTitle: [
						{
							required: true,
							message: '请输入投票标题',
							trigger: 'blur',
						},
					],
					// 这里要加上自定义校验
					options: [],
				},
			};
		},
		computed: {
			optionsLabels() {
				const {
					options: { length = 0 },
				} = this.form;
				const az = [...Array(parseInt(length)).keys()].map((i) =>
					String.fromCharCode(i + 65)
				);
				return az.map((v) => `选项${v}`);
			},
		},
		methods: {
			// 大于等于最少
			validMax(rule, value, callback) {
				const max = Number(value);
				const min = Number(this.form.voteMin) || 1;
				if (max < min) {
					callback(new Error('不能小于最少选！'));
				} else if (max > this.form.options.length) {
					callback(new Error('不能输入大于选项数量！'));
				}
				callback();
			},

			// 小于等于最多
			validMin(rule, value, callback) {
				const max = Number(this.form.voteMax) || 1;
				const min = Number(value) || 1;
				if (max < min) {
					callback(new Error('不能大于最多选！'));
				} else if (min > this.form.options.length) {
					callback(new Error('不能输入大于选项数量！'));
				}
				callback();
			},
			// 新增在线投票选项
			addOptions() {
				if (this.form.options.length < 16) {
					this.form.options.push({
						content: '',
					});
				}
			},
			// 处理删除选项
			handleDeleteOptions(index) {
				this.$confirm(`确定删除选项${this.optionsLabels[index]}吗？`, {
					customClass: 'custom-message-box',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					showClose: false,
					center: true,
					cancelButtonClass: 'plain-btn',
					confirmButtonClass: 'plain-btn',
				}).then(() => {
					this.form.options.splice(index, 1);
				});
			},
		},
	};
</script>

<style lang="less" scoped>
	@import url('~@/assets/css/activeDialog.less');

	.options-del {
		display: flex;
		align-items: center;
		justify-content: center;

		position: absolute;
		right: 0px;
		top: 5px;

		height: 30px;
		width: 60px;
		font-size: 14px;
		color: #fff;
		border-radius: 2px;
	}
</style>
