<template>
  <div class="computer-goband">
    <div class="svg-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        :viewBox="`0 0 ${viewWidth} ${viewHeight + 30}`"
        class="svg"
        ref="svg"
      >
        <defs>
          <radialGradient spreadMethod="reflect" cx="30%" cy="30%" r="90%" fx="45%" fy="35%" fr="0%" id="white-fill">
            <stop offset="5%" stop-color="#fff" />
            <stop offset="57%" stop-color="#dedede" />
            <stop offset="100%" stop-color="#8e8e8e" />
          </radialGradient>

          <radialGradient spreadMethod="reflect" cx="30%" cy="30%" r="80%" fx="45%" fy="35%" fr="0%" id="black-fill">
            <stop offset="5%" stop-color="#6e6e6e" />
            <stop offset="65%" stop-color="#0c0c0c" />
            <stop offset="95%" stop-color="black" />
          </radialGradient>
          <filter id="shadow">
            <feDropShadow :dx="cellSize / 30" :dy="cellSize / 20" :stdDeviation="cellSize / 35" flood-opacity="0.5" />
          </filter>

          <pattern id="chess-board-bg" width="1" height="1">
            <image xlink:href="../../assets/bg.jpg"></image>
          </pattern>

          <filter id="board-shadow" x="0" y="0" width="200%" height="200%">
            <feOffset in="SourceAlpha" dx="2" dy="1" result="offsetBlur" />
            <feColorMatrix
              result="matrixOut"
              in="offOut"
              type="matrix"
              values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0.6 0
            "
            />
            <feGaussianBlur result="blur" in="offOut" stdDeviation="3" />
            <feBlend in="SourceGraphic" in2="blur" mode="normal" />
          </filter>
        </defs>

        <symbol id="current-position" viewBox="0 0 100 100">
          <path
            d="M0 20 v-20 h20 M80 0 h20 v20 M100 80 v20 h-20 M20 100 h-20 v-20"
            fill="none"
            stroke="black"
            stroke-width="6"
          />
        </symbol>
        <g id="btn" :class="{ hide: bottomBtnHide }">
          <g id="restart-btn" class="board-btn" @click="restart">
            <rect :x="viewWidth / 2 - 95" :y="viewHeight" width="70" height="20" fill="url('#chess-board-bg')"></rect>
            <text class="btn-text" :x="viewWidth / 2 - 85" :y="viewHeight" textLength="50" text-anchor="start" dy="14">
              重新开始
            </text>
          </g>
          <g
            id="prev-step-btn"
            :class="{ disabled: isEnd || preChessBoard === null, 'board-btn': true }"
            @click="preStep"
          >
            <rect :x="viewWidth / 2 - 175" :y="viewHeight" width="50" height="20" fill="url('#chess-board-bg')"></rect>
            <text class="btn-text" :x="viewWidth / 2 - 165" :y="viewHeight" textLength="30" text-anchor="start" dy="14">
              悔棋
            </text>
          </g>
          <g id="black-first" :class="{ disabled: !isComputerFirst, 'board-btn': true }" @click="changeFirst(true)">
            <rect :x="viewWidth / 2 - 5" :y="viewHeight" width="70" height="20" fill="url('#chess-board-bg')"></rect>
            <text class="btn-text" :x="viewWidth / 2 + 5" :y="viewHeight" textLength="50" text-anchor="start" dy="14">
              电脑先手
            </text>
          </g>
          <g id="white-first" :class="{ disabled: isComputerFirst, 'board-btn': true }" @click="changeFirst(false)" >
            <rect :x="viewWidth / 2 + 85" :y="viewHeight" width="70" height="20" fill="url('#chess-board-bg')"></rect>
            <text class="btn-text" :x="viewWidth / 2 + 95" :y="viewHeight" textLength="50" text-anchor="start" dy="14">
              玩家先手
            </text>
          </g>
          <g id="hide-btn">
            <polygon :points="hideBtnPoints" fill="url('#chess-board-bg')" @click="hideBtn" />
          </g>
        </g>
        <g id="chess-board" @click="handleClick">
          <rect id="board" x="0" y="0" :width="viewWidth" :height="viewHeight"></rect>
          <use
            v-if="currentPos !== null"
            xlink:href="#current-position"
            :x="getPiecePos(currentPos[1]) - cellSize * 0.475"
            :y="getPiecePos(currentPos[0]) - cellSize * 0.475"
            :width="cellSize * 0.95"
            :height="cellSize * 0.95"
          />
          <path :d="linePath" stroke="black" stroke-width="1" />
          <g id="star-dot">
            <circle
              v-for="(item, index) in starPos"
              :key="index"
              :cx="getPiecePos(item[0])"
              :cy="getPiecePos(item[1])"
              :r="circleRadius * 0.3"
              fill="black"
            />
          </g>
        </g>
        <g id="black-piece">
          <circle
            v-for="(item, index) in blackArr"
            :key="`black-${index}`"
            :cx="getPiecePos(item.col)"
            :cy="getPiecePos(item.row)"
            :r="circleRadius"
            fill="url(#black-fill)"
            filter="url(#shadow)"
          />
        </g>
        <g id="white-piece">
          <circle
            v-for="(item, index) in whiteArr"
            :key="`white-${index}`"
            :cx="item.col * cellSize + boardPadding"
            :cy="item.row * cellSize + boardPadding"
            :r="circleRadius"
            fill="url(#white-fill)"
            filter="url(#shadow)"
          />
        </g>
      </svg>
    </div>
    <!-- <v-btn color="info" @click="restart">重新开始</v-btn>
    <v-btn color="info" @click="preStep" :disabled="isEnd || preChessBoard === null">悔棋</v-btn>
    <v-switch label="电脑先手" v-model="isComputerFirst" @change="changeFirst"></v-switch> -->
  </div>
</template>

<script>
import cd from 'lodash.clonedeep'

const COLOR = {
  White: 1,
  Black: 2
}

export default {
  name: 'pixi',
  data() {
    return {
      h: 15,
      v: 15,
      viewWidth: 450,
      viewHeight: 450,
      boardPadding: 20,
      nextColor: COLOR.White,
      chessBoard: [],
      currentPos: null,
      wins: [],
      winsNum: 0,
      myWin: [],
      computerWin: [],
      isComputerFirst: false,
      isEnd: false,

      preChessBoard: null,
      prePos: null,
      preMyWin: [],
      preComputerWin: [],
      bottomBtnHide: false
    }
  },
  computed: {
    linePath() {
      let line = ''
      const p = this.boardPadding
      const c = this.cellSize
      const v = this.viewWidth
      for (let i = 0; i < this.h; i++) {
        line += ` M${i * c + p} ${p} L${i * c + p} ${v - p}`
      }
      for (let i = 0; i < this.v; i++) {
        line += ` M${p} ${i * c + p} L${v - p} ${i * c + p}`
      }
      return line
    },

    starPos() {
      return [
        [this.h / 2, this.v / 2],
        [3, 3],
        [3, this.v - 4],
        [this.h - 4, 3],
        [this.h - 4, this.v - 4]
      ]
    },

    hideBtnPoints() {
      const s = [this.viewWidth / 2 + 185, this.viewHeight] // startPoint
      return `${s[0]},${s[1]} ${s[0]},${s[1] + 20} ${s[0] + 7},${s[1] + 30} ${s[0] + 14},${s[1] + 20} ${s[0] +
        14},${s[1] + 0}`
    },

    chessBoardArr() {
      return this.chessBoard.flat()
    },

    chessBoardObj() {
      return this.chessBoard
        .map((item, row) => {
          return item.map((item, col) => {
            return {
              row,
              col,
              color: item
            }
          })
        })
        .flat()
    },

    blackArr() {
      return this.chessBoardObj.filter(item => {
        return item.color === COLOR.Black
      })
    },

    whiteArr() {
      return this.chessBoardObj.filter(item => {
        return item.color === COLOR.White
      })
    },

    cellSize() {
      return ((this.viewWidth - 2 * this.boardPadding) / (this.h - 1)).toFixed(3)
    },

    circleRadius() {
      return this.cellSize * 0.4
    }
  },

  beforeMount() {
    let local = window.localStorage.getItem('isComputerFirst')
    console.log(local)
    if (local === null) {
      window.localStorage.setItem('isComputerFirst', this.isComputerFirst)
    } else {
      this.isComputerFirst = JSON.parse(local)
    }
    this.restart()
  },

  methods: {
    getPiecePos(num) {
      return Math.floor(num) * this.cellSize + this.boardPadding
    },

    initBoardData() {
      const res = []
      for (let a = 0; a < this.h; a++) {
        res[a] = []
        for (let b = 0; b < this.v; b++) {
          res[a][b] = 0
        }
      }
      return res
    },

    initWinsByBoth() {
      this.myWin = []
      this.computerWin = []
      for (var i = 0; i < this.winsNum; i++) {
        this.myWin[i] = 0
        this.computerWin[i] = 0
      }
    },

    computeRes(j, i) {
      let current, next, gameOverText
      if (this.nextColor === COLOR.White) {
        current = 'myWin'
        next = 'computerWin'
        gameOverText = '你赢了!'
      } else {
        current = 'computerWin'
        next = 'myWin'
        gameOverText = '电脑赢了!'
      }
      this.nextColor = 3 - this.nextColor

      for (var k = 0; k < this.winsNum; k++) {
        if (this.wins[j][i][k]) {
          this[current][k]++
          // 第k种赢法中，有黑子和白子两种，如果其中白子占用了这条路线，那么黑子则不可能在这条路线取胜，直接设为负数或6，不加入分值计算
          this[next][k] = -5
          if (this[current][k] == 5) {
            this.isEnd = true
            setTimeout(() => {
              window.alert(gameOverText)
            })
          }
        }
      }
    },

    generateAllWinsArr() {
      // 初始化赢法数组
      for (let a = 0; a < this.h; a++) {
        this.wins[a] = []
        for (let b = 0; b < this.v; b++) {
          this.wins[a][b] = []
        }
      }

      //横线
      for (var i = 0; i < this.h; i++) {
        for (var j = 0; j < this.v - 4; j++) {
          for (var k = 0; k < 5; k++) {
            this.wins[i][j + k][this.winsNum] = true
          }
          this.winsNum++
        }
      }

      //竖线
      for (var i = 0; i < this.h; i++) {
        for (var j = 0; j < this.v - 4; j++) {
          for (var k = 0; k < 5; k++) {
            this.wins[j + k][i][this.winsNum] = true
          }
          this.winsNum++
        }
      }

      //斜线
      for (var i = 0; i < this.h - 4; i++) {
        for (var j = 0; j < this.v - 4; j++) {
          for (var k = 0; k < 5; k++) {
            this.wins[i + k][j + k][this.winsNum] = true
          }
          this.winsNum++
        }
      }

      //反斜线
      for (var i = 0; i < this.h - 4; i++) {
        for (var j = this.v - 1; j > 3; j--) {
          for (var k = 0; k < 5; k++) {
            this.wins[i + k][j - k][this.winsNum] = true
          }
          this.winsNum++
        }
      }
    },

    computerAI() {
      const myScore = [] //人类的分值
      const computerScore = [] //电脑的分值
      let max = 0 //落子的价值
      let [u, v] = [0, 0] //落子的坐标

      //初始化分值
      for (var i = 0; i < this.h; i++) {
        myScore[i] = []
        computerScore[i] = []
        for (var j = 0; j < this.v; j++) {
          myScore[i][j] = 0
          computerScore[i][j] = 0
        }
      }

      //计算所有赢法分值
      for (var i = 0; i < this.h; i++) {
        for (var j = 0; j < this.v; j++) {
          if (this.chessBoard[i][j] === 0) {
            //该点没有棋子，可下棋
            for (var k = 0; k < this.winsNum; k++) {
              //遍历所有赢法
              if (this.wins[i][j][k]) {
                // 坐标i,j中，第k种赢法有子
                if (this.myWin[k] == 1) {
                  // 第k种赢法中，人类方有一子
                  myScore[i][j] += 200
                } else if (this.myWin[k] == 2) {
                  myScore[i][j] += 400
                } else if (this.myWin[k] == 3) {
                  myScore[i][j] += 2000
                } else if (this.myWin[k] == 4) {
                  myScore[i][j] += 10000
                }

                if (this.computerWin[k] == 1) {
                  // 第k种赢法中，电脑方有一子
                  computerScore[i][j] += 220
                } else if (this.computerWin[k] == 2) {
                  computerScore[i][j] += 420
                } else if (this.computerWin[k] == 3) {
                  computerScore[i][j] += 2100
                } else if (this.computerWin[k] == 4) {
                  computerScore[i][j] += 20000
                }
              }
            }

            //下面判断计算机落子的最佳处

            // 先计算人下一步哪个分值更高，高于电脑则优先截断，如果下一步电脑分值高，则优先扩充自己的路线
            if (myScore[i][j] > max) {
              //人在某步的权值更高的时候
              max = myScore[i][j]
              u = i
              v = j
            } else if (myScore[i][j] == max) {
              //如果权值是最大了
              if (computerScore[i][j] > computerScore[u][v]) {
                //而i,j点的权值比在u,v点的更大时
                u = i
                v = j
              }
            }

            if (computerScore[i][j] > max) {
              //电脑在某步的权值更高的时候
              max = computerScore[i][j]
              u = i
              v = j
            } else if (computerScore[i][j] == max) {
              //如果权值是最大了
              if (myScore[i][j] > myScore[u][v]) {
                //而电脑在此处落子更有用
                u = i
                v = j
              }
            }
          }
        }
      }

      this.oneStep(u, v, COLOR.Black)

      this.currentPos = [u, v]

      this.computeRes(u, v)
    },

    oneStep(x, y, color) {
      const a = [...this.chessBoard]
      a[x][y] = color
      this.chessBoard = a
    },

    changeFirst(val) {
      console.log('change')
      this.isComputerFirst = val
      window.localStorage.setItem('isComputerFirst', val)
      this.restart()
    },

    hideBtn() {
      this.bottomBtnHide = !this.bottomBtnHide
    },

    handleClick(e) {
      if (this.isEnd) return
      if (this.whiteArr.length > 0) {
        this.preChessBoard = cd(this.chessBoard)
        this.preMyWin = cd(this.myWin)
        this.preComputerWin = cd(this.computerWin)
        this.prePos = cd(this.currentPos)
      }
      const zoom_x = this.viewWidth / this.$refs.svg.clientWidth
      const zoom_Y = (this.viewHeight + 30) / this.$refs.svg.clientHeight

      let x = e.offsetX * zoom_x - this.boardPadding
      let y = e.offsetY * zoom_Y - this.boardPadding

      let i = Math.round(x / this.cellSize)
      let j = Math.round(y / this.cellSize)
      if (i < 0 || j < 0 || i > this.h - 1 || j > this.v - 1) {
        return
      }

      console.log(i, j)

      if (this.chessBoard[j][i] !== 0) return

      this.oneStep(j, i, COLOR.White)

      this.computeRes(j, i)
      if (!this.isEnd) this.computerAI()
    },

    restart() {
      this.chessBoard = this.initBoardData()
      if (this.isComputerFirst) {
        this.oneStep(Math.floor(this.h / 2), Math.floor(this.v / 2), COLOR.Black)
      }
      this.nextColor = COLOR.White
      this.generateAllWinsArr()
      this.initWinsByBoth()
      this.currentPos = null
      this.preChessBoard = null
      this.isEnd = false
    },

    preStep() {
      if (this.preChessBoard === null) return
      console.log('preStep')
      this.chessBoard = this.preChessBoard
      this.myWin = this.preMyWin
      this.computerWin = this.preComputerWin
      this.currentPos = this.prePos
      this.preChessBoard = null
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-container {
  width: 85vw;
  height: 85vw;
  margin-top: 50px;
  max-width: 700px;
  max-height: 700px;
  #btn {
    transition: transform 0.2s ease;
    &.hide {
      transform: translateY(-20px);
    }
    .board-btn {
      &.disabled {
        opacity: 0.5;
      }
      .btn-text {
        font-size: 11px;
        fill: white;
      }
    }
  }
  #chess-board {
    #board {
      fill: url('#chess-board-bg');
      filter: url('#board-shadow');
    }
  }
}
.svg {
  width: 100%;
  height: 100%;
}
</style>
