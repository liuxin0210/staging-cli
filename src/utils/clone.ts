import simpleGit, { SimpleGit, SimpleGitOptions } from 'simple-git'
import createLogger from "progress-estimator";
import chalk from "chalk";

// utils 
import log from './log';

// prtial options
const gitOptions: Partial<SimpleGitOptions> = {
    baseDir: process.cwd(),      
    binary: 'git',
    maxConcurrentProcesses: 6,
};

// init logger
const logger = createLogger({
    spinner: {
        interval: 300,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(_ => chalk.blue(_))
    }
})

export const clone = async (url: string, prjName: string, options: string[]) => {
    const git: SimpleGit = simpleGit(gitOptions);

    try {
        await logger(git.clone(url, prjName, options), '代码下载中', {
            estimate: 80000
        })

        console.log()
        console.log(chalk.blueBright(`==================================`))
        console.log(chalk.blueBright(`=== 欢迎使用 zhanglu-cli 脚手架 ===`))
        console.log(chalk.blueBright(`==================================`))
        console.log()

        log.success(`项目创建成功 ${chalk.blueBright(prjName)}`);
        log.success(`执行以下命令启动项目：`);
        log.info(`cd ${chalk.blueBright(prjName)}`);
        log.info(`${chalk.yellow('pnpm')} install`);
        log.info(`${chalk.yellow('pnpm')} run dev`);

    } catch (error) {
        console.error(chalk.redBright(`下载失败`))
        console.log(error);
    }
}