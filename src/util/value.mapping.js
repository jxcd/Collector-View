import {ifNull} from "./es.util";
import {AlipayOutlined, AppstoreAddOutlined, BankOutlined, CarOutlined, WechatOutlined} from "@ant-design/icons";
import list from "rc-virtual-list/lib/List";

const listToObj = (list, valueMapping = it => it.name) => {
    const obj = {};
    list.forEach(it => obj[it.key] = valueMapping(it));
    return obj;
}

export const stateList = [
    {key: 0, name: '初始化'},
    {key: 1, name: '开始'},
    {key: 3, name: '完成'},
    {key: 4, name: '错误'},
]

export const stateMapping = listToObj(stateList);

export const stateText = v => ifNull(stateMapping[v], v);

export const platformList = [
    {key: "支付宝", name: "支付宝", icon: <AlipayOutlined />},
    {key: "微信", name: "微信", icon: <WechatOutlined />},
    {key: "交通银行", name: "交通银行", icon: <BankOutlined />},
    {key: "ETC", name: "ETC", icon: <CarOutlined />},
    {key: "银联", name: "银联", icon: <BankOutlined />},
    {key: "招商银行", name: "招商银行", icon: <BankOutlined />},
    {key: "云闪付", name: "云闪付", icon: <BankOutlined />},
    {key: "网上国网", name: "网上国网", icon: <BankOutlined />},
    {key: "三星Pay", name: "三星Pay", icon: <BankOutlined />},
    {key: "京东", name: "京东", icon: <AppstoreAddOutlined />},
    {key: "中国铁路", name: "中国铁路", icon: <AppstoreAddOutlined />},
    {key: "小红书", name: "小红书", icon: <AppstoreAddOutlined />},
    {key: "拼多多", name: "拼多多", icon: <AppstoreAddOutlined />},
    {key: "美团", name: "美团", icon: <AppstoreAddOutlined />},
    {key: "抖音", name: "抖音", icon: <AppstoreAddOutlined />},
    {key: "华为商城", name: "华为商城", icon: <AppstoreAddOutlined />},
]

export const platformMapping = listToObj(platformList)

export const platformIconMapping = listToObj(platformList, it => it.icon);