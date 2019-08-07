//********定义一些全局的变量***********
//配置是后台授权中心的代码
const ssoserverpath='http://localhost:10000/sso/auth/'
//配置后台业务服务的访问地址
const serverpath='http://localhost:10000/api/manger/'
const userinfo={}
export default {
  serverpath,
  ssoserverpath,
  userinfo,
}
