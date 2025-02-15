import {Button, Input, InputNumber, message, Popconfirm, Switch, Tag, Typography} from "antd";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {postWithHandler} from "../util/es.util";


const {Text, Paragraph} = Typography;

/**
 * 使用一个气泡确认框包裹一个 Button
 * 对 Button 的 onClick 操作进行二次确认
 */
export const ConfirmButton = ({
                                  t,
                                  // Button属性
                                  onClick, type, size, disabled, loading, danger, block, icon, style,
                                  // PopConfirm 属性
                                  title = t('secondaryConfirmation'),
                                  description = <Text>{t('confirmToContinueTheOperation')}?</Text>,
                                  okText = t('confirm'),
                                  cancelText = t('cancel'),
                                  onCancel,
                                  children,
                              }) => <Popconfirm title={title} description={description}
                                                onConfirm={onClick} okText={okText}
                                                onCancel={onCancel} cancelText={cancelText}>
    <Button type={type} size={size} disabled={disabled} icon={icon}
            loading={loading} danger={danger} block={block} style={style}>
        {children}
    </Button>
</Popconfirm>

/**
 * 使用一个气泡确认框包裹一个 Switch
 * 对 Switch 的 onChange 操作进行二次确认
 */
export const ConfirmSwitch = ({
                                  t,
                                  // Switch属性
                                  onChange, disabled, loading, size,
                                  checked, defaultChecked,
                                  checkedChildren, unCheckedChildren,
                                  // PopConfirm 属性
                                  title = t('secondaryConfirmation'),
                                  description = `${t('confirmToContinueTheOperation')}?`,
                                  okText = t('confirm'),
                                  cancelText = t('cancel'),
                                  onCancel,
                              }) => <Popconfirm title={title} description={description}
                                                onConfirm={() => onChange(!checked)} okText={okText}
                                                onCancel={onCancel} cancelText={cancelText}>
    <Switch disabled={disabled} loading={loading} size={size}
            checked={checked} defaultChecked={defaultChecked}
            checkedChildren={checkedChildren} unCheckedChildren={unCheckedChildren}
    />
</Popconfirm>


/**
 * 对某个对象发起修改优先级操作(/${type}/updatePriority?id=${id}&priority=${priority}), 传递 id 和 priority
 */
export const UpdatePriority = ({priority, it, type, t}) => {
    const id = it.id;
    const [value, setValue] = useState(priority);

    const updatePriority = () => {
        postWithHandler(`${API_COMMON}/${type}/updatePriority?id=${id}&priority=${value}`, {},
            () => message.info(`${t('modified')} ${type}-${id} ${t('priority')} ${t('to')} ${value}`))
    }

    return (<Popconfirm
        title={`${t('edit')} ${type}-${it.id} ${t('priority')}`}
        description={<InputNumber value={value} onChange={setValue}/>}
        onConfirm={updatePriority}
        okText={t('edit')}
        cancelText={t('cancel')}
    >
        <Button type={"text"}>{priority}</Button>
    </Popconfirm>)
}

export const UpdateNumberWithConfirm = ({t, defaultValue, onSubmit}) => {
    const [value, setValue] = useState(defaultValue);

    return (<Popconfirm
        title={`${t('edit')} ${defaultValue} --> ${value}`}
        description={<InputNumber value={value} onChange={setValue}/>}
        onConfirm={() => onSubmit(value)}
        onCancel={() => setValue(defaultValue)}
        onOpenChange={(open) => {
            if (!open) setValue(defaultValue)
        }}
        okText={t('edit')}
        cancelText={t('cancel')}
    >
        {defaultValue}
    </Popconfirm>)
}

export const SubmitCustomValue = ({title, onSubmit, children}) => {
    const [value, setValue] = useState('');
    const {t} = useTranslation();

    return <Popconfirm
        title={title} onConfirm={() => onSubmit(value)}
        description={<Input value={value} onChange={e => setValue(e.target.value)}/>}
        okText={t('submit')}
        cancelText={t('cancel')}
    >
        {children}
    </Popconfirm>

}

export const BitTag = ({bit, name, disableName = name, color = "success", disableColor = "default"}) => {
    return <Tag color={bit ? color : disableColor}>{bit ? name : disableName}</Tag>
}