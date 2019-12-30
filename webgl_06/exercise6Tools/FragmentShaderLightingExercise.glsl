precision mediump float;

uniform bool uEnableTexture;
uniform bool uEnableLighting;

uniform vec3 uLightPosition;
uniform vec3 uLightColor;

varying vec3 vNormalEye;
varying vec3 vVertexPositionEye3;

varying vec3 vColor;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;


const float ambientFactor = 0.2;
const float shininess = 10.0;
const vec3 specularMaterialColor = vec3(0.4, 0.4, 0.4);

void main() {
    vec3 baseColor = vColor;
    if (uEnableTexture) {
        vec4 color = texture2D(uSampler, vTextureCoord);
        float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
        baseColor = vec3(gray)*vColor;
    }

    if (uEnableLighting) {
        // calculate light direction as seen from the vertex position
        vec3 lightDirectionEye = normalize(vVertexPositionEye3 - uLightPosition);    // L = LP = 0P-> - 0L
        vec3 normal = normalize(vNormalEye);    //N

        // ambient lighting
        vec3 ambientColor = ambientFactor * baseColor.rgb;

        // diffuse lighting
        float diffuseFactor = max(0.0,dot(normalize(lightDirectionEye), normal)); // N*L
        vec3 diffuseColor = uLightColor * baseColor * diffuseFactor;

        // specular lighting
        vec3 specularColor = vec3(0, 0, 0);
        if (diffuseFactor > 0.0) {
           //vec3 reflectionDir = 2.0*normal * diffuseFactor - lightDirectionEye;  //R = 2N(N•L) - L
           vec3 reflectionDir = normalize(reflect(-lightDirectionEye,normal));
           vec3 eyeDir = -normalize(vVertexPositionEye3);  // V
           float cosPhi = max(0.0,dot(normalize(eyeDir), reflectionDir));  // V*R
           float specularFactor = pow(cosPhi,shininess);   //cosPhi^n
           specularColor = uLightColor * specularMaterialColor * specularFactor;
        }

        vec3 color = ambientColor + diffuseColor + specularColor;
        gl_FragColor = vec4(color, 1.0);
    }
    else {
        gl_FragColor = vec4(baseColor, 1.0);
    }
}
