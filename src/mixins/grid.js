export default {
    data(){
        return{
            editVisible: false, // 新增／更新，弹窗visible状态
        }
    },
    methods:{
        editHandle(id,type) {  // 新增／更新/编辑
            this.editVisible = true;
            this.$nextTick(() => {
              if (!id) {
                id = null;
              }
              this.$refs.edit.init(id,type);
            });
          }
    }
}