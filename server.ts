import * as Koa from "koa";
import * as Router from "koa-router";

import {
  checkForEvents,
  getAsyncData,
  getLiveData,
  GameState,
} from "./api/api";
import BanterBotDB from "./api/db";
import { addChallenge, getWinners } from "./api/db/challenges";
// import {
//   fetchData,
//   luckernoobOfTheWeek,
//   rittardOfTheWeek,
//   topDickOfTheWeek,
// } from "./api/parser";

const app = new Koa();
const router = new Router<Koa.DefaultState, Koa.Context>();

const db = new BanterBotDB();

let state: GameState;

let liveData = {};
const getData = async () => {
  state = await getAsyncData();
  liveData = await getLiveData();
};
getData();

router.get("/", (ctx, next) => {
  ctx.body = Array.from(state.activePlayers);
});

router.get("/rittard", (ctx, next) => {
  //   ctx.body = rittardOfTheWeek();
});

router.get("/topdick", (ctx, next) => {
  //   ctx.body = topDickOfTheWeek();
});

router.get("/luckernoob", (ctx, next) => {
  //   ctx.body = luckernoobOfTheWeek();
});

router.get("/live", (ctx, next) => {
  const events = checkForEvents(liveData);
  ctx.body = events;
});

router.get("/live1", (ctx, next) => {
  const data = {
    elements: {
      287: {
        explain: [
          [
            [
              {
                name: "Goals scored",
                points: 4,
                value: 1,
                stat: "goals_scored",
              },
              {
                name: "Minutes played",
                points: 0,
                value: 0,
                stat: "minutes",
              },
            ],
            69,
          ],
        ],
      },
    },
  };
  const events = checkForEvents(data);
  ctx.body = events;
  ctx.body = events;
});

router.get("/live2", (ctx, next) => {
  const data = {
    elements: {
      287: {
        explain: [
          [
            [
              {
                name: "Goals scored",
                points: 4,
                value: 1,
                stat: "goals_scored",
              },
              {
                name: "Minutes played",
                points: 0,
                value: 0,
                stat: "minutes",
              },
              {
                name: "Goals scored",
                points: 4,
                value: 1,
                stat: "goals_scored",
              },
            ],
            69,
          ],
        ],
      },
    },
  };
  const events = checkForEvents(data);
  ctx.body = events;
});

router.get("/db/challenge/insert", (ctx, next) => {
  addChallenge("testname", "", () => {});
  ctx.status = 200;
});

router.get("/db/challenge/testname", (ctx, next) => {
  db.getChallenge("testname");
  ctx.body = 200;
});

router.get("/db/challenge/all", (ctx, next) => {
  db.getChallenges();
  const challenges = db.getChallengesList();
  console.log("challenges in server", challenges);
  ctx.body = challenges;
});

router.get("/db/score/insert", (ctx, next) => {
  db.addScore(2, 1, 50);
  ctx.status = 200;
});

router.get("/db/score/", (ctx, next) => {
  const score = db.getScore(1, 1);
  console.log("score", score);
  ctx.body = score;
});

router.get("/db/winners/", (ctx, next) => {
  let losers = [];
  let winners = [];
  getWinners(1, (rows) => {
    rows.forEach((row) => {
      if (row.bet === row.result) {
        winners.push(row.playerId);
      } else {
        losers.push(row.playerId);
      }
    });
  });
  ctx.status = 200;
});

router.get("/db/score/all", (ctx, next) => {
  db.getScores();
  const scores = db.getScoreList();
  console.log("Scores", scores);
  let result = {};
  scores.forEach((score) => {
    if (!result[score.challengeId]) {
      result[score.challengeId] = [
        {
          player: score.name,
          score: score.score,
        },
      ];
    } else {
      result[score.challengeId].push({
        player: score.name,
        score: score.score,
      });
    }
  });
  ctx.body = result;
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log("Listening on 3000..");
