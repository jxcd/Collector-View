import React, {useEffect, useState} from "react";
import {Avatar, Breadcrumb, Button, Flex, FloatButton, message, Popover} from "antd";
import {I18NChange} from "../../../compose/I18N";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {postWithHandler} from "../../../util/es.util";


import {API_COMMON} from "../../../config/route";

const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];

export const Head = ({breadcrumbs, collapsed, onCollapse}) => {
    const {t} = useTranslation();
    const [username, setUsername] = useState('');
    const [color, setColor] = useState(ColorList[0]);
    const [open, setOpen] = useState(false);

    const whoAmI = () => postWithHandler(`${API_COMMON}/whoAmI`, {}, info => {
        const name = info.username;
        setUsername(name);
        setColor(ColorList[name.length % 4]);
        localStorage.setItem("user", info);
    }, error => {
        if (error.message === "not login") {
            window.location.href = "/#/login";
        } else {
            message.error(error.message).then();
        }
    });
    const logout = () => postWithHandler(`${API_COMMON}/logout`, {}, () => {
        localStorage.removeItem("token");
        return window.location.href = "/#/login";
    });

    useEffect(() => {
        whoAmI();
    }, []);

    return <Flex direction="column" justify={"space-between"} align={"center"}
                 style={{padding: "0px 5px 0px 0px"}}>
        <Flex gap={"small"} align={"center"}>
            <Button size={"small"} onClick={() => onCollapse(!collapsed)}>
                {collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
            </Button>
            <Breadcrumb items={breadcrumbs.map(it => ({title: it, key: it}))}/>
        </Flex>

        <Popover
            open={open}
            onOpenChange={setOpen}
            trigger="hover"
            content={<Flex gap={"middle"} vertical={true} align={"center"}>
                <I18NChange/>
                <Link to={"/personalInformation"}>{t('Head.personalInformation')}</Link>
                <Button type={"link"} onClick={logout}>{t('Head.logOut')}</Button>
            </Flex>}
        >
            <Avatar gap={4} style={{backgroundColor: color}}>{username}</Avatar>
        </Popover>

        <FloatButton.BackTop/>
    </Flex>

};

