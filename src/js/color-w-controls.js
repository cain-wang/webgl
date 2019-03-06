import { clearCanvas, createProgram } from "./webgls.js";
import { initCanvas } from "./helpers.js";

const vertexShader = `
attribute vec2 a_position;
attribute vec3 a_color;
uniform float u_seed;
varying vec4 v_color;

void main() {
  vec2 pos = a_position + vec2(0, u_seed);
  gl_Position = vec4(pos * u_seed, 0, 1);
  v_color = vec4(a_color * u_seed, 1);
}
`;

const fragmentShader = `
precision mediump float;
varying vec4 v_color;

void main() {
  gl_FragColor = v_color;
}
`;

function getSeed() {
  return Math.min(Math.random() + 0.3, 1);
}

function main() {
  const { canvas, gl } = initCanvas();
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const colorLocation = gl.getAttribLocation(program, "a_color");
  const seedUniform = gl.getUniformLocation(program, "u_seed");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0, -1, 1, 0, -1, 0]),
    gl.STATIC_DRAW
  );

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]),
    gl.STATIC_DRAW
  );

  function renderScene(seed) {
    clearCanvas(gl, 0, 0, 0, 1);
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, 3, 0, 0);

    gl.uniform1f(seedUniform, seed);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  renderScene(getSeed());

  canvas.addEventListener("click", () => {
    renderScene(getSeed());
  });
}

main();
