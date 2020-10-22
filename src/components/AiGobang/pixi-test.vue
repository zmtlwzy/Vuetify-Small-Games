<template>
  <div class="cavans-container"></div>
</template>

<script>
import { Application, Graphics } from 'pixi.js'
//Create a Pixi Application
let app = new Application({
  width: 256,
  height: 256,
  antialias: true,
  transparent: false,
  resolution: 1
})

//Circle
let circle = new Graphics()
circle.beginFill(0xffffff)
circle.drawCircle(0, 0, 60)
// circle.endFill(0X000000)
circle.position.set(app.screen.width/2,app.screen.height/2)
app.stage.addChild(circle)
console.log(circle)

//Rectangle
let rectangle = new Graphics()
rectangle.lineStyle(4, 0xff3300, 1)
rectangle.beginFill(0x66ccff)
rectangle.drawRect(0, 0, 64, 64)
rectangle.endFill()
rectangle.x = 170
rectangle.y = 170
app.stage.addChild(rectangle)

//Line
let line = new Graphics()
line.lineStyle(4, 0xffffff, 1)
line.moveTo(0, 0)
line.lineTo(80, 50)
line.x = 32
line.y = 32
app.stage.addChild(line)


//Rounded rectangle
let roundBox = new Graphics()
roundBox.lineStyle(4, 0x99ccff, 1)
roundBox.beginFill(0xff9933)
roundBox.drawRoundedRect(0, 0, 84, 36, 10)
roundBox.endFill()
roundBox.x = 48
roundBox.y = 190
app.stage.addChild(roundBox)

window.addEventListener('resize',function(){
    circle.scale.set(app.screen.width/600)
    // console.log(app.screen.width/2)
    circle.position.set(app.screen.width/3,app.screen.height/3)
})

export default {
  name: 'pixi',
  mounted() {
    this.$el.appendChild(app.view)
    app.resizeTo = this.$el
  }
}
</script>

<style>
.cavans-container {
  width: 85vw;
  height: 85vw;
  max-width: 600px;
  max-height: 600px;
  border: 1px solid;
}
</style>
