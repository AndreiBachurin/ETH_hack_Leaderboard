const fs = require("fs");

const leaderBoardPath = "boards/leaderBoard.json";
const allPlayersBoardPath = "boards/allPlayersBoard.json";

const networks = require("../../utils/networkDetails.json");
const { reCalculateScores } = require("../tools/evaluateHelper.cjs");

const writeLeaderBoards = async () => {
  // 1. compile network leaderboards
  for (let network of networks) {
    const networkLeaderBoardPath = `boards/networkleaderboards/${network.name}LeaderBoard.json`;

    const networkPlayersBoard = require(`../../networks/${String(
      network.name.toLowerCase()
    )}/${network.name}PlayersBoard.json`);

    let playersBoardWithScores = reCalculateScores(networkPlayersBoard);
    let networkLeaderBoard = playersBoardWithScores.sort((a, b) => {
      return b.score - a.score;
    });
    fs.writeFileSync(
      networkLeaderBoardPath,
      JSON.stringify(networkLeaderBoard)
    );
    console.log("networkLeaderBoard scribed for " + network.name);
  }

  // 2. compile global players board
  let allPlayersBoard = [];
  for (let network of networks) {
    const networkLeaderBoard = require(`../../boards/networkleaderboards/${network.name}LeaderBoard.json`);
    allPlayersBoard = [...allPlayersBoard, ...networkLeaderBoard];
  }
  fs.writeFileSync(allPlayersBoardPath, JSON.stringify(allPlayersBoard));

  // 3. write global leaderboard
  let allPlayersUnsorted = require(`../../${allPlayersBoardPath}`);
  let trimmedAllPlayersUnsorted = allPlayersUnsorted.filter((player) => {
    return player != "0x3992542b66F63157265E37Ce9f727F9f65beE97f" && player.totalNumberOfLevelsCompleted >= 1 && player.totalNumberOfLevelsCompleted >= 4 && player.score < 1000;
  });
  let leaderBoard = trimmedAllPlayersUnsorted.sort((a, b) => {
    return b.playerScore - a.playerScore;
  });
  fs.writeFileSync(leaderBoardPath, JSON.stringify(leaderBoard));
  console.log(
    "button up your mittens, because the leaders have come forth! Leader board written from historical data."
  );
};

module.exports = writeLeaderBoards;
