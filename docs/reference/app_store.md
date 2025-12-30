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
    "download_task_id": 3,
    "optional": false
  },
  {
    "name": "package_manager",
    "latest_version": "0.3.2",
    "current_version": "0.3.0",
    "status": "installing",
    "install_task_id": 4,
    "optional": false
  }
]
```

```ts
type ListPackageResponse = Package[];

type PackageStatus =
  | 'not_installed' // show a GET button
  | 'upgradable' // show a download button
  | 'up_to_date'
  | 'download_queueing'
  | 'downloading'
  | 'downloaded' // show a install button
  | 'download_failed' // show a retry button. call download API
  | 'install_queueing'
  | 'installing'
  | 'install_failed' // show a retry button. call install API
  | 'uninstall_queueing'
  | 'uninstalling'
  | 'uninstall_failed'

interface Package {
  name: string;
  latest_version: string;
  current_version: string;
  status: PackageStatus;

  // download-related (optional)
  downloaded_versions?: string[];
  downloading_version?: string;
  downloading_progress?: number; // 0.0 - 1.0
  download_task_id?: number;

  // install-related (optional)
  installing_version?: string;
  installing_progress?: number; // 0.0 - 1.0
  install_task_id?: number;
  install_failed_reason?: string;

  // uninstall-related (optional)
  uninstall_task_id?: number;

  optional?: boolean;
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
  "ax": { "error": "installed version(master-pi64) is higher than downloaded version(2.4.1-pi64), skip..." },
  "iot": { "error": "installed version(master) is higher than downloaded version(1.0.5), skip..." }
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
  -d '{"filename": "/tmp/ax.2.6.4.pi64.tar.gz"}' \
  http://192.168.25.25:8090/app_store/services/install_local_file
```

**Response**

```json
{
  "module_name": "ax",
  "version": "2.6.4"
}
```

## Uninstall Packages

Uninstall installed packages.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"packages": ["follow"]}' \
  http://192.168.25.25:8090/app_store/services/uninstall_packages
```

**Response**

```json
{
  "follow": {
    "task_id": 7,
    "version": "2.2.0-opi64"
  }
}
```

## View Download/Installation Tasks

When downloading/installing packages, there are associated "download/install tasks".
One can view logs of these tasks.

```bash
# for download tasks
curl http://192.168.25.25:8090/app_store/jobs/download/tasks
# for installation tasks
curl http://192.168.25.25:8090/app_store/jobs/install/tasks
```

**Response**

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
```

### Show Download/Installation Task Detail (Log)

For a task, the logs of the task can be requested.

```bash
curl "http://192.168.25.25:8090/app_store/jobs/download/tasks/4/log"
```

But if the task is still in progress, the log will be incomplete.

With query parameters, the log can be downloaded progressively, which is more suitable for realtime display.

```
curl http://192.168.25.25:8090/app_store/jobs/download/tasks/4/log?start=0&end=1024
```

Optional query params:

- `start` (number): start character, inclusive
- `end` (number): end character, exclusive

**Response**

- Headers:

  - `Content-Type: text/plain; charset=utf-8`
  - `X-MORE-DATA`: "true"/"false" (indicates whether more log data is available)
  - `X-TEXT-SIZE`: number (total size of the log in characters)

```
id: 5
create time: 2024-01-03 18:46:47
install task package_manager(0.4.4) added
start time: 2024-01-03 18:46:47
install task package_manager(0.4.4) begin
=== installing package_manager:0.4.4
=== checking checksum
=== extract
...
```

## Refresh Firmware Store

App store also supports manage firmware packages. Check available firmware updates from remote repository.

```bash
curl -X POST http://192.168.25.25:8090/app_store/firmware/refresh_store
```

**Response**

```json
{ "status": 200 }
```

## Firmware Status

Get firmware packages status. Response is same as normal package status.

```bash
curl http://192.168.25.25:8090/app_store/firmware/packages
>>>>>>> origin/update_app_store
```

**Response**

```json
[
  {
    "name": "bottom-sensor",
    "latest_version": "1.4.3",
    "current_version": "1.3.1",
    "status": "upgradable"
  }
]
```

## Firmware Install

Unlike normal packages, firmware packages do not require download package beforehand. It will automatically download and install firmware packages.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"packages": ["bottom-sensor"]}' \
  http://192.168.25.25:8090/app_store/firmware/install_packages
```

**Response**

```json
{ "bottom-sensor": { "task_id": 12, "version": "1.5.4" } }
```
