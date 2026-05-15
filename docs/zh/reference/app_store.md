# 应用商店 API

自 2.5.0 版本起可用

## 列出软件包

软件包列表包含所有可用软件包及其当前的更新状态。

```bash
curl -X GET http://192.168.25.25:8090/app_store/packages
```

**响应**

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
  | 'not_installed' // 显示“获取”按钮。
  | 'upgradable' // 显示“下载”按钮。
  | 'up_to_date'
  | 'download_queueing'
  | 'downloading'
  | 'downloaded' // 显示“安装”按钮。
  | 'download_failed' // 显示“重试”按钮；调用下载 API。
  | 'install_queueing'
  | 'installing'
  | 'install_failed' // 显示“重试”按钮；调用安装 API。
  | 'uninstall_queueing'
  | 'uninstalling'
  | 'uninstall_failed'

interface Package {
  name: string;
  latest_version: string;
  current_version: string;
  status: PackageStatus;

  // 下载相关 (可选)
  downloaded_versions?: string[];
  downloading_version?: string;
  downloading_progress?: number; // 0.0 - 1.0
  download_task_id?: number;

  // 安装相关 (可选)
  installing_version?: string;
  installing_progress?: number; // 0.0 - 1.0
  install_task_id?: number;
  install_failed_reason?: string;

  // 卸载相关 (可选)
  uninstall_task_id?: number;

  optional?: boolean;
}
```

## 刷新应用商店

刷新应用商店会检查软件包索引是否有新软件包和可用更新。
软件包索引将异步更新；因此，客户端应定期轮询软件包列表以查看更改。

```bash
curl -X POST http://192.168.25.25:8090/app_store/services/refresh_store
```

## 下载软件包

软件包必须先下载才能安装。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"packages": ["ax", "py_axbot"]}' \
  http://192.168.25.25:8090/app_store/services/download_packages
```

**响应**

如果请求失败 (状态码 400)：

```json
{
  "iot": "installed version(master) is already up to date",
  "some_random_package": "invalid module some_random_package, skip..."
}
```

如果请求成功 (状态码 201)：

```json
{"py_axbot": {"task_id": 16, "version": "1.1.6-opi64"}}
```

## 安装软件包

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"packages": ["ax", "py_axbot"]}' \
  http://192.168.25.25:8090/app_store/services/install_packages
```

**响应**

如果请求失败 (状态码 400)：

```json
{
  "ax": { "error": "installed version(master-pi64) is higher than downloaded version(2.4.1-pi64), skip..." },
  "iot": { "error": "installed version(master) is higher than downloaded version(1.0.5), skip..." }
}
```

如果请求成功 (状态码 201)：

```json
{"follow": {"task_id": 19, "version": "1.1.6-opi64"}}
```

## 从本地文件安装软件包

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"filename": "/tmp/ax.2.6.4.pi64.tar.gz"}' \
  http://192.168.25.25:8090/app_store/services/install_local_file
```

**响应**

```json
{
  "module_name": "ax",
  "version": "2.6.4"
}
```

## 卸载软件包

卸载之前安装的软件包。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"packages": ["follow"]}' \
  http://192.168.25.25:8090/app_store/services/uninstall_packages
```

**响应**

```json
{
  "follow": {
    "task_id": 7,
    "version": "2.2.0-opi64"
  }
}
```

## 查看下载和安装任务

下载或安装软件包会创建关联的“下载”或“安装”任务。
您可以使用以下端点查看这些任务的日志：

```bash
# 查看下载任务
curl http://192.168.25.25:8090/app_store/jobs/download/tasks
# 查看安装任务
curl http://192.168.25.25:8090/app_store/jobs/install/tasks
```

**响应**

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

### 显示下载或安装任务详情 (日志)

您可以请求特定任务的日志。

```bash
curl "http://192.168.25.25:8090/app_store/jobs/download/tasks/4/log"
```

请注意，如果任务仍在进行中，日志将是不完整的。

通过使用查询参数，可以渐进地下载日志，这非常适合实时显示。

```
curl http://192.168.25.25:8090/app_store/jobs/download/tasks/4/log?start=0&end=1024
```

可选查询参数：

- `start` (数字)：起始字符索引 (含)。
- `end` (数字)：结束字符索引 (不含)。

**响应**

- 响应头：

  - `Content-Type: text/plain; charset=utf-8`
  - `X-MORE-DATA`: "true"/"false" (指示是否有更多日志数据可用。)
  - `X-TEXT-SIZE`: 数字 (日志的总字符大小。)

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

## 刷新固件库

应用商店还支持管理固件包。此端点从远程仓库检查可用的固件更新。

```bash
curl -X POST http://192.168.25.25:8090/app_store/services/refresh_store
```

**响应**

```json
{ "status": 200 }
```

## 固件状态

获取固件包的状态。响应格式与普通软件包状态相同。

```bash
curl http://192.168.25.25:8090/app_store/firmware/packages
```

**响应**

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

## 固件安装

与标准软件包不同，固件包不需要预先下载；它们会自动在单个步骤中完成下载和安装。

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"packages": ["bottom-sensor"]}' \
  http://192.168.25.25:8090/app_store/firmware/install_packages
```

**响应**

```json
{ "bottom-sensor": { "task_id": 12, "version": "1.5.4" } }
```
