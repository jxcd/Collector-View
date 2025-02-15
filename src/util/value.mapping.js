import {ifNull} from "./es.util";

const listToObj = (list, valueMapping) => {
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

export const stateMapping = listToObj(stateList, it => it.name);

export const stateText = v => ifNull(stateMapping[v], v);