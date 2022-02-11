<template>
	<div class="tabs">
		<div
			class="tabs__item"
			v-for="item in list"
			:class="isActive(item.value) ? 'tabs__item--active' : ''"
			:key="item.label"
			@click="handleSelect(item)"
		>
			{{ item.label }}
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: () => [],
			},
			multiple: {
				type: Boolean,
				default: false,
			},
		},
		data() {
			return {
				defList: [],
			};
		},
		watch: {
			list(n, o) {
				if (n !== this.defList) {
					this.defList = n;
				}
			},
		},
		created() {
			if (this.list !== this.defList) {
				this.defList = this.list;
			}
		},

		computed: {
			isActive() {
				return (value) => {
					return value === 1;
				};
			},
			
		},
		methods: {
			// 把当前选中的value 替换为 0 1 相反的值
			handleSelect(item) {
				this.defList = this.defList.map((v) => {
				

					// 多选
					if (this.multiple) {
						// 选中的反选
						if (v.label === item.label) {
							v.value = Number(!Boolean(v.value));
						}
					} else {
						// 单选
						v.value = Number(v.label === item.label);
					}
					return v;
				});
				this.$emit('update:list', this.defList);
			},
		},
	};
</script>

<style lang="less" scoped>
	.tabs {
		
		
		border-radius: 2px;
		display: inline-flex;
		flex-wrap: wrap;
		align-items: center;
		overflow: hidden;
		border: solid 1px #ccc;
		&__item {
			
			// border-top: solid 1px #ccc;
			// border-bottom: 1px solid #ccc;
			width: 72px;
			height: 36px;
			display: flex;
			align-items: center;
			justify-content: center;
			background-color: #fff;
			// border-radius: 2px;

			color: #999;
			font-size: 14px;
			line-height: 21px;
			font-family: Microsoft YaHei;
			transition: all 0.4s;
			cursor: pointer;
			

			&--active {
				color: #fff;
				background-color: #2196f3;
				& + & {
					border-radius: 0;
				}
			}
		}
	}
</style>
