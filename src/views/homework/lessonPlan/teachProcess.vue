<template>
    <div>
        <div v-for="(teachStep,index) in stepList" :key="index">
            <div class="pad">{{teachStep.stepName}}</div>
            <div v-for="(InfoRes,index1) in teachStep.teach2FodderInfoRes" :key="index1">
                <div v-if="InfoRes.activityType ==1"><!-- 在线讨论 -->
                    <div class="pad">{{index+1}}、在线讨论</div>
                    <div class="pad_s">题目:{{InfoRes.activityName}}</div>
                    <div class="des pad_s" v-if="InfoRes.designIntent">设计意图:{{InfoRes.designIntent}}</div>
                </div>
                <div v-if="InfoRes.activityType ==2"><!-- 在线辩论 -->
                    <div class="pad">{{index1+1}}、在线辩论</div>
                    <div class="pad_s">题目:{{InfoRes.activityName}}</div>
                    <div class="pad_s">正方:<span style="display:inline-block" v-html="InfoRes.debateZ"></span></div>
                    <div class="pad_s">反方:<span style="display:inline-block" v-html="InfoRes.debateF"></span></div>
                    <div class="des pad_s" v-if="InfoRes.designIntent">设计意图:{{InfoRes.designIntent}}</div>
                </div>
                <div v-if="InfoRes.activityType ==3"><!-- 投票 -->
                    <div class="pad">{{index1+1}}、在线投票</div>
                    <div class="pad_s">题目:{{InfoRes.activityName}}</div>
                    <div class="pad_s" style="display:flex">
                        <div>选项:</div> 
                        <div style="display:inline-block">
                            <div v-for="(option,indexoption) in InfoRes.voteOptionList" :key="indexoption">
                            <div v-html="option.content"></div>
                        </div>
                        </div>
                    </div>
                    <div class="des pad_s" v-if="InfoRes.designIntent">设计意图:{{InfoRes.designIntent}}</div>
                </div>
                <div v-if="InfoRes.activityType ==4"><!-- 抢答 -->
                    <div class="pad">{{index1+1}}、在线抢答</div>
                    <div v-for="(InfoRes,index1) in teachStep.teach2FodderInfoRes" :key="index1">
                        <div class="pad_s">{{InfoRes.activityName}}</div>
                        <div class="pad_s" v-for="(question,quesindex) in InfoRes.questionList" :key="quesindex">
                            <div>题目:<span style="display:inline-block" v-html="question.questionContent"></span></div>
                            <div style="display:flex">
                                <div>选项:</div> 
                                <span style="display:inline-block">
                                    <div v-for="(option,indexoption) in question.optionList" :key="indexoption">
                                        <div>{{option.sortIndex}}:<span style="display:inline-block" v-html="option.optionContent"></span></div>
                                    </div>
                                </span>
                            </div>
                            <div>正确答案：{{question.rightAnswers}}</div>
                        </div>
                        <div class="des pad_s" v-if="InfoRes.designIntent">设计意图:{{InfoRes.designIntent}}</div>
                    </div>
                </div>
                <div v-if="InfoRes.activityType ==5"><!-- 试卷 -->
                    <div class="pad">{{index1+1}}、试卷组题</div>
                    <div v-for="(InfoRes,index1) in teachStep.teach2FodderInfoRes" :key="index1">
                        <div class="pad_s">{{InfoRes.activityName}}</div>
                        <div class="pad_s" v-for="(question,quesindex) in InfoRes.questionList" :key="quesindex">
                            <div>题目:<span style="display:inline-block" v-html="question.questionContent"></span></div>
                            <div style="display:flex">
                                <div>选项:</div> 
                                <span style="display:inline-block">
                                    <div v-for="(option,indexoption) in question.optionList" :key="indexoption">
                                        <div>{{option.sortIndex}}:<span style="display:inline-block" v-html="option.optionContent"></span></div>
                                    </div>
                                </span>
                            </div>
                            <div>正确答案：{{question.rightAnswers}}</div>
                        </div>
                        <div class="des pad_s" v-if="InfoRes.designIntent">设计意图:{{InfoRes.designIntent}}</div>
                    </div>
                </div>
                <div
                 v-if="
                  InfoRes.fodderType == 1 ||
                  InfoRes.fodderType == 2 ||
                  InfoRes.fodderType == 3 ||
                  InfoRes.fodderType == 7
                ">
                    <div class="pad titlecolor" @click="toPreview(InfoRes)">{{index1+1}}、{{InfoRes.teachFodderName}}</div>
                    <div class="des pad_s" v-if="InfoRes.designIntent">设计意图:{{InfoRes.designIntent}}</div>
                </div>
                <div v-if="InfoRes.fodderType == 4">
                    <div class="pad ">{{index1+1}}、{{InfoRes.teachFodderName}}</div>
                    <video
                        class="pad"
                        controls
                        :src="imgPrefix + material.fodderUrl"
                        v-if="InfoRes.fodderType == 4"
                    ></video>
                    <div class="des pad_s" v-if="InfoRes.designIntent">设计意图:{{InfoRes.designIntent}}</div>
                </div>
                <div v-if="InfoRes.fodderType == 5">
                    <div class="pad ">{{index1+1}}、{{InfoRes.teachFodderName}}</div>
                    <audio
                        class="pad"
                        controls
                        :src="imgPrefix + InfoRes.fodderUrl"
                        v-if="material.fodderType == 5"
                    ></audio>
                    <div class="des pad_s" v-if="InfoRes.designIntent">设计意图:{{InfoRes.designIntent}}</div>
                </div>
                <div v-if="InfoRes.fodderType == 6">
                    <div class="pad">{{index1+1}}、{{InfoRes.teachFodderName}}</div>
                    <img class="pad" :src="imgPrefix + InfoRes.fodderUrl" alt="">
                    <div class="des pad_s" v-if="InfoRes.designIntent">设计意图:{{InfoRes.designIntent}}</div>
                </div>
            </div>
        </div>
        <Preview v-if="preView" ref="preview"></Preview>
    </div>
</template>
<script>
import Preview from "./preview.vue";
export default {
    name:'teachProcess',
    components: { Preview },
    props:['stepList'],
    data(){
        return{
            preView:false
        }
    },
    methods:{
        toPreview(item){
            this.preView = true
            this.$nextTick(()=>{
                this.$refs.preview.init(item)
            })
        }
    }
}
</script>
<style lang="less" scoped>
.pad{
    padding: 10px 20px
}
.pad_s{
    padding: 5px 20px;
    font-size: 16px;
    font-weight: 100;
}
.des{
    color:#ACACAC
}
.titlecolor{
    color: #169BD5;
    cursor: pointer;
}
</style>