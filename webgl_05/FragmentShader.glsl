precision mediump float;

varying vec4 v_color;
varying vec2 v_TextureCoord;

uniform sampler2D uSampler;
uniform bool uIsTexture;

void main() {
    if(uIsTexture)
        gl_FragColor =   v_color + texture2D(uSampler, v_TextureCoord);
    else
        gl_FragColor = v_color;
}
