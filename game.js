kaboom({
  width: 400,
  height: 275,
  background: [0,0,0],
  stretch: true
})

loadSprite("wheel","sprites/wheel.png")
loadSprite("fuel","sprites/fuel.png")
loadSprite("explosion","sprites/explosion.png")
loadSound("score", "sounds/score.mp3")
loadSound("explode", "sounds/explode.mp3")
loadSound("thruster", "sounds/thruster.wav")
loadSound("landing", "sounds/landing.wav")
loadSound("music", "sounds/music.mp3")

for (let step = 1; step <= 16; step++) {
  let name = "s"
  let image_type = "png"
  loadSprite((name+step), ("sprites/"+name+step+"."+image_type))
}

for (let step = 1; step <= 13; step++) {
  let name = "f"
  let image_type = "png"
  loadSprite((name+step), ("sprites/"+name+step+"."+image_type))
}

function animate() {
  return {
    update() {
      if (this.pause) {
        return
      }
      for (let step = 0; step < (this.tot_num_img); step++) {
        if (this.update_counter > (this.transition_delay * this.frame_num) && this.update_counter <= (this.transition_delay * (this.frame_num + 1))) {
          this.use(sprite(this.name+`${this.frame_num}`))
          this.frame_num += 1
        }
      }
      this.update_counter += 1
      if (this.frame_num > this.tot_num_img) {
          this.frame_num = 1
          this.update_counter = 0
        }
      },
    animate() {
			  this.pause = false
    }
  }
}

function pointAt(distance, angle) {
  let radians = -1*deg2rad(angle);
  return vec2(distance * Math.cos(radians), -distance * Math.sin(radians));
}

function moveall(x,a) {
  lpad.pos.x += x
  wheel1.pos.x += x
  wheel2.pos.x += x
  wheel3.pos.x += x
  wheel4.pos.x += x
  fuel1.pos.x += x
  fuel2.pos.x += x
  wheel1.angle += a
  wheel2.angle += a
  wheel3.angle += a
  wheel4.angle += a
  pposx += x
}

var score = 0
var shoot = false
var pposx = 200
var DIR = 90
var missed = false
var check = true
var adjustment = Math.floor(Math.random() * 3)
var timer = 0
var SPEED = 100

const bgmusic = play("music", {
	  loop: true,
  })
volume(0.4)
bgmusic.play()

const scoreLabel = add([
      text("CLICK ON SCREEN \nTO ENABLE KEYBOARD"),
      scale(.7),
      color(255, 166, 81),
      pos(7, 7),
      z(2)
  ])

const rocket = add([	    
  sprite("s1"),
	pos(width()/2,1.92*height()/2),
  anchor("right"),
  area({ scale: vec2(0.95,0.7) }),
  rotate(90),
  opacity(1),
  scale(.25),
  z(1),
  animate(),
  "rocket",
   {
    pause: true,
    name: "s",
    tot_num_img: 16,
    frame_num: 1,
    transition_delay: 1,
    update_counter: 0
  }
])

const fire = add([	    
  sprite("f1"),
	pos(width()/2,1.8*height()/2),
  anchor("top"),
  scale(.15),
  z(3),
  rotate(0),
  opacity(0),
  animate(),
   {
    pause: true,
    name: "f",
    tot_num_img: 13,
    frame_num: 1,
    transition_delay: 2,
    update_counter: 0
  }
])

const wheel1 = add([
  sprite("wheel"),
  color(255,255,255),
  pos(width()/2+10,1.95*height()/2),
  anchor("center"),
  rotate(0),
  scale(.015),
  z(2)
])

const wheel2 = add([
  sprite("wheel"),
  color(255,255,255),
  pos(width()/2-10,1.95*height()/2),
  anchor("center"),
  rotate(0),
  scale(.015),
  z(2)
])

const wheel3 = add([
  sprite("wheel"),
  color(255,255,255),
  pos(width()/2-30,1.95*height()/2),
  anchor("center"),
  rotate(0),
  scale(.015),
  z(2)
])

const wheel4 = add([
  sprite("wheel"),
  color(255,255,255),
  pos(width()/2+30,1.95*height()/2),
  anchor("center"),
  rotate(0),
  scale(.015),
  z(2)
])

const fuel1 = add([
  sprite("fuel"),
  pos(width()/2+30,1.8*height()/2),
  anchor("center"),
  scale(0.1),
  area({ scale: vec2(0.65,1) }),
  z(2)
])

const fuel2 = add([
  sprite("fuel"),
  pos(width()/2-30,1.8*height()/2),
  anchor("center"),
  scale(0.1),
  area({ scale: vec2(0.65,1) }),
  z(2)
])

const lpad = add([
  rect(80,5),
  color(67,70,75),
  anchor("top"),
  pos(width()/2,260),
  outline(1),
  z(2)
])

const mars = add([
  rect(width(),2),
  color(173,98,66),
  pos(0,height()-2),
  area(),
  z(2)
])

onClick(() => {
  setCursor("none")
  scoreLabel.use(text(score))
})

onKeyDown("left", () => {
  if (pposx > 0) {
    moveall(-3,-6)
    if (!shoot) {
      rocket.pos.x -= 3
      fire.pos.x -= 3
    }
  }
})

onKeyDown("right", () => {
  if (pposx < 400) {
    moveall(3,6)
    if (!shoot) {
      rocket.pos.x += 3
      fire.pos.x += 3
    }
  }
})

onKeyPress("space", () => {
  if (!shoot) {
    shoot = true
    play("thruster", {
      volume: 0.9
    })
  }
})

onUpdate(() => {
  if (shoot) {
    rocket.animate()
    fire.animate()
    fire.opacity = 1
    if (rocket.pos.y > height()/2) {
      rocket.move(pointAt(-SPEED, DIR))
      fire.move(pointAt(-SPEED, DIR))
    } else {
      rocket.move(pointAt(-SPEED*3, DIR))
      fire.move(pointAt(-SPEED*3, DIR))
    }
    if (DIR === 270) {
      if (rocket.pos.y > height()) {
        missed = true
      }
      if (rocket.pos.y >= 1.92*height()/2 && rocket.pos.x < pposx + 17 && rocket.pos.x > pposx - 17 && !missed && rocket.opacity === 1) {
        rocket.pos.y = 1.92*height()/2
        fire.pos.y = 1.8*height()/2
        rocket.pause = true
        fire.pause = true
        fire.opacity = 0
        DIR = 90
        SPEED = 100
        play("score", {
          volume: 0.5
        })
        score += 1
        scoreLabel.use(text(score))
        check = true
        shoot = false
      }
      if (rocket.pos.y > height() + 100) {
        destroyAll("explosion")
      }
      if (rocket.pos.y > height() + 200) {
        score = 0
        scoreLabel.use(text(score))
        rocket.opacity = 1
        rocket.pos.x = pposx
        fire.pos.x = pposx
        rocket.pos.y = 1.92*height()/2
        fire.pos.y = 1.8*height()/2
        rocket.pause = true
        fire.pause = true
        fire.opacity = 0
        DIR = 90
        SPEED = 100
        check = true
        missed = false
        shoot = false
      }
    }
  }
  if (rocket.pos.y < -600) {
    rocket.pos.x = rand(100,300)
    DIR = 270
  }
  if(rocket.pos.y > -300 && rocket.pos.y <= 2*height()/3 && DIR === 270) {
    SPEED = 50 + (score*2)
    if (check && rocket.pos.y > -10 * score) {
      play("landing", {
        volume: 0.9
      })
      check = false
    }
    timer += 1
    if (timer > 10) {
      adjustment = Math.floor(Math.random() * 3)
      timer = 0
    }
    if (adjustment === 0) {
      if (rocket.pos.x > 10) {
        rocket.pos.x -= 1
      }
      fire.pos.x = rocket.pos.x - 1.5
      rocket.angle = 90 - 5
      fire.angle = -5
    }
    if (adjustment === 1) {
      if (rocket.pos.x < 390) {
        rocket.pos.x += 1
      }
      fire.pos.x = rocket.pos.x + 1.5
      rocket.angle = 90 + 5
      fire.angle = 5
    }
    if (adjustment === 3) {
      fire.pos.x = rocket.pos.x
      rocket.angle = 90
      fire.angle = 0
    }
  }
  if(rocket.pos.y > 2*height()/3 && DIR === 270) {
    SPEED = 50 + (score*2)
    fire.pos.x = rocket.pos.x
    rocket.angle = 90
    fire.angle = 0
  }
})
 
fuel1.onCollide("rocket", (rocket) => {
  if (rocket.opacity === 1 && DIR === 270) {
    add([
      sprite("explosion"),
      pos(rocket.pos.x,fuel1.pos.y-77),
      anchor("center"),
      scale(0.7),
      z(3),
      "explosion"
    ])
    play("explode", {
      volume: 1,
      speed: 0.15
    })
    SPEED = 100
    score = 0
    scoreLabel.use(text(score))
    rocket.opacity = 0
  }
})

fuel2.onCollide("rocket", (rocket) => {
  if (rocket.opacity === 1 && DIR === 270) {
    add([
      sprite("explosion"),
      pos(rocket.pos.x,fuel2.pos.y-77),
      anchor("center"),
      scale(0.7),
      z(3),
      "explosion"
    ])
    play("explode", {
      volume: 1,
      speed: 0.15
    })
    SPEED = 100
    score = 0
    scoreLabel.use(text(score))
    rocket.opacity = 0
  }
})

mars.onCollide("rocket", (rocket) => {
  if (rocket.opacity === 1 && DIR === 270) {
    add([
      sprite("explosion"),
      pos(rocket.pos.x,fuel2.pos.y-77),
      anchor("center"),
      scale(0.7),
      z(3),
      "explosion"
    ])
    play("explode", {
      volume: 1,
      speed: 0.15
    })
    SPEED = 100
    score = 0
    scoreLabel.use(text(score))
    rocket.opacity = 0
  }
})

//debug.inspect = true