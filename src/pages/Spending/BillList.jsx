import {TablePageable} from "../../compose/Table";
import {API_COLLECTOR} from "../../config/route";
import {LongText, textTimeTrim} from "../../compose/Compose";
import {toSelectOptions} from "../../compose/Form";
import {platformIconMapping, platformMapping} from "../../util/value.mapping";
import {Card, Collapse, Flex, List, Popover, Statistic, Typography} from "antd";
import VirtualList from 'rc-virtual-list';
import React, {useEffect, useRef, useState} from "react";
import {notBlack, postWithHandler} from "../../util/es.util";
import {PayCircleFilled} from "@ant-design/icons";

export const BillList = () => {
    const ContainerHeight = window.innerHeight;
    const current = 1;
    const pageSize = 10;

    const [where, setWhere] = useState({reverseOrder: true});
    const [page, setPage] = useState({
        current,
        pageSize,
        total: 0,
        totalPage: 0,
        data: [],
    });
    const idSet = useRef(new Set());
    const [statistics, setStatistics] = useState([]);

    const appendData = (current, pageSize = 20) => {
        postWithHandler(`${API_COLLECTOR}/spending/payInfo/page`, {where, current, pageSize}, it => {
            const newData = [...page.data];
            let set = idSet.current;
            it.data.forEach(item => {
                if (set.has(item.id)) return
                newData.push(item);
                set.add(item.id);
            })

            // const newData = page.data.concat(it.data);
            setPage({...it, data: newData})
        });
    }

    useEffect(() => {
        postWithHandler(`${API_COLLECTOR}/spending/payInfo/cycleStatistics`, [1, 7, 30], setStatistics)
        appendData(1);
    }, []);

    const onScroll = e => {
        console.log({
            sh: e.currentTarget.scrollHeight,
            sp: e.currentTarget.scrollTop,
            ch: ContainerHeight,
        })
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 100) {
            appendData(page.current + 1)
        }
    }

    return <List>
        <List.Item>
            <Flex gap={"middle"} wrap={"wrap"} justify={"space-around"} style={{width: '100%'}}>
                <>{statistics.map(it =>
                    <Card key={it.cycle} title={`${it.cycle}天内`} style={{width: '800'}} hoverable={true}>
                        <Statistic
                            title={`收入 ${it.incomeCount}笔`}
                            value={it.income}
                            valueStyle={{color: '#52c41a'}}
                            suffix={<PayCircleFilled/>}
                        />
                        <Statistic
                            title={`消费 ${it.consumptionCount}笔`}
                            value={it.consumption}
                            valueStyle={{color: '#faad14'}}
                            suffix={<PayCircleFilled/>}
                        />

                    </Card>)}</>
            </Flex>
        </List.Item>

        <VirtualList data={page.data} height={ContainerHeight} itemHeight={48} itemKey={"id"} onScroll={onScroll}>
            {rowItem}
        </VirtualList>
    </List>

}

const rowItem = (it) => {
    const Icon = platformIconMapping[it.platform];

    return (
        <List.Item key={it.id}>
            <Popover
                trigger={"click"}
                content={<Flex vertical={true} gap={"small"}>
                    <Typography.Text>{it.information}</Typography.Text>
                    {notBlack(it.remark) && <Typography.Text>{it.remark}</Typography.Text>}
                </Flex>}
            >
                <Flex justify={"space-between"} wrap={"wrap"}
                      style={{width: '100%', paddingLeft: 16, paddingRight: 16}}>
                    <Flex gap={"large"} align={"center"} justify={"space-evenly"} wrap={"wrap"}>
                        {React.cloneElement(Icon, {style: {fontSize: 48}})}
                        <Typography.Text style={{fontSize: 36, width: 160}}
                            // style={{width: '80'}}
                                         type={it.revenue ? 'success' : 'warning'}>{`${it.revenue ? '+' : '-'}${it.money}`}
                        </Typography.Text>

                        <Flex vertical={true}>
                            <Typography.Text>{textTimeTrim(it.time)}</Typography.Text>
                            <Typography.Text>{`余额: ${it.balance}`}</Typography.Text>
                        </Flex>

                    </Flex>
                    <Typography.Text style={{fontSize: 24}}>{it.place}</Typography.Text>
                </Flex>
            </Popover>
        </List.Item>
    )
};

export const Bills2 = () => {
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
