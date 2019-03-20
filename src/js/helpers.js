import { resizeViewport } from './webgls.js';

export function initCanvas(options) {
  const canvas = document.querySelector('canvas');
  const gl = canvas.getContext('webgl', options);
  resizeViewport(gl, canvas);
  return { canvas, gl };
}
