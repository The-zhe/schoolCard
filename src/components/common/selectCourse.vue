<template>
	<div class="selectCourse">
		<div class="top_now_check">
			<div class="top_now_check_title">当前课程:</div>
			<div class="top_now_check_tag">
				<template v-for="x in checkTagDate.tagArrayObj">
					<el-tag
						:key="y.type + index"
						v-for="(y, index) in x"
						closable
						@close="closeTag(y)"
						type="info"
						>{{ y.name }}</el-tag
					>
				</template>
				<el-tag
					type="info"
					v-show="
						!checkTagDate.tagArrayObj.grade.length &&
						!checkTagDate.tagArrayObj.semester.length &&
						!checkTagDate.tagArrayObj.subject.length
					"
					>全部</el-tag
				>
			</div>
		</div>
		<div class="plan_check_box">
			<div :key="index" v-for="(x, index) in data" class="box_row">
				<div class="box_row_title">
					{{
						index === 'grade' ? '年级' : index === 'semester' ? '学期' : '科目'
					}}:
				</div>
				<div
					@click="y.isable = !y.isable"
					:key="index"
					v-for="(y, index) in x"
					:class="
						!y.isable
							? ['box_row_connect']
							: ['box_row_connect', 'box_row_connect_isAction']
					"
				>
					{{ y.name }}
				</div>
				<div v-if="!x.length" style="cursor: auto" class="box_row_connect">
					暂无
				</div>
			</div>
		</div>
		<div class="plan_chapter">
			<div class="chapter">
				章节:
				<div
					@click="capterChange(x)"
					:class="
						!x.isable
							? ['box_row_connect']
							: ['box_row_connect', 'box_row_connect_isAction']
					"
					:key="index"
					v-for="(x, index) in capter"
				>
					{{ x.name }}
				</div>
			</div>
			<div class="chapter">
				小节:
				<div
					@click="changeSmallChapter(x)"
					:class="
						!x.isable
							? ['box_row_connect']
							: ['box_row_connect', 'box_row_connect_isAction']
					"
					:key="index"
					v-for="(x, index) in smallCapterList"
				>
					{{ x.name }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Api from '@/api/lesson';
	export default {
		components: {},
		props: {
			data: {
				type: Object,
			},
			capter: {
				type: Array,
			},
			listSmallChapterUrl: {
				type: String,
			},
		},
		data() {
			return {
				// checkPlanDate: this.data,
				smallCapterList: [],
				capterCheck: {
					mainCapterCheck: null,
					smallCapterCheck: [],
				},
				// mainCapterCheck: [],
				// smallCapterCheck: [],
			};
		},
		computed: {
			checkTagDate() {
				const { grade, semester, subject } = this.data;

				const data = [...grade, ...semester, ...subject];

				const {
					mainCapterCheck: { value: mainCapter = null },
					smallCapterCheck,
				} = this.capterCheck;

				// let tagArray = [];
				let tagObj = {
					tagArrayObj: {
						grade: [],
						semester: [],
						subject: [],
					},
					capter: this.capterCheck,
				};
				let tags = {
					tagArrayObj: {
						grade: [],
						semester: [],
						subject: [],
					},
					capter: this.capterCheck,
					capter: {
						mainCapter,
						smallCapter: [],
					},
				};

				tags.capter.smallCapter = smallCapterCheck.map((v) => v.value);

				data.forEach((val) => {
					if (val.isable) {
						const { type, value } = val;
						tagObj.tagArrayObj[type].push(val);
						tags.tagArrayObj[type].push(value);
					}
				});
				this.$emit('change', tags);
				return tagObj;
			},
		},
		methods: {
			closeTag(val) {
				this.data[val.type][val.index].isable = false;
			},
			async capterChange(val) {
				if (val.isable) {
					this.smallCapterList = [];
					this.capterCheck = {
						mainCapterCheck: null,
						smallCapterCheck: [],
					};
					val.isable = false;
					return;
				}
				for (let x in this.capter) {
					this.capter[x].isable = this.capter[x] === val;
				}
				this.capterCheck = {
					mainCapterCheck: val,
					smallCapterCheck: [],
				};
				// this.mainCapterCheck = val;
				// this.smallCapterCheck = [];
				const params = {
					chapter: val.value,
					createdBy: this.$store.state.user.data.uid,
				};
				const { data } = await Api.getSmallCapter(
					params,
					this.listSmallChapterUrl
				);
				let smallCapterList = [];
				for (let x in data) {
					smallCapterList.push({
						index: x,
						type: 'smallCapter',
						name: `第${data[x]}小节`,
						isable: false,
						value: data[x],
					});
				}
				this.smallCapterList = smallCapterList;
			},
			changeSmallChapter(val) {
				val.isable = !val.isable;
				let smallCapterArray = [];
				for (let x in this.smallCapterList) {
					if (this.smallCapterList[x].isable) {
						smallCapterArray.push(this.smallCapterList[x]);
					}
				}
				this.capterCheck.smallCapterCheck = smallCapterArray;
			},
		},
	};
</script>

<style lang="less" scoped>
	.selectCourse {
		color: #666666;
		.box_row_connect {
			margin-left: 30px;
			cursor: pointer;
			transition: 0.5s;
		}
		.box_row_connect_isAction {
			color: #85ba44 !important;
		}
		.top_now_check {
			width: 100%;
			height: 69px;
			border-bottom: 1px solid #f3f3f3;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding-top: 10px;
			padding-left: 40px;
			.top_now_check_title {
				color: #b6b6b6;
			}
			.top_now_check_tag {
				span {
					margin-left: 20px;
				}
			}
		}
		.plan_check_box {
			width: 100%;
			height: 127px;
			padding-left: 40px;
			border-bottom: 1px solid #f3f3f3;
			color: #666666;
			.box_row {
				width: 100%;
				height: 33%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}
		}
		.plan_chapter {
			height: 82px;
			width: 100%;
			border-bottom: 1px solid #f3f3f3;
			padding-left: 40px;
			.chapter {
				width: 100%;
				height: 50%;
				display: flex;
				justify-content: flex-start;
				align-items: center;
			}
		}
	}
</style>
