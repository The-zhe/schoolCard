<!-- 
      name:从题库中选择 弹窗
      author:覃祯
      date:2021年11月4日 15点32分
   -->
<template>
	<el-dialog
		:title="title"
		:visible.sync="visible"
		width="1000px"
		@close="handleClose()"
		destroy-on-close
	>
		<!-- 搜索区域 -->
		<div class="search">
			<div class="search__item">
				<p class="search__item__label">关键字</p>
				<el-input
					class="search__item__input"
					v-model="query.searchContent"
					placeholder="请输入题目的关键字"
				></el-input>
			</div>

			<div class="search__item ml-17">
				<p class="search__item__label">知识点</p>
				<el-cascader
					style="display: block; width: 196px"
					v-model="query.kpId"
					placeholder="请选择知识点"
					clearable
					:props="{ multiple: false, checkStrictly: true }"
					:options="options"
				></el-cascader>
			</div>
			<!-- 无知识点 -->
			<template v-if="nonePoint" >
				<div class="none-point ml-10" @click="resetKpId()">无知识点</div>
			</template>

			<el-button
				type="primary"
				icon="el-icon-search"
				class="ml-17 search__item__search"
				:class="resource === 1 ? 'search__item__search--system' : ''"
				@click="handleSearch()"
				>搜索</el-button
			>

			<el-button
				type="info"
				icon="el-icon-delete"
				class="ml-10 search__item__clear"
				@click="handleReset()"
				>清空</el-button
			>
		</div>
		<!-- 表格区域 -->
		<el-table
			v-if="visible"
			ref="tableRef"
			class="mt-24"
			:data="array"
			:header-cell-style="{ background: '#D7EDFF' }"
			:row-style="{ height: '40px' }"
			highlight-current-row
			@select="handleSelect"
			@select-all="handleSelectAll"
			@current-change="clickChange"
			@row-click="handleRowClick"
			@selection-change="handleSelectionChange"
			@sort-change="handleSortChange"
			:header-row-style="{ height: '40px', lineHeight: '40px' }"
			stripe
		>
			<el-table-column width="55" v-if="type === 4">
				<template slot-scope="scope">
					<el-radio v-model="currentSelection" :label="scope.row"
						><i></i
					></el-radio>
				</template>
			</el-table-column>
			<el-table-column type="selection" width="55" v-if="type === 5 || isPaper">
			</el-table-column>
			<el-table-column
				label="序号"
				type="index"
				align="center"
				width="80px"
			></el-table-column>
			<el-table-column label="题目" align="center" prop="questionContent">
				<template slot-scope="scope">
					<div v-html="scope.row.questionContent"></div>
				</template>
			</el-table-column>
			<el-table-column
				label="类型"
				width="140px"
				align="center"
				prop="questionType"
			>
				<template slot-scope="scope">
					{{ scope.row.questionType | type }}
				</template>
			</el-table-column>
			<el-table-column
				label="难度"
				width="140px"
				align="center"
				prop="difficulty"
				sortable="custom"
			>
				<template slot-scope="scope">
					<el-tag :type="scope.row.difficulty | difficultyType">{{
						scope.row.difficulty | difficulty
					}}</el-tag>
				</template>
			</el-table-column>
		</el-table>
		<!-- 底部区域 -->
		<div class="footer mt-40">
			<el-pagination
				background
				layout="prev, pager, next"
				:current-page="query.current"
				:page-size="query.size"
				:total="total"
				@current-change="currentChange"
			>
			</el-pagination>
			<footer-btn
				confirmText="确定"
				@confirm="submit()"
				@cancel="visible = false"
			></footer-btn>
		</div>
	</el-dialog>
</template>

<script>
	import { questionPage, KPTree, myTree } from '@/api/question';
	import EventBus from '@/utils/bus';
	import footerBtn from '@/components/footer-btn';
	import injectMixins from './injectMixins';
	import { mapState } from 'vuex';
	export default {
		mixins: [injectMixins],
		components: {
			footerBtn,
		},

		data() {
			return {
				loadPoint: false,
				currentSelection: null,
				multipleSelection: [],
				visible: false,
				total: 0,
				resource: null,
				type: null,
				query: {
					searchContent: '',
					kpId: '',
					resource: '',
					current: 1,
					size: 7,
					difficultyOrder: 0,
				},
				options: [],
				array: [],
				columns: [
					{
						label: '序号',
						type: 'index',
						width: '80px',
					},
					// 题目内容
					{
						label: '题目',
						prop: 'questionContent',
					},
					// 题目类型，1-单选  2-多选 3-填空 4-判断 5-简答 6-组合
					{
						label: '类型',
						prop: 'questionType',
					},
					// 难度系数 1-难 2-中等 3-简单
					{
						label: '难度',
						prop: 'difficulty',
						sortable: true,
					},
				],
				// sortable:''
			};
		},
		computed: {
			...mapState({
				user: (state) => state.user,
			}),
			title() {
				const titles = [, '系统题库', '我的题库'];
				return titles[this.resource] || '';
			},
			nonePoint() {
				return this.resource === 2;
			},
		},
		filters: {
			type: function (value) {
				const types = [
					'',
					'单选题',
					'多选题',
					'填空题',
					'判断题',
					'简答题',
					'组合题',
				];
				return types[value];
			},
			difficulty(value) {
				const types = ['', '难', '中等', '简单'];
				return types[value];
			},
			difficultyType(value) {
				const types = ['', 'danger', 'warning', 'success'];
				return types[value];
			},
		},

		methods: {
			resetKpId(){
				this.query.kpId = ''
			},
			// 需要传输一个打开弹窗的类型 以及活动类型
			open(resource, type, options = []) {
				this.resource = resource;
				this.query.resource = resource;
				this.query.course = this.course
				this.type = type;
				this.visible = true;
				this.multipleSelection = options;

				this.getPoint();
				this.getTopics();
			},
			// 页码变更
			currentChange(current) {
				this.query.current = current;
				this.getTopics();
			},
			// 点击搜索题目列表
			handleSearch() {
				this.query.current = 1;
				this.getTopics();
			},
			// 重置query
			handleReset() {
				this.query = this.$options.data().query;
			},
			// 单选
			clickChange(row) {
				if (this.type === 4) {
					this.currentSelection = row;
					return;
				}
			},
			// 处理排序变更
			handleSortChange({ column, prop, order }) {
				const orderObject = {
					ascending: 1,
					descending: 2,
				};
				this.query.difficultyOrder = orderObject[order] || 0;
				this.getTopics();
			},
			// 处理点击行事件
			handleRowClick(row) {
				console.log('handleRowClick');
				if (row) {
					this.$refs.tableRef.toggleRowSelection(row);
				}
			},
			// 取消选中时，从multipleSelection中删除
			handleSelect(selection, row) {
				console.log('selection: ', selection);
				// 如果当前选中值没有包含的话 从多选数组中过滤
				if (!selection.includes(row)) {
					this.multipleSelection = this.multipleSelection.filter(
						({ id }) => id !== row.id
					);
				}
			},
			// 取消当前页面全选时，从题目数据中过滤
			handleSelectAll(selection) {
				if (selection.length === 0) {
					let ids = {};
					this.array
						.map((v) => v.id)
						.forEach((v) => {
							ids[v] = true;
						});
					this.multipleSelection = this.multipleSelection.filter(
						(v) => !ids.hasOwnProperty(v.id)
					);
				}
			},
			// 合并选中的题目，对id重复的题目去重
			handleSelectionChange(val) {
				// 1.先过滤掉当前分页数据内容
				const tableIds = this.array.map((v) => v.id);
				const total = this.multipleSelection.filter(
					(v) => !tableIds.includes(v.id)
				);
				// 2.添加当前选中的内容
				if (val instanceof Array) {
					total.push(...val);
				} else {
					total.push(val);
				}
				let ids = {};
				// 3.对数组进行去重
				this.multipleSelection = total.reduce((acc, cur) => {
					if (ids.hasOwnProperty(cur.id)) {
						return acc;
					}
					ids[cur.id] = true;
					return acc.concat(cur);
				}, []);
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
			// 获取知识点
			async getPoint() {
				this.loadPoint = false;
				let result = null;
				const { grade, chapterId, course: subject, bookId } = this;
				// 学段
				let phase = '';
				// TODO 现在暂时不传输学段
				// 一到六年级 对应1  七到九年级 对应2 十到十三年级 对应3
				// let arr = [, [1, 6], [7, 9], [10, 13]];
				// if (grade) {
				// 	arr.forEach((v, i) => {
				// 		if (v && v[0] <= grade && grade <= v[1]) {
				// 			phase = i;
				// 		}
				// 	});
				// }

				if (this.resource === 1) {
					result = await KPTree({ grade, chapterId, subject, phase });
				} else if (this.resource === 2) {
					const teacherId = this.user.data.uid;
					result = await myTree({
						subject,
						teacherId,
						phase,
					});
				}
				const { data } = result;
				this.options = this.formatOptions(data);
				this.loadPoint = true;
			},
			async getTopics() {
				const {
					data: { records, total },
				} = await questionPage(this.query);
				this.array = records;
				this.total = total || 0;

				this.$nextTick(() => {
					// 当前页面已选中的数据

					const selectionIds = this.multipleSelection.map((v) => v.id);
					const currentSelection = records.filter((v) =>
						selectionIds.includes(v.id)
					);

					// 循环选中
					currentSelection.forEach((row) => {
						this.$refs.tableRef.toggleRowSelection(row, true);
					});
				});
			},
			// 关闭弹窗
			handleClose() {
				Object.assign(this.$data, this.$options.data());
			},
			// 提交内容
			// 使用BUS吧
			submit() {
				let questions = this.multipleSelection;
				// 单选
				if (this.type === 4 && this.currentSelection) {
					questions = [this.currentSelection];
				}
				if (questions.length === 0) {
					this.$message.error('请选择题目后再提交！');
					return;
				}
				// 是否添加到我的题库 ？？
				this.$confirm(`是否添加？`, {
					customClass: 'custom-message-box',
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					showClose: false,
					center: true,
					cancelButtonClass: 'plain-btn',
					confirmButtonClass: 'primary-btn',
				}).then(() => {
					
					if (!this.isPaper) {
						// 标记题目来源
						questions = questions.map((v) => {
							v.resource = this.resource;
							return v;
						});
						EventBus.$emit(
							'selectedTopicSuccesss',
							questions,
							this.resource,
							this.type
						);
					}else{
						this.$emit('selectedTopicSuccesss',questions,this.resource)
					}
					this.visible = false;
				});
			},
		},
	};
</script>

<style lang="less" scoped>
	@import url('~@/assets/css/activeDialog.less');

	/deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
		background-color: #d7edff;
	}
	/deep/.el-table .el-table__cell {
		padding: 0;
	}
	// 无知识点
	.none-point {
		background-color: #f8cd6c;
		color: #333;
		height: 36px;
		width: 96px;
		border-radius: 99px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: Microsoft YaHei;
	}

	.ml-10 {
		margin-left: 10px;
	}
	.ml-17 {
		margin-left: 17px;
	}
	.mt-24 {
		margin-top: 24px;
	}
	.mt-40 {
		margin-top: 40px;
	}
	.search {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 20px;
		&__item {
			display: flex;
			align-items: center;
			&__label {
				font-size: 14px;
				color: #424242;
				line-height: 19px;
				white-space: nowrap;
				margin-right: 10px;
			}
			&__input {
				width: 280px;
				height: 36px;
			}
			&__search {
				width: 114px;
				&--system {
					width: 160px;
					margin-left: 32px;
				}
			}
			&__clear {
				width: 82px;
				background-color: #eeeeee;
				color: #333;
			}
			&__search,
			&__clear {
				border: none;
				height: 36px;
				font-family: Microsoft YaHei;
				font-weight: normal;
			}
		}
	}
	.footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
