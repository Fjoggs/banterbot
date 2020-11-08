import { response } from 'express';
import * as Koa from 'koa'
import * as Router from 'koa-router';

import { checkForEvents, getAsyncData, getLiveData } from './api/api';
import { fetchData, luckernoobOfTheWeek, rittardOfTheWeek, topDickOfTheWeek } from './api/parser';

const app = new Koa()
const router = new Router<Koa.DefaultState, Koa.Context>();

let teams = []

const fetchDataServer = async () => teams = await getAsyncData()
fetchDataServer()
fetchData()

let liveData = {}
const fetchLiveData = async () => liveData = await getLiveData()
fetchLiveData()

router.get('/', (ctx, next) => {
    ctx.body = teams;
});

router.get('/rittard', (ctx, next) => {
    ctx.body = rittardOfTheWeek();
})

router.get('/topdick', (ctx, next) => {
    ctx.body = topDickOfTheWeek();
})

router.get('/luckernoob', (ctx, next) => {
    ctx.body = luckernoobOfTheWeek();
})

router.get('/live', (ctx, next) => {
    const event = checkForEvents(liveData)
    ctx.body = event
})

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
console.log('Listening on 3000..')