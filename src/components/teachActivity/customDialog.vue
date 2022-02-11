<!-- 
      name:自主添加题目弹窗
      author:覃祯
      date:2021年11月8日 13点44分
   -->
<template>
	<el-dialog
		width="860px"
		title="自主添加"
		:visible.sync="visible"
		:close-on-click-modal="false"
		append-to-body
		@close="handleClose()"
		class="teaching-popup"
	>
		<el-form :model="form" :rules="rules" ref="form">
			<el-form-item label="题目类型" prop="questionType">
				<br />
				<tabs :list="typeList" v-model="form.questionType"></tabs>
			</el-form-item>

			<el-form-item label="题目内容" prop="questionContent">
				<br />
				<latex-wang-editor
					id="customQuestionContent"
					v-model="form.questionContent"
				></latex-wang-editor>
			</el-form-item>

			<!-- 渲染选项 -->
			<el-form-item
				v-for="(item, index) in form.options"
				:label="item.sortIndex"
				:key="item.sortIndex"
				:prop="'options.' + index + '.optionContent'"
				:rules="{
					required: true,
					message: '选项内容不能为空',
					trigger: 'blur',
				}"
			>
				<br />
				<!-- 第三个以后才显示删除按钮 -->
				<el-button
					v-if="index > 1"
					class="options-del"
					type="danger"
					@click="handleDeleteOptions(index)"
					>删除</el-button
				>
				<latex-wang-editor
					:id="`customOptions${index}`"
					v-model="item.optionContent"
				></latex-wang-editor>
			</el-form-item>

			<!-- 渲染选项 -->
			<div style="margin-top: 20px" v-show="[1, 2].includes(questionType)">
				<el-button
					type="primary"
					icon="el-icon-plus"
					style="width: 300px; border-radius: 2px"
					@click="addOptions()"
					>新增选项</el-button
				>
			</div>
			<!-- prop="rightAnswers" -->
			<el-form-item label="正确选项" prop="rightAnswers">
				<br />
				<template v-if="[1, 2, 4].includes(questionType)">
					<!-- 多选 -->
					<tabs-answer
						:list.sync="optionAnswers"
						:multiple="questionType === 2"
					></tabs-answer>
				</template>
				<template v-else>
					<latex-wang-editor
						id="rightAnswers"
						v-model="form.rightAnswers"
					></latex-wang-editor>
				</template>
			</el-form-item>

			<el-form-item label="题目解析" prop="analysis">
				<br />
				<latex-wang-editor
					id="analysis"
					v-model="form.analysis"
				></latex-wang-editor>
			</el-form-item>

			<el-form-item label="知识点" prop="kpIds">
				<br />
				<div class="tooltip-flex">
					<el-cascader
						class="custom-cascader"
						v-model="form.kpIds"
						placeholder="请选择知识点"
						@change="handleCascaderChange"
						clearable
						collapse-tags
						ref="cascader"
						:show-all-levels="false"
						:props="{
							multiple: true,
							checkStrictly: true,
							label: 'name',
							value: 'id',
						}"
						:options="options"
					></el-cascader>

					<el-tooltip class="tooltip" placement="top" effect="light">
						<div slot="content">
							知识点是非必要选择，但能够更好的为您的学生提供该知识点<br />的延伸和拓展，更好的掌握该内容
						</div>
						<i class="el-icon-info"></i>
					</el-tooltip>
				</div>
			</el-form-item>

			<el-form-item label="难易程度"  prop="difficulty">
				<br />
				<tabs :list="difficultys" v-model="form.difficulty"></tabs>
			</el-form-item>

			<footer-btn @confirm="submitForm()" @cancel="resetForm()"></footer-btn>
		</el-form>
	</el-dialog>
</template>

<script>
	import latexWangEditor from '@/plugins/latex-wang-editor/index';
	import footerBtn from '@/components/footer-btn';
	import tabs from '@/components/tabs';
	import { KPTree } from '@/api/question';
	import {
		questionAdd,
		questionDetail,
		questionUpdata,
	} from '@/api/empcustomer';
	import TabsAnswer from '../tabs/tabs-answer.vue';
	import { mapState } from 'vuex';
	import EventBus from '@/utils/bus';
	import injectMixins from './injectMixins';
	export default {
		mixins: [injectMixins],
		components: {
			latexWangEditor,
			tabs,
			footerBtn,
			TabsAnswer,
		},
		data() {
			return {
				options: [],
				typeList: [
					{
						label: '单选题',
						value: 1,
					},
					{
						label: '多选题',
						value: 2,
					},
					{
						label: '判断题',
						value: 4,
					},
					{
						label: '拍照题',
						value: 5,
					},
				],
				difficultys: [
					{
						label: '简单',
						value: 3,
					},
					{
						label: '中等',
						value: 2,
					},
					{
						label: '难',
						value: 1,
					},
				],
				visible: false,
				form: {
					questionType: 1,
					questionContent: '',
					resource: 3, // 题目来源 3自主答题
					options: [
						{ optionContent: '', sortIndex: 'A', rightAnswer: 0 },
						{ optionContent: '', sortIndex: 'B', rightAnswer: 0 },
						// { optionContent: '', sortIndex: 'C', rightAnswer: 0 },
						// { optionContent: '', sortIndex: 'D', rightAnswer: 0 },
					],
					analysis: '',
					kpIds: [],
					rightAnswers: '',
					difficulty: '',
				},
				rules: {
					questionContent: [
						{
							required: true,
							message: '请输入题目内容',
							trigger: ['change', 'blur'],
						},
					],
					questionType: [
						{
							required: true,
							message: '请选择题型',
							trigger: ['change', 'blur'],
						},
					],
					// kpIds: [
					// 	{
					// 		required: true,
					// 		message: '请选择知识点',
					// 		trigger: ['change', 'blur'],
					// 	},
					// ],
					rightAnswers: [
						{
							required: true,
							message: '请选择正确答案选项',
							trigger: ['change', 'blur'],
						},
						{ validator: this.validAnswers, trigger: ['change', 'blur'] },
					],
					difficulty: [
						{
							required: true,
							message: '请选择题目难易程度',
							trigger: ['change', 'blur'],
						},
					],
				},
			};
		},
		computed: {
			...mapState({
				user: (state) => state.user,
			}),
			// 选择正确答案数组
			optionAnswers: {
				get() {
					return this.form.options.map(
						({ sortIndex: label, rightAnswer: value }) => ({ label, value })
					);
				},
				set(array) {
					this.form.options = this.form.options.map((v, i) => {
						v.rightAnswer = array.length > 0 ? array[i].value : 0;
						return v;
					});
				},
			},
			// 选项答案
			optionsRightAnswer() {
				// 过滤选项值为0的选项 转成label数组 用逗号分割
				return this.optionAnswers
					.filter((v) => v.value)
					.map((v) => v.label)
					.join(',');
			},
			questionType() {
				return this.form.questionType;
			},
		},
		watch: {
			// 选项正确答案
			optionsRightAnswer(n, o) {
				this.form.rightAnswers = n;
			},
			questionType(n, o) {
				if (n === o) {
					return;
				}
				if ([1, 2].includes(n)) {
					this.form.options = [
						{ optionContent: '', sortIndex: 'A', rightAnswer: 0 },
						{ optionContent: '', sortIndex: 'B', rightAnswer: 0 },
						// { optionContent: '', sortIndex: 'C', rightAnswer: 0 },
						// { optionContent: '', sortIndex: 'D', rightAnswer: 0 },
					];
				} else if ([4].includes(n)) {
					this.form.options = [
						{ optionContent: '', sortIndex: 'A', rightAnswer: 0 },
						{ optionContent: '', sortIndex: 'B', rightAnswer: 0 },
					];
				} else if ([5].includes(n)) {
					this.form.options = [];
				}
			},
		},

		methods: {
			// 大于等于最少
			validAnswers(rule, value, callback) {
				if (this.form.type === 2 && this.optionsRightAnswer.length <= 1) {
					callback(new Error('多选题最少选择两个选项为正确答案'));
				}
				callback();
			},
			// 选中知识点的值发生变化
			handleCascaderChange(row) {
				this.form.kps = this.$refs.cascader
					.getCheckedNodes()
					.map((v) => v.data);
			},
			// 获取知识点
			async getPoint() {
				const { grade, chapterId, course:subject, bookId } = this;
				let result = await KPTree({ grade, chapterId, subject, bookId });
				const { data } = result;
				this.options = data.map((v) => {
					if (v.children.length === 0) {
						Reflect.deleteProperty(v, 'children');
					}
					return v;
				});
			},
			// 把知识点数据格式转换
			formatOptions(points) {
				return points.map(({ children, name: label, id: value }) => {
					const temp = { label, value };
					children.length &&
						(temp.children = [...this.formatOptions(children)]);
					return temp;
				});
			},
			// 重置data区
			resetForm() {
				Object.assign(this.$data, this.$options.data());
				this.$nextTick(() => {
					this.$refs.form.clearValidate();
				});
			},
			// 获取自主答题详情
			async getDetail(id) {
				let { data } = await questionDetail(id);
				data.kpIds = JSON.parse(data.kpIds) || [];
				this.form = data;
				this.getPoint();
				this.$nextTick(() => {
					this.$refs.form.clearValidate();
				});
			},
			confirm() {
				return new Promise((resolve, reject) => {
					this.$confirm(`是否添加到我的题库？`, {
						customClass: 'custom-message-box',
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						showClose: false,
						center: true,
						cancelButtonClass: 'plain-btn',
						confirmButtonClass: 'primary-btn',
					})
						.then(() => {
							// 标记题目来源
							resolve(true);
						})
						.catch(() => {
							resolve(false);
						});
				});
			},
			// 提交保存题目
			async submitForm() {
				// 进行表单校验
				this.$refs.form.validate(async (valid) => {
					// 1.校验通过
					if (valid) {
						let { id } = this.form;

						// 如果ID存在说明当前是修改
						let result = null;
						let text = '保存成功';
						const kpIds = JSON.stringify(this.form.kpIds);

						if (!id) {
							// 是否添加到我的题库
							const flag = await this.confirm();
							console.log('flag: ', flag);
							const { uid } = this.user.data || {};
							// 当前用户的userId
							this.form.creator = uid;
							this.form.course = this.course;
							this.form.grade = this.grade;
							this.form.chapterId = this.chapterId;
							this.form.bookId = this.bookId;
							result = await questionAdd({
								...this.form,
								kpIds,
								resource: flag ? 2 : 3,
							});
						} else {
							result = await questionUpdata({ ...this.form, kpIds });
							text = '修改成功';
						}

						this.$message({
							message: text,
							type: 'success',
						});

						// 如果在试卷中 试卷没有编辑 只有新增
						if (this.isPaper && !id) {
							this.$emit('addCustomTopic', { ...this.form,id:result.data.id, kpIds });
							this.resetForm();
							return;
						}

						// 如果是新增的情况下，把id填入form中
						if (!id) {
							this.form.id = result.data.id;
							this.form.resource = 3;
							EventBus.$emit(
								'addCustomTopic',
								{ ...this.form, kpIds },
								this.type
							);
							this.resetForm();
							return;
						}
						// 更新
						EventBus.$emit('editCustomTopic', this.form, this.type);
						this.resetForm();
					} else {
						console.log('校验失败');
					}
				});
			},
			// 处理关闭弹窗
			handleClose() {
				this.resetForm();
			},
			// 需要传输一个打开弹窗的类型 以及活动类型

			async open(resource, type, id) {
				this.resource = resource;
				this.type = type;
				this.visible = true;

				if (id) {
					this.getDetail(id);
				} else {
					this.getPoint();
				}
			},
			// 新增在线投票选项
			addOptions() {
				if (this.form.options.length < 16) {
					const sortIndex = String.fromCharCode(this.form.options.length + 65);
					this.form.options.push({
						optionContent: '',
						sortIndex,
						rightAnswer: 0,
					});
				}
			},
			// 处理删除选项
			handleDeleteOptions(index) {
				this.$confirm(`确定删除当前选项吗？`, {
					customClass: 'custom-message-box',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					showClose: false,
					center: true,
					cancelButtonClass: 'plain-btn',
					confirmButtonClass: 'plain-btn',
				}).then(() => {
					const options = this.form.options;
					options.splice(index, 1);
					options.map((v, i) => {
						v.sortIndex = String.fromCharCode(i + 65);
						return v;
					});
					this.form.options = options;
				});
			},
		},
	};
</script>

<style lang="less" scoped>
	@import url('~@/assets/css/activeDialog.less');

	.custom-cascader {
		/deep/.el-input__inner {
			height: auto !important;
			line-height: auto !important;
		}
	}
	.tooltip-flex {
		display: flex;
		align-items: center;
	}
	.tooltip {
		margin-left: 12px;
		font-size: 20px;
	}

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
