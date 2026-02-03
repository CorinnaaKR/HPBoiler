precision highp float;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 normalMatrix;

attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vNormal = normalize((normalMatrix * vec4(normal, 0.0)).xyz);
  vUv = uv;
  vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
