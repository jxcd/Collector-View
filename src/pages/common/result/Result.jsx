import React from 'react';
import {Button, Result} from 'antd';

export const Page403 = () => (
    <Result
        status="403"
        title="403"
        subTitle="Sorry, you are not authorized to access this page."
        extra={<Button type="primary">Back Home</Button>}
    />
);

export const Page404 = () => (
    <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary" onClick={() => window.location.href = "/"}>Back Home</Button>}
    />
);

export const Page500 = () => (
    <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={() => window.location.href = "/"}>Back Home</Button>}
    />
);