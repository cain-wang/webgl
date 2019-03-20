import { clearCanvas, createProgram } from './webgls.js';
import { initCanvas } from './helpers.js';

const vertexShader = `
attribute vec2 a_position;
varying vec2 v_texCoord;

void main() {
  gl_Position = vec4(a_position, 0, 1);
  v_texCoord = (a_position + 1.0) / 2.0;
}
`;

const fragmentShader = `
precision mediump float;

uniform float u_width;
uniform float u_height;

varying vec2 v_texCoord;

vec2 getValue() {
  return vec2(floor(v_texCoord.x * u_width) / 100.0, floor(v_texCoord.y * u_height) / 100.0);
}

void main() {
  gl_FragColor = vec4(getValue(), 1, 1);
}
`;

function createTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}

function main() {
  const { canvas, gl } = initCanvas({ depth: false, antialias: false });
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const width = 2;
  const height = 2;
  const dataType = gl.UNSIGNED_BYTE;
  const dataFormat = gl.RGBA;

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.uniform1f(gl.getUniformLocation(program, 'u_width'), width);
  gl.uniform1f(gl.getUniformLocation(program, 'u_height'), height);

  const texture = createTexture(gl);
  gl.pixelStorei(gl.PACK_ALIGNMENT, 1);
  gl.texImage2D(gl.TEXTURE_2D, 0, dataFormat, width, height, 0, dataFormat, dataType, null);

  const fb = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.viewport(0, 0, width, height);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  const framebufferStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  console.log('frame buffer status', framebufferStatus, gl.FRAMEBUFFER_COMPLETE);
  const pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, dataFormat, dataType, pixels);
  console.log('read pixels', pixels);
  console.log('frag color', [...pixels].map(val => val / 255.0));
}

main();
