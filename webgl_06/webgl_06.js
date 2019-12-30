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
    aVertexNormalId: -1,
    aVertexColorId: -1,
    aVertexTextureCoordId: -1,

    uProjectionMatId: -1,
    uModelViewMatId: -1,
    uNormalMatId: -1,

    uSamplerId: -1,
    uEnableTextureId: -1,
    uEnableLightingId: -1,
    uLightPositionId: -1,
    uLightColorId: -1
};

var objects = {
    colorCube: -1,
    textureCube: -1
};

var objCC = {
    translate: [-100,0,0],
    scale: [70,70,70],
    rad: 0.1,
    axis: [1,-3,2],
    eye: [0, -200, 0],
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

var objTC = {
    translate: [100,0,0],
    scale: [70,70,70],
    rad: -0.1,
    axis: [1,2,3],
    eye: [0, -200, 0],
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


var colors = [
    [1.0,  1.0,  1.0],    // vordere Fläche: weiß
    [1.0,  0.0,  0.0],    // hintere Fläche: rot
    [0.0,  1.0,  0.0],    // obere Fläche: grün
    [0.0,  0.0,  1.0],    // untere Fläche: blau
    [1.0,  1.0,  0.0],    // rechte Fläche: gelb
    [1.0,  0.0,  1.0]     // linke Fläche: violett
];


var colorsTexture = [
    [1.0,  0.0,  1.0],    // vordere Fläche: violett
    [1.0,  0.0,  0.0],    // hintere Fläche: rot
    [0.0,  1.0,  0.0],    // obere Fläche: grün
    [0.0,  0.0,  1.0],    // untere Fläche: blau
    [1.0,  1.0,  0.0],    // rechte Fläche: gelb
    [1.0,  1.0,  1.0]     // linke Fläche: weiss
];

// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
    textureObj : {}
};

var light = {
    enable: 1,
    position: [-500,700,-500],
    color: [1.0,1.0,1.0]
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    initLight();
    initObjects();
    window.requestAnimationFrame(drawAnimated);
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'exercise6Tools\\VertexShader.glsl', 'exercise6Tools\\FragmentShaderLightingExercise.glsl');
    setUpAttributesAndUniforms();

    gl.frontFace(gl.CCW); //defines how the front face is drawn
    gl.cullFace(gl.BACK); //defines which face should be culled
    gl.enable(gl.CULL_FACE); //enables culling
    gl.enable(gl.DEPTH_TEST); //enables culling
    
    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.aVertexNormalId = gl.getAttribLocation(ctx.shaderProgram, "aVertexNormal");
    ctx.aVertexColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");

    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelViewMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelViewMat");
    ctx.uNormalMatId = gl.getUniformLocation(ctx.shaderProgram, "uNormalMat");

    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
    ctx.uEnableTextureId = gl.getUniformLocation(ctx.shaderProgram, "uEnableTexture");
    ctx.uEnableLightingId = gl.getUniformLocation(ctx.shaderProgram, "uEnableLighting");
    ctx.uLightPositionId = gl.getUniformLocation(ctx.shaderProgram, "uLightPosition");
    ctx.uLightColorId = gl.getUniformLocation(ctx.shaderProgram, "uLightColor");
}

function initObjects() {
    "use strict";
    objects.colorCube = ColorCube(gl, colors);
    objects.textureCube = TextureCube(gl, colorsTexture);
}

function initLight(){
    "use strict";
    gl.uniform1i(ctx.uEnableLightingId, light.enable);
    gl.uniform3fv(ctx.uLightPositionId, light.position);
    gl.uniform3fv(ctx.uLightColorId, light.color);
}

function drawAnimated(timeStamp){
    if(first){
        lastTimeStamp = timeStamp;
        first = false;
    }
    else{
        var timeElapsed = (timeStamp - lastTimeStamp)/50;
        if(timeElapsed >= 1){
            lastTimeStamp = timeStamp;
            objCC.rad += 0.1;
            objTC.rad += 0.1;
            if(objCC.rad >= 2*Math.PI)
                objCC.rad = 0;
            if(objTC.rad >= 2*Math.PI)
                objTC.rad = 0;
        }
    }
    loadTexture();
    window.requestAnimationFrame(drawAnimated);
}


function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // add drawing routines here
    initMatForOrthoFrust(objCC.translate, objCC.scale, objCC.rad, objCC.axis,
        objCC.eye, objCC.center, objCC.up, objCC.left, objCC.right, objCC.bottom, objCC.top, objCC.near, objCC.far, objCC.ortho);
    objects.colorCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexNormalId, ctx.aVertexColorId, ctx.uEnableTextureId);


    initMatForOrthoFrust(objTC.translate, objTC.scale, objTC.rad, objTC.axis,
        objTC.eye, objTC.center, objTC.up, objTC.left, objTC.right, objTC.bottom, objTC.top, objTC.near, objTC.far, objTC.ortho);
    objects.textureCube.draw(gl, ctx.aVertexPositionId, ctx.aVertexNormalId, ctx.aVertexColorId, ctx.aVertexTextureCoordId, ctx.uSamplerId, ctx.uEnableTextureId, lennaTxt.textureObj);
}

/* *
* Load an image as a texture
*/
function loadTexture() {
    var image = new Image();
    // create a texture object
    lennaTxt.textureObj = gl.createTexture();
    image.onload = function () {
        initTexture(image, lennaTxt.textureObj);
        // make sure there is a redraw after the loading of the texture
        draw();
    };
    // setting the src will trigger onload
    image.src = "lena512.png";
}

/* *
* Initialize a texture from an image
* @param image the loaded image
* @param textureObject WebGL Texture Object
*/
function initTexture(image, textureObject ) {
    // create a new texture
    gl.bindTexture (gl.TEXTURE_2D, textureObject ) ;
    // set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL , true ) ;
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D ) ;
    // turn texture off again
    gl.bindTexture (gl.TEXTURE_2D, null);
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
    var normalMat = mat3.create();
    mat4.lookAt(modelViewMat, eye, center, up);
    mat4.translate(modelViewMat,modelViewMat, translation);
    mat4.scale(modelViewMat,modelViewMat, scaling);
    mat4.rotate(modelViewMat,modelViewMat, rad, axis);
    gl.uniformMatrix4fv(ctx.uModelViewMatId,false, modelViewMat);
    mat3.normalFromMat4(normalMat, modelViewMat);
    gl.uniformMatrix3fv(ctx.uNormalMatId,false, normalMat)
}
