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
    "latest_version": "2.4.1-opi64",
    "current_version": "2.5.0-rc1-opi64",
    "status": "up_to_date"
  },
  {
    "name": "iot",
    "latest_version": "1.0.5",
    "current_version": "master",
    "status": "up_to_date"
  },
  {
    "name": "package_manager",
    "latest_version": "0.3.2",
    "current_version": "0.3.1",
    "downloaded_versions": ["0.3.2"],
    "status": "downloaded"
  },
  {
    "name": "py_axbot",
    "latest_version": "1.1.99",
    "current_version": "1.1.99",
    "status": "up_to_date"
  }
]
```

```ts
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
}
```

## Download Packages

Before installation, package must be downloaded first.

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
  "errors": {
    "py_axbot": "No new updates"
  }
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
  "errors": {
    "py_axbot": "No new updates",
    "ax": "Update not downloaded. Please download first"
  }
}
```

If succeeded, status code 201:

```json
{}
```
