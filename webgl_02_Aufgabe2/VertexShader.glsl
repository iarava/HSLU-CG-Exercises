attribute vec2 aVertexPosition;
attribute vec4 aColor;

varying vec4 v_color;

void main () {
    gl_Position = vec4(aVertexPosition, 0, 1);
    v_color = aColor;
}
