import path from 'path';
import fs from 'fs-extra';
import chalk from "chalk";
import { input, select } from '@inquirer/prompts';

// axios
import axios, { AxiosResponse } from 'axios';

// utils
import { clone } from '../utils/clone';

// package
import { name, version } from '../../package.json';

import lodash from 'lodash';

// interface
export interface TemplateInfo {
    name: string;
    branch: string;
    downloadUrl: string;
    description: string;
};

// var
export const templates: Map<string, TemplateInfo> = new Map(
    [
        [
            'vue', {
                name: 'Vue-Typescript-template',
                branch: 'dev11',
                downloadUrl: 'https://gitee.com/sohucw/admin-pro.git',
                description: 'Vue3 + Typescript + Vite + Vue-Router + Vuex + Element-Plus + Axios + Eslint + Prettier + Postcss + GitHooks'
            }
        ],
        [
            'react', {
                name: 'React-Typescript-template',
                branch: 'dev10',
                downloadUrl: 'https://gitee.com/sohucw/admin-pro.git',
                description: 'Vue3 + Typescript + Vite + Vue-Router + Vuex + Element-Plus + Axios + Eslint + Prettier + Postcss + GitHooks'
            }
        ]
    ]
);

export function isOverwrite(projectName: string) {
    console.warn(`${projectName} 文件夹已经存在！`)
    return select({
        message: '是否覆盖？',
        choices: [
            { name: '覆盖', value: true },
            { name: '取消', value: false }
        ]
    })
};

export const getNpmInfo = async (npmName: string) => {
    const npmUrl = `https://registry.npmjs.org/${npmName}`;
    let res = {}
    try {
        res = await axios.get(npmUrl);
    } catch (error) {
        console.error(error);
    }
    return res;
}

export const getNpmLatestVersion = async (npmName: string) => {
    const { data } = (await getNpmInfo(npmName) as AxiosResponse);
    return data['dist-tags']?.latest;
};

export const checkVersion = async (name: string, version: string) => {
    const latestVersion = await getNpmLatestVersion(name);
    const need = lodash.gt(latestVersion, version);
    if (need) {
        console.warn(
            `检查到 zhanglu 最新版本 ${chalk.blackBright(latestVersion)}, 当前版本 ${chalk.blackBright(version)}`
        );
        console.warn(
            `可使用 ${chalk.yellowBright('npm install zhanglu-cli@latest')}, 或者使用 ${chalk.yellowBright('zhanglu update')}更新！`
        );
    }
    return need
};

export async function create(projectName: string) {

    const filePath = path.resolve(process.cwd(), projectName);

    if (fs.existsSync(filePath)) {
        const run = await isOverwrite(projectName);
        if (run) {
            await fs.remove(filePath);
        } else {
            return
        }
    };

    const templateList = Array.from(templates).map((item: [string, TemplateInfo]) => {
        const [name, info] = item || [];
        return {
            name,
            value: name,
            description: info.description,
        };
    });

    if (!projectName) {
        projectName = await input({ message: '请输入项目名称: ' });
    };

    //todo 版本检测
    await checkVersion(name, version)

    const templateName = await select({
        message: '请选择模板',
        choices: templateList,
    });

    const info = templates.get(templateName);

    info && clone(info.downloadUrl, projectName, ['-b', info.branch]);
};