<!-- 
      name:在线抢答 弹窗
      author:覃祯
      date:2021年11月4日 15点05分
   -->
<template>
	<div>
		<el-dialog
			width="690px"
			title="在线抢答"
			:visible.sync="visible"
			:close-on-click-modal="false"
			append-to-body
			@close="handleClose()"
			class="teaching-popup"
		>
			<el-form :model="form" :rules="rules" ref="form">
				<el-form-item label="活动名称" prop="activityName">
					<el-input v-model="form.activityName"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark"></el-input>
				</el-form-item>

				<el-form-item label="添加题目" prop="questions">
					<br />
					<!-- v-if="isShowPushTopic" -->
					<template v-if="isShowPushTopic">
						<div class="modes">
							<div
								class="mode"
								v-for="(mode, idx) in modes"
								@click="handleAddTopic(mode)"
								:key="idx"
							>
								{{ mode.text }}
							</div>
						</div>
					</template>

					<template v-if="form.questions.length > 0">
						<div class="mode-title">已添加题目</div>
						<div class="question" v-for="item in form.questions" :key="item.id">
							<div class="question__type">
								【{{ item.questionType | type }}】
							</div>
							<div
								class="question__topic mt-14"
								v-html="item.questionContent"
							></div>
							<div class="question__options">
								<div
									class="question__option mt-14"
									v-for="(option, index) in item.options"
									:key="index"
								>
									<span>{{ option.sortIndex }}、</span>
									<span v-html="option.optionContent"></span>
								</div>
							</div>
							<div class="question__actions">
								<div class="flex">
									<el-button type="primary" @click="handleLookAnalysis(item)">{{
										item.show ? '收起解析' : '查看解析'
									}}</el-button>
									<el-button
										type="success"
										class="ml-16"
										@click="handleEditTopic(item)"
										>编辑</el-button
									>
								</div>
								<el-button type="danger" @click="handleDeleteTopic(item)"
									>删除</el-button
								>
							</div>
							<el-collapse-transition>
								<div class="question__analysis" v-show="item.show">
									<div class="question__analysis__item">
										<div class="question__analysis__item__label">
											正确答案：
										</div>
										<div
											class="question__analysis__item__text"
											v-html="item.rightAnswers || '无'"
										></div>
									</div>
									<div class="question__analysis__item">
										<div class="question__analysis__item__label">
											本题解析：
										</div>
										<div
											class="question__analysis__item__text"
											v-html="item.analysis || '无'"
										></div>
									</div>
									<div class="question__analysis__item">
										<div class="question__analysis__item__label">知识点：</div>
										<div class="question__analysis__item__text">
											{{ kps(item.kps)}}
										</div>
									</div>
								</div>
							</el-collapse-transition>
						</div>
					</template>
				</el-form-item>

				<footer-btn
					style="margin-top: 40px"
					@confirm="submitForm('form')"
					@cancel="resetForm('form')"
				></footer-btn>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import activityDialogMixin from './activityDialogMixin';
	import topicMixin from './topicMixin';

	export default {
		mixins: [activityDialogMixin, topicMixin],
		data() {
			return {
				form: {
					activityName: '',
					remark: '',
					activityType: 4,
					createdBy: '',
					questions: [],
				},
			};
		},
		computed: {
			// 是否显示添加题目
			isShowPushTopic() {
				return !this.form.questions.length > 0;
			},
			kps(){
				return (kps)=>{
					if(kps instanceof Array){
						return kps.map(v=>v.name).join(';')
					}
					return '无'
				}
			},
		},
	};
</script>

<style lang="less" scoped>
	@import url('~@/assets/css/activeDialog.less');

	.mt-14 {
		margin-top: 14px;
	}
	.flex {
		display: flex;
		align-items: center;
	}

	.question {
		background-color: #f2f2f2;
		padding: 14px 16px;
		margin-top: 15px;
		border-radius: 2px;
		&__type,
		&__topic,
		&__option {
			font-size: 14px;
			color: #424242;
			line-height: 20px;
		}

		/deep/.el-button--primary,
		/deep/.el-button--success {
			width: 124px;
			height: 36px;
			border-radius: 4px;
		}

		&__options {
		}
		&__option {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
		}
		&__actions {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 30px;
		}
		// 解析
		&__analysis {
			background-color: #fff;
			margin-top: 16px;
			padding: 14px;
			padding-top: 1px;
			&__item {
				margin-top: 14px;
				display: flex;
				&__label {
					width: 70px;
					font-size: 14px;
					line-height: 21px;
					color: #424242;
					font-weight: bold;
					font-family: Microsoft YaHei;
					text-align: right;
				}
				&__text {
					font-size: 14px;
					color: #424242;
					line-height: 21px;
					font-family: Microsoft YaHei;
				}
			}
		}
	}
	.ml-16 {
		margin-left: 16px;
	}
	.mode-title {
		font-size: 14px;
		color: #333;
		font-weight: bold;
		font-family: Microsoft YaHei;
		line-height: 19px;
		padding: 12px 15px;
		background-color: #f2f2f2;
	}
	.modes {
		display: flex;
		align-items: center;

		border-radius: 2px;
		background-color: #f2f2f2;
		width: 278px;
		.mode {
			font-size: 14px;
			line-height: 19px;
			padding: 10px;
			flex: 1;
			text-align: center;
			background-color: transparent;
			cursor: pointer;
			border: none;
			color: #2196f3;
			&:nth-child(n + 2) {
				position: relative;
				&::before {
					content: '';
					position: absolute;
					left: 0;
					top: 10px;
					bottom: 10px;
					height: calc(100% - 20px);
					width: 1px;
					background-color: #e6e6e6;
				}
			}
		}
	}
</style>
