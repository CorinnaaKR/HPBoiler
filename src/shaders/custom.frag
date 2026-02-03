precision highp float;

uniform sampler2D map;
uniform vec3 lightDirection;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vec4 texColor = texture2D(map, vUv);
  vec3 normal = normalize(vNormal);
  
  float diffuse = max(0.0, dot(normal, normalize(lightDirection)));
  vec3 color = texColor.rgb * (0.3 + diffuse * 0.7);
  
  gl_FragColor = vec4(color, texColor.a);
}
