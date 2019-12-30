attribute vec2 aVertexPosition;

uniform mat3 uProjectionMat;
uniform mat3 uModelMat;

void main() {
    vec3 homogen_cord = uProjectionMat * uModelMat * vec3(aVertexPosition, 1);
    vec2 real_cord = vec2(homogen_cord.x/homogen_cord.z, homogen_cord.y/homogen_cord.z);
    gl_Position = vec4(real_cord, 0, 1);
}
