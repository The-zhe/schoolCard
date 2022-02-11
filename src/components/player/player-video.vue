<template>
  <div>
    <div class="flow-player">
      <div class="player-wrapper">
        <video-player
          class="video-player vjs-custom-skin"
          ref="videoPlayer"
          :playsinline="true"
          :options="playerOptions"
          @ended="onPlayerEnded($event)"
          @timeupdate="onPlayerTimeupdate($event)"
        >
        </video-player>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
let count = -1;
import { video } from "@/configs/file";

export default {
  data() {
    return {
      playerOptions: {
        preload: "auto",
        sources: [],
        poster: "", // 封面地址
        notSupportedMessage: "此视频暂无法播放，请稍后再试",
      },
    };
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    url: {
      type: [String],
      default: "",
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    fodderType: {
      type: [Number, String],
      default: "",
    },
  },
  mounted() {
    this.$set(this.playerOptions, "sources", [this.imgPrefix + this.url]);

    if (this.isEdit && this.fodderType == video) {
      this.appendDom();
    }
  },
  methods: {
    appendSubject(event) {
      event.stopPropagation();
      this.$refs.videoPlayer.player.pause();

      this.$emit(
        "setTime",
        parseInt(this.$refs.videoPlayer.player.currentTime())
      );

      this.$emit("input", true);
    },
    pay() {
      this.$refs.videoPlayer.player.pay();
    },
    pause() {
      this.$refs.videoPlayer.player.pause();
    },
    onPlayerEnded() {},
    onPlayerTimeupdate(player) {
      if (this.fodderType == video) {
        const num = parseInt(player.currentTime());
        if (count != num) {
          count = num;
          this.$emit("timeUpdate", count);
        }
      }
    },
    appendDom() {
      setTimeout(() => {
        const bar = document.querySelector(".vjs-control-bar");
        const fullScreen = document.querySelector(".vjs-fullscreen-control");
        const slide = document.createElement("button");
        slide.className = "vjs-slide vjs-control vjs-button";
        const i = document.createElement("i");
        i.innerHTML = "&#xe614";
        i.className = "icon iconfont";
        slide.appendChild(i);
        slide.onclick = (e) => {
          this.appendSubject(e);
        };
        bar.insertBefore(slide, fullScreen);
      }, 100);
    },
  },
};
</script>

<style lang="less" scpoed>
.text-right {
  margin-top: 25px;
}
.flow-player {
  display: flex;

  .video-player {
    width: 100%;
    height: 100%;
  }

  .vjs-custom-skin > .video-js {
    height: 100%;
  }

  .subject-item {
    display: flex;
    padding: 0 10px;
    align-items: center;
    height: 60px;
    border-bottom: 1px solid #999;

    .subject-item-f1 {
      flex: 1;
      overflow: hidden;
      padding: 10px 0;
      font-size: 14px;
      color: #fff;

      .subject-time {
        opacity: 0.5;
        margin-top: 4px;
      }
    }
    .subject-ed {
      font-size: 18px;
      i {
        cursor: pointer;
        opacity: 0.8;
        margin-left: 10px;
      }
    }
  }

  .player-wrapper {
    flex: 1;
    min-width: 750px;
    overflow: hidden;
    height: 550px;
    position: relative;

    /deep/ .video-js {
      height: 550px;
    }
    /deep/
      .vjs-custom-skin
      > .video-js
      .vjs-control-bar
      .vjs-fullscreen-control {
      display: none;
    }
  }
}
</style>