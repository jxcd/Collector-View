/**
 * 环境参数转为js参数, 统一入口, 避免使用处显式获取 REACT_APP_* 常量, 然后转js对象
 */

export const COMMON_ICP = process.env.REACT_APP_COMMON_ICP;