Sandboxed workers do not pick up jobs if running node with --watch flag

### Prerequisites

- Node version >= 18
- Docker Engine from docker directly. Guide: https://docs.docker.com/engine/install/
- Docker compose plugin

### Steps to reproduce

#### Install and start redis
``` sh
npm i
npm redis
```

#### Execute example without watch mode
```
> npm test-no-watch
> test-no-watch
> node index.js

completed inline worker
completed sandboxed worker
{ sandboxedCounts: { wait: 0, completed: 1, failed: 0, active: 0 } }
{ notSandboxedCounts: { wait: 0, completed: 1, failed: 0, active: 0 } }

```

#### Execute example with watch mode
```
> npm test-watch
> test-watch
> node --watch index.js

(node:1706604) ExperimentalWarning: Watch mode is an experimental feature. This feature could change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
completed inline worker
{ sandboxedCounts: { wait: 0, completed: 1, failed: 0, active: 1 } }
{ notSandboxedCounts: { wait: 0, completed: 2, failed: 0, active: 0 } }
```

#### Result
Jobs for sandboxed worker remain in state 'active' if started with `--watch` flag and never get processed.
