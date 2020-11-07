import { response } from 'express';
import * as Koa from 'koa'
import * as Router from 'koa-router';
import fetch from 'node-fetch'


import { getData } from './api/api';

const app = new Koa()
const router = new Router<Koa.DefaultState, Koa.Context>();

router.get('/', async (ctx, next) => {
    ctx.body = getData()
});

app.use(router.routes())
    .use(router.allowedMethods());

app.listen(3000);
console.log('Listening on 3000..')