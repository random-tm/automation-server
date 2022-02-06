import Koa from "koa";
import bodyParser from "koa-bodyparser";
import config from "./config/index.js";
import tasks from "./tasks.js";

const app = new Koa();
app.use(bodyParser());

app.use(async ctx => {
    tasks(ctx.request, ctx.response);
});

app.listen(config.service.port);