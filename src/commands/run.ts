import {Command, flags} from '@oclif/command'
import Webserver from "../webserver";
import * as fs from "fs";

export default class Run extends Command {
  static description = 'Run pipeline from JSON config file'

  static examples = [
    `$ edworker run -f /Users/s/Documents/parse-amazon.json`,
  ]

  static flags = {
    help: flags.help({char: 'h'}),
    // flag with a value (-f, --file=PATH)
    debug: flags.string({char: 'd'}),
    file: flags.string({char: 'f', description: 'absolute path to json file'}),
  }
  static usage = 'run -f'
  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(Run)
    const file = flags.file
    const debug = Boolean(args.debug)
    if (file) {
      const webserver = new Webserver()
      await webserver.start({debug, port: 3002})
      if (!fs.existsSync(file)) {
        this.error(`file: ${file} not exists`);
        return;
      }
      const pipeline = JSON.parse(fs.readFileSync(file).toString());
      const result = await webserver.run(pipeline);
      this.log(JSON.stringify(result, null, 4));
      await webserver.stop();
      this.exit();
      return;
    }
    this.error('Path to json file is required argument')
  }

}
