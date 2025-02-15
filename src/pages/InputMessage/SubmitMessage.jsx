import {Button, Card, Flex, Input, Typography} from "antd";
import {useState} from "react";
import TextArea from "antd/es/input/TextArea";
import {postWithHandler} from "../../util/es.util";
import {API_COLLECTOR} from "../../config/route";

export const SubmitMessage = () => {
    const [fromDevice, setFromDevice] = useState('CollectorView');
    const [who, setWho] = useState('95559');
    const [alias, setAlias] = useState('交通银行');
    const [messageText, setMessageText] = useState('');
    const submitText0 = '提交';
    const [submitText, setSubmitText] = useState(submitText0);

    const {Text} = Typography;
    const titleWidth = 120;

    const submit = () => {
        postWithHandler(`${API_COLLECTOR}/inputMessage/input`,
            {fromDevice, who, alias, messageText},
            () => setSubmitText('已提交!')
        );
    }

    return <Card>
        <Flex vertical={true} gap={"middle"}>
            <Flex gap={"small"} align={"center"}>
                <Text style={{width: titleWidth}}>{"设备名称"}</Text>
                <Input value={fromDevice} onChange={e => setFromDevice(e.target.value)}/>
            </Flex>
            <Flex gap={"small"} align={"center"}>
                <Text style={{width: titleWidth}}>{"发送人"}</Text>
                <Input value={who} onChange={e => setWho(e.target.value)}/>
            </Flex>
            <Flex gap={"small"} align={"center"}>
                <Text style={{width: titleWidth}}>{"别名"}</Text>
                <Input value={alias} onChange={e => setAlias(e.target.value)}/>
            </Flex>

            <Flex gap={"small"} align={"center"}>
                <Text style={{width: titleWidth}}>{"消息内容"}</Text>
                <TextArea autoSize={{minRows: 2}} value={messageText}
                          onChange={v => setMessageText(v.target.value)}></TextArea>
            </Flex>

            <Button onClick={submit}
                    disabled={submitText !== submitText0 || messageText === ''}
                    type={"primary"} size={"large"}>
                <Text>{submitText}</Text>
            </Button>
        </Flex>
    </Card>
}