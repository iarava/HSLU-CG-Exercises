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
    aVertexColorId: -1,
    uProjectionMatId: -1,
    uModelViewMatId: -1
};

var objects = {
    wiredCube: -1,
    wiredCube2: -1
};

//translation, scaling, rad, axis, eye, center, up, left, right, bottom, top, near, far, ortho
/*var objWC = {
    translate: [0,0,0],
    scale: [130,130,130],
    rad: 0,
    axis: [0,0,1],
    eye: [0,-300, 0],
    center: [0,0,0],
    up: [0,0,1],
    left: -150,
    right: 150,
    bottom: -150,
    top: 150,
    near: -130,
    far: 130,
    ortho: false
};*/


var objWC = {
    translate: [0,0,0],
    scale: [70,70,70],
    rad: 5,
    axis: [0,0,1],
    eye: [0,-150, 0],
    center: [0,0,0],
    up: [0,0,1],
    left: -100,
    right: 100,
    bottom: -100,
    top: 100,
    near: -100,
    far: 100,
    ortho: false
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    initObjects();
    window.requestAnimationFrame(drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    
    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");

    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMat");
}

function initObjects() {
    "use strict";
    objects.wiredCube = WireFrameCube(gl, [1.0, 1.0, 1.0, 0.5]);
    initMatForOrthoFrust(objWC.translate, objWC.scale, objWC.rad, objWC.axis,
       objWC.eye, objWC.center, objWC.up, objWC.left, objWC.right, objWC.bottom, objWC.top, objWC.near, objWC.far, objWC.ortho);
}

function drawAnimated(timeStamp){
    if(first){
        lastTimeStamp = timeStamp;
        first = false;
    }
    else{
        var timeElapsed = (timeStamp - lastTimeStamp)/100;
        if(timeElapsed >= 1){
            lastTimeStamp = timeStamp;
            objWC.rad = (objWC.rad + 5) % 360;
        }
    }
    initMatForOrthoFrust(objWC.translate, objWC.scale, objWC.rad, objWC.axis,
        objWC.eye, objWC.center, objWC.up, objWC.left, objWC.right, objWC.bottom, objWC.top, objWC.near, objWC.far, objWC.ortho);
    draw();
    window.requestAnimationFrame(drawAnimated);
}

function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    // add drawing routines here
    objects.wiredCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexColorId);
}

function initMatForOrthoFrust(translation, scaling, rad, axis, eye, center, up, left, right, bottom, top, near, far, ortho){

    var projectionMat = mat4.create();
    if(ortho){
        mat4.ortho(projectionMat, left, right, bottom, top, near, far)
    } else{
        mat4.frustum(projectionMat, left, right, bottom, top, near, far)
    }

    setProjectionMat(projectionMat);
    setModelViewMat(eye, center, up, translation, scaling, rad, axis);
}

function initMatForPersp(translation, scaling, eye, center, up, fovy, aspect, near, far){

    var projectionMat = mat4.create();
    mat4.perspective(out, fovy, aspect, near, far);

    setProjectionMat(projectionMat);
    setModelViewMat(eye, center, up);
    setModelViewMat(eye, center, up, translation, scaling);
}

function setProjectionMat(projectionMat) {
    gl.uniformMatrix4fv(ctx.uProjectionMatId,false, projectionMat);
}

function setModelViewMat(eye, center, up, translation, scaling, rad, axis) {
    var modelViewMat = mat4.create();
    mat4.lookAt(modelViewMat, eye, center, up);
    mat4.translate(modelViewMat,modelViewMat, translation);
    mat4.scale(modelViewMat,modelViewMat, scaling);
    mat4.rotate(modelViewMat,modelViewMat, rad, axis);
    gl.uniformMatrix4fv(ctx.uModelViewMatId,false, modelViewMat);
}
