import {Command, flags} from '@oclif/command'
import * as chalk from 'chalk'
import Webserver from "../webserver";
import * as fs from "fs";
import * as path from "path";
import {Configuration} from "../models/configuration.model";
import {examplePipeline} from "../preconfigured/example";

export default class Run extends Command {
  static description = 'Run pipeline from JSON config file'

  static examples = [
    `$ ed-cli run -f parse-amazon.json`,
  ]

  static flags = {
    help: flags.help({char: 'h', hidden: true}),
    debug: flags.boolean({char: 'd', description: 'Show info, warning and error messages'}),
    headless: flags.boolean({description: 'Use headless mode'}),
    maxTabs: flags.integer({description: 'Max chrome tabs', default: 3}),
    port: flags.integer({char: 'p', description: 'Listeners port', default: 3002}),
    file: flags.string({char: 'f', description: 'Relative or absolute path to json file'}),
    preconfigured: flags.boolean({description: 'Example preconfigured json file for first start'}),
    timeout: flags.integer({
      char: 't',
      description: 'Maximum waiting time for a worker in minutes',
      default: 5
    }),
    display: flags.boolean({description: 'Display data after worker finishes'}),
  }
  static usage = 'run -f [path to json file]'
  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Run)
    const file = flags.file
    const maxChromeTabs = flags.maxTabs
    const port = flags.port
    const timeout = flags.timeout
    const debug = Boolean(flags.debug)
    const headless = Boolean(flags.headless)
    const preconfigured = Boolean(flags.preconfigured)
    const display = Boolean(flags.display)
    const webserver = new Webserver()
    if (file || preconfigured) {
      const filePath = file && path.resolve(file);
      try {
        const config = {
          debug,
          headless,
          port,
          maxChromeTabs,
          timeout,
        } as Configuration
        await webserver.start(config)
        if (filePath && !fs.existsSync(filePath)) {
          this.error(`file: ${filePath} not exists`);
          return;
        }
        const json = filePath && fs.readFileSync(filePath).toString();
        const pipeline = preconfigured
          ? examplePipeline
          : JSON.parse(json || '{}');
        const result = await webserver.run(pipeline, config);
        const data = JSON.stringify(result, null, 4);
        this.log(`<--CLI RESPONSE:`);
        this.log(chalk.yellow(data));
        if (display && result.fileLink) {
          const fileLink = result.fileLink.replace('file://', '');
          const parsedData = fs.readFileSync(fileLink).toString();
          this.log(`<--CLI PARSED DATA:`);
          this.log(chalk.green(parsedData));
        }
        await webserver.kill();
      } catch (e) {
        try {
          await webserver.kill();
        } catch (e) {}
        this.error(e);
      }
      return;
    }
    this.error('Please set --preconfigured or --file argument; or run -h for help')
  }

}
