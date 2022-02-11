<!--
 * @Author: qz
 * @Date: 2021-11-12 09:29:32
 * @LastEditTime: 2021-11-15 13:53:23
 * @LastEditors: qz
 * @Description: 课后作业
 * @FilePath: \new-lesson-admin\src\views\lessonPreparation\createPlan\components\home-work.vue
-->
<template>
  <div>
      <latex-wang-editor id="homework" height="260" v-model="defValue" ></latex-wang-editor>
  </div>


</template>

<script>
import latexWangEditor from '@/plugins/latex-wang-editor/index';
export default {
    components: {
        latexWangEditor,
    },
    props: {
        value: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            defValue: ''
        }
    },
    watch: {
        value(n){
            if(n===this.defValue){
                return
            }
            this.defValue = n
        },
        defValue(newValue, oldValue) {
            this.$emit('input',newValue)
        }
    },
    
}
</script>

<style lang="less" scoped>

</style>