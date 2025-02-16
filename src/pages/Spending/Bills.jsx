import {TablePageable} from "../../compose/Table";
import {API_COLLECTOR} from "../../config/route";
import {LongText, textTimeTrim} from "../../compose/Compose";
import {toSelectOptions} from "../../compose/Form";
import {platformMapping, stateMapping} from "../../util/value.mapping";
import {Typography} from "antd";

export const Bills = () => {
    return <TablePageable url={`${API_COLLECTOR}/spending/payInfo/page`}
                          columns={columns} query={query}/>
}

const columns = [
    {title: '编号', dataIndex: 'id',},
    {title: '平台', dataIndex: 'platform',},
    {title: '地点', dataIndex: 'place',},
    {
        title: '金额', dataIndex: 'money', render: (v, it) => <Typography.Text
            type={it.revenue ? 'success' : 'warning'}>{`${it.revenue ? '+' : '-'}${v}`}</Typography.Text>
    },
    {
        title: '余额', dataIndex: 'balance', render: (v) => <Typography.Text
            type={Number(v) < 800 ? 'secondary' : 'default'}>{v}</Typography.Text>
    },
    {title: '备注', dataIndex: 'remark',},
    {title: '原始信息', dataIndex: 'information', render: v => <LongText text={v}/>},
    {title: '信息来源', dataIndex: 'source',},
    {title: '什么时候', dataIndex: 'time', render: textTimeTrim},
]

const query = [
    {title: '平台', dataIndex: 'platform', type: 'select', options: toSelectOptions(platformMapping)},
    {title: '地点', dataIndex: 'place',},
    {title: '备注', dataIndex: 'remark',},
    {title: '原始信息', dataIndex: 'information',},
    {title: '收入', dataIndex: 'revenue', type: 'boolean'},
    {title: '忽略统计', dataIndex: 'ignoreStatistics', type: 'boolean'},
    {title: '什么时候', dataIndex: 'time', type: 'timeRange'},
    {title: '倒序', dataIndex: 'reverseOrder', type: 'switch', defaultValue: true},
]