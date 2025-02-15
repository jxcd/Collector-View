import {Button, Divider, Flex, Form, Input, InputNumber, Radio, Select, Space, Switch, Table} from "antd";
import {ifNull, notBlack} from "../util/es.util";
import TextArea from "antd/es/input/TextArea";
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";

export const SimpleForm = ({
                               form, ignoreSubmitButton, items, onSubmit,
                               minWidth = 300, labelCol = 6, wrapperCol = 18
                           }) => {
    const {t} = useTranslation();
    return (
        <Form
            labelWrap={true}
            labelCol={{span: labelCol,}}
            wrapperCol={{span: wrapperCol,}}
            style={{minWidth: minWidth,}}
            form={form}
            onFinish={onSubmit}
            // variant="filled"
        >
            {
                items.map(it => <Form.Item
                    key={it.name}
                    label={it.label}
                    name={it.name}
                >
                    {<InputItem type={it.type} remark={it.remark}/>}
                </Form.Item>)
            }
            {
                !ignoreSubmitButton && <Form.Item wrapperCol={{offset: labelCol}}>
                    <Button type="primary" htmlType="submit">
                        {t('Form.Submit')}
                    </Button>
                    <Divider type="vertical"/>
                    <Button htmlType="reset">
                        {t('Form.Reset')}
                    </Button>
                </Form.Item>
            }

        </Form>
    );
};


const InputItem = (props) => {
    const remark = ifNull(props.remark, {});
    const style = {width: '100%'}

    useEffect(() => {
        if (props.value === undefined && remark.defaultValue !== undefined) {
            props.onChange?.(remark.defaultValue);
        }
    }, []);

    switch (props.type) {
        case 'number':
            return <InputNumber style={style} value={props.value} onChange={props.onChange}
                                placeholder={remark.placeholder}
            />;
        case 'password':
            return <Input style={style} type={"password"} value={props.value} onChange={props.onChange}
                          placeholder={remark.placeholder}
            />;
        case 'select':
            return <InputSelect style={style} value={props.value} onChange={props.onChange} options={remark.options}
                                placeholder={remark.placeholder} showInput={remark.showInput}
            />;
        case 'textarea':
            return <TextArea style={style} value={props.value} onChange={props.onChange}
                             placeholder={remark.placeholder}
            />
        case 'switch':
            return <Switch value={props.value} onChange={props.onChange}/>
        default:
            return <Input style={style} value={props.value} onChange={props.onChange}
                          defaultValue={remark.defaultValue}
                          placeholder={remark.placeholder}
            />;
    }
}

export const toSelectOptions = (mapping, keyMapping = (label, value) => label) =>
    Object.entries(mapping).map(([value, label]) => ({label, value, key: keyMapping(label, value)}));

export const toSelectOptionsOnBooleanValue = (t, arr = [t('yes'), t('no')]) => ([
    {label: arr[0], value: true, key: true},
    {label: arr[1], value: false, key: false},
])

export const toSelectOptionsByArray = (arr) => (arr.map(it => ({label: it, value: it, key: it})))

const InputSelect = (props) => {
    const onChange = props.onChange;
    const value = props.value;

    const options = props.options;

    if (props.showInput) {
        return (
            <Space.Compact>
                <Select options={options} onChange={v => {
                    onChange?.(v)
                }}/>
                <Input value={value}/>
            </Space.Compact>
        );
    }

    return (<Select options={options} onChange={v => {
        onChange?.(v)
    }}/>);

};

export const ValueList = ({data, fields, title, t}) => {
    const columns = [
        {title: t('Form.field'), dataIndex: "name", key: "name", width: 200},
        {title: t('Form.value'), dataIndex: "value", key: "value"},
    ]

    const dataSource = data === undefined ? [] : fields.map(it => {
        const key = ifNull(it.dataIndex, it.title);
        const value = ifNull(it.render, v => v);

        const text = value(data[key], data);
        return {name: it.title, value: text, key: it.title};
    });


    return <Table title={title} columns={columns} dataSource={dataSource} pagination={false}/>
}

export const InputWithSubmit = ({t, defaultValue, onSubmit, type, placeholder, submitName = t('submit')}) => {
    const [value, setValue] = useState(defaultValue);
    const [showSubmit, setShowSubmit] = useState(notBlack(defaultValue));

    const isNumber = type === 'number';

    useEffect(() => {
        setShowSubmit(isNumber ? Number.isFinite(value) : notBlack(value));
    }, [value]);

    const onClick = () => {
        onSubmit(value);
        setShowSubmit(false);
    }

    return <Flex vertical={false} gap={"small"}>
        {isNumber
            ? <InputNumber value={Number(value)} placeholder={placeholder} onChange={setValue}/>
            : <Input value={value} placeholder={placeholder} onChange={e => setValue(e.target.value)}/>
        }

        <Button disabled={!showSubmit}
                type={showSubmit ? "primary" : "text"}
                onClick={onClick}>{submitName}</Button>
    </Flex>
}

export const SelectWithSubmit = ({options, defaultSelected, submit, submitName = t('submit'), withInput = true}) => {
    const [selectValue, setSelectValue] = useState(ifNull(defaultSelected, options.length > 0 ? options[0].value : ''));
    const [inputValue, setInputValue] = useState('');

    const haveValue = (value) => options.find(it => it.value === value)?.ignoreValue !== true;
    const [hasValue, setHasValue] = useState(haveValue(selectValue));

    const onClick = () => submit(selectValue, hasValue ? inputValue : '');

    const onSelect = (value) => {
        setSelectValue(value);
        setHasValue(haveValue(value))
    };
    return (
        <Space>
            <Select
                defaultValue={selectValue}
                style={{minWidth: 100,}}
                onChange={onSelect}
                options={options}
            />
            {withInput &&
                <Input disabled={!hasValue} value={inputValue} onChange={e => setInputValue(e.target.value)}/>}
            <Button type="primary" onClick={onClick}>{submitName}</Button>
        </Space>
    );
}

export const RadioGroup = (label, onChange, value, list) =>
    <Space.Compact>
        <Button type="text">{label}</Button>
        <Radio.Group value={value} onChange={e => onChange(e.target.value)} optionType="button">
            {list.map(it => <Radio key={it.value} value={it.value}>{it.label}</Radio>)}
        </Radio.Group>
    </Space.Compact>

export const SelectGroup = ({label, options, value, onSelect}) =>
    <Space.Compact>
        <Button type="text">{label}</Button>
        <Select
            value={value}
            style={{minWidth: 100,}}
            onChange={onSelect}
            options={options}
        />
    </Space.Compact>

export const Horizontal = ({children, gap = "small"}, alignment = "center") =>
    <Flex vertical={false} gap={gap} justify={alignment}>
        {children}
    </Flex>