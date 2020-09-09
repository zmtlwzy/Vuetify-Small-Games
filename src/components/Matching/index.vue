<template>
  <div class="matching d-flex justify-center align-center flex-column">
    <v-alert
      dense
      dark
      icon="mdi-clock"
      :color="alertColor"
      class="mt-12 mb-8 time-alert"
    >
      <span class="font-weight-bold" ref="timeStr"
        >用时：{{ timeStamp | time }}</span
      >
    </v-alert>
    <div :class="gameBoard">
      <div
        v-for="(item, index) in iconData"
        :key="index"
        class="card-container"
        ref="card"
        @click="handleClick(index, item)"
      >
        <div class="cover" v-ripple="{ center: true, class: `white--text` }">
          {{ item }}
        </div>
        <div class="back">❓</div>
      </div>
    </div>
    <v-btn-toggle
      v-model="toggle_exclusive"
      class="mt-10"
      mandatory
      dense
      color="info"
      light
    >
      <v-btn @click="easy"> <span class="mx-6"> 简单 </span></v-btn>
      <v-btn @click="normal"> <span class="mx-6"> 普通 </span></v-btn>
      <v-btn @click="hard"> <span class="mx-6"> 困难 </span></v-btn>
    </v-btn-toggle>
  </div>
</template>

<script>
import { sleep, shuffle } from "@/share.js"
const cardEmojis = [
  "😄",
  "👨",
  "👵",
  "🎈",
  "🎄",
  "👓",
  "🍕",
  "🥖",
  "🍥",
  "🚍",
  "🚀",
  "🚧",
  "🦄",
  "👀",
  "❤",
  "👌",
  "🍳",
  "🙏",
]

function createArr(arr, size) {
  const a = arr.slice(0, size)
  const res = new Array(2).fill(a).flat()
  return shuffle(res)
}

export default {
  name:'Matching',
  data() {
    return {
      iconData: [],
      cardNum: 16,
      difficulty: "easy",
      timeStamp: 0,
      timer: null,
      gameBoard: {
        "game-board": true,
        easy: true,
        normal: false,
      },

      lastEmoji: {
        class: null,
        text: null,
      },

      isStop: false,
      FirstClickTime: false,
      toggle_exclusive: 0,
      alertColor: "blue lighten-2",
    }
  },
  filters: {
    time(msec) {
      const _sec = (msec / 1000).toFixed(0)
      const min = Math.floor(_sec / 60)
        .toString()
        .padStart(2, "0")
      const sec = (_sec % 60).toString().padStart(2, "0")
      return `${min}分 ${sec}秒`
    },
  },
  beforeMount() {
    this.easy()
  },
  methods: {
    // 重新开始
    async restart(cardNum, str, classObj) {
      // 清除定时器
      clearInterval(this.timer)
      this.$refs.timeStr &&
        this.$refs.timeStr.classList.remove("twinkle-animation")

      // 将翻到正面的牌翻回背面
      const elementArr = this.$refs.card

      if (
        elementArr &&
        elementArr.some((item, index) => {
          return item.classList.contains("active")
        })
      ) {
        elementArr.forEach((item, index) => {
          item.classList.remove("active")
        })
        await sleep(300)
      }

      // 重置所有状态参数
      this.FirstClickTime = null
      this.timeStamp = 0
      this.lastEmoji = {
        class: null,
        text: null,
      }
      this.alertColor = "blue-grey lighten-4"
      this.iconData = createArr(cardEmojis, cardNum / 2)
      this.cardNum = cardNum
      this.difficulty = str
      Object.assign(this.gameBoard, classObj)
    },

    easy() {
      this.restart(16, "easy", {
        easy: true,
        normal: false,
        hard: false,
      })
    },

    normal() {
      this.restart(24, "normal", {
        easy: false,
        normal: true,
        hard: false,
      })
    },

    hard() {
      this.restart(36, "hard", {
        easy: false,
        normal: false,
        hard: true,
      })
    },

    // 处理点击卡片事件
    async handleClick(index, item) {
      // 保存初次点击的时间
      if (this.FirstClickTime === null) {
        this.alertColor = "blue lighten-2"
        this.FirstClickTime = new Date()
        this.timer = setInterval(() => {
          this.timeStamp = new Date() - this.FirstClickTime
        }, 1000)
      }

      // 点开2张卡片期间不允许再点击
      if (this.isStop) return

      const elementArr = this.$refs.card
      const elementClass = elementArr[index].classList

      // 处理没翻开的卡片
      if (!elementClass.contains("active")) {
        elementClass.add("active")
        // 计算翻开的卡片的数量
        let activeCount = elementArr.filter((item, index) => {
          return item.classList.contains("active")
        }).length

        // 上一张翻开的卡片是否存在
        if (this.lastEmoji.text === null) {
          this.lastEmoji.class = elementClass
          this.lastEmoji.text = item
        } else {
          // 2张卡片不相同，翻回背面
          if (this.lastEmoji.text !== item) {
            this.isStop = true
            elementClass.add("swing-animation")
            this.lastEmoji.class.add("swing-animation")
            await sleep(900)
            elementClass.remove("active","swing-animation")
            this.lastEmoji.class.remove("active","swing-animation")
            this.isStop = false
          }

          // 2张卡片不管是否相同，将上一张记录清空
          this.lastEmoji = {
            class: null,
            text: null,
          }

          // 卡片全部翻完，重置
          if (activeCount === this.cardNum) {
            clearInterval(this.timer)
            // await sleep(1000)
            // this[this.difficulty]()
            this.alertColor = "success"
            this.$refs.timeStr.classList.add("twinkle-animation")
            setTimeout(() => {
              this.$refs.timeStr.classList.remove("twinkle-animation")
            }, 2000)
          }
        }
      }
    },
  },
}
</script>

<style lang="scss">
$width: 11.4vw;
$height: 13vw;
$width2: 68.8px;
$height2: 78.5px;
$breakPoint: 600px;

.matching {
  .time-alert {
    span {
      letter-spacing: 2px;
      margin-right: 1rem;
    }
  }
  .game-board {
    width: 86vw;
    height: 98vw;
    max-width: $breakPoint;
    max-height: $breakPoint;
    display: grid;

    place-content: space-evenly space-evenly;
    &.easy {
      grid-template-columns: repeat(4, $width);
      grid-template-rows: repeat(4, $height);
    }
    &.normal {
      grid-template-columns: repeat(4, $width);
      grid-template-rows: repeat(6, $height);
    }
    &.hard {
      grid-template-columns: repeat(6, $width);
      grid-template-rows: repeat(6, $height);
    }
    @media screen and (min-width: $breakPoint) {
      &.easy {
        grid-template-columns: repeat(4, $width2);
        grid-template-rows: repeat(4, $height2);
      }
      &.normal {
        grid-template-columns: repeat(4, $width2);
        grid-template-rows: repeat(6, $height2);
      }
      &.hard {
        grid-template-columns: repeat(6, $width2);
        grid-template-rows: repeat(6, $height2);
      }
    }
    .card-container {
      perspective: 1000px;
      .cover,
      .back {
        position: absolute;
        line-height: $height;
        text-align: center;
        border-radius: 1.32vw;
        font-size: 5vw;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        transition: transform 0.25s ease-in-out;
        box-shadow: 0 0.12rem 0.2rem rgba(0, 0, 0, 0.18);
        // filter: drop-shadow( 0 0.12rem 0.2rem rgba(0,0,0,0.18));
      }
      @media screen and (min-width: $breakPoint) {
        .cover,
        .back {
          line-height: $height2;
          font-size: 30px;
          text-align: center;
          display: block;
          border-radius: 7.92px;
        }
      }
      .cover {
        background-image: radial-gradient(
          circle 120px at 49.4% 19%,
          rgba(23, 156, 214, 1) 0%,
          rgba(52, 48, 111, 1) 100.2%
        );
        transform: rotateY(-180deg);
      }

      .back {
        background-color: rgb(214, 214, 214);
        transform: rotateY(0deg);
      }
      &.active {
        .cover {
          transform: rotateY(0deg);
        }
        .back {
          transform: rotatey(180deg);
        }
      }
    }
  }
  .difficulty-select {
    width: 100%;
  }
}
</style>
