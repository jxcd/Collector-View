import {TablePageable} from "../../compose/Table";
import {API_COLLECTOR} from "../../config/route";
import {LongText, textTimeTrim} from "../../compose/Compose";

export const Bills = () => {
    return <TablePageable url={`${API_COLLECTOR}/spending/payInfo/page`} columns={columns}/>
}

const columns = [
    {title: '编号', dataIndex: 'id',},
    {title: '平台', dataIndex: 'platform',},
    {title: '地点', dataIndex: 'place',},
    {title: '金额', dataIndex: 'money',},
    {title: '余额', dataIndex: 'balance',},
    {title: '备注', dataIndex: 'remark',},
    {title: '原始信息', dataIndex: 'information', render: v => <LongText text={v}/>},
    {title: '信息来源', dataIndex: 'source',},
    {title: '什么时候', dataIndex: 'time', render: textTimeTrim},
]