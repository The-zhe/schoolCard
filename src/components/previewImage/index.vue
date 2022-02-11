<template>
  <transition name="fade">
    <div class="preview-mask" v-show="value" @click="input">
      <div class="preview-pre" @click.stop="change(-1)">
        <i class="el-icon-arrow-left" v-if="images.length > 1"></i>
      </div>

      <div class="preview-content" @click.stop="kong">
        <img :src="imgPrefix + images[index]" class="preview-image" />
        <div class="preview-indicator">
          <div
            class="preview-indicator-item"
            v-for="(item, i) in images"
            :key="i"
            @click="setPosition(i)"
          >
            <div class="preview-line" :class="{ active: i == index }"></div>
          </div>
        </div>
      </div>

      <div class="preview-next" @click.stop="change(1)">
        <i class="el-icon-arrow-right" v-if="images.length > 1"></i>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      index: 0,
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    images: {
      type: Array,
      default: () => [],
    },
    startPosition: {
      type: [Number, String],
      default: 0,
    },
  },
  watch: {
    startPosition(val) {
      this.index = val;
    },
  },
  methods: {
    change(val) {
      this.index += val;
      if (this.index < 0) {
        this.index = this.images.length - 1;
      } else if (this.index > this.images.length - 1) {
        this.index = 0;
      }
      this.$emit("change", this.index);
    },
    input() {
      this.$emit("input", false);
    },
    setPosition(e) {
      this.index = e;
      this.$emit("change", this.index);
    },
    kong() {},
  },
};
</script>

<style lang="less" scoped>
.preview-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;

  .preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;

    .preview-image {
      max-width: 1000px;
      max-height: 700px;
    }

    .preview-indicator {
      display: flex;
      margin-top: 30px;
      align-items: center;
      justify-content: center;
      width: 100%;

      .preview-indicator-item {
        padding: 12px 4px;
        cursor: pointer;
        width: 30px;
        margin-right: 5px;
      }
      .preview-line {
        height: 2px;
        opacity: 0.48;
        background: #fff;
      }
      .preview-line.active {
        opacity: 1;
      }
    }
  }

  .preview-pre,
  .preview-next {
    cursor: pointer;
    padding: 20px 10px;
    color: #fff;
    font-size: 50px;
    opacity: 0.76;
    transition: opacity 0.25s;

    &:hover {
      opacity: 1;
    }
  }
}
</style>