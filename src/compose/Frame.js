import React, {useEffect, useState} from "react";
import {Image, Layout, Menu} from "antd";
import {Link, Outlet, useLocation} from "react-router-dom";
import {Head} from "../pages/common/head/Head";
import {useTranslation} from "react-i18next";
import logo from "./resource/logo.png";
import {isMobile} from "../util/es.util";

const {Content, Sider} = Layout;

export const WebFrame = (props) => {
    const {t} = useTranslation();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(isMobile());
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [routeData, setRouteData] = useState({});

    const menuOpenWidth = 200;
    const collapsedWidth = 40;
    const [menuWidth, setMenuWidth] = useState(collapsed ? collapsedWidth : menuOpenWidth);

    useEffect(() => {
        setRouteData(menuItems(props.routes));
    }, [props.routes]);

    useEffect(() => {
        // 根据路径设置标题和面包屑
        const urlMapping = routeData.urlMapping;
        if (urlMapping != null) {
            const mapping = urlMapping[location.pathname.substring(1)];
            document.title = mapping.title;
            setBreadcrumbs(mapping.breadcrumbs);
            // console.log({title: mapping.title, breadcrumbs: mapping.breadcrumbs});
        }
    }, [location, routeData]);

    const onCollapse = (state) => {
        setCollapsed(state);
        setMenuWidth(collapsed ? menuOpenWidth : collapsedWidth);
    };
    return <Layout hasSider>
        <Sider style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0, top: 0, bottom: 0,}}
               collapsedWidth={collapsedWidth}
               collapsed={collapsed}
               onCollapse={onCollapse}>
            <Image preview={false} src={logo} style={{padding: collapsed ? "5px 5px 0px" : "8px 8px 10px"}}/>

            <Menu theme="dark" defaultSelectedKeys={[t('route.homePage')]} mode="inline" items={routeData.items}/>
        </Sider>

        <Layout style={{
            marginLeft: menuWidth,
        }}>
            <Head breadcrumbs={breadcrumbs} collapsed={collapsed} onCollapse={onCollapse}/>

            <Content style={{
                margin: '0px 0px',
                minHeight: '85vh',
            }}
            ><Outlet/></Content>
            {/*<FrameFooter footer={props.footer}/>*/}
        </Layout>
    </Layout>;
}
const menuItems = (routes) => {
    const items = [];
    const urlMapping = {};
    const routeToItem = route => ({
        key: route.label,
        label: <Link to={`/${route.url}`}>{route.label}</Link>,
        icon: route.icon
    });
    const routeToGroup = route => ({key: route.label, label: route.label, icon: route.icon, children: []});

    routes.forEach(route => {
        const context = route.context;

        let item;
        if (Array.isArray(context)) {
            item = routeToGroup(route);
            item.children = [];
            context.forEach(r => {
                // 定制菜单
                // if (r.url === "map/:zz") r.url = "map/1";
                if (!route.hidden && !r.hidden) {
                    item.children.push(routeToItem(r));
                }
                urlMapping[r.url] = {
                    title: r.label,
                    breadcrumbs: [item.label, r.label]
                };
            })
        } else {
            item = routeToItem(route);
            urlMapping[route.url] = {
                title: route.label,
                breadcrumbs: [route.label]
            };
        }
        if (!route.hidden) {
            items.push(item);
        }

    });
    return {items, urlMapping};
}