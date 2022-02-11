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
			value: {
				type: [String, Number],
				default: '',
			},
		},
		data() {
			return {
				defValue: '',
			};
		},
		watch: {
			value(n, o) {
				if (n !== this.defValue) {
					this.defValue = n;
				}
			},
		},
		created() {
			if (this.value !== this.defValue) {
				this.defValue = this.value;
			}
		},

		computed: {
			isActive() {
				return (value) => {
                    return this.defValue === value
				};
			},
		},
		methods: {
			handleSelect({value}) {
				// 单选返回String
				this.defValue = value;
                this.$emit('input',value);
			},
		},
	};
</script>

<style lang="less" scoped>
	.tabs {
		border: #cccccc solid 1px;
		background-color: #fff;
		border-radius: 2px;
		display: inline-flex;
		align-items: center;
		overflow: hidden;

		&__item {
			width: 72px;
			height: 36px;
			display: flex;
			align-items: center;
			justify-content: center;
			cursor: pointer;

			color: #999;
			font-size: 14px;
			line-height: 21px;
			font-family: Microsoft YaHei;
			transition: all 0.4s;

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
