import {Button, Flex, Popover, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {SyncOutlined} from "@ant-design/icons";
import React from "react";
import {ifNotNull, ifNull, notBlack} from "../util/es.util";
import dayjs from "dayjs";

export const colorInit = "#6BF586";
export const colorStart = "#82CFFD";
export const colorFinish = "#D7A6CC";
export const colorError = "#FF4589";
export const colorTimeout = "#FFBBC9";
// export const colorCancel = "#e7e8df";
export const colorCancel = "#d5d7cf";

export const colorBusy = "#6B8EFD";
// export const colorWait = "#FFFAA3";
export const colorWait = "#e3dd8f";
export const colorCharge = "#A3FFAB";

const {Text} = Typography;

export const SubmitAndCancel = ({
                                    onSubmit, onCancel,
                                    submitText, cancelText
                                }) => {
    const {t} = useTranslation();
    if (cancelText == null) cancelText = t('cancel');
    if (submitText == null) submitText = t('submit');

    return <Flex vertical={false} gap={"middle"}>
        <Button onClick={onCancel}>{cancelText}</Button>
        <Button type={"primary"} onClick={onSubmit}>{submitText}</Button>
    </Flex>;
}

export const SyncState = ({timestamp}) => {
    const syncTimestamp = ifNull(timestamp, 0);
    const elapsed = (Date.now() - syncTimestamp) / 1000;
    const color = colorDeviceCommunication(elapsed);

    return <Popover trigger="hover"
                    content={() => <Typography.Text>{simpleTime(timestamp, elapsed)}</Typography.Text>}>
        <SyncOutlined style={{color}} spin={elapsed < 10}/>
    </Popover>
}

export const ValueAndRange = ({value, max, min}) => {
    const {t} = useTranslation();

    let type = "success";
    if (value < min) type = "danger";
    if (value > max) type = "warning";

    return <Popover content={() => <Typography.Text>{`${t('range')} ${min} -- ${max}`}</Typography.Text>}>
        <Typography.Text type={type}>{value}</Typography.Text>
    </Popover>
}

const simpleTime = (timestamp, elapsed) => {
    // 同一小时则显示 分和秒
    // 同一天则显示 时和分
    // 否则显示 月和日
    const time = dayjs(timestamp);
    if (elapsed < 24 * 60 * 60) {
        return time.format("HH:mm:ss");
    } else {
        return time.format("MM-DD");
    }

}

const colorDeviceCommunication = elapsed => {
    if (elapsed < 10) return colorInit;
    else if (elapsed < 3 * 60) return colorWait;
    else if (elapsed < 60 * 60) return colorError;
    return colorCancel;
}

export const textTimeTrim = time => ifNotNull(time, it => {
    const i = it.lastIndexOf(".");
    if (i > 0) it = it.substring(0, i);
    return it.replace("T", " ");
}, "");

export const LongText = ({text, width = 160, type, copyable}) =>
    <Text style={{maxWidth: width}} ellipsis={{tooltip: text,}} type={type}
          copyable={copyable && notBlack(text)}>{text}</Text>