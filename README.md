@elasticdataio/worker-cli
=========================

CLI of elasticdata.io worker

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@elasticdataio/worker-cli.svg)](https://npmjs.org/package/@elasticdataio/worker-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@elasticdataio/worker-cli.svg)](https://npmjs.org/package/@elasticdataio/worker-cli)
[![License](https://img.shields.io/npm/l/@elasticdataio/worker-cli.svg)](https://github.com/elasticdataio/worker-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @elasticdataio/worker-cli
$ ed COMMAND
running command...
$ ed (-v|--version|version)
@elasticdataio/worker-cli/0.0.34 darwin-x64 node-v14.16.0
$ ed --help [COMMAND]
USAGE
  $ ed COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ed help [COMMAND]`](#ed-help-command)
* [`ed run -f [path to json file]`](#ed-run--f-path-to-json-file)

## `ed help [COMMAND]`

display help for ed

```
USAGE
  $ ed help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `ed run -f [path to json file]`

Run pipeline from JSON config file

```
USAGE
  $ ed run -f [path to json file]

OPTIONS
  -d, --debug          Show info, warning and error messages
  -e, --preconfigured  Example preconfigured json file for first start
  -f, --file=file      Absolute path to json file
  -h, --help           show CLI help
  -p, --port=port      [default: 3002] Listeners port
  --headless           Use headless mode
  --maxTabs=maxTabs    [default: 3] Max chrome tabs

EXAMPLE
  $ ed-cli run -f /Users/s/Documents/parse-amazon.json
```

_See code: [src/commands/run.ts](https://github.com/elasticdataio/worker-cli/blob/v0.0.34/src/commands/run.ts)_
<!-- commandsstop -->
