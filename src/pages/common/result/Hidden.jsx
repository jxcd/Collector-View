import * as React from "react";
import {useEffect, useState} from "react";
import {Button, Card, Flex} from "antd";
import {Link} from "react-router-dom";
import {ifNull} from "../../../util/es.util";

export const HiddenPage = ({routes}) => {
    const [hiddenItems, setHiddenItems] = useState({});

    useEffect(() => {
        const items = {};
        const addToChildren = (route, parent) => {
            if (Array.isArray(route.context)) route.context.forEach(it => addToChildren(it, route));
            if (React.isValidElement(route.context) && route.url != null && (parent.hidden || route.hidden)) {
                const subs = ifNull(items[parent.label], []);
                subs.push(route);
                items[parent.label] = subs;
            }
        };
        routes.forEach(addToChildren);
        console.log(items)
        setHiddenItems(items);
    }, [routes])

    const cardStyle = {width: '25%'};

    return <Flex gap={"middle"} justify={"center"} style={{width: '100%'}} wrap={"wrap"}>
        {Object.entries(hiddenItems).map(([title, routes]) =>
            <Card title={title} key={title} hoverable={true} style={cardStyle}>
                <Flex vertical={true} gap={"small"}>
                    {routes.map(route => <Link to={`/${route.url}`} key={route.url}>
                            <Button type={"link"}>{route.label}</Button>
                        </Link>
                    )}
                </Flex>
            </Card>)}
    </Flex>;
}