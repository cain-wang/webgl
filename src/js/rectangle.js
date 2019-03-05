const vertexShader = `
attribute vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

const fragmentShader = `
precision mediump float;

void main() {
  gl_FragColor = vec4(0, 0, 1, 1);
}
`;

function fillRectangleBuffer(gl, buffer) {
  const positions = new Float32Array([
    -0.3,
    0.3,
    0.3,
    0.3,
    -0.3,
    -0.3,
    0.3,
    -0.3
  ]);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

function renderRectangle(gl, positionBuffer, positionAttribLocation) {
  fillRectangleBuffer(gl, positionBuffer);
  gl.enableVertexAttribArray(positionAttribLocation);
  gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

(function() {
  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl");
  resizeViewport(gl, canvas);
  clearCanvas(gl);
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);
  const positionAttribLocation = gl.getAttribLocation(program, "a_position");

  const positionBuffer = gl.createBuffer();
  renderRectangle(gl, positionBuffer, positionAttribLocation);
})();
