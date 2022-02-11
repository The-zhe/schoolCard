<template>
	<div>
		<tool-bar :title="`${type == 'edit' ? '编辑' : '创建'}课堂教学方案`">
			<el-button class="cp-save" type="primary" @click="submit">保存</el-button>
		</tool-bar>

		<div class="main-wrapper">
			<dataHeader
				:gradeValue="grade"
				:courseValue="course"
				:chapterIdValue="chapterAll"
				:bookIdValue="bookId"
				@change="checkChange"
			/>

			<div class="cp-content">
				<el-tabs value="basics">
					<el-tab-pane label="基本信息" name="basics">
						<basics ref="basics"></basics>
					</el-tab-pane>
					<el-tab-pane label="教学目标及重难点" name="target">
						<target ref="target"></target>
					</el-tab-pane>
					<el-tab-pane label="教学流程" name="flow">
						<flow
							ref="flow"
							:grade="grade"
							:bookId="bookId"
							:chapterId="chapterId"
							:course="course"
							:uuid="uuid"
						></flow>
					</el-tab-pane>
					<el-tab-pane label="板书" name="Skateboard">
						<skateboard
							ref="skateboard"
							v-model="blackboardWriting"
						></skateboard>
					</el-tab-pane>
					<el-tab-pane label="课后作业" name="Homework">
						<home-work ref="homework" v-model="homeworkDescribe"></home-work>
					</el-tab-pane>
				</el-tabs>
				<div class="cp-look">
					<i class="el-icon-view"></i>
					查看课程
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import basics from './components/basics';
	import target from './components/target';
	import flow from './components/flow';
	import homeWork from './components/home-work.vue';
	import skateboard from './components/skateboard';
	import ToolBar from '@/components/navigation/toolBar.vue';
	import API from '@/api/lesson';
	import { mapState } from 'vuex';
	import { mould } from '@/configs/file';
	import dataHeader from '@/components/teachActivity/dataHeader';
	export default {
		data() {
			return {
				type: '',
				uuid: '',
				grade: '',
				course: '',
				clazz: '',
				bookId: '',
				chapterId: '',
				homeworkDescribe: '',
				blackboardWriting: '',
				chapterAll: [],
			};
		},
		computed: {
			...mapState({
				user: (state) => state.user,
				classList: (state) => state.user.classList,
			}),
		},
		async created() {
			const {
				type = 'add',
				uuid = '',
				grade = '',
				course = '',
				bookId = '',
				chapterId = '',
				chapterAll = '',
			} = this.$route.query;
			this.type = type;
			this.uuid = uuid;
			this.grade = grade;
			this.course = course * 1;
			this.bookId = bookId * 1;
			this.chapterId = chapterId * 1;
			this.chapterAll = chapterAll == 'undefined' ? [] : chapterAll.split(',');

			this.$store.dispatch('getTeacherByUser');

			if (type == 'add') {
				this.grade = sessionStorage.getItem('plan-grade') || '';
				this.course = sessionStorage.getItem('plan-course') * 1 || '';
				this.bookId = sessionStorage.getItem('plan-bookId') * 1 || '';
				this.chapterId = sessionStorage.getItem('plan-chapterId') * 1 || '';
				this.chapterAll = sessionStorage.getItem('plan-chapterAll')
					? sessionStorage
							.getItem('plan-chapterAll')
							.split(',')
							.map((item) => item * 1)
					: [];
				await this.getTeachPlanUuid();
			}
			this.chapterAll = this.chapterAll.map((item) => item * 1);
			this.getTeachFodder();
			if (this.type != 'add' && this.uuid) {
				this.getInfo();
			}
		},
		methods: {
			async getTeachPlanUuid() {
				const { data } = await API.getTeachPlanUuid();
				this.uuid = data;
			},
			checkChange(res) {
				this.grade = res.grade;
				this.course = res.course;
				this.bookId = res.bookId;
				this.chapterId = res.chapter;
				this.chapterAll = res.chapterAll || [];
				if (this.type == 'add') {
					sessionStorage.setItem('plan-grade', this.grade);
					sessionStorage.setItem('plan-course', this.course);
					sessionStorage.setItem('plan-bookId', this.bookId);
					sessionStorage.setItem('plan-chapterId', this.chapterId);
					sessionStorage.setItem('plan-chapterAll', this.chapterAll.join(','));
				}

				this.getTeachFodder();
			},
			getTeachFodder() {
				this.$nextTick(() => {
					this.$refs.flow.changePage(true);
				});
			},
			async getInfo() {
				try {
					const { data } = await API.teachPlanInfo(this.uuid);

					const {
						teachPlanName,
						remark,
						imgUrl,
						keyAndPoints,
						teachPlanAims,
						blackboardWriting,
						homeworkDescribe,
						teachStepInfoBeforeClass,
						teachStepInfoInClass,
						teachStepInfoAfterClass,
					} = data;

					this.blackboardWriting = blackboardWriting;
					this.homeworkDescribe = homeworkDescribe;

					// FIXME 这里之后可能会考虑 使用provide来替换

					this.$refs.basics.setData({
						teachPlanName,
						remark,
						imgUrl,
					});
					this.$refs.target.setData({
						keyAndPoints,
						teachPlanAims,
					});
					const list1 = this.buildStep(teachStepInfoBeforeClass);
					const list2 = this.buildStep(teachStepInfoInClass);
					const list3 = this.buildStep(teachStepInfoAfterClass);
					
					const flow = this.$refs.flow;
					flow.resources[1].list = list1;
					flow.resources[2].list = list2;
					flow.resources[3].list = list3;
				} catch (e) {
					console.log(e);
				}
			},
			buildStep(array) {
				const result = [];
				if (!array) {
					return result;
				}
				array.forEach((res) => {
					const { teach2FodderInfoRes, ...obj } = res;
					const teach2FodderAddReqs = [];

					teach2FodderInfoRes.forEach((item) => {
						const {
							fodderUrl,
							teachFodderName,
							activityName,
							fodderSource,
							fodderType,
							teachFodderUuid,
							activityUuid,
							activityType,
							designIntent,
						} = item;

						const fodderName = teachFodderName || activityName;
						const uuid = teachFodderUuid || activityUuid;
						let data = {
							fodderName,
							fodderSource,
							fodderType,
							uuid,
							designIntent,
						};

						//教学素材
						if (fodderSource == 1) {
							data.fodderUrl = fodderUrl;
						} else if (fodderSource == 2) {
							//教学活动
							data.activityType = activityType;
						}
						teach2FodderAddReqs.push(data);
					});
					obj.teach2FodderAddReqs = teach2FodderAddReqs;
					result.push(obj);
				});

				return result;
			},

			async submit() {
				if (!this.grade) {
					return this.$message({
						message: '请选择年级',
						type: 'warning',
					});
				}
				if (!this.course) {
					return this.$message({
						message: '请选择科目',
						type: 'warning',
					});
				}
				if (!this.bookId) {
					return this.$message({
						message: '请选择教材',
						type: 'warning',
					});
				}
				if (!this.chapterId) {
					return this.$message({
						message: '请选择章节',
						type: 'warning',
					});
				}

				try {
					const basics = await this.$refs.basics.validata();
					const target = await this.$refs.target.validata();
					const teach2StepAddReqList = await this.$refs.flow.validata();
					const params = {
						chapterIdList: this.chapterAll.join(','),
						chapterId: this.chapterId,
						grade: this.grade,
						course: this.course,
						teachBookId: this.bookId,
						blackboardWriting: this.blackboardWriting,
						homeworkDescribe: this.homeworkDescribe,
						...basics,
						...target,
						teach2StepAddReqList,
					};

					if (this.type == 'add') {
						params.createdBy = this.user.data.uid;
						params.teachPlanUuid = this.uuid;
						await API.teachPlanAdd(params);
					} else {
						params.updatedBy = this.user.data.uid;
						params.uuid = this.uuid;
						await API.teachPlanUpdate(params);
					}

					this.$message({
						message: `${this.type == 'add' ? '新增' : '编辑'}成功`,
						type: 'success',
					});
					setTimeout(() => {
						this.$router.push('/lessonPreparation/planManagement');
					}, 1500);
				} catch (e) {
					console.log(e);
					if (e && e.msg) {
						this.$message({
							message: e.msg,
							type: 'warning',
						});
					}
				}
			},
		},
		components: {
			basics,
			target,
			flow,
			ToolBar,
			dataHeader,
			homeWork,
			skateboard,
		},
	};
</script>

<style lang="less" scoped>
	.main-wrapper {
		margin-top: 94px !important;
	}
	/deep/.ql-container {
		height: 200px;
	}
	/deep/ .edit-label-title {
		margin: 20px 0 15px 0;
		display: flex;
		align-items: center;
		height: 20px;

		.require {
			color: red;
			font-size: 18px;
			padding-top: 3px;
			margin-left: 5px;
		}
	}
	/deep/ .mould-input {
		display: block;
		width: 100%;
		line-height: 40px;
		padding: 0 20px;
		height: 40px;
		border: 1px solid #e0e0e0;
	}
	.cp-content {
		margin-top: 15px;
		background-color: #fff;
		padding: 20px 30px;
		position: relative;

		.cp-look {
			position: absolute;
			right: 30px;
			top: 32px;
			display: flex;
			align-items: center;
			color: #2196f3;
			cursor: pointer;

			i {
				font-size: 16px;
				margin-right: 5px;
			}
		}
	}
	.cp-header {
		height: 80px;
		display: flex;
		background-color: #fff;
		align-items: center;
		padding: 0 20px;
		position: relative;
		justify-content: space-between;

		.cp-save {
			position: absolute;
			right: 20px;
			top: 50%;
			transform: translateY(-50%);
		}

		.select-wrap {
			display: flex;
			align-items: center;
			margin-left: 10px;
			&:first-child {
				margin-left: 0;
			}

			.el-select {
				width: 145px;
				margin-left: 10px;
			}
		}
	}
</style>
