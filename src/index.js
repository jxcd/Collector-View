import * as React from "react";
import './index.css';
import {createRoot} from "react-dom/client";
import {createHashRouter, RouterProvider,} from "react-router-dom";
import {WebFrame} from "./compose/Frame";
import {routesConfig} from "./config/route";
import {App, ConfigProvider} from "antd";
import 'dayjs/locale/zh-cn';
import dayjs from "dayjs";
import {Login} from "./pages/common/login/Login";
import {Head} from "./pages/common/head/Head";
import {antLocale, i18nInit} from "./config/i18n";
import {Page404, Page500} from "./pages/common/result/Result";
import {HiddenPage} from "./pages/common/result/Hidden";
import {useTranslation} from "react-i18next";

const Main = () => {
    const {t, i18n} = useTranslation();

    dayjs.locale('zh-cn');
    const routes = routesConfig(t);

    const children = ((routes) => {
        const children = [];
        const addToChildren = (route) => {
            if (Array.isArray(route.context)) route.context.forEach(addToChildren);
            if (React.isValidElement(route.context) && route.url != null)
                children.push({path: route.url, element: route.context});
        };
        routes.forEach(addToChildren);
        return children;
    })(routes);

    const routeArr = [
        {path: "/login", element: <Login/>},
        {
            path: "/",
            element: <WebFrame routes={routes} head={<Head/>}
                               footer={<a href={"https://ilive.com/"}
                                          target={"_blank"}>{"Collector View ©2024 Powered by coderwj"}</a>}
            />,
            errorElement: <Page500/>,
            children: children
        },
        {path: "*", element: <Page404/>},
    ];

    if (process.env.NODE_ENV === 'development') {
        routeArr.unshift({path: "/hidden", element: <HiddenPage routes={routes}/>});
    }

    return <ConfigProvider locale={antLocale(i18n.language)}><App>
        <RouterProvider router={createHashRouter(routeArr)}/>
    </App></ConfigProvider>;
}

i18nInit().then(() => createRoot(document.getElementById("root")).render(<Main/>));
