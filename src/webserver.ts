import {Configuration} from "./models/configuration.model";
import {ChildProcess} from "child_process";

const fs = require('fs');
const path = require('path');
const net = require('net');
const os = require('os');
const { spawn } = require('child_process');
const axios = require('axios').default;

export default class Webserver {
  private interval: NodeJS.Timeout | undefined;
  private debug = false;
  private port = 3002;
  private tmpDir = os.tmpdir();
  private child: ChildProcess | undefined;

  public async stop() {
    try {
      this.child?.stderr.pause();
      this.child?.stdout.pause();
      this.child?.stdin.end();
      this.child?.kill();
    } catch (e) {}
    try {
      const pid = fs.readFileSync(path.join(this.tmpDir, 'pid')).toString();
      process.kill(pid);
      fs.rmdirSync(path.join(this.tmpDir, 'pid'));
    } catch (e) {}
  }

  public async start(config: Configuration): Promise<number> {
    const { debug, port, headless, maxChromeTabs } = config;
    this.debug = debug;
    this.port = port;
    const isReachable = await this.portIsBusy(port);
    if (isReachable) {
      throw new Error(`Port is ${port} busy. Please check listeners: "netstat -ntlp"`)
    }
    const child = this.child = spawn(
      'ed-server',
      [],
      {
        shell: true,
        env: {
          PORT: this.port,
          DEBUG: debug,
          PUPPETEER_HEADLESS: headless ? '1' : '0',
          USE_ISOLATION_MODE: '1',
          MAX_CHROME_TABS: maxChromeTabs.toString(),
          DATA_SERVICE_URL: `http://localhost:${this.port}`,
          TMP_FOLDER: process.cwd(),
        },
        stdio: 'pipe',
      }
    );
    child.stderr.pipe(process.stderr);
    if (debug) {
      child.stdout.pipe(process.stdout);
      child.stdin.pipe(process.stdin);
    }
    process.on('exit', () => child.kill());
    await this.waitWebServer(true);
    fs.writeFileSync(path.join(this.tmpDir, 'pid'), child.pid.toString());
    return child.pid;
  }

  public async run(pipeline: object): Promise<any> {
    const timeoutMin = 60 * 1000 * 5;
    console.log(`-->PIPELINE:`)
    console.log(JSON.stringify(pipeline, null, 4))
    const response = await axios.post(
      `http://localhost:${this.port}/v1/run-sync`,
      pipeline,
      { timeout: timeoutMin }
    );
    if (response.status < 200 || response.status >= 400) {
      console.log(response);
    }
    await this.stop();
    return response.data;
  }

  private async waitWebServer(started : boolean): Promise<void> {
    return new Promise((resolve, reject) => {
      const start = new Date();
      this.interval = setInterval(async () => {
        const isRunning = await this.webServerIsRunning();
        if (isRunning === started) {
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
  private async portIsBusy(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer(function(socket: any) {
        socket.write('Echo server\r\n');
        socket.pipe(socket);
      });
      server.listen(port, '127.0.0.1');
      server.on('error', function () {
        resolve(true);
      });
      server.on('listening', function () {
        server.close();
        resolve(false);
      });
    })
  };

}
