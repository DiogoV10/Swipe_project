window.addEventListener('DOMContentLoaded', (event) => {

    let keysPressed = {}

    document.addEventListener('keydown', (event) =>{
        keysPressed[event.key] = true
    })

    document.addEventListener('keyup', (event) =>{
        delete keysPressed[event.key]
    })

    let canvas = document.getElementById("tutorial")
    let canvas_context = canvas.getContext('2d')

    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight

    let grid_width = 70
    let grid_height = 70

    do{
        grid_width++
    }while (canvas.width % grid_width <= 10)

    do{
        grid_height++
    }while (canvas.height % grid_height <= 10)

    if(canvas.width % grid_width > 0){
        canvas.width = canvas.width - grid_width - (canvas.width % grid_width)
    }

    if(canvas.height % grid_height > 0){
        canvas.height = canvas.height - grid_height - (canvas.height % grid_height)
    }
    
    let moveUp = false
    let moveDown = false
    let moveLeft = false
    let moveRight = false
    let moving = false
    let obj = 0
    let objCount = 0

    canvas.style.background = '#000000'

    class Rectangle {
        constructor(x, y, height, width, color, objective){
            this.x = x
            this.y = y
            this.height = height
            this.width = width
            this.color = color
            this.objective = objective
            this.goal = false
            this.hit = false
            this.xmom = 0
            this.ymom = 0
        }

        draw(){
            canvas_context.lineWidth = 2
            canvas_context.fillStyle = this.color
            canvas_context.strokeStyle = 'yellow'
            canvas_context.fillRect(this.x + this.width/6, this.y + this.height/6, this.width/1.5, this.height/1.5)
            canvas_context.strokeRect(this.x + this.width/6, this.y + this.height/6, this.width/1.5, this.height/1.5)
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
            canvas_context.lineWidth = 2 //Change stroke width
            canvas_context.strokeStyle = this.color
            canvas_context.beginPath()
            canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
            canvas_context.fillStyle = this.color //Can be removed for now (better keep it until the end)
            canvas_context.fill() //Can be removed for now (better keep it until the end)
            canvas_context.stroke()
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

            for(let i = 0; this.y<canvas.height; i++){
                for(let j = 0; this.x<canvas.width; j++){
                    let block

                    if(this.x > 0 && this.x < canvas.width - grid_width){
                        if(this.y > 0 && this.y < canvas.height - grid_height){
                            if(Math.random() < .91){
                                if(Math.random() < .98){
                                    block = new Rectangle(this.x, this.y, this.height, this.width, color, false)
                                }else{
                                    block = new Rectangle(this.x, this.y, this.height, this.width, color, true)
                                    obj++
                                    console.log(obj)
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
            this.goal()
        }

        goal(){
            if(objCount > 0 && objCount == 1)
            {
                let done = false
                let random = 0


                do{
                    random = Math.floor(Math.random() * this.blocks.length)
                    console.log(random)

                    if(this.blocks[random].color == 'black')
                    {
                        this.blocks[random].goal = true
                        this.blocks[random].color = 'blue'
                        console.log('Done')
                        done = true
                    }

                }while(done == false)   

                objCount = 0
            }
        }
    }

    class Agent{
        constructor(grid, color){
            this.grid = grid
            this.body = new Circle(0,0,Math.min(this.grid.width/3, this.grid.height/3), color)
            this.location = this.grid.blocks[Math.floor(Math.random()*this.grid.blocks.length)]

            do{
                if(this.location.color != 'black' || this.location.objective){
                    this.location = this.grid.blocks[Math.floor(Math.random()*this.grid.blocks.length)]
                }
            }while (this.location.color != 'black' || this.location.objective)

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
                                if(this.grid.blocks[i].color == 'black'){
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
                        this.location = new Rectangle(this.body.x - grid_width/2, canvas.height - grid_height, grid_height, grid_width, 'blue')
                    }
    
                    if(this.body.y > canvas.height){
                        this.location = new Rectangle(this.body.x - grid_width/2, 0, grid_height, grid_width, 'blue')
                    }
                }

                if(this.body.x < 0){
                    this.location = new Rectangle(canvas.width - grid_width, this.body.y - grid_height/2, grid_height, grid_width, 'blue')
                }

                if(this.body.x > canvas.width){
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
                                            this.circles[j].color = 'transparent'
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