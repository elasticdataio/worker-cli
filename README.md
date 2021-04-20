@elasticdataio/worker-cli
=========================

CLI of elasticdata.io worker

[![Version](https://img.shields.io/npm/v/@elasticdataio/worker-cli.svg)](https://npmjs.org/package/@elasticdataio/worker-cli)
[![Downloads/week](https://img.shields.io/npm/dw/@elasticdataio/worker-cli.svg)](https://npmjs.org/package/@elasticdataio/worker-cli)
[![License](https://img.shields.io/npm/l/@elasticdataio/worker-cli.svg)](https://github.com/elasticdataio/worker-cli/blob/master/package.json)

## Installation

```
npm i -g --unsafe-perm=true  @elasticdataio/worker-cli
```

<!-- toc -->

<!-- tocstop -->
## Commands
<!-- commands -->
* [`ed-cli help [COMMAND]`](#ed-cli-help-command)
* [`ed-cli run -f [path to json file]`](#ed-cli-run--f-path-to-json-file)

## `ed-cli help [COMMAND]`

display help for ed-cli

```
USAGE
  $ ed-cli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `ed-cli run -f [path to json file]`

Run pipeline from JSON config file

```
USAGE
  $ ed-cli run -f [path to json file]

OPTIONS
  -d, --debug            Show info, warning and error messages
  -f, --file=file        Relative or absolute path to json file
  -p, --port=port        [default: 3002] Listeners port
  -t, --timeout=timeout  [default: 5] Maximum waiting time for a worker in minutes
  --display              Display data after worker finishes
  --headless             Use headless mode
  --maxTabs=maxTabs      [default: 3] Max chrome tabs
  --preconfigured        Example preconfigured json file for first start

EXAMPLE
  $ ed-cli run -f parse-amazon.json
```

_See code: [src/commands/run.ts](https://github.com/elasticdataio/worker-cli/blob/v0.1.0/src/commands/run.ts)_
<!-- commandsstop -->

## Other documentation

* [Commands DSL](https://app.elasticdata.io/#/docs)
