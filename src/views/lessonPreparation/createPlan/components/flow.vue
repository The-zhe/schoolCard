<template>
	<div class="flow-page-v">
		<div class="flow-content">
			<div class="flow-left">
				<el-tabs
					type="border-card"
					v-model="paneType"
					class="flow-tabs"
					@tab-click="changeTab"
				>
					<el-tab-pane
						v-for="pa in pane"
						:label="pa.label"
						:name="pa.name"
						:key="pa.name"
					>
						<search
							v-model="fodderName"
							:listType="listType"
							:fileType="fileType"
							:show="pa.label == '我的素材'"
							@addMould="addMould"
							@search="getTeachFodder"
							@change="change"
						></search>
						<file-type
							:fileType="fileType"
							:hide="pa.hide"
							@changeFile="changeFile"
						></file-type>
						<el-scrollbar>
							<div class="clearfix" style="padding-right: 15px">
								<!-- :options="{ group: { name: 'itxst', pull: 'clone' } }" -->
								<draggable
									v-model="temp"
									:options="{ group: { name: 'itxst', pull: 'clone' } }"
									:disabled="disabled"
									@end="end"
									:clone="clone"
									animation="300"
								>
									<transition-group>
										<file-item
											v-for="(item, i) in temp"
											:key="`${i}file-item-temp`"
											:listType="listType"
											:item="item"
											:index="i"
											:startPosition="startPosition"
											:onSelect="true"
											:previewView="previewView"
											position="left"
											@editActive="editActive"
											@delect="delectTeachFodder"
											@previewImage="previewImage"
											@previewPlayer="previewPlayer"
											@previewOffice="previewOffice"
										></file-item>
									</transition-group>
								</draggable>
							</div>
						</el-scrollbar>
					</el-tab-pane>
				</el-tabs>
				<div class="flow-pages">
					<el-pagination
						background
						style="text-align: center"
						@current-change="changePage"
						:current-page.sync="pageNum"
						:page-size="pageSize"
						layout="prev, pager, next, jumper"
						:total="total"
					>
					</el-pagination>
				</div>
			</div>
			<div class="flow-right">
				<el-tabs type="border-card" class="flow-tabs" v-model="activeName">
					<div class="radio-intention">
						<el-checkbox v-model="hideIntention">隐藏设计意图</el-checkbox>
					</div>

					<el-tab-pane
						:name="key"
						:label="data.label"
						v-for="(data, key) in resources"
						:key="key"
					>
						<el-scrollbar style="margin: 0">
							<file-slidedown
								@delectStep="delectStep"
								@addTeachFodder="addTeachFodder"
								v-for="(item, index) in data.list"
								:bookId="bookId"
								:grade="grade"
								:chapterId="chapterId"
								:course="course"
								:key="item.id"
								:index="index"
								:item="item"
							>
								<!-- group="itxst" -->
								<draggable
									v-model="item.teach2FodderAddReqs"
									group="itxst"
									animation="300"
									@start="onStart"
									@add="onAdd($event, item.teach2FodderAddReqs)"
									@end="onEnd"
								>
									<transition-group>
										<div key="2" v-if="item.teach2FodderAddReqs.length == 0">
											<img src="@/assets/senior_tip.png" />
										</div>
										<template v-else>
											<file-item
												v-for="(res, i) in item.teach2FodderAddReqs"
												:key="`${i}file-item`"
												:item="res"
												:index="i"
												:showIndex="true"
												:parentIndex="index"
												:isEdit="true"
												:showExe="true"
												:previewView="previewView"
												position="right"
												:hideIntention="hideIntention"
												@editActive="editActive"
												@delect="delectResources"
												@previewImage="previewImage"
												@previewPlayer="previewPlayer"
												@previewOffice="previewOffice"
											></file-item>
										</template>
									</transition-group>
								</draggable>
							</file-slidedown>
						</el-scrollbar>
					</el-tab-pane>
				</el-tabs>
				<div class="flow-right-add" @click="showAddStep = true">
					<i class="icon iconfont">&#xe641;</i>
				</div>
			</div>

			<preview-image
				v-model="showPerview"
				:images="images"
				:startPosition="startPosition"
				@change="changePosition"
			></preview-image>
		</div>
		<div class="cp-submit">
			<el-button type="primary" @click="saveThisMould"
				>将当前教材流程保存为模板</el-button
			>
			<el-button type="primary" @click="showSelectMould = true"
				>选择教学模板</el-button
			>
		</div>

		<el-dialog
			title="选择教学模板"
			class="select-m"
			:visible.sync="showSelectMould"
			width="70%"
		>
			<select-mould v-model="showSelectMould" @outStep="outStep"></select-mould>
		</el-dialog>
		<el-dialog title="添加教学流程步骤" :visible.sync="showAddStep" width="70%">
			<add-step
				v-model="showAddStep"
				:stepType="activeName"
				@output="addStepItem"
			></add-step>
		</el-dialog>

		<el-dialog
			title="将当前教学流程保存为模板"
			:visible.sync="showMouldMsg"
			width="70%"
		>
			<save-mould v-model="showMouldMsg" @output="save"></save-mould>
		</el-dialog>

		<el-dialog :title="fileTitle" :visible.sync="showOffice" width="70%">
			<iframe :src="iframeUrl"></iframe>
		</el-dialog>

		<player
			v-model="showPlayer"
			:uuid="fileId"
			:isEdit="isEdit"
			:showExe="showExe"
			:bookId="bookId"
			:grade="grade"
			:chapterId="chapterId"
			:course="course"
			:teachPlanUuid="uuid"
		></player>
		<AddActive
			ref="edit"
			:bookId="bookId"
			:grade="grade"
			:chapterId="chapterId"
			:course="course"
			:uuid="uuid"
			@complete="completeActive45"
		></AddActive>

		<subject
			v-model="showSubject"
			:bookId="bookId"
			:grade="grade"
			:chapterId="chapterId"
			:course="course"
			:uuid="subJectUuid"
			:activityType="activityType"
			@complete="completeActive45"
		></subject>
	</div>
</template>

<script>
	import { getPreviewUrl } from '@/api/admin';
	import Search from './flow-search';
	import fileType from './file-type';
	import fileItem from './file-item';
	import fileSlidedown from './file-slidedown';
	import previewImage from '@/components/previewImage';
	import selectMould from './select-mould';
	import addStep from './addStep';
	import saveMould from './saveMould';
	import { files, image, mould } from '@/configs/file';
	import { teachModelAdd } from '@/api/teachMould';
	import {
		teachFodderPage,
		teachFodderRemove,
		teachFodderAdd,
	} from '@/api/teachFodder';
	import {
		teachActivityPageWithUuid,
		teachActivityRemove,
	} from '@/api/empcustomer';
	import player from '@/components/player/player';
	import { mapState } from 'vuex';
	import AddActive from '@/components/teachActivity/addActive.vue';
	import Subject from '@/components/subject';
	import grid from '@/mixins/grid';
	let count = 0;
	let active5 = {};
	export default {
		data() {
			return {
				activityType: 0,
				showSubject: false,
				subJectUuid: '',
				disabled: false,
				showPerview: false,
				showSelectMould: false,
				showAddStep: false,
				showMouldMsg: false,
				showOffice: false,
				fileTitle: '',
				iframeUrl: '',
				fileId: '',
				showPlayer: false,
				isEdit: false,
				showExe: false,
				images: [],
				startPosition: -1,
				previewView: '',
				hideIntention: false,
				pane: [
					{ label: '我的素材', hide: false, name: '1' },
					{ label: '平台素材', hide: true, name: '2' },
					/* { label: "常用素材", hide: true, name: "3" }, */
				],
				paneType: '1',
				fodderName: '',
				pageSize: 10,
				pageNum: 1,
				total: 10,
				listType: 'list',
				fileType: files[0],
				temp: [],
				activeName: '1',
				resources: {
					1: { label: '前置学习', key: '1', list: [] },
					2: { label: '课堂学习', key: '2', list: [] },
					3: { label: '课后延伸', key: '3', list: [] },
				},
			};
		},
		props: {
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
			uuid: {
				type: String,
				default: '',
			},
		},
		computed: {
			...mapState({
				user: (state) => state.user,
			}),
		},
		mounted() {},
		methods: {
			clone(origin) {
				const data = JSON.parse(JSON.stringify(origin));
				return data;
			},
			onAdd(e, item) {
				console.log('e: ', e);
				console.log(item[0] === item[1]);
			},
			addMould() {
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
				this.editHandle();
			},
			//验证并重组数据
			validata() {
				return new Promise((resolve, reject) => {
					let teachModelStepAddReqList = this.validata2();
					const list = [];
					if (teachModelStepAddReqList) {
						teachModelStepAddReqList.forEach((res) => {
							const item = { ...res };
							delete item.orderNum;
							delete item.teach2FodderAddReqs;
							const teach2FodderAddReqs = [];
							res.teach2FodderAddReqs.forEach((data, index) => {
								const obj = {
									fodderNum: index + 1,
									designIntent: data.designIntent || '',
									fodderSource: data.fodderSource || 1,
									teachFodderUuid: data.uuid,
								};
								teach2FodderAddReqs.push(obj);
							});
							item.teach2FodderAddReqs = teach2FodderAddReqs;
							list.push(item);
						});
						resolve(list);
					} else {
						reject();
					}
				});
			},
			//获取教学素材
			async getTeachFodder() {
				this.temp = [];
				try {
					const params = {
						bookId: this.bookId,
						grade: this.grade,
						chapter: this.chapterId,
						course: this.course,
						fodderName: this.fodderName,
						fodderType: this.fileType,
						current: this.pageNum,
						size: this.pageSize,
					};
					if (this.paneType == 1) {
						params.createdBy = this.user.data.uid;
						params.type = 1;
					} else {
						params.type = 2;
					}

					const { data } = await teachFodderPage(params);
					this.total = data.total;
					data.records.forEach((item) => {
						item.fodderSource = 1;
					});
					this.temp = data.records;
				} catch (e) {}
			},
			//获取教学活动
			async getActiveList() {
				this.temp = [];
				try {
					const params = {
						teachActivityName: this.fodderName,
						createBy: this.user.data.uid,
						current: this.pageNum,
						size: this.pageSize,
						teachPlanUuid: this.uuid,
					};
					const { data } = await teachActivityPageWithUuid(params);
					this.total = data.total;
					const list = [];
					data.records.forEach((item) => {
						const data = {
							fodderName: item.activityName,
							fodderSource: 2,
							uuid: item.uuid,
							activityType: item.activityType,
							fodderType: mould,
						};
						list.push(data);
					});
					this.temp = list;
				} catch (e) {
					console.log(e);
				}
			},
			change(e) {
				this.listType = e;
				this.pageNum = 1;
				if (e == 'list') {
					this.pageSize = 10;
				} else {
					this.pageSize = this.fileType == image ? 9 : 25;
				}
				if (this.fileType == mould) {
					this.getActiveList();
				} else {
					this.getTeachFodder();
				}
			},
			changeFile(e) {
				this.startPosition = -1;
				this.fileType = e;
				this.pageNum = 1;
				if (this.listType == 'list') {
					this.pageSize = 10;
				} else {
					this.pageSize = e == image ? 9 : 25;
				}
				if (e == mould) {
					this.getActiveList();
				} else {
					this.getTeachFodder();
				}
			},
			//添加素材
			async addTeachFodder({ index, name, data: res, fodderType }) {
				try {
					const params = {
						grade: this.grade,
						course: this.course,
						teachBookId: this.bookId,
						chapterId: this.chapterId,
						fodderName: name,
						fodderSize: res.fileSize,
						fodderUrl: res.url,
						fodderPreviewUrl: res.previewUrl || '',
						createdBy: this.user.data.uid,
						fodderType,
					};
					const { data } = await teachFodderAdd(params);
					data.fodderSource = 1;
					this.resources[this.activeName].list[index].teach2FodderAddReqs.push(
						data
					);
					this.changePage();
				} catch (e) {
					console.log(e);
				}
			},
			//删除素材
			delectTeachFodder({ index }) {
				this.$confirm('是否删除此素材?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				})
					.then(async () => {
						if (this.fileType == mould) {
							await teachActivityRemove([this.temp[index].uuid]);
						} else {
							await teachFodderRemove([this.temp[index].uuid]);
						}
						this.changePage();
						this.$message({
							message: `删除成功`,
							type: 'success',
						});
					})
					.catch(() => {});
			},
			changePage(rest) {
				if (!rest) {
					this.pageNum = 1;
				}
				if (this.fileType == mould) {
					this.getActiveList();
				} else {
					this.getTeachFodder();
				}
			},
			validata2() {
				let i = 0;
				const list = [];
				for (let key in this.resources) {
					const item = this.resources[key];
					if (item.list.length > 0) {
						++i;
						item.list.forEach((data, index) => {
							data.orderNum = index + 1;
							data.stepNum = index + 1;
						});
						list.push(...item.list);
					}
				}

				if (i == 0) {
					this.$message({
						message: '请先添加教学流程步骤',
						type: 'warning',
					});
					return false;
				} else {
					return list;
				}
			},
			//将当前流程保存模板
			async save(e) {
				let teachModelStepAddReqList = this.validata2();
				if (teachModelStepAddReqList) {
					const params = {
						...e,
						createdBy: this.user.data.uid,
						teachModelStepAddReqList,
					};
					try {
						await teachModelAdd(params);
						this.$message({
							message: `保存成功`,
							type: 'success',
						});
					} catch (e) {}
				}
			},
			//添加步骤
			addStepItem(e) {
				e.id = count++;
				e.list = [];
				this.resources[this.activeName].list.push(e);
			},
			//删除步骤
			delectStep(e) {
				this.resources[this.activeName].list.splice(e, 1);
			},
			previewPlayer({ data, isEdit, showExe }) {
				this.fileId = data.uuid;
				this.isEdit = isEdit;
				this.showExe = showExe;
				this.showPlayer = true;
			},
			async previewOffice({ data }) {
				console.log(data);
				this.showOffice = true;
				this.fileTitle = data.fodderName;
				const res = await getPreviewUrl({
					fileUrl: this.imgPrefix + data.fodderUrl,
				});
				this.iframeUrl = encodeURI(res.data.previewUrl);
			},
			previewImage({ index, data = '', previewView }) {
				if (previewView == 'right') {
					this.images = [data];
					this.startPosition = 0;
					this.previewView = 'right';
				} else {
					this.images = this.temp.map((item) => item.fodderUrl);
					this.startPosition = index;
					this.previewView = 'left';
				}
				this.showPerview = true;
			},
			delectResources({ parentIndex, index }) {
				this.resources[this.activeName].list[
					parentIndex
				].teach2FodderAddReqs.splice(index, 1);
			},
			changePosition(e) {
				this.startPosition = e;
			},
			//修改教学活动
			editActive({ data, index, parentIndex }) {
				active5.index = index;
				active5.parentIndex = parentIndex;

				const { uuid, activityType } = data;
				this.editHandle(uuid, activityType);

				// this.subJectUuid = uuid;
				// active5.index = index;
				// active5.parentIndex = parentIndex;
				// this.activityType = data.activityType;
				// if (data.activityType == 5 || data.activityType == 4) {
				//   this.showSubject = true;
				//   this.subJectUuid = data.uuid;
				// } else if (data.activityType) {
				//   this.editHandle(data.uuid, data.activityType);
				// }
			},
			//更新教学活动-试题组卷 || 在线抢答
			completeActive45(data) {
				this.$nextTick(() => {
					this.changePage();
					if (active5.parentIndex > -1) {
						const params = {
							fodderName: data.activityName,
							fodderSource: 2,
							uuid: data.uuid,
							activityType: data.activityType,
							fodderType: mould,
						};
						this.resources[this.activeName].list[
							active5.parentIndex
						].teach2FodderAddReqs.splice(active5.index, 1, params);
					}
				});
			},
			//选择教学模板
			outStep(result) {
				for (let i in result) {
					this.resources[i].list = result[i];
				}
			},
			//切换左侧资源tab
			changeTab(e) {
				if (e.label != '我的素材') {
					if (this.fileType == mould) {
						this.fileType = files[0];
					}
				}

				this.getTeachFodder();
			},
			saveThisMould() {
				let data = this.validata2();
				if (data) {
					this.showMouldMsg = true;
				}
			},
			onStart() {
				this.disabled = true;
			},
			end() {
				this.startPosition = -1;
			},
			onEnd() {
				this.disabled = false;
			},
		},
		mixins: [grid],
		components: {
			Search,
			fileType,
			fileItem,
			fileSlidedown,
			previewImage,
			selectMould,
			addStep,
			saveMould,
			player,
			AddActive,
			Subject,
		},
	};
</script>

<style lang="less" scoped>
	.radio-intention {
		display: flex;
		align-items: center;
		justify-content: end;
	}

	.radio-intention /deep/ {
		.el-checkbox__input.is-checked .el-checkbox__inner,
		.el-checkbox__input.is-indeterminate .el-checkbox__inner {
			// 修改填充颜色
			background-color: #00b052;
			border-color: #00b052;
		}
		.el-checkbox__input.is-checked + .el-checkbox__label {
			color: #00b052;
		}
		.el-checkbox.is-bordered.is-checked {
			border-color: #00b052;
		}
		.el-checkbox__input.is-focus .el-checkbox__inner {
			border-color: #00b052;
		}

		//设置边框的圆角，默认为方，
		.el-input__inner,
		.el-checkbox__inner,
		.el-textarea__inner,
		.el-button {
			border-radius: 20px;
		}
	}
	.flow-page-v {
		/deep/ .el-dialog .el-dialog__body iframe {
			height: 600px;
			display: block;
			width: 100%;
			border: medium none;
		}
	}
	/deep/.activelist.el-scrollbar {
		height: 550px;
		.el-scrollbar__wrap {
			overflow-x: hidden;
		}
	}

	/deep/ .dialog-player > .el-dialog {
		background: #191a20;
		min-width: 1080px;
	}
	/deep/.edit-label-title {
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
	/deep/.mould-input {
		display: block;
		width: 100%;
		line-height: 40px;
		padding: 0 20px;
		height: 40px;
		border: 1px solid #e0e0e0;
	}
	/deep/ .mould-text {
		display: block;
		width: 100%;
		height: 120px;
		padding: 10px 20px;
		border: 1px solid #e0e0e0;
	}
	/deep/ .select-m {
		.el-dialog {
			margin-top: 10vh !important;
		}
		.el-dialog__body {
			min-height: 72vh;
			position: relative;
			padding: 30px 20px 100px 20px;
		}
	}
	/deep/.cp-submit {
		display: flex;
		flex-direction: row-reverse;
		margin-top: 40px;

		> button {
			margin-left: 20px;
		}
	}
	.flow-content {
		display: flex;
		padding-top: 20px;
		/deep/ .flow-tabs .el-tabs__content {
			height: 400px;
		}

		.flow-right-add {
			position: absolute;
			right: 15px;
			bottom: 20px;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			display: flex;
			align-items: center;
			justify-content: center;
			color: #fff;
			background: #85ba44;
			font-size: 20px;
			cursor: pointer;
		}
		.flow-pages {
			position: absolute;
			bottom: 20px;
			left: 0;
			width: 100%;
			z-index: 1;
			/deep/.el-pagination__jump {
				margin-left: 0;
			}
		}
		/deep/ .flow-tabs .el-tabs__content .el-tab-pane {
			height: 370px;
			display: flex;
			flex-direction: column;
			position: relative;
			padding-bottom: 40px;
			box-sizing: border-box;

			.el-scrollbar {
				flex: 1;
				margin: 15px 0;
				.el-scrollbar__wrap {
					overflow-x: hidden;
				}
			}
		}

		.flow-left {
			width: 500px;
			margin-right: 20px;
			position: relative;
		}
		.flow-right {
			flex: 1;
			overflow: hidden;
			position: relative;
		}
	}
</style>
