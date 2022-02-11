<template>
	<div class="latex-editor">
		<div :id="id"></div>
		<textarea
			class="textarea"
			name=""
			id=""
			cols="170"
			rows="20"
			readonly
			v-model="editorData"
		></textarea>

		<!-- <el-upload>

        </el-upload> -->
	</div>
</template>

<script>
	import wangEditor from 'wangeditor';
	import formulaMenu from './formulaMenu';
	import writeMenu from './writeMenu';
	import { baseUrl } from '@/configs';
	import { uploadFiles } from '@/axios/index';

	export default {
		props: {
			value: {
				type: String,
				default: '',
			},
			height: {
				type: [String, Number],
				default: 100,
			},
			id: {
				type: String,
				default: 'latex-editor',
			},
		},
		data() {
			return {
				first:true,
				midData: '',
				editorData: '',
				editor: null,
			};
		},
		watch: {
			// 1.显示的时候正则替换url加上前缀
			//   1. 匹配时 前缀不能为http或https开头
			//   2.
			// 2.数据回传的时候把匹配的前缀去掉

			editorData(n, o) {
				// && n !== this.value
				if (n !== o) {
					this.midData = n.replace(new RegExp(this.imgPrefix, 'g'), '');
					this.$emit('input', this.midData);
				}
			},
			
			value(n, o) {
				if (n !== this.midData && this.editor) {
					this.updateHtml(n)
				}
			},
		},

		async mounted() {
			const editor = new wangEditor(`#${this.id}`);
			this.editor = editor;
			editor.menus.extend('write', writeMenu);
			editor.menus.extend('formula', formulaMenu);
			editor.config.menus = editor.config.menus
				.concat('write')
				.concat('formula');

			editor.config.excludeMenus = [
				'code',
				'head',
				'todo',
				'table',
				'quote',
				'emoticon',
				'undo',
				'redo',
				'indent',
				'lineHeight',
				'italic',
				'underline',
				'strikeThrough',
				'video',
			];

			// 隐藏上传网络图片
			editor.config.showLinkImg = false;

			editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
				const file = resultFiles[0];
				// 上传文件
				const {
					data: { fullUrl },
				} = await uploadFiles(`${baseUrl}/admin/sys-file/otoUpload`, { file });
				insertImgFn(fullUrl);
			};

			editor.config.height = this.height;

			editor.config.onchange = (html) => {
				this.editorData = html;
			};
			// 创建编辑器
			editor.create();
			// 需要在这里更新一下html 如果在watch中可能会出现editor未准备好 第一次无法进行更新
			this.updateHtml(this.value);
			
		},
		methods: {
			updateHtml(content) {
				// console.log('updateHtml',this.id);
				this.editorData = content.replace(
					new RegExp(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi),
					(match, capture) => {
						// 如果不是http或https开头的
						if (!capture.startsWith('http')) {
							match = match.replace(
								new RegExp(capture, 'g'),
								this.imgPrefix + capture
							);
						}
						return match;
					}
				);
				// 初始化编辑器的值
				this.editor.txt.html(this.editorData);
			},
		},
	};
</script>

<style lang="less" scoped>
	.textarea {
		display: none;
	}
	/deep/.w-e-menu--custom {
		width: auto !important;
		margin: 0 13px;
	}
</style>
