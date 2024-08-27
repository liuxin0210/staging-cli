import process from "child_process";
import chalk from "chalk";
import ora from "ora";

const spinner = ora({
    text: 'zhanglu-cli 正在更新中....',
    spinner: {
        interval: 300,
        frames: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'].map(_ => chalk.blue(_))
    }
})

export function update() {
    spinner.start();

    process.exec('npm update zhanglu-cli -g', (err, stdout, stderr) => {
        spinner.stop();
        if (!err) {
            console.log(chalk.green('zhanglu-cli 更新成功！'));
        } else {
            console.log(chalk.red('zhanglu-cli 更新失败！'));
        }
    })
}