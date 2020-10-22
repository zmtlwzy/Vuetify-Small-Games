<template>
  <div id="gobang" class="d-flex justify-center align-center flex-column">
    <s-btn class="tips my-6" disabled>
      <template #default>
        <v-icon color="black" class="mr-2">{{ icon }}</v-icon>
        {{ gameResult || gameInfo }}
      </template>
    </s-btn>

    <s-btn disabled class="gobang-board">
      <div class="gobang-container" :style="conStyle" :class="sizeClass">
        <div class="cell" v-for="(i, index) in totalNum" :key="i" @click="handleClick(index)">
          <div
            ref="piece"
            :class="{
              circle: checkerboard[index] !== 0,
              white: checkerboard[index] === 1,
              black: checkerboard[index] === 2
            }"
          ></div>
        </div>
      </div>
    </s-btn>
    <div class="button mt-8 d-flex flex-column justify-center" :style="{ marginBottom: '20px', width: '100%' }">
      <!-- <div class="d-flex justify-center mb-6">
        <v-btn-toggle
          v-model="toggle_exclusive"
          mandatory
          dense
          color="black"
          light
        >
          <v-btn @click="small"> <span class="mx-4"> 8 X 8 </span></v-btn>
          <v-btn @click="normal"> <span class="mx-4"> 12X12 </span></v-btn>
          <v-btn @click="large"> <span class="mx-4"> 16X16 </span></v-btn>
        </v-btn-toggle>
      </div> -->

      <div class="d-flex justify-space-between mb-6">
        <div :style="{ width: '40%' }">
          <s-btn @click="blackFirst" class="text-center">
            黑色先手
          </s-btn>
        </div>
        <div :style="{ width: '40%' }">
          <s-btn @click="whiteFirst" class="text-center">
            白色先手
          </s-btn>
        </div>
      </div>

      <s-btn @click="isReset" :disabled="isNull" class="text-center">重新开始</s-btn>
    </div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">当前对局未结束！</v-card-title>
          <v-card-text>是否重新开始游戏？</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false">取消</v-btn>
            <v-btn color="green darken-1" text @click="reset(dialogArg)">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import sBtn from './SolidButton.vue'
const COLOR = {
  White: 1,
  Black: 2
}

export default {
  name: 'gobang',
  components: {
    sBtn
  },
  data() {
    return {
      h: 12,
      v: 12,
      isCheckerboardClick: true,
      checkerboard: [],
      white: [],
      black: [],
      fmove: COLOR.White,
      nmove: COLOR.Black,
      nextColor: null,
      gameResult: null,
      stateToggle: null,
      isWin: false,

      icon: 'mdi-information',

      toggle_exclusive: 1,
      dialog: false,
      dialogArg: {}
    }
  },
  watch: {
    whiteArr(val) {
      this.gobangRule(val, COLOR.White)
    },
    blackArr(val) {
      this.gobangRule(val, COLOR.Black)
    },
    isFull(val) {
      if (val) {
        this.gameResult = '此局平局，请重新开始'
      }
    }
  },
  computed: {
    // alertColor() {
    //   return "blue lighten-2"
    // },
    alertType() {
      mdi - information
      return 'mdi-check-circle'
    },
    conStyle() {
      return {
        gridTemplateColumns: `repeat(${this.h},1fr)`,
        gridTemplateRows: `repeat(${this.v},1fr)`
      }
    },
    sizeClass() {
      switch (this.toggle_exclusive) {
        case 0:
          return 'large'
        case 1:
          return 'normal'
        case 2:
          return 'small'
      }
    },
    totalNum() {
      return this.h * this.v
    },
    whiteArr() {
      return this.white.map(this.getColorArr)
    },
    blackArr() {
      return this.black.map(this.getColorArr)
    },
    isNull() {
      return this.checkerboard.every(item => {
        return item === 0
      })
    },
    isFull() {
      return this.checkerboard.every(item => {
        return item !== 0
      })
    },
    gameInfo() {
      switch (this.nextColor) {
        case COLOR.White:
          return '下一步：白色方'
        case COLOR.Black:
          return '下一步：黑色方'
      }
    }
  },
  beforeMount() {
    this.checkerboard = this.getInitialBoardData()
    this.nextStep()
  },
  methods: {
    small() {
      this.isReset({
        h: 8,
        v: 8
      })
    },
    normal() {
      this.isReset({
        h: 12,
        v: 12
      })
    },
    large() {
      this.isReset({
        h: 16,
        v: 16
      })
    },

    getInitialBoardData() {
      const n = this.totalNum
      return new Array(n).fill(0)
    },

    toggleColor: function*() {
      while (true) {
        yield this.fmove
        yield this.nmove
      }
    },

    nextStep() {
      if (this.stateToggle === null) {
        this.stateToggle = this.toggleColor()
      }
      this.nextColor = this.stateToggle.next().value
    },

    blackFirst() {
      this.fmove = COLOR.Black
      this.nmove = COLOR.White
      this.isReset()
    },

    whiteFirst() {
      this.fmove = COLOR.White
      this.nmove = COLOR.Black
      this.isReset()
    },

    getColorArr(item, index) {
      return {
        row: Math.floor(item / this.h),
        col: item % this.h
      }
    },

    handleClick(index) {
      const l = [...this.checkerboard]
      if (!this.isCheckerboardClick || l[index] !== 0) {
        return
      }
      l[index] = this.nextColor
      if (this.nextColor === COLOR.White) {
        this.white.push(index)
      } else if (this.nextColor === COLOR.Black) {
        this.black.push(index)
      }
      this.checkerboard = l
      this.nextStep()
    },

    handleWin(winDataArr, winColor) {
      const res = this.flatData(winDataArr)
      this.isCheckerboardClick = false
      this.icon = 'mdi-check-circle'
      this.isWin = true
      switch (winColor) {
        case COLOR.White:
          this.gameResult = '白子获胜'

          break
        case COLOR.Black:
          this.gameResult = '黑子获胜'
          break
      }

      // 避免最后一个棋子没有动画
      setTimeout(() => {
        res.forEach(item => {
          this.$refs.piece[item].classList.add('twinkle-animation')
        })
      })
    },

    flatData(val) {
      return val.map((item, index) => {
        return item.row * this.h + item.col
      })
    },

    isReset(overlayData) {
      if (!this.isNull && !this.isWin) {
        this.dialogArg = overlayData
        this.dialog = true
      } else {
        this.reset(overlayData)
      }
    },

    reset(overlayData = {}) {
      Object.assign(this, overlayData)
      this.checkerboard = this.getInitialBoardData()
      this.white = []
      this.black = []
      this.stateToggle = null
      this.isCheckerboardClick = true
      this.gameResult = null
      this.icon = 'mdi-information'
      this.isWin = false

      this.nextStep()
      this.dialog = false
    },

    gobangRule(val, color) {
      if (val.length < 5) return

      //将棋子顺序有左向右，上到下的顺序排序
      let sortVal = [...val].sort((a, b) => {
        let res = a.row - b.row
        if (res === 0) res = a.col - b.col
        return res
      })

      let num = 1
      let findedVal

      // 存放赢得对局后4种连线方式的数组，用于后续动画
      let horizontalArr = []
      let verticalArr = []
      let leftSkewArr = []
      let rightSkewArr = []

      main: while (true) {
        if (!sortVal[0]) break

        // 删除第一个元素并提取棋子位置
        const { row, col } = sortVal.shift()

        // 是否连成 ‘-’
        while (true) {
          if (
            (findedVal = sortVal.find(item => {
              return item.row === row && item.col - col === num
            }))
          ) {
            num++
            horizontalArr.push(findedVal)
            if (num === 5) {
              horizontalArr.unshift({ row, col })
              this.handleWin(horizontalArr, color)
              break main
            }
          } else {
            horizontalArr = []
            num = 1
            break
          }
        }

        // 是否连成 ‘|’
        while (true) {
          if (
            (findedVal = sortVal.find(item => {
              return item.row === row + num && item.col === col
            }))
          ) {
            num++
            verticalArr.push(findedVal)
            if (num === 5) {
              verticalArr.unshift({ row, col })
              this.handleWin(verticalArr, color)
              break main
            }
          } else {
            verticalArr = []
            num = 1
            break
          }
        }

        // 是否连成 ‘/’
        while (true) {
          if (
            (findedVal = sortVal.find(item => {
              return item.row === row + num && item.col - col === -num
            }))
          ) {
            num++
            leftSkewArr.push(findedVal)
            if (num === 5) {
              leftSkewArr.unshift({ row, col })
              this.handleWin(leftSkewArr, color)
              break main
            }
          } else {
            leftSkewArr = []
            num = 1
            break
          }
        }

        // 是否连成 ‘\’
        while (true) {
          if (
            (findedVal = sortVal.find(item => {
              return item.row === row + num && item.col - col === num
            }))
          ) {
            num++
            rightSkewArr.push(findedVal)
            if (num === 5) {
              rightSkewArr.unshift({ row, col })
              this.handleWin(rightSkewArr, color)
              break main
            }
          } else {
            rightSkewArr = []
            num = 1
            break
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
$piece-shadow: 1px 2px 3px rgba(104, 104, 104, 0.616), 2px 4px 8px rgba(143, 143, 143, 0.5);
$checkerboard-bg-color: #eee;
#gobang {
  .tips {
    border-radius: 10px;
    width: 100%;
  }
  .gobang-board {
    padding: 20px;
    border-radius: 20px;
    width: 85vw;
    height: 85vw;
    max-height: 500px;
    max-width: 500px;
    .gobang-container {
      display: grid;
      width: 100%;
      height: 100%;
      border: 3px solid #000;
      position: relative;
      &.small {
        gap: 1px;
      }
      &.normal {
        gap: 1px;
      }
      &.large {
        gap: 2px;
      }

      &::before {
        content: '';
        display: block;
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: #000;
        z-index: 0;
      }
      .cell {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: $checkerboard-bg-color;
        display: flex;
        justify-content: center;
        align-items: center;
        .circle {
          width: 70%;
          height: 70%;
          border-radius: 50%;
          &.white {
            background-color: #fff;
            background-image: radial-gradient(circle at 45% 40%, #fff 5%, #f0f0f0 60%, #666 100%);
            box-shadow: $piece-shadow;
          }
          &.black {
            background-color: #000;
            background-image: radial-gradient(circle at 40% 20%, rgba(204, 204, 204, 0.555) 0%, #000 60%);
            box-shadow: $piece-shadow;
          }
        }
      }
    }
  }
}
</style>
