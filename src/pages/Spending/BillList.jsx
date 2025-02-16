import {TablePageable} from "../../compose/Table";
import {API_COLLECTOR} from "../../config/route";
import {LongText, textTimeTrim} from "../../compose/Compose";
import {toSelectOptions} from "../../compose/Form";
import {platformIconMapping, platformMapping, stateMapping} from "../../util/value.mapping";
import {Col, Collapse, Flex, Row, Typography} from "antd";
import {Avatar, List, message} from 'antd';
import VirtualList from 'rc-virtual-list';
import React, {useEffect, useRef, useState} from "react";
import {isBlack, notBlack, postWithHandler} from "../../util/es.util";
import {BugOutlined} from "@ant-design/icons";

export const BillList = () => {
    const ContainerHeight = window.innerHeight ;
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
        appendData(1)
    }, []);

    const onScroll = e => {
        console.log({
            sh: e.currentTarget.scrollHeight,
            sp: e.currentTarget.scrollTop,
            ch: ContainerHeight,
        })
        if (Math.abs(e.currentTarget.scrollHeight - e.currentTarget.scrollTop - ContainerHeight) <= 1) {
            appendData(page.current + 1)
        }
    }

    return <List>
        <VirtualList data={page.data} height={ContainerHeight} itemHeight={47} itemKey={"id"} onScroll={onScroll}>
            {(it) => {
                const itemsCollapse = [
                    {
                        key: '1', label: it.place, children: <Flex vertical={true} gap={"small"}>
                            <Typography.Text>{it.information}</Typography.Text>
                            {notBlack(it.remark) && <Typography.Text>{it.remark}</Typography.Text>}
                        </Flex>
                    }
                ];

                const Icon = platformIconMapping[it.platform];

                return (
                    <List.Item key={it.id}>
                        <Flex gap={"large"} align={"center"} justify={"space-evenly"} style={{width: '100%'}}
                              wrap={"wrap"}>
                            {React.cloneElement(Icon, {style: {fontSize: 48}})}
                            <Typography.Text style={{fontSize: 36, width: 160}}
                                // style={{width: '80'}}
                                             type={it.revenue ? 'success' : 'warning'}>{`${it.revenue ? '+' : '-'}${it.money}`}
                            </Typography.Text>

                            <Flex vertical={true}>
                                <Typography.Text>{textTimeTrim(it.time)}</Typography.Text>
                                <Typography.Text>{`余额: ${it.balance}`}</Typography.Text>
                            </Flex>

                            <Collapse  style={{minWidth: '50vw'}} items={itemsCollapse} />
                        </Flex>
                        {/*<Row style={{width: '100%'}} gutter={{*/
                        }
                        {/*    xs: 8,*/
                        }
                        {/*    sm: 16,*/
                        }
                        {/*    md: 24,*/
                        }
                        {/*    lg: 32,*/
                        }
                        {/*}}>*/
                        }
                        {/*    /!*<Flex gap={"middle"}>*!/*/
                        }
                        {/*    <Col span={2}>*/
                        }
                        {/*        <BugOutlined/>*/
                        }
                        {/*    </Col>*/
                        }
                        {/*    <Col span={2}>*/
                        }
                        {/*        <Typography.Text*/
                        }
                        {/*            type={it.revenue ? 'success' : 'warning'}>{`${it.revenue ? '+' : '-'}${it.money}`}*/
                        }
                        {/*        </Typography.Text>*/
                        }
                        {/*    </Col>*/
                        }

                        {/*    <Col span={16}>*/
                        }
                        {/*        <Flex vertical={true}>*/
                        }
                        {/*            <Typography.Text>{textTimeTrim(it.time)}</Typography.Text>*/
                        }

                        {/*            <Collapse items={itemsCollapse}/>*/
                        }
                        {/*        </Flex>*/
                        }
                        {/*    </Col>*/
                        }

                        {/*    <Col span={2}>*/
                        }
                        {/*        <Typography.Text>{it.balance}</Typography.Text>*/
                        }
                        {/*    </Col>*/
                        }
                        {/*    /!*</Flex>*!/*/
                        }
                        {/*</Row>*/
                        }

                        {/*<List.Item.Meta*/
                        }
                        {/*    avatar={<BugOutlined/>}*/
                        }
                        {/*    title={<Flex gap={"large"} wrap={"wrap"}>*/
                        }
                        {/*        {textTimeTrim(it.time)}*/
                        }

                        {/*        <Typography.Text*/
                        }
                        {/*            type={it.revenue ? 'success' : 'warning'}>{`${it.revenue ? '+' : '-'}${it.money}`}*/
                        }
                        {/*        </Typography.Text>*/
                        }
                        {/*    </Flex>}*/
                        }
                        {/*    description={<Collapse items={itemsCollapse}/>}*/
                        }
                        {/*/>*/
                        }
                    </List.Item>
                )
                    ;
            }}
        </VirtualList>
    </List>

}

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