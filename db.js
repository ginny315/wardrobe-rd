const { Sequelize, DataTypes } = require("sequelize");
const list = require('./envList') ;
console.log(list)

// 从环境变量中读取数据库配置
const { MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_ADDRESS = "" } = list;

const [host, port] = MYSQL_ADDRESS.split(":");

const sequelize = new Sequelize("wardrobe", MYSQL_USERNAME, MYSQL_PASSWORD, {
  host,
  port,
  dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
});

// 定义数据模型
const Clothes = sequelize.define("cloth", {
  id:{
    type:Sequelize.INTEGER,  //数据类型
    primaryKey:true,  //是否为主键
    unique:true,   //是否唯一
    autoIncrement:true  //自增
  },
  season: {
    type: DataTypes.STRING,
  },
  type: {
    type: DataTypes.STRING,
  },
  position: {
    type: DataTypes.STRING,
  },
  other: {
    type: DataTypes.STRING,
  },
  imgurl: {
    type: DataTypes.STRING,
  },
});

// 数据库初始化方法
async function init() {
  await Clothes.sync({ alter: true });
}

// 导出初始化方法和模型
module.exports = {
  init,
  Clothes,
};
