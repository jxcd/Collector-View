// 检查 translation.json 文件中, 是否存在遗漏, 以及格式化后输出
// 控制台运行 node checkTranslation.js 或者 直接右键运行

const fs = require('fs');
const path = require('path');

// 这些key哪怕没有引用也保留
const RESERVE_KEY = ["x", "y"];

// const readJson = path => fs.readFile(path, 'utf8', (err, data) => JSON.parse(data))
const readJson = path => JSON.parse(fs.readFileSync(path, {encoding: 'utf8'}))

const distinct = (array) => [...new Set(array)]

// 公共方法
const match = (keys, otherKeys) => {
    const otherOmissions = keys.filter(item => !otherKeys.includes(item));
    const keysOmissions = otherKeys.filter(item => !keys.includes(item)).filter(item => !RESERVE_KEY.includes(item));
    return [distinct(otherOmissions), distinct(keysOmissions)];
}

const sortBy = (a, b) => {
    // 首先比较是否含有 "."
    const hasDotA = a.includes('.');
    const hasDotB = b.includes('.');

    // 如果两者都有或者都没有点，则按自然排序
    if (hasDotA === hasDotB) {
        return a.localeCompare(b);
    }

    // 否则，没有点的排在前面
    return hasDotA ? 1 : -1;
};

const jsonSorted = json => {
    const sorted = {};
    Object.keys(json).sort(sortBy).forEach(key => sorted[key] = json[key]);
    return sorted;
}

const outputFormated = (jsonData, output) => {
    const formated = JSON.stringify(jsonSorted(jsonData), null, 2);
    fs.writeFile(output, formated, 'utf8', (err) => {
        if (err) {
            console.log(`failed output to ${output}, ${err}`);
        } else {
            console.log(`success output to ${output}`)
        }
    })
}

// 遍历目录并查找匹配的字段
const keys = []
const findKeys = directory => {
    // 获取目录下的所有文件
    const files = fs.readdirSync(directory);

    // 遍历文件
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        // 如果是目录，则递归处理
        if (stat.isDirectory()) {
            findKeys(filePath);
        } else {
            // 如果是 .js 或 .jsx 文件，则读取内容并查找匹配的字段
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                const content = fs.readFileSync(filePath, 'utf8');
                const regex = /(?<!\w)t\((['"`])\s*.*?\1\)/g;
                const matches = content.match(regex);

                // 输出匹配的字段
                if (matches && matches.length > 0) {
                    // console.log(`在文件 ${filePath} 中找到匹配的字段:`);
                    matches.forEach(match => {
                        // console.log(`${match.substring(3, match.length - 2)} of ${match}`);
                        keys.push(match.substring(3, match.length - 2))
                    });
                }
            }
        }
    });
};

// 公共方法结束
// 调用函数，传入要搜索的目录路径
findKeys('../../src');
if (keys.length === 0) {
    console.log(`error to load keys from file`)
    return
}

const languages = fs.readdirSync(".", {withFileTypes: true})
    .filter(it => it.isDirectory())
    .map(it => it.name)
;

languages.forEach(language => {
    const path = `${language}/translation.json`;
    const other = readJson(path)
    const [otherOmissions, keysOmissions] = match(keys, Object.keys(other))

    if (keysOmissions.length !== 0) {
        console.log(`find ${language} more ${keysOmissions.length} key, ${keysOmissions}`);
        // 删除多余的key
        keysOmissions.forEach(miss => delete other[miss]);
    }

    if (otherOmissions.length !== 0) {
        console.log(`find ${language} miss ${otherOmissions.length} key, ${otherOmissions}`);
        otherOmissions.forEach(miss => other[miss] = language === 'en' ? `todoAddValue${miss}` : `todoAddValue`);
    }
    outputFormated(other, path);
});
