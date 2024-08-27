import { Command } from 'commander'
import { version } from '../package.json'
import { create } from './command/create'
import { update } from './command/update'
const program = new Command('zhanglu');

program.version(version, '-v --version');

program.command('update')
    .description('更新脚手架 zhanglu-cli')
    .action(() => {
        update()
    });

program.command('create')
    .description('创建一个新项目')
    .argument('[name]', '项目名称')
    .action((dirName) => {
        create(dirName)
    });

program.parse()