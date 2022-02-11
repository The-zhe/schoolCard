/**
 * name：教学活动弹窗混入内容
 * author:qz
 */
// 公式编辑器内容
import latexWangEditor from '@/plugins/latex-wang-editor/index';
import footerBtn from '@/components/footer-btn';
import { mapState } from 'vuex';
import {
    teachActivityAdd,
    teachActivityInfo,
    teachActivityUpdate,
} from '@/api/empcustomer';

export default {
    props: {
        value: {
            type: Boolean,
            default: false
        },
        id: null,
        uuid: null,
    },
    data() {
        return {
            visible: false,
            args_type: '',
        }
    },
    components: {
        latexWangEditor,
        footerBtn,
    },
    computed: {
        ...mapState({
            user: (state) => state.user,
        }),
    },
    watch: {
        value(n, o) {
            if (n !== this.visible) {
                this.visible = n
                if (this.id) {
                    this.getActivityDetail(this.id);
                } else {
                    this.$nextTick(() => {
                        this.$refs.form.clearValidate();
                    })
                }
            }
        }
    },
    mounted() {
        this.args_type = args_type;
    },
    methods: {
        // 创建课堂活动
        async createActivity(from) {
            from.createdBy = this.user.data.id;
            from.teachPlanUuid = this.uuid;
            const { data } = await teachActivityAdd(from);
            this.dataFrom = data;
            this.$message({
                message: '创建课堂活动成功',
                type: 'success',
            });
        },
        // 更新教学活动
        async updateActivity(from) {
            try {
                from.createdBy = this.$store.state.user.data.id;
                from.teachPlanUuid = this.uuid;
                const { data } = await teachActivityUpdate(from);
                this.$message({
                    message: '修改成功',
                    type: 'success',
                });
                return data;
            } catch (e) {
                console.log(e);
            }
        },

        // 处理关闭
        handleClose() {
            this.resetForm();
            this.$emit('input', this.visible);
            this.$emit('close');
        },

        // 提交表单
        submitForm() {

            // 进行表单校验
            this.$refs.form.validate(async (valid) => {
                // 1.校验通过
                if (valid) {
                    let _form = { ...this.form }
                    const { activityType } = _form;
                    // 在线抢答、课堂练习的情况下 把题目数据改成题目ID的数据
                    if ([4, 5].includes(activityType)) {
                        _form.questions = _form.questions.map(v => v.id);
                    }

                    // 1.默认是新建教学活动
                    let requestFunctionName = 'createActivity';

                    // 2.如果id和type都存在 说明是修改教学活动内容
                    const { uid } = this.user.data || {};
                    if (this.id) {
                        _form.updatedBy = uid;
                        requestFunctionName = 'updateActivity';
                    } else {
                        _form.createdBy = uid;
                    }

                    await this[requestFunctionName](
                        _form
                    );
                    this.resetForm();
                    this.$emit('complete');
                } else {
                    console.log('校验失败');
                }
            });
        },

        // 重置表单
        resetForm() {
            Object.assign(this.$data, this.$options.data());
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
            })
        },
        // 获取活动详情
        async getActivityDetail(id) {
            const { data } = await teachActivityInfo(id);
            let { activityType, options } = data;

            // 1。分组讨论 2.分组辩论 3.在线投票  4.在线抢答 5.试题组卷 6.自主探索 7.照片墙
            if ([3].includes(activityType)) {
                const expand = { options: options.map(v => ({ content: v })) };
                this.form = { ...data, ...expand }
                return
            }
            this.form = data;
            this.$nextTick(() => {
                this.$refs.form.clearValidate();
            })
        },



    },
}