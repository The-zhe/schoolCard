/*
 * @Author: yato
 * @Date: 2021-11-10 16:47:09
 * @LastEditTime: 2021-12-08 17:43:36
 * @LastEditors: qz
 * @Description: 教学活动弹窗混入内容 在addActive页面中
 * @FilePath: \new-lesson-admin\src\components\teachActivity\injectMixins.js
 */
export default {
   props: {
      isPaper: {
         type: Boolean,
         default: false
      },
   },
   // , 'chapterId', 'course', 'bookId'
   inject: ['app'],
  
   computed: {
      grade() {
         return this.app.grade 
      },
      chapterId() {
         return this.app.chapterId 
      },
      course() {
         return this.app.course 
      },
      bookId() {
         return this.app.bookId 
      },
   },
}
