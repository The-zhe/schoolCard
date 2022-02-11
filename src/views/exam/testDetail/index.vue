<template>
	<div class="testDetail">
		<div class="exam">
			<div class="header">
				<div class="header_title">
					<div class="title">{{ testPaperName }}</div>
					<div class="msg">
						<div class="name" @click="editName">编辑名字</div>
						<div class="totalScore">
							总分：<el-input :disabled="true" :value="totalScore"></el-input>
						</div>
					</div>
				</div>
				<div class="btn">
					<el-button
						type="text"
						style="background: rgba(254, 189, 43, 1); color: white"
						@click="checkTest()"
						>增题</el-button
					>
					<!-- <el-button
						type="text"
						style="background: rgba(133, 186, 68, 1); color: white"
						@click="download()"
						>下载</el-button
					> -->
					<el-button
						v-if="examId"
						type="text"
						style="background: rgba(236, 86, 86, 1); color: white"
						@click="deleteTest()"
						>删除</el-button
					>
					<el-button
						type="text"
						style="background: rgba(33, 150, 243, 1); color: white"
						@click="submit()"
						>保存</el-button
					>
				</div>
			</div>
			<div class="main">
				<div
					class="question"
					v-for="(item, index) in questionList"
					:key="index"
				>
					<div class="question_main">
						<div class="title">
							<div>{{ index + 1 }}.</div>
							<div v-html="item.questionContent"></div>
						</div>
						<div
							class="options"
							v-for="(option, index) in item.optionList"
							:key="index"
						>
							<div>{{ option.sortIndex }}.</div>
							<div v-html="option.optionContent"></div>
						</div>
					</div>
					<div class="score">
						分值：<el-input
							v-model="item.score"
							oninput="value=value.replace(/[^0-9.]/g,'')"
						></el-input>
					</div>
					<div class="operation">
						<el-button
							type="text"
							class="action-btn"
							style="background: rgba(33, 150, 243, 1)"
							@click="showParse(item)"
							>{{ item.isParse ? '收回解析' : '查看解析' }}</el-button
						>
						<el-button
							type="text"
							class="action-btn"
							style="background: rgba(236, 86, 86, 1)"
							icon="el-icon-delete"
							@click="deleteQuestion(item, index)"
							>删除此题</el-button
						>

						<el-button
							class="el-icon-top move-btn"
							@click="indexAdd(index)"
							v-if="index != 0"
							>上移</el-button
						>
						<el-button
							class="el-icon-bottom move-btn"
							@click="indexReduce(index)"
							v-if="index != questionList.length - 1"
							>下移</el-button
						>
					</div>
					<div class="parse" v-if="item.isParse">
						<div class="parse_main">
							<span>正确答案：</span>{{ item.rightAnswers }}
						</div>
						<!-- <div class="parse_main"><span>评分标准：</span>答错不得分</div> -->
						<div class="parse_main">
							<span>答案解析：</span>
							<div style="display: contents" v-html="item.analysis"></div>
						</div>
						<div class="parse_main">
							<span>难易程度：</span>
							<div>{{ [, '难', '中等', '简单'][item.difficulty] || '' }}</div>
						</div>
						<div class="parse_main"><span>知识考点：</span>{{ item.name }}</div>
					</div>
				</div>
			</div>
		</div>

		<el-dialog
			title="添加题目"
			:visible.sync="visible"
			width="710px"
			class="add-dialog"
		>
			<div class="modes">
				<div
					class="mode"
					v-for="(mode, idx) in modes"
					:key="idx"
					@click="handleAddTopic(mode)"
				>
					{{ mode.text }}
				</div>
			</div>
		</el-dialog>

		<!-- 从题库中选择 -->f
		<select-topic-dialog
			:course="courseType"
			:isPaper="true"
			ref="selectTopic"
			@selectedTopicSuccesss="selectedTopicSuccesss"
		></select-topic-dialog>
		<!-- 自主答题 -->
		<custom-dialog
			:isPaper="true"
			@addCustomTopic="addCustomTopic"
			:course="courseType"
			ref="customTopic"
		></custom-dialog>

		<EditName ref="editName" v-if="isName" @getName="nameGet"></EditName>
	</div>
</template>
<script>
	import EditName from './edit_name.vue';
	import { mapState } from 'vuex';
	import { testDetail, removeTest, addOrSaveTest } from '@/api/exam';
	import { testPaperDownload } from '@/axios/download';
	import selectTopicDialog from '@/components/teachActivity/selectTopicDialog';
	import customDialog from '@/components/teachActivity/customDialog';
	export default {
		name: 'testDetail',
		components: {
			EditName,
			selectTopicDialog,
			customDialog,
		},

		data() {
			return {
				visible: false,
				course:this.$route.query.subject,
				modes: [
					{
						resource: 1,
						text: '系统题库',
					},

					{
						resource: 3,
						text: '自主添加',
					},
					{
						resource: 2,
						text: '我的题库',
					},
				],
				examId: this.$route.query.id, // 试卷ID
				testType: this.$route.query.type, // 试卷类型
				testPaperName: this.$route.query.name, // 试卷名称
				courseType: this.$route.query.subject, // 科目
				isName: false,
				isCheck: false,
				isAdd: false,
				isScore: false,
				templateContent: [],
				kpsProps: {
					value: 'id',
					label: 'name',
					children: 'children',
				},
				questionList: [],
				sort: null,
				addQuestionList: [],
				dataFrom: {
					list: [],
					testPaper: {
						courseType: null,
						createBy: null,
						grade: null,
						id: null,
						regionCode: null,
						teachBookType: null,
						termType: null,
						testPaperName: null,
						testPaperSource: null,
						testPaperType: null,
						year: null,
						updateTime: null,
						createTime: null,
					},
				},
			};
		},
		provide() {
			return {
				app:this,
			};
		},
		computed: {
			...mapState({
				user: (state) => state.user,
			}),
			totalScore() {
				return this.questionList.reduce((acc, cur) => {
					acc += Number(cur.score) || 0;
					return acc;
				}, 0);
			},
		},
		
		methods: {
			// 获取试卷内容
			async getTestList() {
				try {
					const {
						data: { questionRes, testPaperName },
					} = await testDetail(this.examId);
					this.dataFrom.testPaper.id = this.examId;
					this.testPaperName = testPaperName;
					// 题目列表
					this.questionList = questionRes.map((v) => {
						v.isParse = false;
						return v;
					});
				} catch (e) {}
			},
			// 自主添加题目
			addCustomTopic(question) {
				question.isParse = false;
				question.questionId = question.id;
				question.optionList = question.options;
				this.questionList.push(question);
				this.visible = false;
			},
			// 从题库中选择
			selectedTopicSuccesss(multipleSelection = [], resource) {
				// 1.对相同来源进行标记
				const questions =
					this.questionList.map((v) => {
						v.flag = v.resource === resource;
						return v;
					}) || [];

				// 2.把选中的内容追加到尾部
				const selection = multipleSelection.map((v) => {
					v.isParse = false;
					v.questionId = v.id;
					if (!v.optionList) {
						v.optionList = v.options;
					}
					return v;
				});
				questions.push(...selection);
				// 3.一个id对象
				const idObj = {};
				// 4.把不重复的数据插入数组中 重复的数据flag设置为false  过滤flag为true的数据
				this.questionList = questions
					.reduce((acc, cur) => {
						const { id } = cur;
						if (idObj.hasOwnProperty(id)) {
							const idx = acc.findIndex((v) => v.id === id);
							acc[idx].flag = false;
							return acc;
						}
						idObj[id] = true;
						acc.push(cur);
						return acc;
					}, [])
					.filter((v) => !v.flag);
				this.visible = false;
			},
			// 点击增加题目
			handleAddTopic({ resource }) {
				const questions =
					this.questionList.filter((v) => v.resource === resource) || [];
				if ([1, 2].includes(resource)) {
					this.$refs.selectTopic.open(resource, null, questions);
					return;
				}
				this.$refs.customTopic.open(resource);
			},
			nameGet(value) {
				this.testPaperName = value;
			},

			async addQuestion(from) {
				try {
					const { data } = await addOrSaveTest(from);
					this.$message({
						message: '保存成功',
						type: 'success',
					});
					// 保存成功后，返回上一页
					this.$router.go(-1);
				} catch (e) {}
			},
			async download() {
				testPaperDownload(this.examId, this.testPaperName);
			},
			// 删除试卷ID
			async deleteTestById(id) {
				try {
					const { data } = await removeTest(id);
				} catch (e) {}
			},
			deleteTest() {
				this.$confirm('此操作将会删除该试卷，是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'info',
				})
					.then(() => {
						this.deleteTestById(this.examId);
						this.$message({
							type: 'success',
							message: '删除成功!',
						});
						this.$router.push('/exam/examItem');
					})
					.catch((e) => {});
			},
			deleteQuestion(item, index) {
				this.questionList.splice(index, 1);
				this.questionList.forEach((item, index) => {
					this.questionList[index].sort = index + 1;
				});
			},
			editName() {
				this.isName = true;
				this.$nextTick(() => {
					this.$refs.editName.init();
				});
			},
			showParse(item) {
				this.questionList = this.questionList.map((v) => {
					if (v.questionId === item.questionId) {
						v.isParse = !v.isParse;
					}
					return v;
				});
			},
			checkTest() {
				this.visible = true;
			},
			indexAdd(index) {
				if (index != 0) {
					this.templateContent = this.questionList[index - 1]; // 获取目标上一个数据
					this.$set(this.questionList, index - 1, this.questionList[index]); //修改索引
					this.questionList[index].sort = this.questionList[index].sort - 1;
					this.templateContent.sort = this.templateContent.sort + 1;
					this.$set(this.questionList, index, this.templateContent);
				}
			},
			indexReduce(index) {
				if (index != this.questionList.length - 1) {
					this.templateContent = this.questionList[index + 1]; // 获取目标下一个数据
					this.$set(this.questionList, index + 1, this.questionList[index]); //修改索引
					this.questionList[index].sort = this.questionList[index].sort + 1;
					this.templateContent.sort = this.templateContent.sort - 1;
					this.$set(this.questionList, index, this.templateContent);
				}
			},
			submit() {
				let total = 0;
				if (this.questionList.length == 0) {
					this.$message({
						message: '无法保存空试卷，请添加题目',
						type: 'info',
					});
				} else {
					this.questionList.forEach((item, index) => {
						this.$set(item, 'sort', index + 1);
						this.$set(item, 'testPaperId', this.examId);
						this.$set(item, 'score', item.score);
						this.$set(item, 'paperRightAnswers', item.rightAnswers);
						item.paperQuestionOptions = '';
						0;
						item.optionList.forEach((option, index) => {
							item.paperQuestionOptions += option.sortIndex;
						});
						if (!isNaN(item.score) && item.score != '' && item.score != null) {
							total += Number(item.score || 0);
						} else {
							this.isScore = true;
						}
					});

					if (this.isScore) {
						this.$message({
							message: '请输入分值',
							type: 'info',
						});
						this.isScore = false;
					} else {
						this.dataFrom.testPaper.createBy = this.user.data.uid;
						this.dataFrom.testPaper.testPaperName = this.testPaperName;
						this.dataFrom.testPaper.courseType = Number(this.courseType);
						this.dataFrom.list = this.questionList;
						this.addQuestion(this.dataFrom);
					}
				}
			},
		},
		mounted() {
			if (this.examId) {
				this.getTestList();
			}
		},
	};
</script>
<style lang="less" scoped>
	.action-btn {
		color: white;
		height: 31px;
		width: 86px;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 6px 15px;
	}
	.move-btn {
		width: 60px;
		height: 31px;
		display: flex;
		font-size: 12px;
		align-items: center;
		justify-content: center;
	}
	/deep/.el-input__inner {
		text-align: center;
	}
	.add-dialog {
		/deep/.el-dialog__header {
			padding: 30px 60px;
		}
		/deep/.el-dialog__body {
			padding: 60px;
		}
		/deep/.el-dialog__title {
			font-size: 24px;
			font-weight: bold;
			font-family: Microsoft YaHei;
			line-height: 21px;
		}
		/deep/.el-dialog__headerbtn {
			right: 30px;
			top: 30px;

			.el-dialog__close {
				color: black;
				font-size: 24px;
				font-weight: bold;
			}
		}
	}
	.modes {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.mode {
			width: 156px;
			height: 54px;
			line-height: 54px;
			text-align: center;
			border-radius: 4px;
			background-color: #2196f3;
			color: #fff;
			font-size: 18px;
		}
	}
	.testDetail {
		.exam {
			margin: 50px auto;
			min-height: 1000px;
			width: 1080px;
			.header {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-bottom: 20px;
				.header_title {
					.title {
						font-size: 24px;
						color: #333333;
					}
					.msg {
						display: flex;
						flex-direction: row;
						margin-top: 10px;
						.name {
							font-size: 16px;
							color: #2196f3;
							margin-right: 20px;
							cursor: pointer;
						}
						.totalScore {
							display: flex;
							flex-direction: row;
							font-size: 16px;
							color: #febd2b;
							/deep/.el-input {
								width: auto;
							}
							/deep/.el-input__inner {
								padding: 5px;
								width: 50px;
								height: 20px !important;
							}
						}
					}
				}
			}
			.main {
				display: flex;
				flex-direction: column;
				height: 100%;
				background-color: white;
				padding: 50px;
				overflow: auto;
				overflow-y: overlay;
				.question {
					display: flex;
					flex-direction: column;
					margin-bottom: 20px;
					.question_main {
						display: flex;
						flex-direction: column;
						.title {
							display: flex;
							flex-direction: row;
							margin: 5px;
							line-height: 30px;
							font-size: 20px;
							color: #333333;
						}
						.options {
							display: flex;
							flex-direction: row;
							align-items: center;
							font-size: 18px;
							color: #333333;
							margin: 10px 5px 5px 5px;
						}
					}
					.score {
						display: flex;
						flex-direction: row;
						font-size: 16px;
						color: #febd2b;
						margin: 20px 5px 5px 5px;
						/deep/.el-input {
							width: auto;
						}
						/deep/.el-input__inner {
							padding: 5px;
							width: 50px;
							height: 20px !important;
						}
					}
					.operation {
						display: flex;
						flex-direction: row;
						align-items: center;
						margin-top: 20px;
						.text {
							font-size: 16px;
							color: #757575;
							margin: 0px 5px;
							cursor: pointer;
						}
					}
					.parse {
						display: flex;
						flex-direction: column;
						margin: 5px;
						padding: 20px;
						border: 1px solid #bbbbbb;
						border-radius: 4px;
						.parse_main {
							display: flex;
							flex-direction: row;
							font-size: 18px;
							color: #757575;
							// align-items: center;
							margin: 5px;
							span {
								white-space: nowrap;
								font-size: 18px;
								color: rgba(51, 51, 51, 1);
							}
						}
					}
				}
			}
		}
	}
</style>
