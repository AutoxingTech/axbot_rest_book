# App Store API

Available since version 2.5.0

## List Packages

The package list contains all available packages and their current update status.

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
  | 'not_installed' // Displays a 'GET' button.
  | 'upgradable' // Displays a 'Download' button.
  | 'up_to_date'
  | 'download_queueing'
  | 'downloading'
  | 'downloaded' // Displays an 'Install' button.
  | 'download_failed' // Displays a 'Retry' button; calls the download API.
  | 'install_queueing'
  | 'installing'
  | 'install_failed' // Displays a 'Retry' button; calls the install API.
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

Refreshing the App Store checks the package index for new packages and available updates.
The package index will be updated asynchronously; therefore, the client should poll the package list at regular intervals to see the changes.

```bash
curl -X POST http://192.168.25.25:8090/app_store/services/refresh_store
```

## Download Packages

Packages must be downloaded before they can be installed.

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"packages": ["ax", "py_axbot"]}' \
  http://192.168.25.25:8090/app_store/services/download_packages
```

**Response**

If the request fails (status code 400):

```json
{
  "iot": "installed version(master) is already up to date",
  "some_random_package": "invalid module some_random_package, skip..."
}
```

If the request succeeds (status code 201):

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

If the request fails (status code 400):

```json
{
  "ax": { "error": "installed version(master-pi64) is higher than downloaded version(2.4.1-pi64), skip..." },
  "iot": { "error": "installed version(master) is higher than downloaded version(1.0.5), skip..." }
}
```

If the request succeeds (status code 201):

```json
{"follow": {"task_id": 19, "version": "1.1.6-opi64"}}
```

## Install Package from a Local File

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

Uninstalls previously installed packages.

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

## View Download and Installation Tasks

Downloading or installing packages creates associated "download" or "install" tasks.
You can view the logs for these tasks using the following endpoints:

```bash
# For download tasks
curl http://192.168.25.25:8090/app_store/jobs/download/tasks
# For installation tasks
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

### Show Download or Installation Task Details (Log)

You can request the logs for a specific task.

```bash
curl "http://192.168.25.25:8090/app_store/jobs/download/tasks/4/log"
```

Note that if the task is still in progress, the log will be incomplete.

Using query parameters, the log can be downloaded progressively, which is ideal for real-time display.

```
curl http://192.168.25.25:8090/app_store/jobs/download/tasks/4/log?start=0&end=1024
```

Optional Query Parameters:

- `start` (number): The starting character index (inclusive).
- `end` (number): The ending character index (exclusive).

**Response**

- Headers:

  - `Content-Type: text/plain; charset=utf-8`
  - `X-MORE-DATA`: "true"/"false" (Indicates whether more log data is available.)
  - `X-TEXT-SIZE`: number (The total size of the log in characters.)

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

The App Store also supports managing firmware packages. This endpoint checks for available firmware updates from the remote repository.

```bash
curl -X POST http://192.168.25.25:8090/app_store/services/refresh_store
```

**Response**

```json
{ "status": 200 }
```

## Firmware Status

Retrieves the status of firmware packages. The response format is identical to that of normal package status.

```bash
curl http://192.168.25.25:8090/app_store/firmware/packages
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

## Firmware Installation

Unlike standard packages, firmware packages do not need to be downloaded beforehand; they are automatically downloaded and installed in a single step.

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
