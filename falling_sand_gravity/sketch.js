function criarMatriz2D(colunas, linhas) {
  let matriz = new Array(colunas);
  for (let i = 0; i < matriz.length; i++) {
    matriz[i] = new Array(linhas).fill(0);
  }
  return matriz;
}

// A grade
let grid;
let velocityGrid;

// Tamanho de cada quadrado
let w = 5;
let colunas, linhas;
let valorHue = 100;

let gravidade = 0.08;

// Verifica se uma coluna está dentro dos limites
function dentroDasColunas(i) {
  return i >= 0 && i <= colunas - 1;
}

// Verifica se uma linha está dentro dos limites
function dentroDasLinhas(j) {
  return j >= 0 && j <= linhas - 1;
}

function setup() {
  createCanvas(600, 500);
  colorMode(HSB, 360, 255, 255);
  colunas = width / w;
  linhas = height / w;
  grid = criarMatriz2D(colunas, linhas);
  velocityGrid = criarMatriz2D(colunas, linhas).map(row => row.fill(1));
}

function mouseDragged() {}

function draw() {
  background(0);

  if (mouseIsPressed) {
    let colunaMouse = floor(mouseX / w);
    let linhaMouse = floor(mouseY / w);

    // Adiciona aleatoriamente uma área de partículas de areia
    let matriz = 6;
    let extensao = floor(matriz / 2);
    for (let i = -extensao; i <= extensao; i++) {
      for (let j = -extensao; j <= extensao; j++) {
        if (random(1) < 0.75) {
          let col = colunaMouse + i;
          let lin = linhaMouse + j;
          if (dentroDasColunas(col) && dentroDasLinhas(lin)) {
            grid[col][lin] = valorHue;
            velocityGrid[col][lin] = 1;
          }
        }
      }
    }
    // Altera a cor da areia ao longo do tempo
    valorHue += 0.5;
    if (valorHue > 360) {
      valorHue = 1;
    }
  }

  // Desenha a areia
  for (let i = 0; i < colunas; i++) {
    for (let j = 0; j < linhas; j++) {
      noStroke();
      if (grid[i][j] > 0) {
        fill(grid[i][j], 255, 255);
        let x = i * w;
        let y = j * w;
        square(x, y, w);
      }
    }
  }

  // Cria uma matriz 2D para o próximo quadro de animação
  let proximaGrid = criarMatriz2D(colunas, linhas);
  let proximaVelocityGrid = criarMatriz2D(colunas, linhas);

  // Verifica cada célula
  for (let i = 0; i < colunas; i++) {
    for (let j = 0; j < linhas; j++) {
      // Qual é o estado?
      let estado = grid[i][j];
      let velocidade = velocityGrid[i][j];
      let movido = false;
      if (estado > 0) {
        let novaPosicao = int(j + velocidade);
        for (let y = novaPosicao; y > j; y--) {
          let abaixo = grid[i][y];
          let dir = 1;
          if (random(1) < 0.5) {
            dir *= -1;
          }
          let abaixoA = -1;
          let abaixoB = -1;
          if (dentroDasColunas(i + dir)) abaixoA = grid[i + dir][y];
          if (dentroDasColunas(i - dir)) abaixoB = grid[i - dir][y];

          if (abaixo === 0) {
            proximaGrid[i][y] = estado;
            proximaVelocityGrid[i][y] = velocidade + gravidade;
            movido = true;
            break;
          } else if (abaixoA === 0) {
            proximaGrid[i + dir][y] = estado;
            proximaVelocityGrid[i + dir][y] = velocidade + gravidade;
            movido = true;
            break;
          } else if (abaixoB === 0) {
            proximaGrid[i - dir][y] = estado;
            proximaVelocityGrid[i - dir][y] = velocidade + gravidade;
            movido = true;
            break;
          }
        }
      }

      if (estado > 0 && !movido) {
        proximaGrid[i][j] = grid[i][j];
        proximaVelocityGrid[i][j] = velocityGrid[i][j] + gravidade;
      }
    }
  }
  grid = proximaGrid;
  velocityGrid = proximaVelocityGrid;
}