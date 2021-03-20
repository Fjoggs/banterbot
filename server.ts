import * as Koa from "koa";
import * as Router from "koa-router";

import {
  checkForEvents,
  getAsyncData,
  getLiveData,
  GameState,
} from "./api/api";
// import {
//   fetchData,
//   luckernoobOfTheWeek,
//   rittardOfTheWeek,
//   topDickOfTheWeek,
// } from "./api/parser";

const app = new Koa();
const router = new Router<Koa.DefaultState, Koa.Context>();

let state: GameState;

let liveData = {};
const getData = async () => {
  state = await getAsyncData();
  liveData = await getLiveData();
}
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

router.get('/live1', (ctx, next) => {
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
  const events = checkForEvents(data, true)
  ctx.body = events
  ctx.body = events
})

router.get('/live2', (ctx, next) => {
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
  const events = checkForEvents(data, true)
  ctx.body = events
})

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000);
console.log("Listening on 3000..");
