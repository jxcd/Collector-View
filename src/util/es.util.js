import {useTranslation} from "react-i18next";
import {message} from "antd";

export const notBlack = str => typeof str === 'string' && str.trim() !== '';
export const isBlack = str => !notBlack(str);

export const notZoneOrNull = num => num !== null && typeof num === 'number' && num !== 0;

export const ifNull = (value, defaultValue) => (value != null && true) ? value : defaultValue;

export const ifNotNull = (value, notNull = v => v, isNull = "") => value == null ? isNull : notNull(value);

export const ifNotBlack = (value, onNotBlack = v => v, isBlack = "") => notBlack(value) ? onNotBlack(value) : isBlack;

export const ifTest = (value, test = ((_) => false), defaultValue = null, pass = v => v) =>
    test(value) ? pass(value) : defaultValue;

export const numberFixed = (number, bounds = 3) => number.toFixed(bounds)

// 开发者模式, 1. nodejs启动
export const developmentMode = () =>
    process.env.NODE_ENV === 'development' && Boolean(process.env.REACT_APP_DEV_MODE);

/**
 * 发送post请求到后端
 * 需要自己写 .then(result => ...);
 */
export const post = (url,
                     data = {},
) => {

    const headers = {'Content-Type': 'application/json',};
    const token = localStorage.getItem("token");
    if (token != null) headers.Authorization = `Bearer ${token}`;

    return fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    })
        .then(resp => {
            const code = resp.status;
            if (code === 401) {
                window.location.href = "/#/login";
            }
            if (code >= 400) {
                throw new Error(`${code} ${resp.statusText}`);
            }

            return resp;
        });
};

/**
 * 发送post请求到后端
 * 期望返回Result, 所以只有result.ok时才调用onSuccess
 * 推荐只有在确定需要处理 Promise<Response> 返回对象时使用
 */
export const postWithResult = (url, data = {}) =>
    post(url, data)
        .then(response => response.json())
        .then(result => {
            if (result.code === "0") {
                return result.data;
            } else {
                throw new Error(result.message);
            }
        })

export const postWithoutResult = (url, data = {}, onError = (error) => console.error('Error:', error)) => {
    postWithResult(url, data).catch(onError)
};

/**
 * 加入处理器, 简单场景直接使用, 避免显式的catch异常
 */
export const postWithHandler = (url, data = {},
                                onSuccess = data => console.log('Success:', data),
                                // onError = error => console.error('Error:', error)) => {
                                onError = error => {
                                    message.error(error.message).then();
                                }) => {
    postWithResult(url, data).then(onSuccess).catch(onError);
}

export const postWithDownload = (
    url, data = {}, defaultFilename,
    onError = error => console.error(`Error export ${defaultFilename}:`, error)
) => {
    return post(url, data).then(response => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename;
        if (contentDisposition && contentDisposition.includes('filename=')) {
            filename = contentDisposition.split('filename=')[1].trim();
        } else {
            filename = defaultFilename;
        }
        return response.blob().then(blob => ({blob, filename}));
    })
        .then(({blob, filename}) => {
            const dUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = dUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(onError);
}

/**
 * 将 "1,3,7-8, 5-4"这样的字符串解析为数组 [1,3,4,5,7,8]
 * @param rangeText
 */
export const parseRange = (rangeText) => {
    if (rangeText == null) return [];
    const ranges = rangeText.split(',').map(part => part.trim());
    const result = [];

    for (const range of ranges) {
        if (range.includes('-')) {
            const [startStr, endStr] = range.split('-');
            const start = parseInt(startStr);
            const end = parseInt(endStr);

            if (!isNaN(start) && !isNaN(end)) {
                const [min, max] = [Math.min(start, end), Math.max(start, end)];
                for (let i = min; i <= max; i++) {
                    result.push(i);
                }
            }
        } else {
            const num = parseInt(range);
            if (!isNaN(num)) {
                result.push(num);
            }
        }
    }

    return result.sort((a, b) => a - b);
}

export const copyToClipboard = text => {
    const {t} = useTranslation();
    const clipboard = navigator.clipboard;
    if (clipboard == null) {
        return Promise.reject(new Error(t('es.util.httpsSecurely')));
    }

    return clipboard.writeText(text)
        .then(() => console.log(`${t('es.util.copy')} ${text} ${t('success')}`));
};

// 从文件的绝对路径获取文件名
const fileNameRegex = /[^\\\/]+$/;
export const pathToFileName = filePath => {
    // 使用正则表达式匹配文件名部分
    const match = filePath.match(fileNameRegex);
    // 如果找到匹配，返回文件名；否则返回空字符串
    return match ? match[0] : filePath;
};

export const arrayEqualIgnoreSort = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const sortedArr1 = arr1.slice().sort();
    const sortedArr2 = arr2.slice().sort();

    return sortedArr1.every((value, index) => value === sortedArr2[index]);
};

export const createWebsocket = (url,
                                onWsMessage,
                                onWsOpen,
                                onWsClose) => {
    console.log(`WebSocket connect to ${url}`)
    const ws = new WebSocket(url);

    ws.onopen = onWsOpen;
    ws.onmessage = onWsMessage;
    ws.onclose = onWsClose;
    return ws;
}

export const formatString = (template, ...values) => template.replace(/{(\d+)}/g, (match, index) => {
    return typeof values[index] !== 'undefined' ? values[index] : match;
});

export const isMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /mobile|android|iPad|iPhone/i.test(userAgent);
}

export const arraysEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((element, index) => element === arr2[index]);
};

export const convertKeysToCamelCase = obj => {
    if (Array.isArray(obj)) {
        // 如果是数组，递归处理每个元素
        return obj.map(item => convertKeysToCamelCase(item));
    } else if (obj !== null && typeof obj === 'object') {
        // 如果是对象，遍历键并递归处理
        return Object.entries(obj).reduce((newObj, [key, value]) => {
            const camelCaseKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            newObj[camelCaseKey] = convertKeysToCamelCase(value); // 递归处理子对象
            return newObj;
        }, {});
    }
    // 其他类型直接返回
    return obj;
};

export const exportToFile = (text, filename, type = `text/${filename.substring(filename.lastIndexOf(".") + 1)};charset=utf-8;`) => {
    // 创建一个 Blob 对象
    const blob = new Blob([text], {type});

    // 创建一个下载链接
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = filename;

    // 触发下载
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    // 清理资源
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * 将数据转为 CSV 格式
 * data = [
 *     ['Name', 'Age', 'City'], // 表头
 *     ['Alice', 25, 'New York'],
 *     ['Bob', 30, 'Los Angeles'],
 *     ['Charlie', 35, 'Chicago']
 * ]
 *
 * @param data 数据
 * @param filename 导出文件名
 */
export const exportToCSV = (data, filename = 'data.csv') => {
    const csvContent = data.map(row =>
        row.map(item => `"${item}"`).join(',') // 确保内容被正确转义
    ).join('\n');

    exportToFile(csvContent, filename, `text/csv;charset=utf-8;`);
};
