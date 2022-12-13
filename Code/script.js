window.addEventListener('DOMContentLoaded', (event) => {

    let keysPressed = {}

    document.addEventListener('keydown', (event) =>{
        keysPressed[event.key] = true
    })

    document.addEventListener('keyup', (event) =>{
        delete keysPressed[event.key]
    })

    let tutorial_canvas = document.getElementById("tutorial")
    let tutorial_canvas_context = tutorial_canvas.getContext('2d')

    tutorial_canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    tutorial_canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    let grid_width = 50
    let grid_height = 50

    do{
        grid_width++
    }while (tutorial_canvas.width % grid_width <= 10)

    do{
        grid_height++
    }while (tutorial_canvas.height % grid_height <= 10)

    if(tutorial_canvas.width % grid_width > 0){
        tutorial_canvas.width = tutorial_canvas.width - grid_width - (tutorial_canvas.width % grid_width)
    }

    if(tutorial_canvas.height % grid_height > 0){
        tutorial_canvas.height = tutorial_canvas.height - grid_height - (tutorial_canvas.height % grid_height)
    }
    
    let moveUp = false
    let moveDown = false
    let moveLeft = false
    let moveRight = false
    let moving = false
    let obj = 0
    let objCount = 0

    tutorial_canvas.style.background = "#000000"

    class Rectangle {
        constructor(x, y, height, width, color, objective){
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.objective = objective
            this.hit = false
            this.xmom = 0
            this.ymom = 0
        }

        draw(){
            tutorial_canvas_context.lineWidth = 4
            tutorial_canvas_context.fillStyle = this.color
            tutorial_canvas_context.strokeStyle = 'yellow'
            tutorial_canvas_context.fillRect(this.x + this.width/6, this.y + this.height/6, this.width/1.5, this.height/1.5)
            tutorial_canvas_context.strokeRect(this.x + this.width/6, this.y + this.height/6, this.width/1.5, this.height/1.5)
        }

        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
    }

    class Circle{
        constructor(x, y, radius, color, xmom = 0, ymom = 0){
            this.x = x
            this.y = y
            this.radius = radius
            this.color = color
            this.xmom = xmom
            this.ymom = ymom
            this.lens = 0
        }

        draw(){
            tutorial_canvas_context.lineWidth = 4 //Change stroke width
            tutorial_canvas_context.strokeStyle = this.color
            tutorial_canvas_context.beginPath()
            tutorial_canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            tutorial_canvas_context.fillStyle = this.color //Can be removed for now (better keep it until the end)
            tutorial_canvas_context.fill() //Can be removed for now (better keep it until the end)
            tutorial_canvas_context.stroke()
        }

        move(){
            this.x+=this.xmom
            this.y+=this.ymom
        }
    }

    class Grid{
        constructor(width, height, color){
            this.width = width
            this.height = height
            this.x = 0
            this.y = 0
            this.blocks = []

            for(let i = 0; this.y<tutorial_canvas.height; i++){
                for(let j = 0; this.x<tutorial_canvas.width; j++){
                    let block

                    if(this.x > 0 && this.x < tutorial_canvas.width - grid_width){
                        if(this.y > 0 && this.y < tutorial_canvas.height - grid_height){
                            if(Math.random() < .91){
                                if(Math.random() < .98){
                                    block = new Rectangle(this.x, this.y, this.height, this.width, color, false)
                                }else{
                                    block = new Rectangle(this.x, this.y, this.height, this.width, color, true)
                                    obj++
                                    console.log('obj')
                                }  
                            }else{
                                block = new Rectangle(this.x, this.y, this.height, this.width, 'red', false)
                            }
                        }else{
                            block = new Rectangle(this.x, this.y, this.height, this.width, color, false)
                        }
                    }else{
                        block = new Rectangle(this.x, this.y, this.height, this.width, color, false)
                    }

                    this.blocks.push(block)
                    this.x+=this.width
                }
                this.y+=this.height
                this.x = 0
            }
        }
        draw(){
            for(let i = 0; i<this.blocks.length; i++){
                this.blocks[i].draw()
            }
        }
    }

    class Agent{
        constructor(grid, color){
            this.grid = grid
            this.body = new Circle(0,0,Math.min(this.grid.width/3, this.grid.height/3), color)
            this.location = this.grid.blocks[Math.floor(Math.random()*this.grid.blocks.length)]

            do{
                if(this.location.color == 'red' || this.location.objective){
                    this.location = this.grid.blocks[Math.floor(Math.random()*this.grid.blocks.length)]
                }
            }while (this.location.color == 'red' || this.location.objective)

        }

        draw(){
            this.body.x = this.location.x + this.location.width/2
            this.body.y = this.location.y + this.location.height/2
            this.body.draw()
            this.control()
        }

        control(){
            if(keysPressed['w']){
                if(moving == false){
                    moveDown = false
                    moveLeft = false
                    moveRight = false
                    moveUp = true

                    moving = true
                }
            }
            if(keysPressed['a']){
                if(moving == false){
                    moveDown = false
                    moveRight = false
                    moveUp = false
                    moveLeft = true

                    moving = true
                }
            }
            if(keysPressed['s']){
                if(moving == false){
                    moveRight = false
                    moveUp = false
                    moveLeft = false
                    moveDown = true

                    moving = true
                }
            }
            if(keysPressed['d']){
                if(moving == false){
                    moveUp = false
                    moveLeft = false
                    moveDown = false
                    moveRight = true

                    moving = true
                }  
            }

            if(moveUp){
                this.body.y -= this.grid.height
            }
            if(moveLeft){
                this.body.x -= this.grid.width
            }
            if(moveDown){
                this.body.y += this.grid.height
            }
            if(moveRight){
                this.body.x += this.grid.width
            }
            

            for(let i = 0; i<this.grid.blocks.length; i++){
                if(this.body.x > this.grid.blocks[i].x){
                    if(this.body.y > this.grid.blocks[i].y){
                        if(this.body.x < this.grid.blocks[i].x+this.grid.blocks[i].width){
                            if(this.body.y < this.grid.blocks[i].y+this.grid.blocks[i].height){
                                if(this.grid.blocks[i].color != 'red'){
                                    if(this.grid.blocks[i].objective){
                                        this.grid.blocks[i].hit = true
                                        this.grid.blocks[i].objective = false
                                    }
                                    this.location = this.grid.blocks[i]
                                }else{
                                    moving = false
                                }
                            }
                        }
                    }

                    if(this.body.y < 0){
                        this.location = new Rectangle(this.body.x - grid_width/2, tutorial_canvas.height - grid_height, grid_height, grid_width, 'blue')
                    }
    
                    if(this.body.y > tutorial_canvas.height){
                        this.location = new Rectangle(this.body.x - grid_width/2, 0, grid_height, grid_width, 'blue')
                    }
                }

                if(this.body.x < 0){
                    this.location = new Rectangle(tutorial_canvas.width - grid_width, this.body.y - grid_height/2, grid_height, grid_width, 'blue')
                }

                if(this.body.x > tutorial_canvas.width){
                    this.location = new Rectangle(0, this.body.y - grid_height/2, grid_height, grid_width, 'blue')
                }

                
            }
        }
    }

    class Objective{
        constructor(grid){
            this.grid = grid
            this.circles = new Array()
            this.locations = new Array()

            for(let i = 0; i<this.grid.blocks.length; i++){
                let circle
                let location
                
                if(this.grid.blocks[i].objective){
                    circle = new Circle(0,0,Math.min(this.grid.width/3.5, this.grid.height/3.5), 'blue')
                    location = this.grid.blocks[i]

                    this.circles.push(circle)
                    this.locations.push(location)
                } 
            }
        }
        draw(){
            for(let i = 0; i<this.circles.length; i++){
                this.circles[i].x = this.locations[i].x + this.locations[i].width/2
                this.circles[i].y = this.locations[i].y + this.locations[i].height/2
                this.circles[i].draw()
            }
            this.collision()
        }
        collision(){
            for(let i = 0; i<this.grid.blocks.length; i++){
                for(let j = 0; j<this.circles.length; j++){
                    if(this.circles[j].x > this.grid.blocks[i].x){
                        if(this.circles[j].y > this.grid.blocks[i].y){
                            if(this.circles[j].x < this.grid.blocks[i].x+this.grid.blocks[i].width){
                                if(this.circles[j].y < this.grid.blocks[i].y+this.grid.blocks[i].height){
                                    if(this.grid.blocks[i].objective == false){
                                        if(this.grid.blocks[i].hit){
                                            this.circles[j].color = 'black'
                                            objCount++
                                            console.log('Objective Count')
                                            this.grid.blocks[i].hit = false
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            console.log('Objective count - ' + objCount)
        }
    }

    let board = new Grid(grid_width,grid_height,'black')
    let objective = new Objective(board)
    let player = new Agent(board, 'white')

    window.setInterval(function(){
        board.draw()
        objective.draw()
        player.draw()
    }, 10)
})