function resizeViewport(gl, canvas) {
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function clearCanvas(gl) {
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const ok = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (ok) {
    return shader;
  }

  const log = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw new Error(log);
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const program = gl.createProgram();
  gl.attachShader(
    program,
    createShader(gl, gl.VERTEX_SHADER, vertexShaderSource)
  );
  gl.attachShader(
    program,
    createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource)
  );
  gl.linkProgram(program);

  const ok = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (ok) {
    return program;
  }

  console.error(gl.getProgramInfoLog(program));
}
