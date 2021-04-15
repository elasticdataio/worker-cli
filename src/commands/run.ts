import {Command, flags} from '@oclif/command'
import Webserver from "../webserver";
import * as fs from "fs";
import {Configuration} from "../models/configuration.model";
import {examplePipeline} from "../preconfigured/example";

export default class Run extends Command {
  static description = 'Run pipeline from JSON config file'

  static examples = [
    `$ ed-cli run -f /Users/s/Documents/parse-amazon.json`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    debug: flags.boolean({char: 'd', description: 'Show info, warning and error messages'}),
    headless: flags.boolean({description: 'Use headless mode'}),
    maxTabs: flags.integer({description: 'Max chrome tabs', default: 3}),
    port: flags.integer({char: 'p', description: 'Listeners port', default: 3002}),
    file: flags.string({char: 'f', description: 'Absolute path to json file'}),
    preconfigured: flags.boolean({char: 'e', description: 'Example preconfigured json file for first start'}),
  }
  static usage = 'run -f [path to json file]'
  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Run)
    const file = flags.file
    const maxChromeTabs = flags.maxTabs
    const port = flags.port
    const debug = Boolean(flags.debug)
    const headless = Boolean(flags.headless)
    const preconfigured = Boolean(flags.preconfigured)
    if (file || preconfigured) {
      try {
        const webserver = new Webserver()
        await webserver.stop();
        await webserver.start({
          debug,
          headless,
          port,
          maxChromeTabs,
        } as Configuration)
        if (file && !fs.existsSync(file)) {
          this.error(`file: ${file} not exists`);
          return;
        }
        const json = file && fs.readFileSync(file).toString();
        const pipeline = preconfigured
          ? examplePipeline
          : JSON.parse(json || '{}');
        const result = await webserver.run(pipeline);
        this.log(`<--RETURN DATA:`);
        this.log(JSON.stringify(result, null, 4));
        this.log(`<--DONE---Press Ctrl + C for exit process`);
      } catch (e) {
        this.error(e);
      }
      return;
    }
    this.error('Please set --preconfigured or --file argument; or run -h for help')
  }

}
