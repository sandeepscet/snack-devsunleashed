// @ts-nocheck
/* eslint-disable */

import { invoke } from '@forge/bridge';
import { view } from '@forge/bridge';

let gameForgeData = [];
const context = await view.getContext();
const accountId = context.accountId;
getHighScore().then(points => setHighScore(points));
getOverallHighScore().then(points => setOverallHighScore(points));

invoke('getStorage', { key: 'config' }).then((config: any) => {
  if(!config && Object.keys(config).length === 0)
  {
    alert('App Config Pending, Please check with your JIRA admin');
  }else
  {
    
    const invokeArr = [];
    for (const element of config) {

      const invokePromise = invoke('jiraIssues' , { jql : element.ql}).then((returnedData: any) => {
        if (returnedData.status.status === 200) {
          const data  = JSON.parse(returnedData.data);
          const resolvedDates = getJiraResolvedData(data , element.field);
          return {"block" : element.noOfBlocks , "data" : resolvedDates };
        }
        return [];
      }); 

      invokeArr.push(invokePromise);
    }

    Promise.all(invokeArr).then((values) => {
      gameForgeData  = values
      updateDom(gameForgeData);
    });

  }
  
});

function getJiraResolvedData(jqlResult: any , field:string) {
  const jiraResolvedDates = [];
  for (let index = 0; index < jqlResult.total; index++) {
    jiraResolvedDates.push(jqlResult['issues'][index]['fields'][field]);
  }
  return jiraResolvedDates;
}

function getConfluenceCreatedDates(jqlResult: any) {
  const createdDates = [];
  for (let index = 0; index < jqlResult.total; index++) {
    createdDates.push(jqlResult['issues'][index]['resolutiondate']);
  }
  return createdDates;
}

function storeScoreData(points)
{ 
    const key = "score" + accountId;
    invoke('getStorage', { key: key }).then((response: any) => {
        if(!response)
        {
            response = 0;
        }
        if(parseInt(response , 10) < points)
        {
            setHighScore(points);
            storeOverallHighScoreData(points);
            invoke('setStorage', { key: key , value : points}).then((response: any) => { });
        }   
    });
}

function storeOverallHighScoreData(points)
{ 
    const key = 'overllHighScore';
    invoke('getStorage', { key: key }).then((response: any) => {
        if(!response)
        {
            response = 0;
        }
        if(parseInt(response , 10) < points)
        {
            setOverallHighScore(points);            
            invoke('setStorage', { key: key , value : points}).then((response: any) => { });
        }   
    });
}

async function  getHighScore(){
    const key = "score" + accountId;
    const response = await invoke('getStorage', { key: key });
    if(!response)
    {
        return 0;
    }
    return response;
}

async function getOverallHighScore(){
    const key = 'overllHighScore';
    const response = await invoke('getStorage', { key: key });
    if(!response)
    {
        return 0;
    }
    return response;
}

function setHighScore(points){
    const highScore = document.getElementById('highScore');
    const highScoreDiv = document.getElementById('highScoreDiv');
    highScoreDiv.style.display = "block";
    highScore?.innerText = points;
}

function setOverallHighScore(points){
    const currentHighScore = document.getElementById('overallHighScore');
    const currentHighScoreDiv = document.getElementById('overallHighScoreDiv');
    currentHighScoreDiv.style.display = "block";
    currentHighScore?.innerText = points;
}

    


var SIZE = 10;
var WIDTH = 31;
var HEIGHT = 31;
var KEY = { LEFT: 37, RIGHT: 39, SPACE: 32 };

var speed = 50;
var gameLoop;

var canvas = document.getElementById('canvas-demo');
var point = new obelisk.Point(350, 50);
var pixelView = new obelisk.PixelView(canvas, point);
var dimension = new obelisk.CubeDimension(SIZE, SIZE, SIZE);

var matrix;
var snake;
var movX = 0;
var movY = -1;
var grow = 0;
var points = 0;

var playing = false;
var pressed = false;
var gameover = false;

function createArray(width, height) {
    var arr = new Array(width);
    for (var i = 0; i < width; i++) {
        arr[i] = new Array(height);
    }

    return arr;
}

function init(gameForgeData) {

   let gameMappedData = gameForgeData.map(row => { 
            return { block : (row.block ? row.block : 1) , data : (row.data ? row.data.map(datez => new Date(datez).getDate()) : []) }
    });

    points = 0;
    document.getElementById('points').innerHTML = points;
    speed = 70;
    movX = 0;
    movY = -1;
    grow = 0;
    playing = false;
    pressed = false;


    matrix = createArray(WIDTH, HEIGHT);
    snake = new Array(3);

    snake[0] = [Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2)];
    snake[1] = [Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2) + 1];
    snake[2] = [Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2) + 2];
    

    putSnake();
    putData(gameMappedData);

    
}


function putData(gameMappedData)
{
    for(const row of gameMappedData)
    {
        const type = parseInt(row.block,10) + 2;  // 1,2 is for snack
        for(let blockPoint of row.data)
        {
            blockPoint = blockPoint - 1 // since array start with 0;
            let blocks = [[blockPoint,blockPoint]];

            if(type === 4){
                let blockPoint2x = blockPoint;
                let blockPoint2y = blockPoint + 1;

                if(blockPoint2y > 30)
                {
                    blockPoint2x = blockPoint-1;
                    blockPoint2y = blockPoint;
                }
                blocks = [[blockPoint,blockPoint] , [blockPoint2x,blockPoint2y]]
            }
            if(type === 5){

                let blockPoint2x = blockPoint;
                let blockPoint2y = blockPoint + 1;

                if(blockPoint2y > 30)
                {
                    blockPoint2x = blockPoint-1;
                    blockPoint2y = blockPoint;
                }

                let blockPoint3x = blockPoint;
                let blockPoint3y = blockPoint + 2;

                if(blockPoint3y > 30)
                {
                    blockPoint3x = blockPoint-1;
                    blockPoint3y = blockPoint;
                }
                

                blocks = [[blockPoint,blockPoint] , [blockPoint2x,blockPoint2y],  [blockPoint3x,blockPoint3y]]
            }
            putBlocks(blocks , type); 
        }
    }
}

function putBlocks(pos , type = 3)
{
    for (var i = 0; i < pos.length; i++) {
        putBlock(pos[i][0] ,pos[i][1] , type);
    }
}

function putBlock(posX = '' , posY = '' , val = 3)
{
    let oPosX = posX;
    let oPosY = posY
    if(posX === ''){
        oPosX = posX = Math.floor(Math.random() * WIDTH);
    }
    if(posY === ''){
        oPosY = posY = Math.floor(Math.random() * HEIGHT);
    }   

    while (matrix[posX][posY]) {
        posX = (posX + 1) % WIDTH;
        if (posX == WIDTH) {
            posX = posX % WIDTH;
            posY = (posY + 1) % HEIGHT;
        }

        if (oPosX == posX && oPosY == posY) {
            clearInterval(gameLoop);
            playing = false;
        }
    }

    matrix[posX][posY] = val;
}

function putSnake(last) {
    if (snake[0][0] < 0 || snake[0][0] >= WIDTH || snake[0][1] < 0 || snake[0][1] >= HEIGHT) {
        document.getElementById('info').innerHTML = '<b style="color:Tomato;">Game Over</b> <br> You hit the wall <br> Press "space" to restart';
        clearInterval(gameLoop);
        playing = false;
        gameover = true;
        storeScoreData(points);
    } else {
        if (matrix[snake[0][0]][snake[0][1]] == 2) {
            document.getElementById('info').innerHTML = '<b style="color:Tomato;">Game Over</b> <br> You eat your own body <br> Press "space" to restart';
            clearInterval(gameLoop);
            playing = false;
            gameover = true;
            storeScoreData(points);
        }
        else {
        	if (matrix[snake[0][0]][snake[0][1]] >= 3) {
                // eat a block
                grow += 2;
                putBlock('' , '' , 6);
                points += 1;
                if (speed < 50) {
                    speed++;
                    clearInterval(gameLoop);
                    gameLoop = setInterval(update, 10000 / speed);
                }

                document.getElementById('points').innerHTML = points;
            }

            matrix[snake[0][0]][snake[0][1]] = 1;
            for (var i = 1; i < snake.length; i++) {
                matrix[snake[i][0]][snake[i][1]] = 2;
            }
            if (last) {
                if (!grow) {
                    matrix[last[0]][last[1]] = 0;
                }
                else {
                    snake.push([last[0], last[1]]);
                    grow--;
                }
            }
        }
    }
}

function moveSnake() {
    var last = [snake[snake.length - 1][0], snake[snake.length - 1][1]];
    for (var i = snake.length - 1; i > 0; i--) {
        snake[i][0] = snake[i - 1][0];
        snake[i][1] = snake[i - 1][1];
    }
    snake[0][0] = snake[0][0] + movX;
    snake[0][1] = snake[0][1] + movY;
    return last;
}

function update() {
    var last = moveSnake();
    putSnake(last);
    draw();
    pressed = false;
}

function draw() {
    var colorBG = new obelisk.SideColor().getByInnerColor(obelisk.ColorPattern.GRAY);
    var colorBG2 = new obelisk.SideColor().getByInnerColor(0x00474347);
    pixelView.clear();

    for (var i = 0; i < WIDTH; i++) {
        var sideX0 = new obelisk.SideX(dimension, colorBG2);
        var p3dX0 = new obelisk.Point3D(SIZE * i, 31 * SIZE, -SIZE);
        pixelView.renderObject(sideX0, p3dX0);

        var sideY0 = new obelisk.SideY(dimension, colorBG2);
        var p3dY0 = new obelisk.Point3D(31 * SIZE, i * SIZE, -SIZE);
        pixelView.renderObject(sideY0, p3dY0);

        var sideY1 = new obelisk.SideY(dimension, colorBG2);
        var p3dY1 = new obelisk.Point3D(0 * SIZE, i * SIZE, 0);
        pixelView.renderObject(sideY1, p3dY1);

        var sideX1 = new obelisk.SideX(dimension, colorBG2);
        var p3dX1 = new obelisk.Point3D(SIZE * i, 0 * SIZE, 0);
        pixelView.renderObject(sideX1, p3dX1);
    }

    for (var i = 0; i < WIDTH; i++) {

        for (var j = 0; j < HEIGHT; j++) {
            var p3d = new obelisk.Point3D(i * SIZE, j * SIZE, 1);

            switch (matrix[i][j]) {
                case 1:
                    // draw head snake
                    var color = new obelisk.CubeColor().getByHorizontalColor(0x0032358f);
                    var cube = new obelisk.Cube(dimension, color);
                    pixelView.renderObject(cube, p3d);
                    break;
                case 2:
                    // draw body snake
                    var color = new obelisk.CubeColor().getByHorizontalColor(obelisk.ColorPattern.BLUE);
                    var cube = new obelisk.Cube(dimension, color);
                    pixelView.renderObject(cube, p3d);
                    break;
                case 3:
                    // draw commit
                    var color = new obelisk.CubeColor().getByHorizontalColor(0x0023751e);
                    var cube = new obelisk.Cube(dimension, color);
                    pixelView.renderObject(cube, p3d);
                    break;
                case 4:
                    // draw Block
                    var color = new obelisk.CubeColor().getByHorizontalColor(0xa4b021);
                    var cube = new obelisk.Cube(dimension, color);
                    pixelView.renderObject(cube, p3d);
                    break;
                case 5:
                    // draw Block
                    var color = new obelisk.CubeColor().getByHorizontalColor(0x008c2242);
                    var pyramid = new obelisk.Cube(dimension, color);
                    pixelView.renderObject(pyramid, p3d);
                    break;
                case 6:
                    // draw Block
                    var color = new obelisk.CubeColor().getByHorizontalColor(0x0032358f);
                    var pyramid = new obelisk.Cube(dimension, color);
                    pixelView.renderObject(pyramid, p3d);
                    break;
                default:
                    var brick = new obelisk.Brick(dimension, colorBG);
                    pixelView.renderObject(brick, p3d);
                    break;
            }
        }
    }
}

function onkeydown(e) {
    if (e.keyCode < 112 || e.keyCode > 123) {
        e.preventDefault();
    }

    if (playing) {
        if (!pressed) {
            switch (e.keyCode) {
                case KEY.LEFT:
                    pressed = true;
                    if (movY) {
                        movX = movY;
                        movY = 0;
                    }
                    else {
                        movY = -movX;
                        movX = 0;
                    }
                    break;
                case KEY.RIGHT:
                    pressed = true;
                    if (movY) {
                        movX = -movY;
                        movY = 0;
                    }
                    else {
                        movY = movX;
                        movX = 0;
                    }
                    break;
            }
        }
    }
    else {
        if (e.keyCode == KEY.SPACE) {
            if (gameover && e.keyCode == KEY.SPACE) {
                init(gameForgeData);
                draw();
            }
            playing = true;
            pressed = true;
            gameLoop = setInterval(update, 10000 / speed);
            document.getElementById('info').innerHTML = 'All the Best 👍';
        }
    }
}

function updateDom(gameForgeData): void {
    console.log(gameForgeData);
    const root = document.getElementById('loader');
    if (root) {
      root.remove();
    }
  
    const game = document.getElementById('game');
    if (game) {
      game.style.display = "block";
    }
      
    document.addEventListener('keydown', onkeydown, false);
    init(gameForgeData);
    draw();
  
  }

