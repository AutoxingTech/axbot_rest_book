# Changelog of Releases

### 1.10.0-rc0

- REST API

  - 支持 `/services/setup_wifi`。设置 wifi 为 station 或者 AP 模式。
  - In `/device/info` add `/rgb_camera/enable`.
  - 支持外接 RGB 摄像机。通过 websocket 把数据传入底盘。

- planning

  - 新的全局算路：基于 ROS navfn 改进的基于地势的逐像素算路。
  - 新的规控
    - 使用了比较标准的 DWA。使用了速度、角速度两个搜索空间。
    - 支持后退 DWA 搜索，腾挪到更适合转身，离障碍物更远的地方。
    - 浅度碰撞，支持向碰撞更轻的方向做 DWA 评价，脱离碰撞。
    - 行进更礼貌，距离人尽量更远。
  - [RCSS-1810] 支持机器人被推动时自动切换到手动模式，停车 10s 后切回自动模式。
  - 新增参数，可以调节后退的加减速度。解决后退时机器仰头的问题。
  - 修复加长底盘和小圆底盘充电问题。
  - [RCSS-1714] 支持停车模式下的调度靠边功能。
  - 优化充电模块。
    - 适配不同尺寸底盘的对桩挂接距离
    - 修复了对桩过程中出现的摇头问题
    - 优化对桩的逻辑，减少不必要的旋转
    - 提高了对桩的精准度
  - 修复解析轨迹时插值的 BUG.

- [RCSS-1779] 修复旋转异常卡住.
- [RCSS-1615] 支持后退充电(充电触点在后面)
- 修复沿固定轨道行驶中自交路线的进度跟踪问题。
- [RCSS-1505] 支持沿给定轨道行驶。

- monitor

  - 新增 rgb 摄像机报错：`AlertCode::cameraRgbDeviceNotFound`, `AlertCode::cameraRgbCameraNodeDead` and `AlertCode::cameraRgbOtherError`.
  - 当内存报警时，汇报 memory top 5 进程信息。
  - 当温度报警、CPU 报警时，汇报 cpu top 5 进程信息。
  - 某些报警，上报位置信息。
  - 新增 ax_startup 服务启动失败报警
  - 当内存报警时，自动杀死使用内存最多的进程。

- slam

  - [RCSS-1724] 建图时，广播带有时间戳的轨迹
  - [RCSS-1453] Reduce memory usage of `cartographer_occupancy_grid_node` when it's idle.
  - Add ROS param `/slam/nearby_grid_size_length` to restrict area of published map.

- feature_detector

  - [RCSS-1814] 增加电梯检测开关。默认开启。`/detectors/enable_gate_detection`
  - [RCSS-1773] enhance gate state logic

- map_server

  - [RCSS-1718] 把可行驶区直接画入原始地图，擦掉残影。

- 避障图

  - 支持深度点云同时用在记忆图层和非记忆图层
  - [RCSS-1744] 把视觉检测物体转到世界坐标系，便于可视化 `/matched_vision_detected_objects`.
  - [RCSS-1694] 支持独占区
  - [RCSS-1445] 广播周边的机器人信息

- 其它

  - 在线调参，支持多个配置段配置同一个设备。
  - 支持充电时轮子碰撞电流保护阈值 `wheel_max_current_when_docking`。
  - 支持一部分错误码带上定位信息。可以通过 `monitor/publish_pose` 配置。

- 驱动

  - 支持雷达休眠。默认 1 小时。解决了休眠引起的内存碰撞 bug。
  - 避免设备绑定混乱。支持根据 E2PROM(`CP210x` or `CH340B`) 信息来绑定设备。
  - 支持插多个深度相机模块。
  - [RCSS-1784] 新增新硬件：btm-1 (单点激光 + 光流 LC302 + ESP Now)。
  - 雷神激光雷达系列改动：
    - [RCSS-1735] 雷神 LSN10 激光雷达，换了一个新的降噪算法。
    - [RCSS-1817] 雷达转速不稳延迟报警。
    - [RCSS-1776] 雷神 LSN10 支持软件调速。
    - 新增参数 `reset_lidar_on_scan_rate_error`，可以禁用雷达转速不稳自动掉电重启的功能。
  - 支持新的型号 longtray。
  - 支持新的 4G 网卡 EG25-G
  - 支持连按 3 次 power 键，重置 wifi。
  - 支持上报电池统计信息(充电电压、电流、电池电压、电量信息)。默认关闭，需要选定一些设备开启。
  - 深度相机，增强了中值滤波，大幅降低了梯度降噪的程度。
  - 支持 wifi 配置。
  - Bug Fix:
    - 修复了雷达型号检测错误的概率性问题。
    - 如果雷达型号检测错误，应该继续启动其它程序。
    - [RCSS-1787] Fix orangepi DNS conflict.

### 1.8.9-rc0

- Fix bug:
  - 任务被取消或者任务失败时，清除 v2x 发布的路线.
  - 支持禁用雷达转速不稳自动重启的功能，但是默认开启。`/sensor_manager/reset_lidar_on_scan_rate_error`
  - 支持当雷达转速不稳时，延迟重启(或许能减少雷神雷达重启的问题)。默认 1 秒。 `/monitor/lidar/scan_rate_error_delay`

### 1.8.8

- Fix bug:
  - Restore content of network configuration file, which might be messed by other releases.

### 1.8.8-rc4

- 增加 imu 外参矫正脚本 `/opt/ax/bin/calibrate_imu.py`
- 缓存远程配置，如果启动时网络不可用，则使用缓存的配置。
- [RCSS-1587] 增加 Debug 用的深度点云查看功能。
- Fix bug
  - Fix ROS service exception when setting map or start/stop slamming.
  - Fix bug: `/slam/state` is not send when websocket is connected for the first time.

### 1.8.8-rc3

- [RCSS-858] 支持远程调参。
- 支持 50x50 的深度摄像头。增量了阳光降噪能力（部分牺牲了小物体的识别能力）。
- 暂时禁用了休眠功能。
- [RCSS-1706] 对于失败的 API Call，也记录并上传到 Action Log。
- Bug Fixes:
  - 修复了未知心跳引起的误报警。
  - [RCSS-1711] Fix false heartbeat alarm of `rgb_camera_node`
  - [RCSS-1708] 修复上桩过程中 `/planning_state` 发布卡住状态.
  - 修复了重启时，还没有定位，就报(0,0)坐标的问题。
  - [RCSS-1704] 修复了充电桩识别模块 log 过多的问题。

### 1.8.8-rc2

- 启用了 vision-based-detector
  - Add websocket topic `/vision_detected_objects`.
  - REST caps 增加 `supportsVisionBasedDetector`。说明支持基于 RGB 的视觉识别。
- REST caps 增加 `supportsExternalRgbCamera`。说明支持从外接摄像头回传 RGB 数据。

### 1.8.8-rc1

- [RCSS-1575] 修复了静止时(往往在充电)，定位飞的问题
- [RCSS-1615] 支持屁股对桩
- [RCSS-1701] 支持屁股对桩车型，当充电时定位不在充电桩上，则自动复位(必须全机器只有唯一充电桩)
- Bug Fix:
  - [RCSS-1700] 修复急停状态时 v2x 不发送自车位置

### 1.8.8-rc0

- 平台
  - 支持新机型 Tray (开放架子)
  - 支持新机型 Bubble (圆形地盘)
  - [RCSS-1530] 减少存盘到文件的 log
  - 保护 v2x (其实没啥用，后来再也没有出现过，而且保护只对 CH340 有效)
  - 增强垃圾文件自动删除的能力。比如自动录制的 bag 包，超过 7 天自动删除。
  - [RCSS-1423] 检测 MMC 寿命，自动报警
  - 减小 hotel 机型的角速度，from 1.57 to 1.2.
  - Update libgattlib and libwiringPi.
- 轮控
  - 增加 euler 驱动器适配。
  - [RCSS-1763] 支持通过参数设置轮子最大电流。
  - [RCSS-1319] 安普斯，使用高精度转速控制。
- 驱动
  - [RCSS-1637] Add support of param `external_data_topic` in `rgb_camera_node`.
  - 默认禁用碰撞条（因为有些机器的固件有问题）
  - [RCSS-1602] 支持光流里程计
  - Report the abnormal disconnection of Bluetooth.
  - 支持 `lsn10` 雷神的激光雷达(但是还是 12 米).
  - Publish `signal_strengh` in `/usb_4g_state`
  - 支持 4G 模块错误上报
  - 保护 4G 模块。检测到某些硬件错误，自动重启模块，甚至自动重启整机。
  - 保护激光雷达。转速到转速异常，自动重启雷达。（Test: 转速一直不对，或许会导致无限反复重启）
  - 保护雷达、主板的串口通讯。如果 USB 接触不良导致断线，自动重连。
  - [RCSS-1471] 支持读取主板的唯一编号
  - 上报 充电/放电/充满 事件(Test: 有些机器会在充满-放电-充满-放电之间高频反复震荡，对服务器造成冲击)
  - 支持 RGB 摄像头。, publish to `/rgb_cameras/xxx/compressed` and `/rgb_cameras/xxx/raw`.
  - [RCSS-1255] Add topic: `/rgb_camera_state` and service `/rgb_camera/enable`.
  - 支持香橙派
  - 重启时间缩短到 15 秒
  - [RCSS-1377] Add h264 video output topic to rgb_camera.
  - [RCSS-1357] 支持通过长按硬件按钮，安全关机。（而不是像之前一样硬关机）
    (Test: 只有新设备、新固件支持，测试时。长按 5 秒后，听到一个特殊声音，就松手，然后过几秒会自动关机。
    测试时，应该能从监控平台看到按钮触发的关机事件。
    如果不松手，一直按。再过 5 秒，应该会出现另一个声音，强制关机。)
  - [RCSS-1188] 能上报显示深度相机的固件版本号，监控平台能看
  - Rename `/imu/work_state` to `/imu_state`.
  - Rename lidar power service to `/baseboard/power_on_lidar`.
  - Add service `/depth_camera/enable_cameras`.
  - [RCSS-1128] 深度相机支持设置 ROI，从而禁用部分像素。
  - [RCSS-1261] 支持动态开关激光雷达，从而实现雷达休眠。
  - [RCSS-1226] IMU 断线重连，上报云端。
  - [RCSS-1596] 缩短蓝牙断线时间，让梯控、闸机等连接更稳定。
  - Bug Fix:
    - [RCSS-1572] Fix rosparam set too frequent bug. Rename "baseboard_mac" to "uid".
    - Fix baseboard command error. Failed to get firmware version etc.
    - [RCSS-1537] Fix RGB camera high cpu when device is unplugged.
    - Fix air720 kernel not recover.
    - [RCSS-1245] Bug fix: Falsely report battery state full flickeringly.
- 报警
  - 新增 sensor_manager 心跳报警
  - 新增 CPU 占用率报警（之前的是 load 报警，不是真的 CPU 占用率）
  - 新增机器侧翻报警。必须手动清除。
  - 新增 imu 断线重连 event。
- REST API
  - [RCSS-1604] Support external RGB data input and control.
  - Support service `/services/start_global_positioning` and websocket topic `/global_positioning_state`
  - Support websocket topics `/odom_state`.
  - Support websocket topics `/rgb_cameras/front/compressed` and `/rgb_cameras/back/compressed`.
  - Support websocket `/rgb_cameras/front_augmented/video`.
  - `/device/status` and `/device/info` is almost the same. Except that `/device/status` contains 3 more fields: `sn`, `nickname` and `version`. In the future, when all devices are updated, `/device/status` shall be obsoleted.
  - Add `size_bytes` in Bag and VideoFile object.
  - Add video list. `/videos`
  - Add websocket topic `/nearby_robots`.
  - Add websocket topic `/vision_detected_objects`.
  - Add `/device/info`. It contains `axbot_version` and `caps`.
  - Add clear flip error servcie. POST to `/services/monitor/clear_clip_error`.
  - [RCSS-1504] Output trajectories of mapping object.
  - Support `/sensor_manager_state` topic.
  - Add `/nearby_map_match` debug topic.
  - [RCSS-1419] Add `/measurement` websocket topic.
  - Add RGB camera message.
  - Support publishing action from ROS message.
  - Add `start_pose_type` in start mapping request.
  - Add `/move_base/trajectory`, a debug topic.
  - Use `{ "enable_topic": "/action" }` to receive action messages.
  - [RCSS-1391] Support saving only the new map after incremental mapping.
  - Deprecated websocket `/chassis/pose`, `/chassis/path` and `/chassis/occupancy_grid`.
    Use `/ws/v2/topics` to use the new `/tracked_pose`, `/path` and `/map`.
  - Add services `/wheel_control/set_emergency_stop` and `/wheel_control/set_control_mode`.
    - Add `/wheel_state` topic.
    - Deprecate `/chassis_state` topic.
    - Don't use global param for `control_mode`, `emergency_stop_pressed` or `wheel_overloaded`. |api-break|
  - Record `/tracked_pose/low_frequency` when mapping.
  - Add websocket topic `/depth_camera_state`, `/baseboard_state`.
  - Add move action type `PULL_OVER`.
  - Add services `POST /services/baseboard/power_on_lidar` and `POST /services/depth_camera/enable_cameras`.
  - Add soft reset wheels with `POST /services/wheel_control/reset_wheels`.
  - Optimize ROS message subscription with message center.
  - Forward `/imu_state` with websocket.

### 1.8.7

- 支持使用 CP210x 和 pl2303 两款 UART-to-USB 转接芯片的 V2X 芯片的绑定。

### 1.8.7-rc1

- 新增报警 6506(时间不同步) 。当系统时间和 NTP 时间相差 1 分钟以上，则报警。
- Bug fix:
  - 修复了已经在充电桩上，还自动复位的问题
  - 修复了充电桩复位的内存泄漏
  - 修复了统计信息中的错误
  - lidar_odom covariance 修正为 2x2 矩阵

### 1.8.7-rc0

- [RCSS-1609] 支持机器人在桩上充电后自动复位。 (**planning**)
- [RCSS-1592] 加动态开关，能开关融合 odom。默认关闭。`/odom_error_detector/fuse_lidar_odom` (**odom_error_detect**)
- [RCSS-1593] 重构进入电梯相关策略。 (**planning**)
  - 未进入电梯时，电梯门关闭，任务直接失败.
  - 乘梯点状态未知或被遮挡时，机器人停车不动.
  - 乘梯点状态未知超过 10s，任务失败.
  - 乘梯点被遮挡超过 20s，任务失败.
  - 乘梯点是 occupied 状态时，车先停 3s 再运动，超过 3s 还是 occupied 状态播报让一让.
- 充电桩检测一些修改，和 master 同步
  - **2022-05-24** [RCSS-1560] enhance filtering logic
  - **2022-05-10** [RCSS-1399] related, improve charger detection result filtering.
  - **2022-04-27** [RCSS-1449] Refine charger detection.
  - **2022-04-14** [RCSS-1407] If the charger hint has associated area in `/map/info`, use it to limit detection result.
  - **2022-03-22** [RCSS-1342] Add logic of charger detecting result holding.
  - **2022-03-11** [RCSS-1310] Fix a bug in clustering of charger detection result.
  - **2022-03-09** [RCSS-1272] Add services of charger hint:
    - `/feature_detector/set_charger_hint` # ax_msgs/SetPose
    - `/feature_detector/clear_charger_hint` # std_srvs/Trigger
  - **2022-03-08** [RCSS-1297] Add protection against duplicate points of elevator area.
- 运动过程中，超过 3s 进度没有更新播报让一让，超过 10s 进度没有更新任务失败.]
- MoveActionFailReason 新增 `elevator_closed`
- [RCSS-1594] detect occupancy status even if the robot is inside the elevator. (**feature_detectors**)
- 支持通过 `/measurement` 频道向云端上报统计信息。
- 增加打滑调试统计信息上报
- Bug Fix:
  - 修正 planning 心跳不稳的误报。修改 Planning 心跳运行在单独线程中。 (**planning**)
  - [RCSS-1579] fix bugs in elevator occupancy status filtering. (**feature_detectors**)
  - [RCSS-1596] 延长蓝牙断线超时时间。减少梯控通讯连接中断。

### 1.8.6

- 支持参数 /occupancy_grid_server/use_depth_cameras。在避障图中禁用深度相机。可以动态修改。
- 2008(严重打滑) 自动录制 bag 包。

### 1.8.6-rc1

- 增加 v2x 守护服务。 `systemctl cat v2x_guard.service`
- 错误码 2008，重新定义为严重打滑。
- 增加 2501(小打滑) ，仅仅用于统计。
- REST API，新增 `/services/clear_slipping_error`。用于清除打滑错误。
- 增加定期清理 log 和 bag 的后台服务。自动删除 7 天以上的文件。
- 减少 log 文件的写入，去掉 rosout.log。
- Bug fix:
  - 解决了 journalctl -f 查看 log 不及时的问题。

### 1.8.6-rc0

- [RCSS-1477] **电梯门识别结果** 和 **电梯占用状态** 中，将设备 ID 作为名称 (**feature_detectors**)
- [RCSS-1476] 使用 `v2x_node` 获取周围机器人的信息。
- 支持通过 `v2x` 发布机器人位姿及部分路线用于防碰撞检测。
- 管理平台，可以看到周围的机器人（新增 websocket topic `/nearby_robots`）
- 使用 clang 替代 gcc 进行编译。

### 1.8.5-rc2

- Bug Fix:
  - rc1 新增的打滑报警忘了开了。

### 1.8.5-rc1

- 新增打滑检测、报警
- 新增 systemCpuUsageVeryHigh 报警
- 启动时，配置树莓派默认声卡。
- Bug Fix:
  - 修复树莓派深度相机 USB 绑定错误。

### 1.8.5-rc0

- Bug Fix:
  - [RCSS-1441] 补桩逻辑不全，机器人任然偶现有充不上电的情况
  - [RCSS-1416] 4g 模块异常守护

### 1.8.4-rc1

- Bug Fix:
  - [RCSS-1508] 解决绍兴几个地铁站，长隧道误报 7002 丢定位的问题。
  - 7002(丢定位)，加入停止运动的白名单中。

### 1.8.4-rc0

- Bug Fix:
  - 解决切换地图时 1005(超过 1s 没有避障图 /maps/5cm 消息) 误报。
  - Fix [RCSS-1495] 建图时，不应该有残留的虚拟墙。
  - 内存报警门限，从 2G 改为 3G。

### 1.8.3

- [RCSS-1171] 自动持续矫正 Gyroscrope Bias。
- 新增视频驱动，读取 RGB 摄像头数据。
- 新增循环记录 H.264 视频功能。
- [RCSS-1415] 新增禁行区功能。
- [RCSS-1427] 建图时 30MB bag 包，改为 200MB。
- 监控平台，默认不再显示虚拟墙、禁行区。必须点击 MapInfo 查看。
- Bug Fix:
  - Fix [RCSS-1400]. 建图时，参数不正确导致建图回环困难。
  - Fix [RCSS-1438] 修复充电时识别到错误充电桩后机器人卡住。
  - 缓解光滑地面顶桩的问题。充电的轮子电流保护阈值由 `2.0A` 改为 `1.5A`。
  - 修复了定位模式下，应该优先匹配附近点云的 bug。

### 1.8.2

- bug fix:
  - 急停时，不应该触发机器人卡死报警
  - 修复建图后，pbstream 下载错误的问题

### 1.8.1

- 修改了 ax_first_time_init，使用新的 frpc 配置，增加连接稳定性。（只对母盘有影响）

### 1.8.1-rc2 2022/03/23

- Bug Fix:
  - 解决了开机时，如果 imu 矫正失败，导致 IMU 永远无数据的问题。

### 1.8.1-rc1 2022/03/17

- [RCSS-1344] planning 增加开关，可以禁用动态充电桩。 (**planning**)
- Bug Fix:
  - 充电桩区域支持建图平台画的任意四边形。 (**planning**)
  - 解决了 `POWER_SUPPLY_STATUS_FULL` 电池满状态不可靠的问题。改用充电电流判断。 (**sensor-drivers**)
  - [RCSS-1297] 解决了电梯区域有重复点，导致电梯开关门状态识别错误的问题。(**feature_detectors**)

### 1.8.1-rc0 2022/03/11

- Bug Fix:
  - [RCSS-1310] Fix a bug in clustering of charger detection result. (**feature_detectors**)
  - 将观察点的观测时间改为动态参数，默认值为 `2s` 。 (**planning**)
  - 修复重新上桩时后退不足导致旋转失败的问题。 (**planning**)

### 1.8.0 2022/03/08

- 新增报警 10003，充电簧片有信号，但是没有充电电流

### 1.8.0-rc7 2022/03/07

- Bug Fix:
  - [RCSS-1290] 发起回桩充电时，如果恰好已经在观察点，则不会使用识别结果，可能导致直接撞墙 (**planning**)
  - [RCSS-1228] 新增对桩 `Touch` 后长时间没收到电流时进行补桩。 (**planning**)

### 1.8.0-rc6 2022/03/02

- Bug Fix:
  - 消杀机器本来就没有深度摄像头，误报 11006(未找到深度摄像头设备)

### 1.8.0-rc5 2022/03/01

- 新增错误 11006 未找到深度摄像头设备
- 监控平台，支持显示都谁在看某个机器人

![](images/2022-03-01-22-56-11.png)

- 监控平台，当消息堆积，自动跳过多余的消息节省带宽
- 监控平台，支持显示轮子和主板固件版本

![](images/2022-03-01-22-52-11.png)

- Bug Fix:
  - 禁用 8005。误报太多。
  - 修复多线程引起回桩业务异常导致卡死的问题。
  - 修改 map2wolrd 时坐标移到像素中心。
  - [RCSS-1238] 到观测点时至少停留 1s 等待动态识别的充电桩结果，没有结果时再进行搜索。

### 1.8.0-rc4

- 新增 更新/删除/覆盖 地图的 Action Log 显示。
- Websocket 新增 `/device_info`. 使用 `{"topic": "/get_device_info"}` 发起请求。
- 修改全局算路和二级算路地势影响系数，提高走窄道能力。
- 酒店型号，修改默认运动参数。速度 0.8->1.2，加速度 0.4->0.8 (**platform-build**)
- 默认禁用深度摄像头记忆 (**platform-build**)
- [RCSS-1203] 支持单独调节 imu 报错灵敏度 (**ax_platform_monitor**)
- [RCSS-1048] 加强 IMU 校准时的运动错误，防止校准错误 (**sensor-drivers**)
- Other:
  - Record `/detected_features` in axrosbag. (**platform-build**)
  - [RCSS-1208] add uid in map info (**ax-platform-control**)
- Bug Fix:
  - 修复充电时搜索路线转向 BUG。
  - 修复转弯超调。
  - Fix bug: failed to set wheel current limit. (**wheel_control**)
  - Fix bug: failed to report wheel errors. (**wheel_control**)
  - [RCSS-1218] 修复原地旋转时，双轮转速不对称的 bug. (**wheel_control**)
  - [RCSS-1201] Use Asia/Shanghai timezone for file name. (**ax-platform-control**)
  - [RCSS-1149] 修复对桩旋转不到位，导致歪斜（修改挂节点距离为 0.6m）。 (**planning**)

### 1.8.0-rc3

- [RCSS-1208] Websocket /map_info 中 增加 uid (**ax-platform-control**)
- Bug Fix:
  - [RCSS-1201] Use Asia/Shanghai timezone for file name. (**ax-platform-control**)
  - [RCSS-1199] 修复机器人退桩时有人走过，会导致机器人卡住不动。 (**planning**)
  - [RCSS-1198] 修复退桩距离太短造成旋转时剐蹭充电片。 (**planning**)
  - [RCSS-1149] 修复机器人歪斜着对桩（修改挂节点距离为 1m）。 (**planning**)
  - [RCSS-1185] 修复机器人对桩时长时间倒着走。 (**planning**)
  - [RCSS-1175] 修复机器人来回溜达不对桩。 (**planning**)
  - [RCSS-1169] 修复机器人回桩未充上电，也没有补桩。 (**planning**)
  - [RCSS-1159] 修复在电梯门口退回待梯点时卡住的问题。 (**planning**)

### 1.8.0-rc2

- 监控平台，支持 Action Log。

![](images/2022-03-01-22-52-45.png)

- [RCSS-1089] 提高地图载入性能。支持 `/slam/set_map` 直接加载地图。 (**cartographer_ros**)
- Bug Fix:
  - [RCSS-1136] 修复轮子使能/释放状态错误的 bug (**wheel_control**)
  - [RCSS-1119] 为轮动打补丁，如果删除非常高的速度，则不相信 (**wheel_control**)
  - [RCSS-1110] 修复启动时报 BUS_UNLINK_ERROR. (**wheel_control**)

### 1.8.0-rc1

- [RCSS-490] 支持增量更新地图
- [RCSS-1051] 当电梯满时，快速放弃乘梯
- [RCSS-1065] planning 使用机器人的精确轮廓线判断碰撞
- [RCSS-1024] 轮速静止时，如果 imu 原地旋转，则报警
- [RCSS-1025] 轮速静止时，如果 imu 颤抖，则报警
- [RCSS-751] 如果任务迟迟不结束，监控平台要报警 code 1008
- [RCSS-1009] 自动清除机器人体内的障碍物。
- [RCSS-1032] 进出电梯，禁用视觉。
- [RCSS-1071] 优化退桩时耗时较长的问题。
- [RCSS-1060] 支持断电重启/关闭整个底盘。
- [RCSS-1049] 支持动态开关深度相机。可以永久配置。
- [RCSS-1061] 使用软件补偿 bias。提升 IMU 校准精度。增加 IMU 校准时间为 10 秒
- [RCSS-890] 降低建图过程中的 CPU 占用率（降低地图范围，只能在自车附近遥控）。
- [RCSS-1033] 支持显示电量满的状态。

![](images/2022-03-01-22-53-56.png)

- [RCSS-1067] 地图列表直接输出版本号，方便业务端加速同步地图。
- 增加 IMU 统计数据，温度、10 秒平均角速度，10 秒角速度标准差等。
- Bug fixes:
  - [RCSS-1007] 修复脱困到隧道外后卡死 BUG。
  - [RCSS-1055] 修复建图后，存盘时的误报警。
  - [RCSS-936] move_action，要能区分任务发起者。
  - [RCSS-1044] Fix an ultrasonic bug triggered by empty point cloud frame.
  - [RCSS-790] fix bug: 运动过程中，突然杀死轮控，waiter-3 会一直冲出去跑
  - [RCSS-1004] 在狭窄区域内退梯，卡死
  - [RCSS-1010] 回桩对桩过程中有人经过时，机器人卡死

### 1.7.4

- 支持远程清除避障图

![](images/2022-03-01-22-58-23.png)

### 1.7.3

- 增加卡死上报

### 1.7.2

- 可以在 Web 界面远程查看聚合后的 Changelog

  ![](images/2022-01-14-20-12-37.png)

- Bug Fix:
  - 修复了 Web 界面点击 save bag，无法记录 Bag 包的问题
  - 修复机器人卡住后清除避障图时间太长的问题
  - 修复轨道行驶中 `planning_state` 消息异常
  - 修复了 Web 界面无法远程重启服务的问题
  - 修复了时间同步失败的问题。增加了两个 NTP 服务
  - 修复了建图过程中，内存占用高的问题。(axrosbag 暂停录制一些 topic。)
  - 修复了建图时间太长，保存地图时内存占用过高的问题。(bag 包最多记录 30MB。)
  - 修复了连续发起移动指令，切换任务时会卡一下的问题。
