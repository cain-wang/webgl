import { clearCanvas, createProgram } from './webgls.js';
import { initCanvas } from './helpers.js';

const vertexShader = `
attribute vec2 a_position;
attribute vec2 a_textCoord;
varying vec2 v_textCoord;

void main() {
  gl_Position = vec4(a_position, 0, 1);
  v_textCoord = a_textCoord;
}
`;

const fragmentShader = `
precision mediump float;
varying vec2 v_textCoord;
uniform sampler2D u_image;

void main() {
  gl_FragColor = texture2D(u_image, v_textCoord);
}
`;

function render(image) {
  const { canvas, gl } = initCanvas();
  clearCanvas(gl, 0, 0, 0, 1);

  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  const textCoordLocation = gl.getAttribLocation(program, 'a_textCoord');
  const imageLocation = gl.getUniformLocation(program, 'u_image');

  gl.enableVertexAttribArray(positionLocation);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = new Float32Array([-1, 1, 1, 1, -1, -1, 1, -1]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  gl.enableVertexAttribArray(textCoordLocation);
  const textCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, textCoordBuffer);
  const textCoords = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
  gl.bufferData(gl.ARRAY_BUFFER, textCoords, gl.STATIC_DRAW);
  gl.vertexAttribPointer(textCoordLocation, 2, gl.FLOAT, false, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function main() {
  const image = new Image();
  image.src = 'uber.png';
  image.onload = () => render(image);
}

main();
