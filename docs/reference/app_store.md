# App Store API

Available since 2.5.0

## List Packages

Package list contain all packages and their update status.

```bash
curl -X GET http://192.168.25.25:8090/app_store/packages
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
  | 'not_installed' // show a GET button
  | 'upgradable' // show a download button
  | 'downloading'
  | 'downloaded' // show a install button
  | 'installing'
  | 'up_to_date'
  | 'download_queueing'
  | 'install_queueing'
  | 'download_failed' // show a retry button. call download API
  | 'install_failed' // show a retry button. call install API
  | 'uninstalling'
  | 'uninstalling_failed' // show a retry button. call uninstall API

interface Package {
  name: string;
  latest_version: string;
  current_version: string;
  status: PackageStatus;
  download_task_id?: number;
  install_task_id?: number;
}
```

## Refresh App Store

By refreshing app store, it will check the package index for new packages and available updates.
The package index will be updated. But because it's asynchronous, the user should GET the package list at a regular interval.

```bash
curl -X POST http://192.168.25.25:8090/app_store/services/refresh_store
```

## Download Packages

Before installation, packages must be downloaded first.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"packages": ["ax", "py_axbot"]}' \
  http://192.168.25.25:8090/app_store/services/download_packages
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
{"py_axbot": {"task_id": 16, "version": "1.1.6-opi64"}}
```

## Install Packages

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"packages": ["ax", "py_axbot"]}' \
  http://192.168.25.25:8090/app_store/services/install_packages
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
{"follow": {"task_id": 19, "version": "1.1.6-opi64"}}
```

## Install Package from Local File

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"filename": "/tmp/ax.2.6.4.pi64.tar.gz"]}' \
  http://192.168.25.25:8090/app_store/services/install_local_file
```

**Response**

```json
{
  "module_name": "ax",
  "version": "2.6.4"
}
```

## View Download/Installation Tasks

When downloading/installing packages, there are associated "download/install tasks".
One can view logs of these tasks.

````
# for download tasks
curl http://192.168.25.25:8090/app_store/jobs/download/tasks
# for installation tasks
curl http://192.168.25.25:8090/app_store/jobs/install/tasks

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
    "url": "http://192.168.25.25:8090/app_store/jobs/download/tasks/4/log"
  },
  {
    "id": 3,
    "status": "succeeded",
    "module": "ax",
    "version": "2.4.1-pi64",
    "create_time": "2023-05-04 17:21:36",
    "start_time": "2023-05-04 17:21:36",
    "end_time": "2023-05-04 17:21:47",
    "url": "http://192.168.25.25:8090/app_store/jobs/download/tasks/3/log"
  }
]
````

For a task, the logs of the task can be requested.

```bash
curl "http://192.168.25.25:8090/app_store/jobs/download/tasks/4/log"
```

But if the task is still in progress, the log will be incomplete.

With `GET` request, the log can be downloaded progressively, which is more suitable for realtime display.

```bash
curl https://192.168.25.25:8090/app_store/jobs/download/tasks/5/log?start=193&end=0
```

The server will return additional response headers:

- **`x-more-data`** - `true` means the log is incomplete, `false` otherwise.
- **`x-text-size`** - Currently available characters of the whole file
