//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;
var first = true;
var lastTimeStamp = 0;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

var player1 = {
    scale: [20,80],
    translate: [-370,0],
    rotation: 0,
    velocity: 30,
    direction: 0
};

var player2 = {
    scale: [20,80],
    translate: [370,0],
    rotation: 0,
    velocity: 30,
    direction: 0
};

var linie = {
    scale: [5,800],
    translate: [0,0],
    rotation: 0
};

var ball = {
    scale: [15,15],
    translate: [-200,50],
    rotation: 0,
    velocity: [18,-10],
    isMovingLeft: false,
    isMovingUp: false
};

var scores = {
    scorePlayer1: 0,
    scorePlayer2: 0
}

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);
    window.requestAnimationFrame(drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();
    
    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");
    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat")
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat")
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    // Set up the world coordinates
    var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [2.0/gl.drawingBufferWidth, 2.0/gl.drawingBufferHeight]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId,false, projectionMat);

    var modelMat = mat3.create()
    mat3.translate(modelMat,modelMat, player1.translate);
    mat3.scale(modelMat,modelMat, player1.scale)
    gl.uniformMatrix3fv(ctx.uModelMatId,false, modelMat);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    var modelMat = mat3.create()
    mat3.translate(modelMat, modelMat, player2.translate);
    mat3.scale(modelMat,modelMat, player2.scale)
    gl.uniformMatrix3fv(ctx.uModelMatId,false, modelMat);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    var modelMat = mat3.create()
    mat3.translate(modelMat,modelMat, linie.translate);
    mat3.scale(modelMat,modelMat, linie.scale)
    gl.uniformMatrix3fv(ctx.uModelMatId,false, modelMat);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    var modelMat = mat3.create()
    mat3.translate(modelMat,modelMat, ball.translate);
    mat3.scale(modelMat,modelMat, ball.scale)
    gl.uniformMatrix3fv(ctx.uModelMatId,false, modelMat);

    gl.uniform4f(ctx.uColorId, 1, 1, 1, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function drawAnimated(timeStamp){
    if(first){
        lastTimeStamp = timeStamp;
        first = false;
    }
    else{
        var timeElapsed = (timeStamp - lastTimeStamp)/ 100;
        lastTimeStamp = timeStamp;
        moveBall(timeElapsed);
        movePlayer1(timeElapsed);
        movePlayer2(timeElapsed);
        //unbeatableBot(timeElapsed);
    }
    draw();
    window.requestAnimationFrame(drawAnimated);
}

function moveBall(timeElapsed) {
    ball.translate[0] += ball.velocity[0] * timeElapsed;
    ball.translate[1] += ball.velocity[1] * timeElapsed;

    if(ball.translate[0]>375)
        win(true);
    if(ball.translate[0]<-375)
        win(false);
    if(ball.translate[0]>360 && player2.translate[1] > ball.translate[1]-40 && player2.translate[1] < ball.translate[1]+40 && !ball.isMovingLeft){
        ball.velocity[0] *= -1.05;
        ball.isMovingLeft = true;
    }
    if(ball.translate[0]<-360 && player1.translate[1] > ball.translate[1]-40 && player1.translate[1] < ball.translate[1]+40 && ball.isMovingLeft){
        ball.velocity[0] *= -1.05;
        ball.isMovingLeft = false;
    }
    if(ball.translate[1]>290 && ball.isMovingUp){
        ball.velocity[1] *= -1;
        ball.isMovingUp = false;
    }

    if(ball.translate[1]<-290 && !ball.isMovingUp){
        ball.velocity[1] *= -1;
        ball.isMovingUp = true;
    }
}

function win(player1win){
    if(player1win){
        scores.scorePlayer1++;
    }
    else{
        scores.scorePlayer2++;
    }
    resetBall();
    document.getElementById("score").innerHTML = "Player1 Wins: " + scores.scorePlayer1 + "/ Player2 Wins: " + scores.scorePlayer2;
}

function resetBall() {
    ball.translate = [-200,50];
    ball.velocity = [18,-10];
    ball.isMovingLeft = false;
    ball.isMovingUp = false;
}

function movePlayer1(timeElapsed){
    player1.direction = 0;
    if(isDown(key.S))
        player1.direction -= 1;
    if(isDown(key.W))
        player1.direction += 1;

    player1.translate[1] += player1.direction * player1.velocity * timeElapsed;

    if(player1.translate[1]>260)
        player1.translate[1] = 260;
    if(player1.translate[1]<-260)
        player1.translate[1] = -260
}

function movePlayer2(timeElapsed){
    player2.direction = 0;
    if(isDown(key.DOWN))
        player2.direction -= 1;
    if(isDown(key.UP))
        player2.direction += 1;

    player2.translate[1] += player2.direction * player2.velocity * timeElapsed;

    if(player2.translate[1]>260)
        player2.translate[1] = 260;
    if(player2.translate[1]<-260)
        player2.translate[1] = -260
}

function unbeatableBot(timeElapsed){

    player2.translate[1] = ball.translate[1]
    if(player2.translate[1]>260)
        player2.translate[1] = 260;
    if(player2.translate[1]<-260)
        player2.translate[1] = -260
}


// Key Handling
var key = {
    _pressed: {},

    UP: 38,
    DOWN: 40,
    W: 87,
    S: 83
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}
