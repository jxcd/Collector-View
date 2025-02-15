import {BugOutlined, HomeOutlined,} from "@ant-design/icons";
import React from "react";
import {Home} from "../pages/common/Home";
import {Messages} from "../pages/InputMessage/Messages";
import {Bills} from "../pages/Spending/Bills";
import {SubmitMessage} from "../pages/InputMessage/SubmitMessage";

export const API_COMMON = "/api"
export const API_COLLECTOR = API_COMMON

export const routesConfig = t => {
    const routeArray = [];
    routeArray.push({label: '主页', url: "", context: <Home/>, icon: <HomeOutlined/>, hidden: false});
    routeArray.push({
        label: "消息", context: [
            {label: '记录', url: "messages", context: <Messages/>},
            {label: '提交', url: "submitMessage", context: <SubmitMessage/>},
        ], icon: <BugOutlined/>
    });
    routeArray.push({
        label: "消费", context: [
            {label: '账单', url: "bills", context: <Bills/>},
        ], icon: <BugOutlined/>
    });
    return routeArray;
}
