attribute vec3 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uProjectionMat;
uniform mat4 uModelViewMat;

varying vec4 v_color;

void main () {
    vec4 position =  vec4(aVertexPosition,1);
    gl_Position = uProjectionMat * uModelViewMat * position;
    v_color = aVertexColor;
}
