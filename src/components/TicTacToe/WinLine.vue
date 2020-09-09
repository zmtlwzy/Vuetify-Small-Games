<template>
  <div class="d-flex justify-center">
    <div class="win-line" :style="{width:`${boxWidth}px`,height:`${boxWidth}px`}">
      <svg >
        <transition @before-enter="beforeEnter" @after-enter="afterEnter">
          <path :d="path" ref="path" v-show="pathData && pathData.length === 4" />
        </transition>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pathData: {
      type: Array | undefined,
      required: true,
    },
    boxWidth: {
      type: Number | null,
      required: true,
    }
  },

  computed: {
    path() {
      if (this.pathData === undefined || this.pathData.length < 4) return
      const res = `M ${this.pathData[0]} ${this.pathData[1]} L ${this.pathData[2]} ${this.pathData[3]}`
      return res
    },
    lineLen() {
      if (this.pathData === undefined || this.pathData.length < 4) return
      const len = Math.sqrt(
        Math.pow(this.pathData[2] - this.pathData[0], 2) +
          Math.pow(this.pathData[3] - this.pathData[1], 2)
      )
      console.log(len)
      return len
    },
  },
  watch: {
    pathData(val) {
      if (val === undefined) return
      this.$refs.path.style.strokeDasharray = this.lineLen
    },
  },

  methods: {
    beforeEnter() {
      // console.log("before")
      this.$refs.path.style.strokeDasharray = this.lineLen
      this.$refs.path.style.strokeDashoffset = this.lineLen
    },
    afterEnter() {
      // console.log("afterEnter")
      this.$refs.path.style.strokeDashoffset = ""
    },
  },
}
</script>

<style lang="scss">
.win-line {
  position: fixed;
  z-index: 6;
  box-sizing: border-box;
  max-width: 450px;
  max-height: 450px;
  margin: 0 auto;
  pointer-events: none;
  svg {
    width: 100%;
    height: 100%;
    path {
      fill: none;
      stroke: #4caf50;
      stroke-width: 5px;
      stroke-linecap: round;
      
    }
  }
}
.v-enter-to {
  stroke-dashoffset: 0 !important;
}
.v-leave-to {
  opacity: 0;
}
.v-enter-active {
  transition: stroke-dashoffset 0.6s cubic-bezier(0.6, 0.12, 0.13, 0.86) 0.2s;
}
.v-leave-active {
  transition: opacity 0.3s cubic-bezier(0.06, 0.93, 0.38, 0.98);
}
</style>
