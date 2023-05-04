# App Store API

Available since 2.5.0

## Refresh App Store

By refreshing app store, it will check the package index for new packages and available updates.

```bash
curl -X POST http://localhost:8000/app_store/services/refresh_store
```

## List Packages

Package list contain all packages and their update status.

```bash
curl -X GET http://localhost:8000/app_store/packages
```

**Response**

```json
[
  {
    "name": "ax",
    "latest_version": "2.4.1-pi64",
    "current_version": "2.4.1-pi64",
    "status": "up_to_date"
  },
  {
    "name": "iot",
    "latest_version": "1.0.5",
    "current_version": "1.0.4",
    "status": "downloading",
    "download_task_id": 3
  },
  {
    "name": "package_manager",
    "latest_version": "0.3.2",
    "current_version": "0.3.0",
    "status": "installing",
    "install_task_id": 4
  }
]
```

```ts
type ListPackageResponse = Package[];

type PackageStatus =
  | 'upgradable'
  | 'downloading'
  | 'downloaded'
  | 'installing'
  | 'up_to_date'
  | 'download_queueing'
  | 'install_queueing'
  | 'download_failed'
  | 'install_failed';

interface Package {
  name: string;
  latest_version: string;
  current_version: string;
  status: PackageStatus;
  download_action_id?: number;
  install_action_id?: number;
}
```

## Download Packages

Before installation, packages must be downloaded first.

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"packages": ["ax", "py_axbot"]}'
  http://localhost:8000/app_store/services/download_packages
```

**Response**

If failed, status code 400:

```json
{
  "iot": "installed version(master) is already up to date",
  "some_random_package": "invalid module some_random_package, skip..."
}
```

If succeeded, status code 201:

```json
{}
```

## Install Packages

```bash
curl -X POST \
  -H "Content-Type: application/json"
  -d '{"packages": ["ax", "py_axbot"]}'
  http://localhost:8000/app_store/services/install_packages
```

**Response**

If failed, status code 400:

```json
{
  "ax": "installed version(master-pi64) is higher than downloaded version(2.4.1-pi64), skip...",
  "iot": "installed version(master) is higher than downloaded version(1.0.5), skip..."
}
```

If succeeded, status code 201:

```json
{}
```

## View Download/Installation Tasks

When downloading packages, there are associated "download tasks".
One can view logs of these tasks.

```
# for download tasks
curl http://tunnel.autoxing.com:10144/app_store/jobs/download/tasks
# for installation tasks
curl http://tunnel.autoxing.com:10144/app_store/jobs/install/tasks
```

```json
[
  {
    "id": 4,
    "status": "succeeded",
    "module": "iot",
    "version": "1.0.5",
    "create_time": "2023-05-04 17:21:36",
    "start_time": "2023-05-04 17:21:47",
    "end_time": "2023-05-04 17:21:50",
    "url": "http://localhost:8000/app_store/jobs/download/tasks/4/log"
  },
  {
    "id": 3,
    "status": "succeeded",
    "module": "ax",
    "version": "2.4.1-pi64",
    "create_time": "2023-05-04 17:21:36",
    "start_time": "2023-05-04 17:21:36",
    "end_time": "2023-05-04 17:21:47",
    "url": "http://localhost:8000/app_store/jobs/download/tasks/3/log"
  }
]
```

For a task, the logs of the task can be requested.

```bash
curl http://localhost:8000/app_store/jobs/download/tasks/4/log
```

Or with `RANGE` header, a log can be downloaded progressively, allowing for realtime display.

```bash
curl -H "Range: 4096-8192" http://localhost:8000/app_store/jobs/download/tasks/4/log
```
