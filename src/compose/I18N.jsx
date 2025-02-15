import {useTranslation} from "react-i18next";
import {toSelectOptions} from "./Form";
import {Select} from "antd";
import React from "react";
import {ifNull} from "../util/es.util";

export const I18NChange = () => {
    const {i18n} = useTranslation();

    return <Select options={toSelectOptions(i18nMapping)}
                   style={{minWidth: 100,}}
                   value={textI18n(i18n.language)}
                   onSelect={value => i18n.changeLanguage(value)}
    />
}

const i18nMapping = {
    'zh': '中文',
    'en': 'English',
}

const textI18n = it => ifNull(i18nMapping[it], it)