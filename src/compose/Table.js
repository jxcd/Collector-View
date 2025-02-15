import React, {useEffect, useState} from "react";
import {formatString, ifNotNull, postWithDownload, postWithHandler} from "../util/es.util";
import {
    Button,
    DatePicker,
    Flex,
    Input,
    InputNumber,
    message,
    Segmented,
    Select,
    Switch,
    Table,
    Typography
} from "antd";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {DoubleLeftOutlined, DoubleRightOutlined} from "@ant-design/icons";

const {RangePicker} = DatePicker;
const {Text} = Typography;

/**
 * 不分页的简单表格, 适合一次加载少量简单数据
 * @param props
 * @constructor
 */
export const TableOnly = ({
                              url, columns, rowKey = it => it.id, flushKey,
                              queryBody = {},
                              afterLoadData = (_) => {
                              },
                              expandable, bordered
                          }) => {
    const {t} = useTranslation();

    const [loading, setLoading] = useState(true);
    const [data, setDate] = useState([]);
    const fetchData = () => {
        setLoading(true);
        postWithHandler(url, queryBody, it => {
            afterLoadData(it);
            setLoading(false);
            ifNotNull(it, setDate);
        }, error => {
            setLoading(false);
            message.error(error.message).then();
        });
    };

    useEffect(() => {
        fetchData();
    }, [flushKey]);

    return <Table
        loading={loading}
        footer={() => <Button onClick={fetchData}>{t('refresh')}</Button>}
        columns={columns}
        rowKey={rowKey}
        dataSource={data}
        expandable={expandable}
        bordered={bordered}
        pagination={false}
    />
}

/**
 * 带分页的表格, 适合加载大量数据
 *
 * @param url 数据链接
 * @param columns 数据列
 * @param flushKey 刷新键
 * @param query 查询参数列表, 无则不显示查询和导出
 * @param defaultQuery 查询参数默认值
 * @param exportName 导出文件名, 无则不显示导出按钮
 * @param exportColumns 导出列的映射, 如 {id: "编号", name: "名字"}
 * @param exportRows 最大导出行数
 * @param current 当前页, 默认1
 * @param pageSize 页大小, 默认10
 * @param expandable 展开参数
 * @param scrollX x滚动
 * @param rowKey 每行数据的键, 默认会使用 id, 但是没有 id的row, 需要独立配置
 * @param afterLoadData 数据加载成功后回调, 可做额外计算, 或处理数据
 * @returns {Element}
 * @constructor
 */
export const TablePageable = (
    {
        url, columns, flushKey,
        query, defaultQuery = {},
        exportName, exportColumns = {}, exportMaxRows = 1000,
        current = 1, pageSize = 10,
        expandable, scrollX,
        rowKey = it => it.id, afterLoadData = _ => {
    }
    }) => {

    const [page, setPage] = useState({
        current,
        pageSize,
        total: 0,
        totalPage: 0,
        data: []
    });
    const [where, setWhere] = useState(defaultQuery);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    const fetchData = (current = 1, pageSize = 10, where = {}) => {
        setLoading(true);
        postWithHandler(url, {where, current, pageSize,}, it => {
            if (it.data.length === 0 && it.current > 1 && it.total > 0) {
                // 有数据, 但是因为页数太大而没有查出来, 就从第一页重新检索
                fetchData(1, pageSize, where);
                return
            }
            afterLoadData(it);
            setLoading(false);
            ifNotNull(it, setPage);
        }, error => {
            setLoading(false);
            message.error(error.message).then();
        });
    }

    useEffect(() => {
        ifNotNull(query, items => {
            items.forEach(it => {
                if (it.defaultValue) {
                    where[it.dataIndex] = it.defaultValue;
                }
            });
        });
        fetchData(page.current, page.pageSize, where)
    }, [flushKey])

    const onExport = exportName == null ? null : () => {
        setExporting(true);
        postWithDownload(url + "/export", {
                where, filename: exportName, exportMaxRows,
                exportColumns: Object.fromEntries(exportColumns.entries())
            },
            exportName + ".xlsx")
            .then(() => setExporting(false));
    }

    const pagination = {
        position: ["bottomCenter"],
        total: page.total,
        showTotal: (total, range) => <ShowTotal from={range[0]} to={[range[1]]} total={total}/>,
        current: page.current,
        defaultPageSize: page.pageSize,
        defaultCurrent: page.current,
        onChange: (page, pageSize) => fetchData(page, pageSize, where),
        showSizeChanger: true,
        showQuickJumper: true,
        hideOnSinglePage: false,
    };
    return <Flex gap={"middle"} vertical={true}>
        <Query items={query} where={where} onExport={onExport} exporting={exporting}
               onQuery={() => fetchData(page.current, page.pageSize, where)}
               onChange={(dataIndex, v) => setWhere({...where, [dataIndex]: v})}
        />
        <Table
            loading={loading}
            columns={columns}
            rowKey={rowKey}
            dataSource={page.data}
            pagination={pagination}
            expandable={expandable}
            scroll={{scrollToFirstRowOnChange: true, x: scrollX}}
        />
    </Flex>

}

const ShowTotal = ({from, to, total}) => {
    const {t} = useTranslation();

    const text = t('Table.showTotal');
    return <Text>{formatString(text, from, to, total)}</Text>
}

export const Query = ({items, onChange, onQuery, where, onExport, exporting}) => {
    const {t} = useTranslation();
    const [show, setShow] = useState(true);

    if (items == null) return <></>

    return <Flex wrap="wrap" gap={"small"}>
        <Button icon={show ? <DoubleLeftOutlined/> : <DoubleRightOutlined/>} type={show ? 'default' : 'primary'}
                onClick={() => setShow(prevState => !prevState)}>
            {show ? <Text>{t('Table.lessParams')}</Text> : <Text>{t('Table.moreParams')}</Text>}
        </Button>
        {show && items.map(item => <Flex key={item.dataIndex} align={"center"} gap={"small"}>
            <Text>{item.title}</Text>
            <InputItem item={item} value={where[item.dataIndex]} onChange={onChange}/>
        </Flex>)}
        <Button type={"primary"} onClick={onQuery}>{t('Table.query')}</Button>
        {onExport && <Button type={"dashed"} disabled={exporting} onClick={onExport}>{t('Table.export')}</Button>}
    </Flex>;
}

/**
 * 将列快速转为导出列
 * 适用于没有组合显示字段的简单场合
 */
export const toExportColumns = (columns, convent = (it, exportColumns) => exportColumns[it.dataIndex] = it.title) => {
    const exportColumns = {};
    columns.forEach(it => convent(it, exportColumns));
    return exportColumns;
}

const InputItem = ({item, onChange, value}) => {
    const {t} = useTranslation();

    const dataIndex = item.dataIndex;
    const type = item.type;
    const onValueChange = (v) => onChange(dataIndex, v);

    switch (type) {
        case 'number':
            return <InputNumber value={value} placeholder={item.placeholder} style={{width: 80}}
                                defaultValue={item.defaultValue} max={item.max}
                                onChange={onValueChange}/>;
        case 'select':
            return <Select value={value} defaultValue={item.defaultValue} onChange={onValueChange} allowClear={true}
                           mode={"tags"} options={item.options} popupMatchSelectWidth={150}/>;
        case 'timeRange' :
            return <RangePicker showTime value={value} onChange={onValueChange} allowClear={true}
                                allowEmpty={[true, true]} presets={rangePresets(t)} changeOnBlur={true}
                                inputReadOnly={true} style={{width: 350}}/>
        case 'switch' :
            return <Switch checked={value} onChange={onValueChange}
                           checkedChildren={item.checkedChildren} unCheckedChildren={item.unCheckedChildren}/>
        case 'boolean' :
            const options = [
                {label: t('no'), value: false},
                {label: t('Charset.black'), value: null},
                {label: t('yes'), value: true}
            ]
            return <Segmented
                options={options} defaultValue={null}
                onChange={onValueChange}
            />
        // <ButtonGroup>
        //     <Button type={value === false ? 'primary' : 'default'}
        //             onClick={() => onValueChange(false)}>{t('no')}</Button>
        //     <Button type={value == null ? 'primary' : 'default'}
        //             onClick={() => onValueChange(null)}>{t('Charset.black')}</Button>
        //     <Button type={value === true ? 'primary' : 'default'}
        //             onClick={() => onValueChange(true)}>{t('yes')}</Button>
        // </ButtonGroup>
        default :
            return <Input value={value} placeholder={item.placeholder} style={{width: 100}}
                          onChange={e => onValueChange(e.target.value)} allowClear={true}/>;
    }
}

const rangePresets = (t) => [
    {
        label: t('Table.currentHour'),
        value: [dayjs().startOf('h'), dayjs().endOf('h')],
    },
    {
        label: t('Table.nearlyAnHour'),
        value: [dayjs().add(-1, 'h'), dayjs()],
    },
    {
        label: t('Table.currentDay'),
        value: [dayjs().startOf('d'), dayjs().endOf('d')],
    },
    {
        label: t('Table.lastDay'),
        value: [dayjs().add(-1, 'd'), dayjs()],
    },
    {
        label: t('Table.currentWeek'),
        value: [dayjs().startOf('w'), dayjs().endOf('w')],
    },
    {
        label: t('Table.lastWeek'),
        value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
        label: t('Table.currentMonth'),
        value: [dayjs().startOf('M'), dayjs().endOf('M')],
    },
    {
        label: t('Table.lastMonth'),
        value: [dayjs().add(-1, 'M'), dayjs()],
    },
    {
        label: t('Table.threeMonth'),
        value: [dayjs().add(-3, 'M'), dayjs()],
    },
    {
        label: t('Table.pastYear'),
        value: [dayjs().add(-1, 'y'), dayjs()],
    },
];