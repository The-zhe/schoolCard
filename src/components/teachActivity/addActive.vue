<template>
	<div>
		<el-dialog
			width="690px"
			:title="!id ? '添加' : '修改'"
			:visible.sync="visible"
			append-to-body
			class="edit-popup"
		>
			<div style="overflow: hidden">
				<div class="title_active">新增教学活动</div>
				<ul>
					<li
						v-for="(item, index) in active_list"
						:key="index"
						@click="typeOpera(item)"
					>
						<img :src="item.icon" />
						<div>{{ item.title }}</div>
					</li>
				</ul>
			</div>

			<!---------------------------------------------- 在线投票 ------------------------------------------------------------->
			<vote-dialog
				v-model="voteVisible"
				:id="id"
				:uuid="uuid"
				@complete="complete"
				@close="handleClose()"
			></vote-dialog>
			<!---------------------------------------------- 分组辩论 ------------------------------------------------------------->
			<debate-dialog
				v-model="debateVisible"
				:id="id"
				:uuid="uuid"
				@complete="complete"
				@close="handleClose()"
			></debate-dialog>
			<!---------------------------------------------- 在线抢答 ------------------------------------------------------------->
			<responder-dialog
				v-model="viesVisible"
				:id="id"
				:uuid="uuid"
				@select="handleSelect"
				@complete="complete"
				@close="handleClose()"
			></responder-dialog>
			<!---------------------------------------------- 课堂练习 ------------------------------------------------------------->
			<exercise-dialog
				v-model="exploreVisible"
				:id="id"
				:uuid="uuid"
				@select="handleSelect"
				@complete="complete"
				@close="handleClose()"
			></exercise-dialog>

			<!---------------------------------------------- 分组辩论 ------------------------------------------------------------->
		</el-dialog>
		<!-- 从题库中选择 -->
		<select-topic-dialog
			:course="course"
			ref="selectTopic"
		></select-topic-dialog>
		<!-- 自主答题 -->
		<custom-dialog :course="course" ref="customTopic"></custom-dialog>
	</div>
</template>
<script>
	import Subject from '@/components/subject';
	// 在线投票弹窗
	import voteDialog from './voteDialog.vue';
	// 分组辩论弹窗
	import DebateDialog from './debateDialog.vue';
	import ResponderDialog from './responderDialog.vue';
	import exerciseDialog from './exerciseDialog.vue';
	import selectTopicDialog from './selectTopicDialog.vue';
	import customDialog from './customDialog.vue';

	export default {
		name: 'addActive',
		components: {
			Subject,
			voteDialog,
			DebateDialog,
			ResponderDialog,
			selectTopicDialog,
			customDialog,
			exerciseDialog,
		},

		data() {
			return {
				id: null,
				selectVisibel: false,
				activityType: null,
				resource: 1,
				//  1在线讨论、2在线辩论、3在线投票、4在线抢答、5课堂练习、6自主探索、7照片墙
				type: null,
				visible: false,
				show: false,
				voteVisible: false, //在线投票
				debateVisible: false, //分组辩论
				discussVisible: false, //分组讨论
				viesVisible: false, //在线抢答
				exploreVisible: false, //课堂练习
				picVisible: false, //照片墙
				active_list: [
					{
						id: 2,
						icon: require('@/assets/classActivity/icon-group.png'),
						title: '分组辩论',
					},
					{
						id: 3,
						icon: require('@/assets/classActivity/icon-vote.png'),
						title: '在线投票',
					},
					{
						id: 4,
						icon: require('@/assets/classActivity/icon-responder.png'),
						title: '在线抢答',
					},
					{
						id: 5,
						icon: require('@/assets/classActivity/icon-training.png'),
						title: '课堂练习',
					},
				],
				voteRules2: {
					activityName: [
						{ required: true, message: '请输入活动名称', trigger: 'blur' },
					],
					remark: [
						{ required: true, message: '请输入投票标题', trigger: 'blur' },
					],
				},
			};
		},
		provide() {
			return {
				app: this
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

		methods: {
			handleSelect({ resource, type, questions, id }) {
				if ([1, 2].includes(resource)) {
					this.$refs.selectTopic.open(resource, type, questions);
					return;
				}
				this.$refs.customTopic.open(resource, type, id);
			},
			// 处理关闭编辑子弹窗
			handleClose() {
				this.visible = !(this.id && this.type);
			},
			// 初始化弹窗
			init(id, type) {
				this.id = id;
				this.type = type;
				if (id && type) {
					this.visible = true;
					this.openChildDialog(type);
				} else {
					(this.id = null), (this.type = null);
					this.visible = true;
				}
			},
			// 打开子弹窗
			openChildDialog(type) {
				if (!type) {
					return;
				}
				//  1在线讨论、2在线辩论、3在线投票、4在线抢答、5课堂练习、6自主探索、7照片墙
				const innerDialogVisibles = {
					1: 'discussVisible',
					2: 'debateVisible',
					3: 'voteVisible',
					4: 'viesVisible',
					5: 'exploreVisible',
					6: 'exploreVisible',
					7: 'picVisible',
				};
				this.$nextTick(() => {
					if (innerDialogVisibles.hasOwnProperty(type)) {
						this[innerDialogVisibles[type]] = true;
						return;
					}
					Object.values(innerDialogVisibles).forEach((key) => {
						this[key] = false;
					});
				});
			},
			// 点击打开新建窗口
			typeOpera({ id }) {
				this.openChildDialog(id);
			},
			complete() {
				this.$emit('complete');
			},
		},
	};
</script>
<style lang="less" scoped>
	.m-0-5 {
		margin: 0px 5px;
	}
	/deep/.el-message-box {
		width: 360px;
	}

	.edit-popup {
		/deep/.el-dialog__header {
			padding: 20px 30px 20px;
		}

		/deep/.el-dialog__title {
			font-size: 18px;
			line-height: 24px;
			color: #212121;
			font-weight: bold;
			font-family: Microsoft YaHei;
		}
		/deep/.el-dialog__body {
			padding-top: 0;
			padding-bottom: 110px;
		}

		.title_active {
			font-size: 14px;
			text-align: center;
			font-family: Microsoft YaHei;
			font-weight: bold;
			color: #212121;
		}
		br {
			height: 0;
			width: 0;
		}
		ul {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 20px;
			li {
				display: flex;
				flex-direction: column;
				align-items: center;
				padding: 20px 40px;
				cursor: pointer;
				img {
					width: 32px;
					height: 32px;
				}
				div {
					margin-top: 8px;
					font-size: 14px;
					color: #212121;
					line-height: 19px;
				}
			}
		}
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
