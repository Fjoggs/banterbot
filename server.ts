import { response } from 'express';
import * as Koa from 'koa'
import * as Router from 'koa-router';

import { getAsyncData } from './api/api';

const app = new Koa()
const router = new Router<Koa.DefaultState, Koa.Context>();

let data = {}
const fetchData = async () => data = await getAsyncData()
fetchData()

router.get('/', (ctx, next) => {
    ctx.body = data;
});

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
console.log('Listening on 3000..')