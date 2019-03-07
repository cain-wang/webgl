import { clearCanvas, createProgram } from "./webgls.js";
import { initCanvas } from "./helpers.js";

const vertexShader = `
struct Input {
  bool active;
  vec2 offset;
  vec4 color;
};

uniform Input u_input;
attribute vec4 a_position;
varying vec4 v_color;

void main() {
  gl_Position = u_input.active ? (a_position + vec4(u_input.offset, 0, 0)) : vec4(0);
  v_color = u_input.color;
}
`;

const fragmentShader = `
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`;

const trianglePositions = new Float32Array([-0.4, 0.4, 0.4, 0.4, 0, 0]);
const colors = [[1, 0, 0, 1], [0, 1, 0, 1], [0, 0, 1, 1]];

function main() {
  const { canvas, gl } = initCanvas();
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  let active = true;
  let colorIndex = 0;
  let offset = [0, 0];

  const activeLocation = gl.getUniformLocation(program, "u_input.active");
  const offsetLocation = gl.getUniformLocation(program, "u_input.offset");
  const colorLocation = gl.getUniformLocation(program, "u_input.color");
  const positionLocation = gl.getAttribLocation(program, "a_position");

  function input() {
    gl.uniform1i(activeLocation, active);
    gl.uniform2fv(offsetLocation, offset);
    gl.uniform4fv(colorLocation, colors[colorIndex]);

    renderScene();
  }

  function renderScene() {
    clearCanvas(gl, 0, 0, 0, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, trianglePositions, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  input();

  canvas.addEventListener("click", e => {
    active = !active;
    colorIndex++;
    colorIndex = colorIndex >= colors.length ? 0 : colorIndex;
    offset[0] = colorIndex / 10;
    offset[1] = colorIndex / 10;
    input();
  });
}

main();
