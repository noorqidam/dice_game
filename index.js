const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function rng(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function throwDices(playerList) {
  playerList.forEach((player, index) => {
    if (player.isRunOutDice) {
      console.log(
        `player #${index + 1} (${
          player.point
        }) : _ (Stop playing because no dice remain in hand)`
      );
      return;
    }
    for (let i = 1; i <= player.diceCount; i++) {
      const thrownDice = rng(1, 6);
      player.thrownDices.push(thrownDice);
    }
    const thrownDicesString = player.thrownDices.join(",");
    console.log(
      `player #${index + 1} (${player.point}) : ${thrownDicesString}`
    );
  });
}

function evaluateRound(playerList, currentPlayer) {
  console.log("after evaluation : ");
  playerList.forEach((player, playerIndex) => {
    player.thrownDices.forEach((dice, diceIndex) => {
      if (dice == 1) {
        const nextPlayerIndex = (playerIndex + 1) % playerList.length;
        if (!player.isRunOutDice) {
          player.diceCount--;
          playerList[nextPlayerIndex].diceCount++;
          playerList[nextPlayerIndex].newDices.push(1);
          player.thrownDices.splice(diceIndex, 1);
        }
      } else if (dice == 6) {
        player.diceCount--;
        player.point++;
        player.thrownDices.splice(diceIndex, 1);
      }
    });
  });
  playerList.forEach((player, index) => {
    player.thrownDices.push(player.newDices);
    if (player.diceCount == 0 && !player.isRunOutDice) {
      player.isRunOutDice = true;
      currentPlayer.playerCount--;
      console.log(
        `player #${index + 1} (${
          player.point
        }) : _ (Stop playing because no dice remain in hand)`
      );
      return;
    }
    if (player.isRunOutDice) {
      console.log(
        `player #${index + 1} (${
          player.point
        }) : _ (Stop playing because no dice remain in hand)`
      );
      return;
    }
    let thrownDices = player.thrownDices.join(",");
    console.log(`player #${index + 1} (${player.point}) : ${thrownDices}`);
    player.thrownDices = [];
    player.newDices = [];
  });
  console.log();
}

function startDiceGame(playerCount, diceCount) {
  playerCount = parseInt(playerCount);
  let currentPlayer = { playerCount };
  diceCount = parseInt(diceCount);

  if (isNaN(playerCount) || isNaN(diceCount)) {
    console.log("invalid player count");
    return;
  }
  console.log("----GAME START----\n");
  const playerList = [];
  for (let i = 1; i <= playerCount; i++) {
    const playerData = {
      point: 0,
      diceCount,
      thrownDices: [],
      newDices: [],
      isRunOutDice: false,
    };
    playerList.push(playerData);
  }

  for (let i = 1; i > 0; i++) {
    if (currentPlayer.playerCount <= 1) {
      break;
    }
    console.log(`turn #${i} throw dice :`);

    throwDices(playerList);
    evaluateRound(playerList, currentPlayer);
  }
}

rl.question("input number of player : ", function (playerCount) {
  rl.question("input number of dice : ", function (diceCount) {
    startDiceGame(playerCount, diceCount);
    rl.close();
  });
});

rl.on("close", function () {
  console.log("BYE BYE !!!");
  process.exit(0);
});
