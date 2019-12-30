attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;
attribute vec2 aVertexTextureCoord;

uniform mat4 uProjectionMat;
uniform mat4 uModelViewMat;

varying vec4 v_color;
varying vec2 v_TextureCoord;

void main () {
    vec4 position =  vec4(aVertexPosition,1);
    gl_Position = uProjectionMat * uModelViewMat * position;
    v_color = aVertexColor;
    v_TextureCoord = aVertexTextureCoord;
}
