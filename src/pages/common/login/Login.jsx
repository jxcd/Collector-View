import {Button, Card, Carousel, Flex, Image, Input, Typography} from "antd";
import React, {useState} from "react";
import {useTranslation} from 'react-i18next';
import {postWithResult} from "../../../util/es.util";
import p1 from "./p1.jpeg"
import p2 from "./p2.jpeg"
import p3 from "./p3.jpeg"
import p4 from "./p4.jpeg"
import p5 from "./p5.jpeg"
import p6 from "./p6.jpeg"
import p7 from "./p7.jpeg"
import {I18NChange} from "../../../compose/I18N";


import {API_COMMON} from "../../../config/route";
import {COMMON_ICP} from "../../../util/env";

export const Login = () => {
    return <div style={{position: "relative"}}>
        <Background/>
        <LoginForm/>
        <ICP/>
    </div>
};

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')
    // const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const {t} = useTranslation();
    const {Text} = Typography;

    const login = () => {
        console.log(`${username} login with ${password}`);
        postWithResult(`${API_COMMON}/login`, {username, password})
            .then(token => {
                localStorage.setItem("token", token);
                return window.location.href = "/";
            })
            .catch(e => setErrorMessage(e.message));
    }

    const btnStyle = {};
    const inputStyle = {width: '16vw'};
    return <Card style={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(2.5px)',
        width: "24vw",
        position: "absolute", zIndex: 1,
        top: '40vh', left: '70vw',
    }}>
        <Flex vertical={true} gap={"middle"}
              justify={"end"} align={"end"}>
            <Flex vertical={false} gap={"small"} align={"center"}>
                <Text type={"text"} tabIndex={-1} style={btnStyle}>{t('username')}</Text>
                <Input value={username} style={inputStyle}
                       onChange={e => setUsername(e.target.value)}/>
            </Flex>
            <Flex vertical={false} gap={"small"} align={"center"}>
                <Text type={"text"} tabIndex={-1} style={btnStyle}>{t("Login.password")}</Text>
                <Input.Password value={password} style={inputStyle}
                                onPressEnter={login}
                                onChange={e => setPassword(e.target.value)}/>
            </Flex>
            {/*<Checkbox checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}/>*/}

            <Flex align={"center"} justify={"end"} gap={"middle"}>
                <Button type={"primary"} onClick={login}>{t('Login.login')}</Button>
                <I18NChange/>
                {/*<a href={"http://www.galaxis-tech.com/"} target={"_blank"}>{"Galaxis"}</a>*/}
            </Flex>

            <Text type={"danger"}>{errorMessage}</Text>
        </Flex>
    </Card>;
}

const Background = () => {
    const images = [p1, p2, p3, p4, p5, p6, p7];

    return <Carousel autoplay>
        {images.map((image, i) => <div key={i}>
            <Image
                preview={false}
                width={'100vw'}
                height={'96vh'}
                src={image}
            />
        </div>)}
    </Carousel>;
}

const ICP = () => {

    return <Flex justify={"center"} style={{
        position: "absolute", zIndex: 2,
        top: '96vh',
        width: '100%'
    }}>
        <a href="https://beian.miit.gov.cn/" target="_blank">{COMMON_ICP}</a>
    </Flex>
}