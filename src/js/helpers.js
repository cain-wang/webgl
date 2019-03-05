import { resizeViewport } from "./webgls.js";

export function initCanvas() {
  const canvas = document.querySelector("canvas");
  const gl = canvas.getContext("webgl");
  resizeViewport(gl, canvas);
  return { canvas, gl };
}
