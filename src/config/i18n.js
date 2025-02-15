import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';

import Backend from 'i18next-http-backend';

// 自定义语言检测器
const customLanguageDetector = {
    type: 'languageDetector',
    async: true,
    detect: (callback) => {
        const lang = localStorage.getItem('i18nextLng') || 'zh';
        const language = lang.split('-')[0];
        callback(language);
    },
    init: () => {
    },
    cacheUserLanguage: (lng) => {
        localStorage.setItem('i18nextLng', lng);
    }
};

export const i18nInit = () => i18n
    .use(Backend)
    .use(customLanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'zh',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false,
        }
    });


export const t = i18n.t;

export const antLocale = it => {
    if (it.startsWith("en")) {
        return enUS;
    } else {
        return zhCN;
    }
}