const fs = require('fs');
const { spawn } = require('child_process');
const axios = require('axios').default;

export default class Webserver {
  private interval: NodeJS.Timeout | undefined;
  private debug = false;
  private port = 3002;

  public async stop() {
    try {
      const pid = fs.readFileSync('pid').toString();
      process.kill(pid);
      fs.rmdirSync('pid');
    } catch (e) {}
  }

  public async start(config: {debug: boolean, port: number}): Promise<number> {
    await this.stop();
    const { debug, port } = config;
    this.debug = debug;
    this.port = port;
    const child = spawn(
      'node',
      ['./node_modules/@elasticdataio/worker/dist/main.js'],
      {
        shell: true,
        env: {  PORT: this.port, DEBUG: debug },
        stdio: 'pipe',
      }
    );
    child.stderr.pipe(process.stderr);
    if (debug) {
      child.stdout.pipe(process.stdout);
      child.stdin.pipe(process.stdin);
    }
    await this.waitStartWebServer();
    fs.writeFileSync('pid', child.pid.toString());
    return child.pid;
  }

  public async run(pipeline: object): Promise<any> {
    const timeoutMin = 60 * 1000 * 5;
    const response = await axios.post(
      `http://localhost:${this.port}/v1/run-sync`,
      pipeline,
      { timeout: timeoutMin }
    );
    console.log('request is completed')
    if (response.status < 200 || response.status >= 400) {
      console.log(response);
    }
    return response.data;
  }

  private async waitStartWebServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const start = new Date();
      this.interval = setInterval(async () => {
        const isRunning = await this.webServerIsRunning();
        if (isRunning) {
          clearInterval(this.interval as NodeJS.Timeout);
          resolve();
        }
        const end = new Date();
        const execMs = end.getTime() - start.getTime()
        if (execMs / 1000 > 30) {
          clearInterval(this.interval as NodeJS.Timeout);
          reject('timeout max wait starting web server');
        }
      }, 500)
    })
  }
  private async webServerIsRunning(): Promise<boolean> {
    try {
      const response = await axios.get(`http://localhost:${this.port}/api`)
      return response.status === 200
    } catch (err) {}
    return false
  }
}
