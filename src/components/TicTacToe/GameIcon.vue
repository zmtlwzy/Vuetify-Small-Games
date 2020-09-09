<template>
  <div
    class="svg-container"
    :style="{width:`${containerSize}px`,height:`${containerSize}px`}"
  >
    <svg :viewBox="viewBox">
      <transition
        name="cir"
        @before-enter="cirBeforeEnter"
        @after-enter="cirAfterEnter"
      >
        <circle
          class="circle"
          v-show="show === `O`"
          :r="radius"
          :stroke-width="strokeWidth"
          ref="circle"
        />
      </transition>
      <transition
        v-for="i in 2"
        :key="i"
        :name="`cro-${i}`"
        @before-enter="croBeforeEnter(i - 1)"
        @after-enter="croAfterEnter(i - 1)"
      >
        <path
          :class="[`cross-${i}`]"
          v-show="show === `X`"
          :d="crossPath[i - 1]"
          :stroke-width="strokeWidth"
          ref="cross"
        />
      </transition>
    </svg>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: String,
    },
    boxWidth: {
      type: Number | null,
      required: true,
    },
  },
  data() {
    return {
      viewSize: 60,
      radius: 25,
      strokeWidth: 6,
    }
  },
  computed: {
    containerSize() {
      return this.boxWidth * 0.18
    },

    viewBox() {
      return `0 0 ${this.viewSize} ${this.viewSize}`
    },
    sideLength() {
      return this.radius * 2 + this.strokeWidth + 3
    },
    crossPath() {
      const l = (this.sideLength * 0.5) / Math.sqrt(2)
      const s = this.viewSize * 0.5 - l
      const e = this.viewSize * 0.5 + l
      return [`M${s} ${s} ${e} ${e}`, `M${e} ${s} ${s} ${e}`]
    },
    perimeter() {
      return 2 * this.radius * Math.PI
    },
  },

  methods: {
    cirBeforeEnter() {
      this.$refs.circle.style.strokeDasharray = this.perimeter
      this.$refs.circle.style.strokeDashoffset = this.perimeter
    },
    cirAfterEnter() {
      this.$refs.circle.style.strokeDashoffset = ""
    },
    croBeforeEnter(index) {
      this.$refs.cross[index].style.strokeDasharray = this.sideLength
      this.$refs.cross[index].style.strokeDashoffset = this.sideLength
    },
    croAfterEnter(index) {
      this.$refs.cross[index].style.strokeDashoffset = ""
    },
  },
}
</script>

<style scoped lang="scss">
// $svgSize: 65px;

@mixin same {
  cx: 50%;
  cy: 50%;
  stroke: black;
  fill: none;
  stroke-linecap: round;
  will-change: stroke-dashoffset;
}

.svg-container {
  // width: $svgSize;
  // height: $svgSize;
  svg {
    width: 100%;
    height: 100%;
    .circle {
      @include same;
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }
    .cross-1,
    .cross-2 {
      @include same;
    }
  }
}

.cir-enter-to,
.cro-1-enter-to,
.cro-2-enter-to {
  stroke-dashoffset: 0 !important;
}

.cir-enter-active,
.cro-1-enter-active {
  transition: stroke-dashoffset 0.5s cubic-bezier(0.06, 0.93, 0.38, 0.98);
}

.cro-2-enter-active {
  transition: stroke-dashoffset 0.5s cubic-bezier(0.06, 0.93, 0.38, 0.98) 0.15s;
}

.cir-leave-to,
.cro-1-leave-to,
.cro-2-leave-to {
  opacity: 0;
}

.cir-leave-active,
.cro-1-leave-active,
.cro-2-leave-active {
  transition: opacity 0.3s cubic-bezier(0.06, 0.93, 0.38, 0.98);
}
</style>
