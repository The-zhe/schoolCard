<template>
	<el-dialog :title="title" :visible.sync="show" width="1080px">
		<el-scrollbar class="activelist">
			<div class="edit-label-title" style="margin-top: 0">知识点</div>
			<div>
				<el-cascader
					style="display: block"
					v-model="kpId"
					clearable
					:props="{ multiple: false, checkStrictly: true }"
					:options="options"
					@change="handleChange"
				></el-cascader>
			</div>

			<el-table
				:data="tableData"
				style="width: 100%; margin: 10px 0"
				border
				@selection-change="handleSelectionChange"
			>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<!-- <template v-if="scope.row.questionType == 4">
              <div>
                答案：{{ scope.row.rightAnswers == "T" ? "正确" : "错误" }}
              </div>
            </template> -->
						<template v-if="[1, 2, 4].includes(scope.row.questionType)">
							<div
								class="sub-r"
								v-for="(item, index) in scope.row.options"
								:key="item.id"
							>
								<div style="width: 30px">
									<i class="icon iconfont" v-if="item.rightAnswer">&#xe61e;</i>
								</div>
								<div class="flex">
									<span style="margin-right: 3px">{{ asc[index] }}</span>
									<div v-html="item.optionContent"></div>
								</div>
							</div>
						</template>
					</template>
				</el-table-column>
				<el-table-column type="selection" width="55"> </el-table-column>
				<el-table-column label="题目">
					<template slot-scope="scope">
						<div v-html="scope.row.questionContent"></div>
					</template>
				</el-table-column>
				<el-table-column label="知识点" width="400">
					<template slot-scope="scope">
						<div v-for="item in scope.row.kps" :key="item.id">
							{{ item.name }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="类型" width="70">
					<template slot-scope="scope">
						<div>{{ questionType[scope.row.questionType] }}</div>
					</template>
				</el-table-column>
				<el-table-column label="难易" width="70">
					<template slot-scope="scope">
						<div>{{ difficulty[scope.row.difficulty] }}</div>
					</template>
				</el-table-column>
			</el-table>
		</el-scrollbar>
		<div class="flow-pages">
			<el-pagination
				background
				style="text-align: center; margin-top: 10px"
				@current-change="getList"
				:current-page.sync="current"
				:page-size="pageSize"
				layout="prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination>
		</div>
		<div class="cp-submit" style="margin-top: 10px; text-align: right">
			<el-button type="primary" @click="outSubject">保存</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import { questionPage, KPTree } from '@/api/question';
	import { difficulty, questionType, asc } from '@/configs';
	export default {
		data() {
			return {
				asc,
				difficulty,
				questionType,
				show: false,
				kpId: [],
				current: 1,
				pageSize: 10,
				total: 0,
				tableData: [],
				multipleSelection: [],
				options: [],
			};
		},
		props: {
			value: {
				type: Boolean,
				default: false,
			},
			title: {
				type: String,
				default: '',
			},
			grade: {
				type: [Number, String],
				default: '',
			},
			chapterId: {
				type: [Number, String],
				default: '',
			},
			course: {
				type: [Number, String],
				default: '',
			},
			bookId: {
				type: [Number, String],
				default: '',
			},
		},
		watch: {
			value(val) {
				if (val) {
					this.show = val;
				}
			},
			show(val) {
				if (!val) {
					this.$emit('input', val);
				} else {
					this.current = 1;
					this.total = 0;
					this.list = [];
					this.kpId = [];
					this.getList();
					this.getKPTree();
				}
			},
		},
		mounted() {
			this.show = this.value;
		},
		methods: {
			Currying(array) {
				array.forEach((item) => {
					item.label = item.name;
					item.value = item.id;
					if (item.children) {
						if (item.children.length > 0) {
							this.Currying(item.children);
						} else {
							delete item.children;
						}
					}
				});
			},
			async getKPTree() {
				const { data } = await KPTree({
					subject: this.course,
					bookId: this.bookId,
					chapterId: this.chapterId,
				});
				this.Currying(data);
				this.options = data;
			},
			async getList(e) {
				let kpId = this.kpId;
				const params = {
					current: this.current,
					size: this.pageSize,
					grade: this.grade,
					chapterId: this.chapterId,
					course: this.course,
				};
				if (kpId.length > 0) {
					params.kpId = kpId[kpId.length - 1];
				}

				const { data } = await questionPage(params);

				this.tableData = data.records;
				this.total = data.total;
			},
			handleChange() {
				this.current = 1;
				this.getList();
			},
			outSubject() {
				this.$emit('outSubject', this.multipleSelection);
				this.show = false;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
		},
	};
</script>

<style lang="less" scoped>
	.sub-r {
		margin: 7px 0;
		display: flex;
		align-items: center;

		i {
			color: #85ba44;
			font-size: 13px;
		}
	}
	.flex {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
	}
</style>
