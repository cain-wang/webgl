import { clearCanvas, createProgram } from "./webgls.js";
import { initCanvas } from "./helpers.js";

const vertexShader = `
attribute vec2 a_position;

uniform vec2 u_resolution;

void main() {
  vec2 zeroToOne = a_position / u_resolution;
  vec2 clipSpace = (zeroToOne * 2.0 - 1.0) * vec2(1, -1);
  gl_Position = vec4(clipSpace, 0, 1);
}
`;

const fragmentShader = `
precision mediump float;

void main() {
  gl_FragColor = vec4(0, 0, 1, 1);
}
`;

function fillRectangleBuffer(gl, buffer) {
  const positions = new Float32Array([0, 0, 100, 0, 0, 100, 100, 100]);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

function renderRectangle(gl, positionBuffer, positionAttribLocation) {
  fillRectangleBuffer(gl, positionBuffer);
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function main() {
  const { canvas, gl } = initCanvas();
  clearCanvas(gl, 0, 0, 0, 1);
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  const positionAttribLocation = gl.getAttribLocation(program, "a_position");
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

  const positionBuffer = gl.createBuffer();
  renderRectangle(gl, positionBuffer, positionAttribLocation);
}

main();
