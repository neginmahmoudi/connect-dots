let columns = 0;
let rows = 0;
let winScore = 0;
let players = [];
let currentPlayer = "";
const message = document.querySelector(".message");
const gameBoard = document.querySelector(".game-board");
const options = document.querySelector(".game-options");
const rowsOption = document.querySelector(".rows");
const columnsOption = document.querySelector(".columns");
const pointsOption = document.querySelector(".points");
const avatarsOption = document.querySelector(".players");
const resetButton = document.querySelector(".button--reset");
const startButton = document.querySelector(".button--start");
const optionsButton = document.querySelector(".button--options");
const avatarsSelect = document.querySelector(".avatars-select");
const selectableAvatars = [
  "Negin",
  "Alex",
  "Flo",
  "Sara",
  "Daniel",
  "Cat",
  "Dog",
  "Fox",
  "Gorilla",
  "Koala",
  "Lion",
  "Rabbit",
  "Tiger",
  "Cats",
  "Dogs",
  "Pigs",
  "Rabbits",
];

const hideElement = (element) => {
  element.classList.add("hidden");
};

const showElement = (element) => {
  element.classList.remove("hidden");
};

const showOptions = () => {
  changeMessageText("Connect The Dots");

  showElement(options);
  hideGameBoard();
};

const hideGameBoard = () => {
  hideElement(gameBoard);
  hideElement(optionsButton);
  hideElement(resetButton);
};

const renderAvatarsSelect = () => {
  let avatarsHTML = "";
  for (let i = 0; i < avatarsOption.value; i++) {
    avatarsHTML += `<select required><option value="" selected disabled>Avatar</option>`;
    for (let j = 0; j < selectableAvatars.length; j++) {
      avatarsHTML += `<option value="${selectableAvatars[j]}">${selectableAvatars[j]}</option>`;
    }
    avatarsHTML += "</select>";
  }
  avatarsSelect.innerHTML = avatarsHTML;
};

const getPlayers = () => {
  players = [];
  document.querySelectorAll("select").forEach((select) => {
    players.push(select.value);
  });
  currentPlayer = players[0];
};

const getOptions = () => {
  columns = columnsOption.value;
  rows = parseInt(rowsOption.value) + 1;
  winScore = pointsOption.value;
  getPlayers();
};

const startGame = () => {
  getOptions();
  hideElement(options);
  renderRowsAndColumns(rows, columns);
  showElement(resetButton);
  showElement(optionsButton);
};

const changeMessageText = (text) => {
  message.textContent = text;
};

const renderRowsAndColumns = (rows, columns) => {
  showElement(gameBoard);
  changeMessageText(`Connect ${winScore} Dots`);
  gameBoard.classList.remove("disableClick");

  const renderGameBoardHTML = () => {
    gameBoard.innerHTML = "";
    let html = "";
    for (let i = 1; i <= columns; i++) {
      html += `<div class="column" data-column="${i}" tabindex="0">`;
      for (let j = rows; j > 0; j--) {
        html += `<div class="cell" data-column="${i}" data-cell="${j}"></div>`;
      }
      html += `</div>`;
    }
    gameBoard.innerHTML = html;
  };

  const addGameBoardEventlisteners = () => {
    document.querySelectorAll(".column").forEach((element) => {
      element.addEventListener("click", () => {
        for (let i = 1; i < rows; i++) {
          const currentCell = document.querySelector(
            `[data-column="${element.dataset.column}"] [data-cell="${i}"]`
          );
          if (!currentCell.classList.contains("taken")) {
            currentCell.classList.add("taken");
            currentCell.classList.add(currentPlayer);
            currentCell.style.backgroundImage = `url('https://harka.com/img/avatars/${currentPlayer.toLocaleLowerCase()}.jpg')`;
            checkIfWon(element.dataset.column, i);
            changePlayer();
            document.querySelector(
              `[data-column="${element.dataset.column}"] [data-cell="${rows}"]`
            ).style.backgroundImage = `url('https://harka.com/img/avatars/${currentPlayer.toLocaleLowerCase()}.jpg')`;
            break;
          }
        }
      });

      element.addEventListener("mouseover", () => {
        document.querySelector(
          `[data-column="${element.dataset.column}"] [data-cell="${rows}"]`
        ).style.borderRadius = "50%";
        document.querySelector(
          `[data-column="${element.dataset.column}"].cell:first-of-type`
        ).style.backgroundImage = `url('https://harka.com/img/avatars/${currentPlayer.toLocaleLowerCase()}.jpg')`;
      });

      element.addEventListener("mouseleave", () => {
        document.querySelector(
          `[data-column="${element.dataset.column}"] [data-cell="${rows}"]`
        ).style.borderRadius = "100%";
        document.querySelector(
          `[data-column="${element.dataset.column}"].cell:first-of-type`
        ).style.backgroundImage = "";
      });
    });
  };

  renderGameBoardHTML();
  addGameBoardEventlisteners();
};

// const checkIfColumnIsFull = column => {
//   return document
//     .querySelector(`[data-column="${column}"] [data-cell="${rows - 1}"]`)
//     .classList.contains('taken');
// };

const changePlayer = () => {
  if (currentPlayer === players[players.length - 1]) {
    currentPlayer = players[0];
  } else {
    currentPlayer = players[players.indexOf(currentPlayer) + 1];
  }
};

const quitGame = (input) => {
  if (input === "draw") {
    changeMessageText("It's a draw!");
  } else {
    changeMessageText(`${currentPlayer} won!`);
  }
  gameBoard.classList.add("disableClick");
};

const checkIfGameOver = (score) => {
  if (score >= winScore) quitGame();
};

const checkIfWon = (column, cell) => {
  const checkHorizontal = () => {
    let score = 0;
    const currentRow = document.querySelectorAll(`[data-cell="${cell}"]`);
    currentRow.forEach((cell) => {
      if (cell.classList.contains(currentPlayer)) {
        score++;
      } else {
        score = 0;
      }
      checkIfGameOver(score);
    });
  };

  const checkVertical = () => {
    let score = 0;
    const currentColumn = document.querySelectorAll(
      `[data-column="${column}"]`
    );
    currentColumn.forEach((cell) => {
      if (cell.classList.contains(currentPlayer)) {
        score++;
      } else {
        score = 0;
      }
      checkIfGameOver(score);
    });
  };

  const checkDiagonal = () => {
    let score = 0;

    for (let i = -winScore + 1; i < winScore; i++) {
      const cells = document.querySelectorAll(
        `.cell[data-column="${column - i}"][data-cell="${cell + i}"]`
      );
      cells.forEach((cell) => {
        if (cell.classList.contains(currentPlayer)) {
          score++;
          checkIfGameOver(score);
        } else {
          score = 0;
        }
      });
    }
  };

  const checkAntiDiagonal = () => {
    let score = 0;

    for (let i = -winScore + 1; i < winScore; i++) {
      const cells = document.querySelectorAll(
        `.cell[data-column="${column - i}"][data-cell="${cell - i}"]`
      );
      cells.forEach((cell) => {
        if (cell.classList.contains(currentPlayer)) {
          score++;
          checkIfGameOver(score);
        } else {
          score = 0;
        }
      });
    }
  };

  const checkDraw = () => {
    if (
      document.querySelectorAll(".taken").length ===
      document.querySelectorAll(".cell").length - columns
    ) {
      quitGame("draw");
    }
  };

  checkHorizontal();
  checkVertical();
  checkDiagonal();
  checkAntiDiagonal();
  checkDraw();
};

const resetGame = () => {
  renderRowsAndColumns(rows, columns);
  changeMessageText(`Connect ${winScore} Dots`);
};

resetButton.addEventListener("click", resetGame);
optionsButton.addEventListener("click", showOptions);
avatarsOption.addEventListener("input", renderAvatarsSelect);
options.addEventListener("submit", (e) => {
  e.preventDefault();
  startGame();
});
