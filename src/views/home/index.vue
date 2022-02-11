<template>
  <div class="home">
    <div class="m1" v-show="img1">
      <img src="./img/b1.png" alt="" />
      <div class="c1" @click="show(2)"></div>
    </div>
    <div class="m1 m2" v-show="img2">
      <img src="./img/b2.png" alt="" />
      <div class="c1" @click="show(1)"></div>
      <div class="c2" @click="show2(3)"></div>
    </div>
    <div class="mask" v-show="img3" @click="show(2)">
      <img class="m3" @click.stop.prevent="show(4)" src="./img/b3.png" alt="" />
    </div>
    <div class="m1 m4" v-show="img4">
      <img src="./img/b4.png" alt="" />
      <div class="c1" @click="show(1)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      img1: true,
      img2: false,
      img3: false,
      img4: false,
    };
  },
  mounted() {},
  methods: {
    show(e) {
      for (let i = 1; i < 5; i++) {
        this["img" + i] = i == e;
        console.log(this["img" + i]);
      }
    },
    show2() {
      this.img3 = true;
    },
  },
};
</script>

<style lang="less" scoped>
.m4 {
  .m1 {
    position: absolute;
    left: 11.5%;
    top: 0.4%;
    width: 3.5%;
    height: 2.4%;
    cursor: pointer;
  }
}
.m3 {
  margin-top: 8%;
  margin-left: 22%;
  width: 345px;
  height: 543px;
  cursor: pointer;
}
.m1 {
  margin: 20px auto;
  display: block;
  width: 90%;
  position: relative;
  > img {
    display: block;
    width: 100%;
  }
  .c1 {
    position: absolute;
    left: 12.2%;
    top: 0.4%;
    width: 5.5%;
    height: 2.4%;
    cursor: pointer;
  }
}
.m2 {
  .c2 {
    position: absolute;
    cursor: pointer;
    left: 2%;
    top: 6%;
    width: 16%;
    height: 13%;
  }
  .c1 {
    left: 13.2%;
  }
}
</style>
