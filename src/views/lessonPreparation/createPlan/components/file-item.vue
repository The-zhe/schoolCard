<template>
	<div @click.stop="stop">
		<div
			class="file-item-wrap"
			:class="{
				active:
					listType == 'list' &&
					onSelect &&
					startPosition == index &&
					previewView == position,
			}"
			v-if="listType == 'list'"
		>
			<!-- 资源名称 -->
			<div class="fl1 ell">{{ item.fodderName }}</div>

			<!-- 无内容/未隐藏设计意图/未点击按钮 显示 -->
			<div
				class="icon-wrap icon-wrap--red"
				v-if="isRirght"
				v-show="!hideIntention && showPlus"
				@click="showAddDesign"
			>
				<i class="el-icon-plus"></i>
			</div>

			<!-- 删除 -->
			<i
				class="iconfont icon"
				v-if="[word, ppt, excel, pdf, image].includes(item.fodderType)"
				@click="preview"
				>&#xe667;</i
			>
			<template v-if="[audio, video].includes(item.fodderType)">
				<i class="iconfont icon" v-if="isEdit" @click="preview">&#xe615;</i>
				<i class="iconfont icon" v-else @click="preview">&#xe667;</i>
			</template>
			<template v-if="[mould].includes(item.fodderType)">
				<i class="iconfont icon" @click="editActive">&#xe615;</i>
			</template>

			<i class="iconfont icon" @click="del">&#xe63c;</i>
			<div class="file-number" v-if="showIndex">{{ index + 1 }}</div>
		</div>

		<div
			class="file-item-menu"
			:class="{
				'file-item-img': item.fodderType == image,
				active:
					listType == 'menu' &&
					onSelect &&
					startPosition == index &&
					previewView == position,
			}"
			v-else
			@click="preview"
		>
			<div class="file-item-icon-wrap">
				<i class="icon iconfont c1" v-if="item.fodderType == word">&#xe673;</i>
				<i class="icon iconfont c2" v-if="item.fodderType == ppt">&#xe674;</i>
				<i class="icon iconfont c3" v-if="item.fodderType == excel">&#xe610;</i>
				<i class="icon iconfont c4" v-if="item.fodderType == pdf">&#xe672;</i>
				<img
					:src="imgPrefix + item.fodderUrl"
					v-if="item.fodderType == image"
				/>
				<i class="icon iconfont c5" v-if="item.fodderType == audio">&#xe66f;</i>
				<i class="icon iconfont c6" v-if="item.fodderType == video">&#xe644;</i>
				<i class="icon iconfont c7" v-if="item.fodderType == mould">&#xe67e;</i>
			</div>
			<div class="text-name ell">{{ item.fodderName }}</div>
		</div>
		<!-- 设计意图 -->
		<!-- 有内容/未隐藏设计意图/点击添加按钮 显示 -->
		<div class="design-idea" v-if="isRirght" v-show="!hideIntention && showDesign">
			<div class="icon-wrap icon-wrap--dark"  @click="clearDesign">
				<i class="el-icon-close"></i>
			</div>
			<el-input
				class="design"
				v-model="item.designIntent"
				placeholder="请输入设计意图"
				type="textarea"
				maxlength="144"
			></el-input>
		</div>
	</div>
</template>

<script>
	import {
		files,
		word,
		ppt,
		excel,
		pdf,
		image,
		audio,
		video,
		mould,
	} from '@/configs/file';
	export default {
		data() {
			return {
				word,
				ppt,
				excel,
				pdf,
				image,
				audio,
				video,
				mould,
				show: false,
			};
		},
		props: {
			// 是否隐藏设计意图
			hideIntention:{
				type:Boolean,
				default:false
			},
			item: {
				type: Object,
				default: () => {},
			},
			//排列方式
			listType: {
				type: String,
				default: 'list',
			},
			showExe: {
				type: Boolean,
				default: false,
			},
			isEdit: {
				type: Boolean,
				default: false,
			},
			//序号
			showIndex: {
				type: Boolean,
				default: false,
			},
			//数组索引
			index: {
				type: [String, Number],
				default: -1,
			},
			//父级结构
			parentIndex: {
				type: [String, Number],
				default: -1,
			},
			step: {
				type: String,
				default: '',
			},
			//图片预览选中配置
			onSelect: {
				type: Boolean,
				default: false,
			},
			previewView: {
				type: String,
				default: '',
			},
			position: {
				type: String,
				default: '',
			},
			startPosition: {
				type: [String, Number],
				default: -1,
			},
		},
		computed: {
			isRirght() {
				return this.position === 'right';
			},
			showDesign() {
				return this.show || this.item.designIntent;
			},
			showPlus() {
				return !this.show && !this.item.designIntent;
			},
		},
		
		methods: {
			// 显示设计意图
			showAddDesign() {
				this.show = true;
			},
			// 清空设计意图
			clearDesign() {
				this.item.designIntent = '';
				this.show = false;
			},
			del() {
				const params = {
					index: this.index,
					parentIndex: this.parentIndex,
				};
				this.$emit('delect', params);
			},
			editActive() {
				this.$emit('editActive', {
					data: this.item,
					index: this.index,
					parentIndex: this.parentIndex,
				});
			},
			preview() {
				const type = this.item.fodderType;
				if (type == image) {
					this.$emit('previewImage', {
						index: this.index,
						data: this.item.fodderUrl,
						previewView: this.position,
					});
				} else if (type == audio || type == video) {
					this.$emit('previewPlayer', {
						data: this.item,
						isEdit: this.isEdit,
						showExe: this.showExe,
					});
				} else if (
					type == word ||
					type == ppt ||
					type == excel ||
					type == pdf
				) {
					this.$emit('previewOffice', { data: this.item, index: this.index });
				} else if (type == mould) {
					this.editActive();
				}
			},
			stop() {},
		},
	};
</script>

<style lang="less" scoped>
	.icon-wrap {
		border-radius: 50%;
		width: 22px;
		height: 22px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
		&--dark {
			background-color: black;
			margin: 0 9px;
		}

		&--red {
			background-color: red;
		}
	}
	
	.design-idea{
		display: flex;
		align-items: center;
		margin-left: -40px;
		.design{
			width: calc(100% - 40px);
		}
	}

	.file-item-menu.active {
		background: #f2f2f2;
		border-color: #2196f3;
	}
	.file-item-menu.file-item-img {
		width: 155px;
		height: 161px;

		.file-item-icon-wrap {
			width: 120px;
			height: 120px;

			img {
				max-width: 120px;
				max-height: 120px;
			}
		}
	}

	.file-item-menu {
		float: left;
		width: 93px;
		height: 93px;
		padding: 12px 5px;
		box-sizing: border-box;
		transition: background-color 0.2s;
		border: 1px solid transparent;
		cursor: pointer;

		&:hover {
			background: #f2f2f2;
			border-color: #2196f3;
		}

		.text-name {
			font-size: 12px;
			margin-top: 3px;
			text-align: center;
		}
		.file-item-icon-wrap {
			display: flex;
			align-items: flex-end;
			justify-content: center;
			height: 48px;
			margin: 0 auto;

			i {
				font-size: 40px;
			}

			.c1 {
				color: #2196f3;
			}
			.c2 {
				color: #fe642e;
			}
			.c3 {
				color: #31b404;
			}
			.c4 {
				color: #b40404;
			}
			.c5 {
				color: #ffff00;
			}
			.c6 {
				color: #8904b1;
			}
			.c7 {
				color: #febd2b;
			}
		}
	}
	.file-item-wrap.active {
		background: #f2f2f2;
		border-color: #2196f3;
	}
	.file-item-wrap {
		display: flex;
		height: 38px;
		align-items: center;
		padding: 0 13px;
		border: 1px solid #e7eaec;
		position: relative;
		font-size: 13px;
		color: #676a6c;
		margin: 10px 0;
		box-sizing: border-box;
		transition: background-color 0.2s;
		cursor: pointer;
		border-radius: 2px;
		box-sizing: border-box;
		&:hover {
			background: #f2f2f2;
			border-color: #2196f3;
		}

		.file-number {
			position: absolute;
			top: 50%;
			font-size: 20px;
			left: -25px;
			color: #85ba44;
			transform: translateY(-50%);
		}

		.fl1 {
			flex: 1;
			overflow: hidden;
		}
		.icon {
			font-size: 15px;
			padding: 3px;
			cursor: pointer;
			margin-left: 15px;
		}
		&::after {
			content: '';
			position: absolute;
			left: 0;
			top: 0;
			z-index: 1;
			width: 3px;
			height: 100%;
			background: #2196f3;
		}
	}
</style>
