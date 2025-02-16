import React, {useState} from "react";
import {platformList, platformMapping} from "../../util/value.mapping";
import {Button, Card, DatePicker, Divider, Flex, Input, InputNumber, Typography} from "antd";
import {SelectGroup, toSelectOptions} from "../../compose/Form";
import {numberFixed, postWithHandler} from "../../util/es.util";
import {API_COLLECTOR} from "../../config/route";
import {textTimeTrim} from "../../compose/Compose";
import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

export const SubmitBill = () => {
    const {t} = useTranslation();

    // 平台, 地点, 金额, 余额,
    // 备注, 时间, 来源
    const [source, setSource] = useState('SMS: 95559');
    const [time, setTime] = useState([dayjs().add(-1, 'M'), dayjs()])
    const [allowOffset, setAllowOffset] = useState(2);
    const [checkResult, setCheckResult] = useState(null);

    const checkSource = () => {
        postWithHandler(`${API_COLLECTOR}//spending/payInfo/check`, {
            reverseOrder: false,
            time, source
        }, setCheckResult)
    }

    const [platform, setPlatform] = useState(platformList[0].name);

    return <Card>
        <Flex vertical={true} gap={"middle"}>
            <Flex gap={"small"}>
                <Button type={"primary"} onClick={checkSource}>{"检查遗漏"}</Button>
                <InputNumber value={allowOffset} onChange={setAllowOffset}/>

                <DatePicker.RangePicker showTime value={time} onChange={setTime} allowClear={true}
                                        allowEmpty={[true, true]} changeOnBlur={true}
                                        inputReadOnly={true} style={{width: 350}}/>

                <Input value={source} onChange={e => setSource(e.target.value)}/>
            </Flex>

            <ShowResult checkResult={checkResult} allowOffset={allowOffset}/>

            <Divider type={"horizontal"}/>

            <Flex>
                <SelectGroup label={"平台"} value={platform} onSelect={setPlatform}
                             options={toSelectOptions(platformMapping)}/>
            </Flex>

        </Flex>
    </Card>

}

const ShowResult = ({checkResult, allowOffset}) => {
    if (checkResult == null) {
        return <Typography.Text type={"secondary"}>{"尚未检测..."}</Typography.Text>;
    }
    if (checkResult.length === 0) {
        return <Typography.Title level={1} type={"success"}>{"无异常!"}</Typography.Title>;
    }

    return <Flex gap={"small"} vertical={true}>
        {
            <>{checkResult.reverse().map(pair =>
                <ResultItem key={pair.first.id} last={pair.first} it={pair.second} allowOffset={allowOffset}/>)}
            </>
        }

    </Flex>;
}

const ResultItem = ({last, it, allowOffset}) => {
    const m = Number(it.money);
    const b = Number(it.balance);
    const lb = it.revenue ? m - b : m + b;
    const lb0 = Number(last.balance)
    const cz = lb - lb0

    const {Text, Title} = Typography;

    if (Math.abs(cz) < allowOffset) {
        return <></>
    }

    return <>
        <Title type={cz > 0 ? 'success' : 'warning'}>{`${numberFixed(cz)}`}</Title>
        <Text>{textTimeTrim(it.time)}</Text>
        <Text>{last.information}</Text>
        <Text>{it.information}</Text>
    </>;
}