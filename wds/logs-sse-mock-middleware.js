import { parse } from 'querystring';
import koaSse from 'koa-sse-stream';

const path = '/logs-sse-mock';

const sse = koaSse();

export const logsSseMockMiddleware = async (ctx, next) => {
  if (ctx.path === path) {
    await sse(ctx, next);
    let n = 0;
    const params = parse(ctx.req._parsedUrl.query);
    const rate = params.rate ? parseInt(params.rate) : 1000;
    const limit = params.limit ? parseInt(params.limit) : 10;
    const interval = setInterval(() => {
      const date = (new Date()).toString();
      ctx.sse.send(date);
      console.log('send Date : ' + date);
      n++;
      if (n >= limit) {
        console.log('send manual close');
        ctx.sse.sendEnd();
      }
    }, rate);
    ctx.sse.on('close', (...args) => {
      console.log('clear interval');
      clearInterval(interval);
    });
  }
  else {
    return await next();
  }

};
