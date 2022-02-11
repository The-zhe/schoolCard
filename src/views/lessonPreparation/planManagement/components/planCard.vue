<template>
  <div class="planCard">
    <div class="top">
      <img
        @load="getStyle($event)"
        :style="imgStyle"
        :src="cardData.imgUrl ? imgPrefix + cardData.imgUrl : defaultPlanImg"
      />
      <div class="menu">
        <div
          :key="index"
          v-for="(x, index) in menuData"
          class="menu_button"
          @click="tapItem(x)"
        >
          <div class="menu_button_row">
            <div class="menu_button_row_top">
              <i :class="x.iconClass"></i>
            </div>
            <div class="menu_button_row_bottom">
              <span>{{ x.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <span>{{ cardData.teachPlanName }}</span>
    </div>
  </div>
</template>

<script>
import defaultPlanImg from "@/assets/defaultPlanImg.png";
export default {
  components: {},
  props: {
    cardData: {
      type: Object,
    },
  },
  data() {
    return {
      defaultPlanImg,
      menuData: [
        {
          name: "编辑",
          iconClass: "el-icon-edit",
        },
        {
          name: "删除",
          iconClass: "el-icon-delete",
        },
        /* {
          name: "分享",
          iconClass: "el-icon-share",
        }, */
        {
          name: "预览",
          iconClass: "el-icon-view",
        },
        {
          name: "发送",
          iconClass: "el-icon-s-promotion",
        },
      ],
      imgStyle: {},
    };
  },
  methods: {
    tapItem(item) {
      const { name } = item;
      switch (name) {
        case "编辑":
          const path = `/lessonPreparation/createPlan?type=edit&uuid=${
            this.cardData.uuid
          }&chapterId=${this.cardData.chapterId || ""}&bookId=${
            this.cardData.teachBookId || ""
          }&course=${this.cardData.course || ""}&grade=${
            this.cardData.grade || ""
          }&chapterAll=${this.cardData.chapterIdList || ""}`;
          this.$router.push(path);
          break;
        case "删除":
          this.$emit("delect", this.cardData.uuid);
          break;
        case "发送":
          this.$emit("send", this.cardData);
          break;
      }
    },
    getStyle(event) {
      // console.log(event.path[0].clientWidth)
      const width = event.path[0].clientWidth;
      const height = event.path[0].clientHeight;
      this.imgStyle = {
        width: height >= width ? "100%" : "auto",
        height: height < width ? "100%" : "auto",
      };
    },
  },
};
</script>

<style lang="less" scoped>
.planCard {
  width: 265px;
  height: 100%;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  position: relative;
  cursor: pointer;
  .top {
    width: 100%;
    height: 77%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    .menu {
      position: absolute;
      width: 70%;
      height: 50%;
      // background-color: red;
      top: 15%;
      left: 15%;
      display: flex;
      opacity: 0;
      transition: 0.5s;
      justify-content: flex-start;
      flex-wrap: wrap;
      .menu_button {
        width: 50%;
        height: 50%;
        // background: #f3f3f3;
        padding: 1px;
        .menu_button_row {
          width: 100%;
          height: 100%;
          background: #000000ad;
          border-radius: 3px;
          color: #cac8c8a1;
          transition: 0.2s;
          cursor: pointer;
          .menu_button_row_top {
            height: 60%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            i {
              font-size: 21px;
            }
          }
          .menu_button_row_bottom {
            height: 40%;
            width: 100%;
            text-align: center;
            font-size: 12px;
          }
        }
        .menu_button_row:hover {
          color: #ffffff;
        }
      }
    }
    img {
      // width: 100%;
      transition: 0.5s;
      // cursor: pointer;
      transform: scale(1.2);
    }
    // img:hover {
    //   transform: scale(1.4);
    // }
  }
  .top:hover {
    .menu {
      // display: flex;
      opacity: 1;
    }
    img {
      transform: scale(1.4);
    }
  }
  .bottom {
    height: 23%;
    width: 100%;
    display: flex;
    align-items: center;
    color: #757575;
    font-size: 14px;
    justify-content: space-around;

    span {
      width: 90%;
      margin: auto;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: left;
    }
  }
}
</style>
