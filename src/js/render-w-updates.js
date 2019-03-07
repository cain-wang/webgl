import { clearCanvas, createProgram } from "./webgls.js";
import { initCanvas } from "./helpers.js";

const vertexShader = `
uniform vec2 u_offset;
uniform vec2 u_resolution;

attribute vec2 a_position;
attribute vec3 a_color;

varying vec4 v_color;

void main() {
  vec2 zeroToOne = (a_position + u_offset) / u_resolution;
  vec2 clipSpace = zeroToOne * 2.0 - 1.0;
  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
  v_color = vec4(a_color, 1);
}
`;

const fragmentShader = `
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`;

function main() {
  const { canvas, gl } = initCanvas();
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const colorLocation = gl.getAttribLocation(program, "a_color");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const offsetLocation = gl.getUniformLocation(program, "u_offset");

  gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, 0, 100, 100, 0, 100]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
    gl.STATIC_DRAW
  );
  gl.enableVertexAttribArray(colorLocation);
  gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, 3, 0, 0);

  function renderScene(offsetLeft, offsetTop) {
    clearCanvas(gl, 0, 0, 0, 1);
    console.log("offset", offsetLeft, offsetTop);
    gl.uniform2f(offsetLocation, offsetLeft, offsetTop);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  renderScene(0, 0);
  canvas.addEventListener("click", e => renderScene(e.offsetX, e.offsetY));
}

main();
