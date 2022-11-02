const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const fs = require("fs");
const path = require("path");
const { init: initDB, Clothes } = require("./db");
// const cloud = require('wx-server-sdk');
const router = new Router();
const cors = require('koa2-cors');

const homePage = fs.readFileSync(path.join(__dirname, "index.html"), "utf-8");

// 首页
router.get("/", async (ctx) => {
  ctx.body = homePage;
});

// 小程序调用，获取微信 Open ID
router.get("/api/wx_openid", async (ctx) => {
  if (ctx.request.headers["x-wx-source"]) {
    ctx.body = ctx.request.headers["x-wx-openid"];
  }
});

// 获取
router.get("/api/get_clothes", async (ctx) => {
  const result = await Clothes.findAll({});

  ctx.body = {
    code: 0,
    data: result,
  };
});

// 新增
router.post("/api/add_clothes", async (ctx) => {
  const { body } = ctx.request;
  console.log('add body=', body,)
  const item = {
    season: body.season[0],
    type: body.type[0],
    position: body.position[0],
    other: body.other,
    imgurl: body.imgurl
  }
  const result = await Clothes.create(item);
  ctx.body = {
    code: 0,
    data: result,
  };
  ctx.status = 201;
});

// 删除
router.delete("/api/del_clothes/:id", async (ctx) => {
  // const { body } = ctx.request;
  const id = Number(ctx.params.id);
  console.log('del=', id)
  const result = await Clothes.destroy({
    where: {id:id}
  })
  console.log('88',result)
  ctx.body = {
    code: 0,
    data: 'del success',
  };
  ctx.status = 201;
});


const app = new Koa();
app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .use(cors());

const port = process.env.PORT || 90;
async function bootstrap() {
  await initDB();
  app.listen(port, () => {
    console.log("启动成功", port);
  });
}
bootstrap();