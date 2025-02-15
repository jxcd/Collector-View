import {LongText, textTimeTrim} from "../../compose/Compose";
import {stateMapping, stateText} from "../../util/value.mapping";
import {TablePageable} from "../../compose/Table";


import {API_COLLECTOR} from "../../config/route";
import {toSelectOptions} from "../../compose/Form";

export const Messages = () => {

    return <TablePageable url={`${API_COLLECTOR}/inputMessage/page`}
                          columns={columns} query={query}/>
}

const columns = [
    {title: '编号', dataIndex: 'id',},
    {title: '来源设备', dataIndex: 'fromDevice',},
    {title: '发送者', dataIndex: 'who',},
    {title: '消息', dataIndex: 'messageText', render: v => <LongText text={v}/>},
    {title: '解析结果', dataIndex: 'parseResult', render: v => <LongText text={v}/>},
    {title: '状态', dataIndex: 'state', render: stateText,},
    {title: '创建时间', dataIndex: 'createTime', render: textTimeTrim},
    {title: '解析时间', dataIndex: 'parseTime', render: textTimeTrim},
]

const query = [
    {title: '消息', dataIndex: 'messageText'},
    {title: '解析结果', dataIndex: 'parseResult'},
    {title: '状态', dataIndex: 'state', type: 'select', options: toSelectOptions(stateMapping),},
    {title: '创建时间', dataIndex: 'createTime', type: 'timeRange'},
    {title: '解析时间', dataIndex: 'parseTime', type: 'timeRange'},
    {title: '倒序', dataIndex: 'reverseOrder', type: 'switch', defaultValue: true},
]