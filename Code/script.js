window.addEventListener('DOMContentLoaded', (event) => {

    var url = "http://colormind.io/api/";
    var data = {
        model : "default",
        input : ["N", "N", [255, 45, 0], "N", "N"]
    }

    var http = new XMLHttpRequest();

    http.onreadystatechange = function() {
        let myPromise = new Promise(function(myResolve, myReject){
            let x = 0

            if(http.readyState == 4 && http.status == 200) {
                x = 1

                var palette = JSON.parse(http.responseText).result;
                
                let keysPressed = {}
    
                document.addEventListener('keydown', (event) =>{
                    keysPressed[event.key] = true
                })
    
                document.addEventListener('keyup', (event) =>{
                    delete keysPressed[event.key]
                })
    
                var fileText
    
                const file = './levels.txt'
                
                function readFile(file){
                    var rawFile = new XMLHttpRequest();
                    rawFile.open("GET", file, false);
                    rawFile.onreadystatechange = function ()
                    {
                        let filePromise = new Promise(function(myResolve, myReject){
                            let fP = 0

                            if(rawFile.readyState === 4)
                            {
                                if(rawFile.status === 200 || rawFile.status == 0)
                                {
                                    fP = 1
                                    fileText = rawFile.responseText;
                                }
                            }

                            if(fP == 1){
                                myResolve('Levels loaded...')
                            }else{
                                myReject('Waiting for Levels File...')
                            }
                        })

                        filePromise.then(
                            function(value) {console.log(value);},
                            function(error) {console.log(error);}
                        )
                    }
                    rawFile.send(null);
                }
    
                readFile(file)
    
                let buttonClickSound = new sound("buttonClick.wav")
                buttonClickSound.volume(0.3)
                let collectingSound = new sound("ball_collect.wav")
                collectingSound.volume(0.3)
                let collectingSound2 = new sound("ball_collect2.wav")
                collectingSound2.volume(0.3)
                let bgMusic = new sound("bgMusic.wav")
                bgMusic.volume(0.3)
                bgMusic.loop()
    
                let levels = []
                let levelNumber = 1
                let levelsCount = 0
                let maxLevel = 0
                let levelDone = false
                let hasLevelChangedNM = false
                let hasLevelChangedIM = false
                let hasLvLStateChangedNM = false
                let hasLvLStateChangedIM = false
                let hasLvLRestartNM = false
                let hasLvLRestartIM = false
                let restartIM = false
    
                bgMusic.play()
    
                function changeLevel(levelNumber){
                    levels.length = 0
    
                    let myArray = fileText.split("{")

                    levelsCount = myArray.length - 1
                    
                    let levelPromise = new Promise(function(myResolve, myReject){
                        let lP = 0

                        if(levelNumber > levelsCount){
                            lP = 2

                            levelNumber = levelNumber - 1
                            maxLevel = levelNumber
                        }else{
                            
                            if(maxLevel < levelNumber){
                                lP = 1
                            }

                            let text = myArray[levelNumber]
                            let myArray2 = text.split("}")
                            let text2 = myArray2[0]
                            let myArray3 = text2.split("\r\n")
            
                            for(let i = 1; i <= 10; i++){
            
                                let text3 = myArray3[i]
                                let myArray4 = text3.split(";")
            
                                for(let j = 0; j < 10; j++){
                                    levels.push(myArray4[j])
                                }
                            }
                        }

                        if(lP == 1){
                            myResolve('New level loaded...')
                        }else if(lP == 2){
                            myReject('Level does not exist...')
                        }
                    })

                    levelPromise.then(
                        function(value) {console.log(value);},
                        function(error) {console.log(error);}
                    )
                }
    
                changeLevel(levelNumber)
    
                windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
                windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    
                let particlesNM = document.querySelector('.particlesNM')
                let particlesIM = document.querySelector('.particlesIM')
    
                particlesIM.removeAttribute('id')
                
    
                let menu = document.getElementById('menu')
                let menuN = document.getElementById('menuN')
                let menuI = document.getElementById('menuI')
    
                menuI.style.display = 'none'
    
               
    
                let canvasIM = document.getElementById('canvasIM')
                let canvasNM = document.getElementById('canvasNM')
    
                canvasNM.style.width = canvasNM.width + 'px'
                canvasNM.style.height = canvasNM.height + 'px'
    
                canvasIM.style.display = 'none'
    
    
                let mode = document.querySelector('.mode')
                let restart = document.querySelector('.restart')
                let nextLvL = document.querySelector('.next')
                let previousLvL = document.querySelector('.previous')
    
                let nMode = true
    
                let particlesLoaded = false
    
                mode.addEventListener('click', function changeMode() {
                    buttonClickSound.play()
                    if(mode.textContent == 'Normal Mode'){
                        mode.textContent = 'Infinite Mode'
                        nMode = false
                        canvasNM.style.display = 'none'
                        canvasIM.style.display = 'block'
                        menuN.style.display = 'none'
                        menuI.style.display = 'block'
                        nextLvL.style.display = 'block'
                        nextLvL.textContent = 'New Level'
                        previousLvL.style.display = 'none'
                        particlesNM.removeAttribute('id')
                        particlesIM.setAttribute('id', 'particles-js')
    
                        if(particlesLoaded == false){
                            particlesJS.load('particles-js', 'particles.json', function(){
                                console.log('particles.json loaded....')
                            })
    
                            particlesLoaded = true
                        }
                    }else{
                        mode.textContent = 'Normal Mode'
                        nMode = true
                        canvasNM.style.display = 'block'
                        canvasIM.style.display = 'none'
                        menuN.style.display = 'block'
                        menuI.style.display = 'none'
                        nextLvL.textContent = 'Next Level'
                        particlesIM.removeAttribute('id')
                        particlesNM.setAttribute('id', 'particles-js')
                    }
                })
    
                restart.addEventListener('click', function changeMode() {
                    buttonClickSound.play()
                    if(nMode == true){
                        //hasLvLRestartNM = true
                        hasLevelChangedNM = true
                        hasLvLStateChangedNM = true
                    }else{
                        hasLvLRestartIM = true
                        hasLvLStateChangedIM = true
                    }
                })
    
                nextLvL.addEventListener('click', function changeMode() {
                    buttonClickSound.play()
                    if(nMode == true){
                        levelNumber = levelNumber + 1
                        changeLevel(levelNumber)
                        hasLevelChangedNM = true
                        hasLvLStateChangedNM = true
                    }else{
                        hasLevelChangedIM = true
                        hasLvLStateChangedIM = true
                    }
                })
    
                previousLvL.addEventListener('click', function changeMode() {
                    buttonClickSound.play()
                    levelNumber = levelNumber - 1
                    changeLevel(levelNumber)
                    hasLevelChangedNM = true
                    hasLvLStateChangedNM = true
                })
                
                function infiniteMode () {
    
                    let canvasIM_context = canvasIM.getContext('2d')
        
                    canvasIM.width = windowWidth
                    canvasIM.height = windowHeight
        
                    canvasIM.height = canvasIM.height - menu.offsetHeight
        
                    let grid_width = 70
                    let grid_height = 70
        
                    do{
                        grid_width++
                    }while (canvasIM.width % grid_width <= 10)
        
                    do{
                        grid_height++
                    }while (canvasIM.height % grid_height <= 10)
        
                    if(canvasIM.width % grid_width > 0){
                        canvasIM.width = canvasIM.width - grid_width - (canvasIM.width % grid_width)
                    }
        
                    if(canvasIM.height % grid_height > 0){
                        canvasIM.height = canvasIM.height - grid_height - (canvasIM.height % grid_height)
                    }
        
                    menu.height = (windowHeight - canvasIM.height)/3
                    menu.style.height = menu.height + 'px'
        
                    let moveUp = false
                    let moveDown = false
                    let moveLeft = false
                    let moveRight = false
                    let moving = false
                    let obj = 0
                    let objCount = 0
        
                    canvasIM.style.background = 'transparent'
        
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
                            this.shadowColor = 'none'
                            this.shadowBlur = 0
                        }
        
                        draw(){
                            canvasIM_context.shadowColor = this.shadowColor
                            canvasIM_context.shadowBlur = this.shadowBlur
                            canvasIM_context.lineWidth = 2
                            canvasIM_context.fillStyle = 'transparent'
                            canvasIM_context.strokeStyle = this.color
                            canvasIM_context.fillRect(this.x + this.width/6, this.y + this.height/6, this.width/1.5, this.height/1.5)
                            canvasIM_context.strokeRect(this.x + this.width/6, this.y + this.height/6, this.width/1.5, this.height/1.5)
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
                            canvasIM_context.shadowBlur = 1
                            canvasIM_context.shadowColor = 'black'
                            canvasIM_context.lineWidth = 1
                            canvasIM_context.strokeStyle = this.color
                            canvasIM_context.beginPath()
                            canvasIM_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
                            //canvasIM_context.fillStyle = this.color //Can be removed for now (better keep it until the end)
                            //canvasIM_context.fill() //Can be removed for now (better keep it until the end)
                            canvasIM_context.stroke()
                            canvasIM_context.closePath()
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
                            this.color = color
                            this.blocks = []
                            this.initialObjective = []
        
                            for(let i = 0; this.y<canvasIM.height; i++){
                                for(let j = 0; this.x<canvasIM.width; j++){
                                    let block
        
                                    if(this.x > 0 && this.x < canvasIM.width - grid_width){
                                        if(this.y > 0 && this.y < canvasIM.height - grid_height){
                                            if(Math.random() < .91){
                                                if(Math.random() < .98){
                                                    block = new Rectangle(this.x, this.y, this.height, this.width, color, false)
                                                }else{
                                                    block = new Rectangle(this.x, this.y, this.height, this.width, color, true)
                                                    obj++
                                                }  
                                            }else{
                                                block = new Rectangle(this.x, this.y, this.height, this.width, getRandomColor(palette), false)
                                                block.shadowBlur = 1
                                                block.shadowColor = 'white'
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
    
                            for(let i = 0; i<this.blocks.length; i++){
                                this.initialObjective[i] = this.blocks[i].objective
                            }
                        }
    
                        restart(){
                            if(hasLvLRestartIM){
                                obj = 0
                                objCount = 0
    
                                for(let i = 0; i<this.blocks.length; i++){
                                    if(this.blocks[i].goal == true){
                                        this.blocks[i].color = 'black'
                                        this.blocks[i].goal = false
                                    }
                                    this.blocks[i].objective = this.initialObjective[i]
                                    this.blocks[i].hit = false
                                }
                            }
    
                            if(restartIM){
                                obj = 0
                                objCount = 0
    
                                for(let i = 0; i<this.blocks.length; i++){
                                    if(this.blocks[i].goal == true){
                                        this.blocks[i].color = 'black'
                                        this.blocks[i].goal = false
                                    }
                                    this.blocks[i].objective = this.initialObjective[i]
                                    this.blocks[i].hit = false
    
                                    if(this.blocks[i].objective){
                                        obj++
                                    }
                                }
    
                                restartIM = false
                            }
                        }
    
                        saveLevelState(){
                            if(hasLvLStateChangedIM){
                                let canvas
    
                                canvas = this.blocks
    
                                canvasIM_context.clearRect(0, 0, canvasIM.width, canvasIM.height);
    
                                this.blocks = canvas
    
                                hasLvLStateChangedIM = false
                            }                  
                        }
    
                        newLevel(){
                            if(hasLevelChangedIM){
                                let block
    
                                obj=0
                                objCount = 0
    
                                for(let i = 0; i<this.blocks.length; i++){
                                    if(this.blocks[i].x > 0 && this.blocks[i].x < canvasIM.width - grid_width){
                                        if(this.blocks[i].y > 0 && this.blocks[i].y < canvasIM.height - grid_height){
                                            if(Math.random() < .91){
                                                if(Math.random() < .98){
                                                    block = new Rectangle(this.blocks[i].x, this.blocks[i].y, this.blocks[i].height, this.blocks[i].width, this.color, false)
                                                }else{
                                                    block = new Rectangle(this.blocks[i].x, this.blocks[i].y, this.blocks[i].height, this.blocks[i].width, this.color, true)
                                                    obj++
                                                }  
                                            }else{
                                                block = new Rectangle(this.blocks[i].x, this.blocks[i].y, this.blocks[i].height, this.blocks[i].width, getRandomColor(palette), false)
                                                block.shadowBlur = 1
                                                block.shadowColor = 'white'
                                            }
                                        }else{
                                            block = new Rectangle(this.blocks[i].x, this.blocks[i].y, this.blocks[i].height, this.blocks[i].width, this.color, false)
                                        }
                                    }else{
                                        block = new Rectangle(this.blocks[i].x, this.blocks[i].y, this.blocks[i].height, this.blocks[i].width, this.color, false)
                                    }
    
                                    this.blocks[i] = block
                                    this.initialObjective[i] = this.blocks[i].objective
                                }
                            }
                        }
        
                        draw(){
                            this.goal()
                            this.restart()
                            this.saveLevelState()
                            this.newLevel()
                            for(let i = 0; i<this.blocks.length; i++){
                                this.blocks[i].draw()
                            }
                        }
        
                        goal(){
                            if(objCount > 0 && objCount == obj)
                            {
                                let done = false
                                let random = 0
        
        
                                do{
                                    random = Math.floor(Math.random() * this.blocks.length)
        
                                    if(this.blocks[random].color == 'black')
                                    {
                                        this.blocks[random].goal = true
                                        this.blocks[random].color = 'blue'
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
                            
                            this.initialLocation = this.location
                        }
    
                        restart(){
                            if(hasLvLRestartIM){
                                this.location = this.initialLocation
    
                                restartIM = true
                                hasLvLRestartIM = false
                            }
                        }
    
                        newLevel(){
                            if(hasLevelChangedIM){
                                this.location = this.grid.blocks[Math.floor(Math.random()*this.grid.blocks.length)]
    
                                do{
                                    if(this.location.color != 'black' || this.location.objective){
                                        this.location = this.grid.blocks[Math.floor(Math.random()*this.grid.blocks.length)]
                                    }
                                }while (this.location.color != 'black' || this.location.objective)
                                
                                this.initialLocation = this.location
    
                                hasLevelChangedIM = false
                            }
                        }
        
                        draw(){
                            this.control()
                            this.restart()
                            this.newLevel()
                            this.body.x = this.location.x + this.location.width/2
                            this.body.y = this.location.y + this.location.height/2
                            this.body.draw()
                        }
        
                        control(){
                            if(moving == false){
                                moveDown = false
                                moveLeft = false
                                moveRight = false
                                moveUp = false
                            }
    
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
    
                            if(hasLevelChangedIM || hasLvLRestartIM){
                                moveUp = false
                                moveLeft = false
                                moveDown = false
                                moveRight = false
                                moving = false
                            }
        
                            if(moveUp){
                                hasLvLStateChangedIM = true
                                this.body.y -= this.grid.height
                            }
                            if(moveLeft){
                                hasLvLStateChangedIM = true
                                this.body.x -= this.grid.width
                            }
                            if(moveDown){
                                hasLvLStateChangedIM = true
                                this.body.y += this.grid.height
                            }
                            if(moveRight){
                                hasLvLStateChangedIM = true
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
                                        this.location = new Rectangle(this.body.x - grid_width/2, canvasIM.height - grid_height, grid_height, grid_width, 'blue')
                                    }
                    
                                    if(this.body.y > canvasIM.height){
                                        this.location = new Rectangle(this.body.x - grid_width/2, 0, grid_height, grid_width, 'blue')
                                    }
                                }
        
                                if(this.body.x < 0){
                                    this.location = new Rectangle(canvasIM.width - grid_width, this.body.y - grid_height/2, grid_height, grid_width, 'blue')
                                }
        
                                if(this.body.x > canvasIM.width){
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
                                
                                circle = new Circle(0,0,Math.min(this.grid.width/3.5, this.grid.height/3.5), 'transparent')
                                location = this.grid.blocks[i]
    
                                if(this.grid.blocks[i].objective){
                                    circle.color = 'blue'
                                } 
                                this.circles.push(circle)
                                this.locations.push(location)
                            }
                        }
                        level(){
                            for(let i = 0; i<this.grid.blocks.length; i++){
                                if(this.grid.blocks[i].objective){
                                    this.circles[i].color = 'blue'
                                }else{
                                    this.circles[i].color = 'transparent'
                                }
                            }
                        }
                        draw(){
                            this.level()
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
                                                            collectingSound.play()
                                                            collectingSound2.play()
                                                            this.grid.blocks[i].hit = false
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
        
                    let board = new Grid(grid_width,grid_height,'black')
                    let objective = new Objective(board)
                    let player = new Agent(board, 'white')
                    
                    
                    window.setInterval(function(){
                        if(nMode == false){
                            menu.height = windowHeight - 30
                            menu.style.height = menu.height + 'px'
                            menu.style.alignItems = 'flex-end'
    
                            board.draw()
                            objective.draw()
                            player.draw()
                        }
                    }, 10)
                }
                
                function normalMode () {
    
                    menuN.height = canvasIM.height + menu.height + 10
                    menuN.style.height = menuN.height + 'px'
    
                    let canvasNM_context = canvasNM.getContext('2d')
        
                    let grid_width = 70
                    let grid_height = 70
        
                    let moveUp = false
                    let moveDown = false
                    let moveLeft = false
                    let moveRight = false
                    let moving = false
                    let obj = 0
                    let objCount = 0
        
                    canvasNM.style.background = 'transparent'
        
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
                            this.shadowColor = 'none'
                            this.shadowBlur = 0
                        }
        
                        draw(){
                            canvasNM_context.shadowColor = this.shadowColor
                            canvasNM_context.shadowBlur = this.shadowBlur
                            canvasNM_context.lineWidth = 2
                            canvasNM_context.fillStyle = 'transparent'
                            canvasNM_context.strokeStyle = this.color
                            canvasNM_context.fillRect(this.x + this.width/6, this.y + this.height/6, this.width/1.5, this.height/1.5)
                            canvasNM_context.strokeRect(this.x + this.width/6, this.y + this.height/6, this.width/1.5, this.height/1.5)
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
                            canvasNM_context.shadowBlur = 1
                            canvasNM_context.shadowColor = 'black'
                            canvasNM_context.lineWidth = 1
                            canvasNM_context.strokeStyle = this.color
                            canvasNM_context.beginPath()
                            canvasNM_context.arc(this.x, this.y, this.radius, 0, (Math.PI*2), true)
                            //canvasNM_context.fillStyle = this.color //Can be removed for now (better keep it until the end)
                            //canvasNM_context.fill() //Can be removed for now (better keep it until the end)
                            canvasNM_context.stroke()
                            canvasNM_context.closePath()
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
                            this.color = color
                            this.blocks = []
                            this.grid = 0
        
                            for(let i = 0; this.y<canvasNM.height; i++){
                                for(let j = 0; this.x<canvasNM.width; j++){
                                    let block
    
                                    if(levels[this.grid] == '1'){
                                        block = new Rectangle(this.x, this.y, this.height, this.width, getRandomColor(palette), false)
                                        block.shadowBlur = 1
                                        block.shadowColor = 'white'
                                    }else if(levels[this.grid] == '2'){
                                        block = new Rectangle(this.x, this.y, this.height, this.width, color, true)
                                        obj++
                                    }else{
                                        block = new Rectangle(this.x, this.y, this.height, this.width, color, false)
                                    }
        
                                    this.blocks.push(block)
                                    this.x+=this.width
                                    this.grid = this.grid + 1
                                }
                                this.y+=this.height
                                this.x = 0
                            }
                        }
    
                        saveLevelState(){
                            if(hasLvLStateChangedNM){
                                let canvas
    
                                canvas = this.blocks
    
                                canvasNM_context.clearRect(0, 0, canvasNM.width, canvasNM.height);
    
                                this.blocks = canvas
    
                                hasLvLStateChangedNM = false
                            }                  
                        }
    
                        level(){
                            if(hasLevelChangedNM){
                                obj = 0
    
                                for(let i = 0; i<levels.length; i++){
      
                                    if(levels[i] == '1'){
                                        this.blocks[i].color = getRandomColor(palette)
                                        this.blocks[i].objective = false
                                        this.blocks[i].hit = false
                                        this.blocks[i].shadowBlur = 1
                                        this.blocks[i].shadowColor = 'white'
                                    }else if(levels[i] == '2'){
                                        this.blocks[i].color = this.color
                                        this.blocks[i].objective = true
                                        this.blocks[i].hit = false
                                        this.blocks[i].shadowBlur = 0
                                        obj++
                                    }else{
                                        this.blocks[i].color = this.color
                                        this.blocks[i].objective = false
                                        this.blocks[i].hit = false
                                        this.blocks[i].shadowBlur = 0
                                    }
                                }  
                                
                            }
    
                            if(hasLvLRestartNM){
                                obj = 0
                                objCount = 0
    
                                for(let i = 0; i<levels.length; i++){
      
                                    if(levels[i] == '1'){
                                        this.blocks[i].color = getRandomColor(palette)
                                        this.blocks[i].objective = false
                                        this.blocks[i].hit = false
                                        this.blocks[i].goal = false
                                        this.blocks[i].shadowBlur = 1
                                        this.blocks[i].shadowColor = 'white'
                                    }else if(levels[i] == '2'){
                                        this.blocks[i].color = this.color
                                        this.blocks[i].objective = true
                                        this.blocks[i].hit = false
                                        this.blocks[i].goal = false
                                        this.blocks[i].shadowBlur = 0
                                        obj++
                                    }else{
                                        this.blocks[i].color = this.color
                                        this.blocks[i].objective = false
                                        this.blocks[i].hit = false
                                        this.blocks[i].goal = false
                                        this.blocks[i].shadowBlur = 0
                                    }
                                }  
    
                                hasLvLRestartNM = false
                            }
                            
                        }
        
                        draw(){
                            this.saveLevelState()
                            this.level()
                            for(let i = 0; i<this.blocks.length; i++){
                                this.blocks[i].draw()
                            }
                            this.goal()
                        }
        
                        goal(){
                            if(objCount > 0 && objCount == obj)
                            {
                                let done = false
        
                                do{
                                    for(let i=0; i<levels.length; i++){
                                        if(levels[i] == 4){
                                            this.blocks[i].goal = true
                                            this.blocks[i].color = 'blue'
                                            done = true
                                        }
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
        
                            for(let i=0; i<levels.length; i++){
                                if(levels[i] == 3){
                                    this.location = this.grid.blocks[i]
                                }
                            }
        
                        }
    
                        level(){
                            if(hasLevelChangedNM){
                                for(let i=0; i<levels.length; i++){
                                    if(levels[i] == 3){
                                        this.location = this.grid.blocks[i]
                                    }
                                }
                                hasLvLRestartNM = true
                            }
                            hasLevelChangedNM = false
                        }
        
                        draw(){
                            this.control()
                            this.level()
                            this.body.x = this.location.x + this.location.width/2
                            this.body.y = this.location.y + this.location.height/2
                            this.body.draw()
                        }
        
                        control(){
                            if(moving == false){
                                moveDown = false
                                moveLeft = false
                                moveRight = false
                                moveUp = false
                            }
                            
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
    
                            if(hasLevelChangedNM){
                                moveUp = false
                                moveLeft = false
                                moveDown = false
                                moveRight = false
                                moving = false
                            }
        
                            if(moveUp){
                                hasLvLStateChangedNM = true
                                this.body.y -= this.grid.height
                            }
                            if(moveLeft){
                                hasLvLStateChangedNM = true
                                this.body.x -= this.grid.width
                            }
                            if(moveDown){
                                hasLvLStateChangedNM = true
                                this.body.y += this.grid.height
                            }
                            if(moveRight){
                                hasLvLStateChangedNM = true
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
                                                    if(this.grid.blocks[i].goal == true){
                                                        levelDone = true
                                                    }
                                                    moving = false       
                                                }
                                            }
                                        }
                                    }
        
                                    if(this.body.y < 0){
                                        this.location = new Rectangle(this.body.x - grid_width/2, canvasNM.height - grid_height, grid_height, grid_width, 'blue')
                                    }
                    
                                    if(this.body.y > canvasNM.height){
                                        this.location = new Rectangle(this.body.x - grid_width/2, 0, grid_height, grid_width, 'blue')
                                    }
                                }
        
                                if(this.body.x < 0){
                                    this.location = new Rectangle(canvasNM.width - grid_width, this.body.y - grid_height/2, grid_height, grid_width, 'blue')
                                }
        
                                if(this.body.x > canvasNM.width){
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
                                
                                circle = new Circle(0,0,Math.min(this.grid.width/3.5, this.grid.height/3.5), 'transparent')
                                location = this.grid.blocks[i]
    
                                if(this.grid.blocks[i].objective){
                                    circle.color = 'blue'
                                } 
                                this.circles.push(circle)
                                this.locations.push(location)
                            }
                        }
                        level(){
                            for(let i = 0; i<this.grid.blocks.length; i++){
                                if(this.grid.blocks[i].objective){
                                    this.circles[i].color = 'blue'
                                }else{
                                    this.circles[i].color = 'transparent'
                                }
                            }
                        }
                        draw(){
                            this.level()
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
                                                            collectingSound.play()
                                                            collectingSound2.play()
                                                            this.grid.blocks[i].hit = false
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
        
                    let board = new Grid(grid_width,grid_height,'black')
                    let objective = new Objective(board)
                    let player = new Agent(board, 'white')
        
                    window.setInterval(function(){
                        if(nMode){
                            menu.height = (windowHeight - canvasIM.height)/3
                            menu.style.height = menu.height + 'px'
                            menu.style.alignItems = 'center'

                            if(levelNumber > levelsCount){
                                
                                levelNumber = levelNumber - 1
                                changeLevel(levelNumber)
                                hasLevelChangedNM = true
                                hasLvLStateChangedNM = true
                                maxLevel = levelNumber
                            }
    
                            if(levelNumber>1){
                                previousLvL.style.display = 'block'
                            }else{
                                previousLvL.style.display = 'none'
                            }
    
                            if(levelDone){
                                if(levelNumber > maxLevel){
                                    nextLvL.style.display = 'block'
                                    maxLevel = maxLevel + 1
                                }
                                levelDone = false
                            }
    
                            if(levelNumber <= maxLevel){
                                nextLvL.style.display = 'block'
                            }else{
                                nextLvL.style.display = 'none'
                            }
    
                            
    
                            board.draw()
                            objective.draw()
                            player.draw()
                        }
                    }, 10)
                }
    
                infiniteMode()
                normalMode()
    
            }

            if(x == 1){
                myResolve('API loaded...')
            }else{
                myReject('Waiting for API...')
            }
        })

        myPromise.then(
            function(value) {console.log(value);},
            function(error) {console.log(error);}
        )
    }

    function getRandomColor(p){
        var randomNumber=Math.floor(Math.random()*5)
        return `rgb(${p[randomNumber][0]},${p[randomNumber][1]},${p[randomNumber][2]})`
    }

    function sound(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function(){
          this.sound.play();
        }
        this.stop = function(){
          this.sound.pause();
        }
        this.volume = function(vol){
            this.sound.volume = vol;
        }
        this.loop = function(){
            this.sound.loop = true;
        }
    }

    http.open("POST", url, true);
    http.send(JSON.stringify(data));
})