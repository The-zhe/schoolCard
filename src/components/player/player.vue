<template>
  <div>
    <el-dialog class="dialog-player" :visible.sync="show" width="70%">
      <player-video
        ref="playerVideo"
        v-if="end"
        v-model="dialogVisible"
        :url="url"
        :isEdit="isEdit"
        :fodderType="fodderType"
        @setTime="setTime"
        @timeUpdate="timeUpdate"
      >
        <div class="player-info" v-if="isEdit && fodderType == video">
          <el-scrollbar>
            <div>
              <div
                class="subject-item"
                v-for="item in teachActivities"
                :key="item.id"
              >
                <div class="subject-item-f1">
                  <div class="ell">{{ item.activityName }}</div>
                  <div class="subject-time">{{ item.time }}</div>
                </div>
                <div class="subject-ed">
                  <i class="icon iconfont" @click="edit(item)">&#xe615;</i>
                  <i class="icon iconfont" @click="delect(item)">&#xe634;</i>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </player-video>
    </el-dialog>
    <resolve-subject
      ref="resSub"
      v-model="dialogVisible"
      title="插入试题"
      @submit="submit"
      @selectSub="selectSub"
    ></resolve-subject>
    <select-subject
      v-model="dialogVisible2"
      :bookId="bookId"
      :grade="grade"
      :chapterId="chapterId"
      :course="course"
      @outSubject="outSubject"
    ></select-subject>

    <el-dialog
      :modal="false"
      title="试题"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible3"
      width="50%"
    >
      <Exercise :uuid="subUuid" v-model="dialogVisible3"></Exercise>
    </el-dialog>
  </div>
</template>
<script>
import {
  teachFodderInfo,
  teachFodderActivityAdd,
  teachFodderActivityRemove,
  teachFodderActivityUpate,
} from "@/api/teachFodder";
import { teachActivity } from "@/api/empcustomer";
import ResolveSubject from "./resolveSubject.vue";
import PlayerVideo from "./player-video.vue";
import selectSubject from "@/components/subject/selectSubject";
import { mapState } from "vuex";
import { secondForTime } from "@/utils";
import { video } from "@/configs/file";
import Exercise from "./exercise";
export default {
  data() {
    return {
      video,
      show: false,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      url: "",
      playTime: "",
      teachActivities: [],
      fodderType: -1,
      end: false,
      subUuid: {},
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    uuid: {
      type: [Number, String],
      default: -1,
    },
    teachPlanUuid: {
      type: String,
      default: "",
    },
    isEdit: {
      type: Boolean,
      default: false,
    },
    showExe: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: [Number, String],
      default: "",
    },
    chapterId: {
      type: [Number, String],
      default: "",
    },
    course: {
      type: [Number, String],
      default: "",
    },
    bookId: {
      type: [Number, String],
      default: "",
    },
  },
  computed: {
    ...mapState({
      user: (state) => state.user,
    }),
  },
  watch: {
    show(val) {
      if (!val) {
        this.$emit("input", val);
        this.end = false;
      }
    },
    value(val) {
      if (val) {
        this.show = val;
        console.log("player", this);
        this.getTeachFodderInfo();
      }
    },
  },
  mounted() {
    //
  },
  methods: {
    timeUpdate(e) {
      if (this.showExe) {
        for (let i = 0; i < this.teachActivities.length; i++) {
          const item = this.teachActivities[i];
          if (e == item.playTime) {
            this.$refs.playerVideo.pause();
            this.subUuid = item.activityUuid;
            this.dialogVisible3 = true;
            break;
          }
        }
      }
    },
    async submit(params) {
      params.activityContent = JSON.stringify(params.activityContent);
      params.teachFodderUuid = this.uuid;
      let add = true;
      let item = {};
      for (let i = 0; i < this.teachActivities.length; i++) {
        item = this.teachActivities[i];
        if (this.playTime == item.playTime) {
          add = false;
          break;
        }
      }
      params.teachPlanUuid = this.teachPlanUuid;
      if (add) {
        params.playTime = this.playTime;
        params.createdBy = this.user.data.uid;
        await teachFodderActivityAdd(params);
      } else {
        params.activityUuid = item.activityUuid;
        params.updatedBy = this.user.data.uid;
        await teachFodderActivityUpate(params);
      }

      this.$message({
        message: `保存成功`,
        type: "success",
      });
      this.getTeachFodderInfo();
    },
    async getTeachFodderInfo() {
      this.teachActivities = [];
      try {
        const { data } = await teachFodderInfo(this.uuid);
        this.url = data.fodderUrl;
        if (data.teachActivities) {
          data.teachActivities.forEach((active) => {
            active.time = secondForTime(active.playTime);
          });
          this.teachActivities = data.teachActivities;
        }

        this.fodderType = data.fodderType;
        this.end = true;
      } catch (e) {
        console.log(e);
      }
    },
    async edit(item) {
      this.playTime = item.playTime;
      try {
        const { data } = await teachActivity(item.activityUuid);
        const { resSub } = this.$refs;
        data.activityContent = JSON.parse(data.activityContent);
        setTimeout(() => {
          resSub.list.push(...data.activityContent);
          resSub.activityName = data.activityName;
          resSub.remark = data.remark;
        }, 50);
        this.dialogVisible = true;
      } catch (e) {}
    },
    delect(item) {
      this.$confirm("是否删除此试题?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await teachFodderActivityRemove([item.id * 1]);
          this.getTeachFodderInfo();
        })
        .catch(() => {});
    },
    setTime(playTime) {
      this.playTime = playTime;
    },
    outSubject(subs) {
      this.$refs.resSub.setList(subs);
    },
    selectSub(type) {
      this.dialogVisible2 = true;
    },
  },
  components: { ResolveSubject, PlayerVideo, selectSubject, Exercise },
};
</script>
<style lang="less" scoped>
/deep/.player-info {
  width: 250px;
  margin-left: 15px;

  .el-scrollbar {
    height: 100%;
    background-color: #222328;

    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>

