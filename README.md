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
* [`ed-cli run -f [path to json file]`](#ed-cli-run--f-path-to-json-file)

## `ed-cli run -f [path to json file]`

Run pipeline from JSON config file

```
USAGE
  $ ed-cli run -f [path to json file]

OPTIONS
  -d, --debug          Show info, warning and error messages
  -e, --preconfigured  Example preconfigured json file for first start
  -f, --file=file      Absolute path to json file
  -p, --port=port      [default: 3002] Listeners port
  --headless           Use headless mode
  --maxTabs=maxTabs    [default: 3] Max chrome tabs

EXAMPLE
  $ ed-cli run -f /Users/s/Documents/parse-amazon.json
```

_See code: [src/commands/run.ts](https://github.com/elasticdataio/worker-cli/blob/v0.0.38/src/commands/run.ts)_
<!-- commandsstop -->
