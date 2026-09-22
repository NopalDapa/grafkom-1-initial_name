function main()
{
  var canvas = document.getElementById("myCanvas");
  var gl = canvas.getContext("webgl");

  var vertices = [];

  var T = 0.12;      // tebal stroke
  var TOP = 0.6;     // batas atas huruf
  var BOT = -0.6;    // batas bawah huruf
  var W = 0.36;      // lebar huruf
  var GAP = 0.18;    // jarak antar huruf

  // menambahkan sebuah quad (2 segitiga) dari 4 titik
  function quad(x1, y1, x2, y2, x3, y3, x4, y4)
  {
    vertices.push(
      x1, y1, x2, y2, x3, y3,
      x1, y1, x3, y3, x4, y4
    );
  }

  // persegi panjang
  function rect(x, y, w, h)
  {
    quad(x, y, x + w, y, x + w, y + h, x, y + h);
  }

  // N
  var N = -0.99;
  rect(N, BOT, T, TOP - BOT);
  rect(N + W - T, BOT, T, TOP - BOT);
  quad(N, TOP, N + T, TOP, N + W, BOT, N + W - T, BOT);

  // D
  var D = N + W + GAP;
  rect(D, BOT, T, TOP - BOT);
  rect(D, TOP - T, W, T);
  rect(D, BOT, W, T);
  rect(D + W - T, BOT + T, T, TOP - BOT - 2 * T);

  // A
  var A = D + W + GAP;
  var cx = A + W / 2;
  quad(A, BOT, A + T, BOT, cx + T / 2, TOP, cx - T / 2, TOP);
  quad(A + W - T, BOT, A + W, BOT, cx + T / 2, TOP, cx - T / 2, TOP);
  rect(A + 0.06, -0.16, W - 0.12, T);

  // Z
  var Z = A + W + GAP;
  rect(Z, TOP - T, W, T);
  rect(Z, BOT, W, T);
  quad(Z + W, TOP - T, Z + W - T, TOP - T, Z + T, BOT + T, Z, BOT + T);

  const vertexShaderCode = `
    attribute vec2 aPosition;
    void main() 
    {
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }`;

  const fragmentShaderCode = `
    precision mediump float;
    void main()
    {
      gl_FragColor = vec4(0.0, 0.6, 0.9, 1.0);
    }`;

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderCode);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) 
  {
    console.error("Vertex shader error:", gl.getShaderInfoLog(vertexShader));
  }

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderCode);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) 
  {
    console.error("Fragment shader error:", gl.getShaderInfoLog(fragmentShader));
  }

  // program harus dibuat DULU sebelum getAttribLocation
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var aPosition = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(aPosition);

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}
