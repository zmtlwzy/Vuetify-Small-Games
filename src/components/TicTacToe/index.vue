<template>
  <div class="tic-tac-toe">
    <v-alert
      dense
      outlined
      :type="alertType"
      :color="alertColor"
      class="tips mt-12"
      width="100%"
    >
      {{ gameText }}
    </v-alert>
    <WinLine :pathData="winPath" :boxWidth="boxWidth" />
    <div ref="grid" class="grid">
      <div
        v-for="i in 9"
        :key="i"
        flat
        ref="subBox"
        @click="handleClick(i - 1)"
        class="con"
        v-ripple="{ class: `blue--text text--lighten-2` }"
      >
        <GameIcon :show="arr[i - 1]" :boxWidth="boxWidth"/>
      </div>
    </div>
    <v-card height="50" flat class="statistics">
      <div class="d-flex align-center justify-space-evenly mt-7 fill-height">
        <v-chip class="ma-2" color="success" outlined label>
          <span>O 胜： </span>
          <strong>{{ statistics.O }}</strong>
        </v-chip>
        <v-chip class="ma-2" color="red" outlined label>
          <span>X 胜： </span>
          <strong>{{ statistics.X }}</strong>
        </v-chip>
        <v-chip class="ma-2" color="warning" outlined label>
          <span>平 局： </span>
          <strong>{{ statistics.draw }}</strong>
        </v-chip>
      </div>
    </v-card>
    <div class="game-bottom d-flex flex-column align-center">
      <v-btn
        :min-height="50"
        :disabled="gameState === 0"
        outlined
        rounded
        color="indigo"
        @click="reStart"
        class="restart px-12"
      >
        {{ btnText }}
      </v-btn>
    </div>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="290">
        <v-card>
          <v-card-title class="headline">当前对局未结束！</v-card-title>
          <v-card-text>是否重新开始游戏？</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialog = false"
              >取消</v-btn
            >
            <v-btn color="green darken-1" text @click="reStart">确定</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>
</template>

<script>
import GameIcon from "./GameIcon.vue"
import WinLine from "./WinLine.vue"

const GS = {
  ready: 0,
  running: 1,
  circle: 2,
  cross: 3,
  draw: 4,
}

const getNullArr = () => new Array(9).fill(null)
export default {
  name:'TicTacToe',
  components: {
    GameIcon,
    WinLine,
  },
  data() {
    return {
      arr: [],
      gameResult: "",
      gameState: GS.ready,
      btnText: "重新开始",
      btnState: false,
      boxWidth: null,
      subBoxSize: null,
      winPath: [],
      winIndex: null,
      dialog: false,
      alertColor: "blue lighten-2",
      alertType: "info",
      statistics: {
        O: 0,
        X: 0,
        draw: 0,
      },
    }
  },
  beforeMount() {
    this.arr = getNullArr()
  },
  mounted() {
    this.calcBoxSize()
    window.addEventListener("resize", this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize)
  },
  computed: {
    len() {
      return this.arr.filter((item) => item === null).length
    },
    nextPlayer() {
      return this.len % 2 === 1 ? "O" : "X"
    },
    gameText() {
      return this.gameState < 2 ? `下一步: ${this.nextPlayer}` : this.gameResult
    },
  },
  watch: {
    gameState(value) {
      // console.log("value:", value)
      switch (value) {
        case GS.ready:
          this.arr = getNullArr()
          this.gameResult = ""
          this.btnState = false
          break
        case GS.running:
          this.btnState = false
          break
        case GS.circle:
          this.gameResult = "获胜者: O"
          this.btnState = true
          this.alertColor = "success"
          this.alertType = "success"
          this.btnText = "再来一局"
          break
        case GS.cross:
          this.gameResult = "获胜者: X"
          this.btnState = true
          this.alertColor = "success"
          this.alertType = "success"
          this.btnText = "再来一局"

          break
        case GS.draw:
          this.gameResult = "平局"
          this.btnState = true
          this.alertColor = "yellow darken-3"
          this.alertType = "info"
          this.btnText = "再来一局"

          break
      }
    },
  },

  methods: {
    calcBoxSize() {
      const { offsetWidth: gw, offsetHeight: gh } = this.$refs.grid
      const { offsetWidth, offsetHeight } = this.$refs.subBox[0]

      this.$refs.grid.style.height = `${gw}px`
      this.boxWidth = gw
      this.subBoxSize = offsetWidth
    },

    handleClick(index) {
      if (this.gameState >= 2) return
      if (this.arr[index] !== null) return
      const _arr = [...this.arr]
      _arr[index] = this.nextPlayer
      this.arr = _arr
      if (this.len < 9) this.gameState = GS.running
      this.calculateWinner()
    },

    handleResize() {
      this.calcBoxSize()
      if (this.gameState === GS.ready) return
      this.winPath = this.calclateWinLine(this.winIndex)
    },

    judgeTyps(data) {
      if (data === "O") {
        this.gameState = GS.circle
        this.statistics.O += 1
      } else {
        this.gameState = GS.cross
        this.statistics.X += 1
      }
    },

    calclateWinLine(index) {
      const [a, b, c, d, e, la, le] = [
        0.2 * this.subBoxSize + 5,
        0.5 * this.subBoxSize + 5,
        1.5 * this.subBoxSize + 10,
        2.5 * this.subBoxSize + 15,
        2.8 * this.subBoxSize + 15,
        0.15 * this.subBoxSize + 5,
        2.85 * this.subBoxSize + 15,
      ]

      const pathDataArr = [
        [la, b, le, b],
        [la, c, le, c],
        [la, d, le, d],

        [b, la, b, le],
        [c, la, c, le],
        [d, la, d, le],

        [a, a, e, e],
        [e, a, a, e],
      ]
      return pathDataArr[index]
    },

    calculateWinner() {
      const [squares, len] = [this.arr, this.len]
      if (len > 4) return
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ]

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c]
        ) {
          this.winIndex = i
          this.winPath = this.calclateWinLine(i)
          this.judgeTyps(squares[a])
          return
        }
      }
      if (len === 0) {
        this.gameState = GS.draw
        this.statistics.draw += 1
      }
    },

    reStart() {
      if (this.gameState === GS.running) {
        if (this.dialog) {
          this.dialog = false
        } else {
          this.dialog = true
          return
        }
      }
      this.gameState = GS.ready
      this.winPath = []
      this.alertColor = "blue lighten-2"
      this.alertType = "info"
      this.btnText = "重新开始"
      this.winIndex = null
    },
  },
}
</script>

<style lang="scss">
.tic-tac-toe {
  width: 85%;
  max-width: 450px;
  .tips {
    margin: 0 0 30px 0;
    font-weight: 600;
  }
  .grid {
    display: grid;
    box-sizing: border-box;
    padding: 5px;
    width: 100%;
    max-height: 450px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    gap: 5px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: calc(100% - 0.001px);
      background-color: #000;
      z-index: 0;
      border-radius: 5px;
    }
    .con {
      z-index: 5;
      background-color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .statistics {
    span {
      font-weight: 400;
    }
  }
  .game-bottom {
    .restart {
      font-weight: 400;
      font-size: 1.1rem;
      margin: 30px 0;
    }
  }
}

</style>
