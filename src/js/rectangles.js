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

uniform vec4 u_color;

void main() {
  gl_FragColor = u_color;
}
`;

function createRandomRectVertices(width, height) {
  const x = Math.random() * width;
  const y = Math.random() * height;
  const size = 100;

  return new Float32Array([x, y, x + 100, y, x, y + 100, x + 100, y + 100]);
}

function main() {
  const {
    canvas,
    canvas: { width, height },
    gl
  } = initCanvas();
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  clearCanvas(gl, 0, 0, 0, 1);
  const positionAttribLocation = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    "u_resolution"
  );
  const colorUniformLocation = gl.getUniformLocation(program, "u_color");
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  Array(10)
    .fill()
    .forEach(() => {
      const positionData = createRandomRectVertices(width, height);
      gl.bufferData(gl.ARRAY_BUFFER, positionData, gl.STATIC_DRAW);
      gl.uniform2f(resolutionUniformLocation, width, height);
      gl.uniform4f(
        colorUniformLocation,
        Math.random(),
        Math.random(),
        Math.random(),
        1
      );
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    });
}

main();
