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

varying vec2 v_texCoord;
uniform sampler2D u_image;
uniform vec2 u_textureSize;

void main() {
  vec2 pixelOffset = vec2(1.0 / u_textureSize.x, 0);

  vec4 texColor = (
    texture2D(u_image, v_texCoord),
    texture2D(u_image, v_texCoord + pixelOffset),
    texture2D(u_image, v_texCoord - pixelOffset)
  ) / 3.0;
  gl_FragColor = vec4(texColor.rgb, 1);
}
`;

function render(image) {
  const { canvas, gl } = initCanvas();
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]), gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const textureSizeLocation = gl.getUniformLocation(program, 'u_textureSize');
  gl.uniform2f(textureSizeLocation, image.width, image.height);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function main() {
  const image = new Image();
  image.src = 'uber.png';
  image.onload = () => render(image);
}

main();
