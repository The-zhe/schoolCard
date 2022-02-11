import { mapState } from "vuex";
import { weburl } from "@/configs"
export default {
  data () {
    return {
      webUrl: weburl
    };
  },
  computed: {
    ...mapState({
      imgPrefix: (state) => state.imgPrefix,
    }),
  },
  created () {
    this.args_type = args_type
  },
  methods: {
    replaceImgPrefix (e) {
      return e ? e.replace(this.imgPrefix, "") : ''
    },
    insertImgFn (str) {
      if (!str) {
        return str
      }
      let result = ''
      let reg = 'src=\"'
      let num = 0
      while (str.indexOf(reg) > -1) {
        num++
        let start = str.indexOf(reg) + reg.length;
        result += str.slice(0, start) + this.imgPrefix
        str = str.slice(start)
        if (num > 10) {
          str = ''
        }
      }
      result += str
      return result
    },
  },
  filters: {
  }
};
