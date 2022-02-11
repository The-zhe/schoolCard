/**
 * name：教学活动弹窗混入内容
 * author:qz
 */

import EventBus from '@/utils/bus';
export default {
    data() {
        return {
            modes: [
                {
                    resource: 1,
                    text: '系统题库',
                },

                {
                    resource: 3,
                    text: '自主添加',
                },
                {
                    resource: 2,
                    text: '我的题库',
                },
            ],
            visible: false,
            rules: {
                activityName: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                ],
                questions:[
                    { required: true, message: '请添加题目', trigger: 'blur' },
                ]
            },
        };
    },
    filters: {
        type: function (value) {
            const types = [
                '',
                '单选题',
                '多选题',
                '填空题',
                '判断题',
                '简答题',
                '组合题',
            ];
            return types[value];
        },
    },
    mounted() {
        EventBus.$on('selectedTopicSuccesss', (multipleSelection, resource, type) => {
            if (this.form.activityType !== type) {
                return
            }
            const questions = this.form.questions.filter(v => v.resource !== resource)
            questions.push(...multipleSelection.map(v => {
                v.show = false
                return v
            }))
            this.form.questions = questions

        });
        // 自主添加题目
        EventBus.$on('addCustomTopic', (question, type) => {

            console.log("type: ", type);
            console.log("question: ", question);
            if (this.form.activityType !== type) {
                return
            }
            this.form.questions.push({
                ...question,
                show: false
            })

        });
        // 编辑自主添加题目
        EventBus.$on('editCustomTopic', (question, type) => {
            if (this.form.activityType !== type) {
                return
            }
            this.form.questions = this.form.questions.map(v => {
                if (question.id === v.id) {
                    v = { ...v, ...question };
                }
                return v
            })
        });
    },
    methods: {
        // 查看题目解析
        handleLookAnalysis(item) {
            this.form.questions = this.form.questions.map((v) => {
                if (v.id === item.id) {
                    v.show = !v.show;
                }
                return v;
            });
        },
        // 处理点击编辑题目逻辑
        handleEditTopic(item) {
            const { resource, id } = item;
            const toasts = [
                '',
                '系统题库不可编辑',
                '我的题库题目请在“我的题库”中修改',
            ];
            if (toasts[resource]) {
                this.$confirm(toasts[resource], {
                    customClass: 'custom-message-box tooltip-box',
                    confirmButtonText: '确定',
                    showClose: false,
                    center: true,
                    showCancelButton: false,
                    confirmButtonClass: 'primary-btn',
                }).then(() => { });
            } else {
                // TODO 编辑自主答题
                const { activityType: type } = this.form
                console.log("id: ",id);
                this.$emit('select', { resource, type, id });
            }
        },
        // 删除题目
        handleDeleteTopic({ id }) {
            this.$confirm(`是否删除此题?`, {
                customClass: 'custom-message-box',
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                showClose: false,
                center: true,
                cancelButtonClass: 'plain-btn',
                confirmButtonClass: 'plain-btn',
            }).then(() => {
                this.form.questions = this.form.questions.filter((v) => v.id !== id);
            });
        },
        // 添加题目
        handleAddTopic({ resource }) {
            const { activityType: type, questions } = this.form;
            this.$emit('select', { resource, type, questions });
        },
    },
}