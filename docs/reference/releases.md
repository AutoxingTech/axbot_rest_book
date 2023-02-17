# Changelog of Releases

# 2.3.0-rc0

- New Features
  - RCSS-2082 改进 DWA 规划，引入加速度
  - RCSS-1781 用强化对向运动机器人左侧障碍物地势的方法实现机器人相遇时靠右错车
  - RCSS-2557 支持一款新的安普斯轮子，代号：amps_bsl3
  - RCSS-1984 iHawk 相机支持休眠
  - RCSS-2287 planning_state 报出精准的卡死原因
  - RCSS-2177 机器人误入虚拟墙报警
  - RCSS-2328 planning 如果崩溃，由 bot_control 自动恢复最后一个 move action
  - RCSS-2458 监控每小时磁盘写入量，如果 IO 过多则报警
  - RCSS-2486 监控平台显示超声波传感器好坏
- Tasks
  - RCSS-2496 避障图中的缺省像素由 unknown 修改为 freeSpace
  - RCSS-2529 减少 NavFn 中像素算路地势梯度的内存使用
  - RCSS-2362 使用 'TwistWithAcc.msg' 控车
  - RCSS-2545 内存报警，改为单门限
  - RCSS-2553 planning 内存优化，只保留一份静态地图的 Costmap2D 实例
  - RCSS-2555 区分紧急减速和非紧急减速，设置两种减速度
  - RCSS-2560 新增世界坐标系下的超声点云，用于 debug 显示
  - RCSS-2564 上报轮控启动错误
  - RCSS-2569 platform-monitor 改为根据 PlanningState.progress_stuck_reason 发出 1008 报警码
  - RCSS-2571 忽略 Depth camera may be covered 报警码
  - RCSS-2575 axrun 加限制：连续多次崩溃，则停止守护
  - RCSS-2593 USB 防止过度守护，仅 reset 3 次，并支持在线禁用 USB 守护
  - RCSS-2594 保存不同的 bag 包，使用不同的时长
- Bug
  - RCSS-2487 光流检测打滑误报，修正参数
  - RCSS-2235 充电桩 POI 打的靠前一点儿，会导致识别失败
  - RCSS-2278 IMU 频率异常，未恢复
  - RCSS-2418 二级算路，不希望走静态地图中的 unknown 区域
  - RCSS-2521 小圆底盘，在充电桩上无法识别出充电桩，点云不完整
  - RCSS-2532 baseboard 启动的时候当设备不存在会正常退出
  - RCSS-2546 终点处卡死，应该能让任务终止，并报错无法旋转
  - RCSS-2563 当频繁调用 usbreset hub 的时候，ihawk_node 有可能打不开设备
  - RCSS-2580 超声数据中，第一个超声出现异常读数
  - RCSS-2581 向机器人后方发起任务时会绕着圈走
  - RCSS-2586 二级路算路失败或者不可行(安全距离)超过 3s 要清除 5cm 避障图

# 2.2.0

- New Feature
  - [RCSS-2033] 增加 WIFI 扫描接口和状态查询接口
  - [RCSS-2271] 缓行区域支持速度设定
  - [RCSS-2499] 默认打开初始定位矫正
  - [RCSS-2542] 开启全局定位的二次验证，并且把初始位姿的验证改为前置验证
- Improvements
  - [RCSS-2517] 把 exit code 和 date 写入 core-dump 文件
  - [RCSS-2522] 全局算路完成后及时释放内存，减少 planning 进程的内存占用量
- Bug
  - [RCSS-2469] imu_6050 反复插拔，出现崩溃
  - [RCSS-2516] imu 崩溃
  - [RCSS-2538] 快速连续两次发起 relocate，第二次显示 Failed to set pose: service is running
  - [RCSS-2540] 机器人上桩充电时 ihawk_node 崩溃(偶现)
  - [RCSS-2556] Mars 机器人 IMU 方向错误
  - [RCSS-2512] 三星工厂报 1008 卡住
  - [RCSS-2518] 遇到一次 planning 崩溃 `ax::PushMonitor::_timerDetected(ros::WallTimerEvent)`
  - [RCSS-2519] 9008 ax_platform_monitor is dead 没有正确上报
  - [RCSS-2525] 7002 丢定位 报的比之前晚了很多
  - [RCSS-2527] 湖北国药东风总医院消杀下坡卡死

## 2.1.0

- Bug
  - [RCSS-2490] 长走廊中，车速不稳 - 避障图中的 unknown 区域导致
  - [RCSS-2502] `platform/lib/berxelLog.ini` 不应该在 log 目录下
  - [RCSS-2506] 如果已经静默了 baseboard，则不能再等待版本上报
  - [RCSS-2508] 还是会获取旧版版本号，没有做到真正的静默
  - [RCSS-2509] imu 禁用俯仰后，零偏校正依然会使用 roll pitch，导致自动零偏校正无效
  - [RCSS-2510] ihawk USB 断开无法自恢复 - usb 地址匹配有问题
  - [RCSS-2511] 阳光工厂，切换到 auto 后，走了几步后卡死
  - [RCSS-2514] systemctl stop 特别的慢 - ax_run 守护导致

## 2.1.0-rc0

- New Features
  - [RCSS-2392] 使用 beam model 输出实时点云匹配度
  - [RCSS-2485] 新增点云匹配度热力图
  - [RCSS-2503] 新增环境对称性热力图

## 2.0.0

- Task
  - [RCSS-2281] 支持查看未过滤的原始点云
- Bug
  - [RCSS-2494] monitor 自身内存过高，引起系统崩溃，应该允许自杀
  - [RCSS-2498] 出隧道纠正时，车依然运动，导致纠正后位姿错误，丢定位
  - [RCSS-2497] depth_camera_tools 检测到参数错误，拒绝启动，但是 exit code 是 1

# 1.12.0

- Task
  - [RCSS-2158] 增加开关，禁用 baseboard 串口通讯
- Bug
  - [RCSS-2411] 西站 1 号，深度摄像头不工作，也没有报警
  - [RCSS-2478] 把终点设置到地图外不太远处，planning 中会访问未初始化的变量

## 1.12.0-rc5

- Task
  - [RCSS-2365] 优化 RealTimeCorrelativeScanMatcher2D
- Bug
  - [RCSS-2457] 1.12.0-rc1，引入了参数 bug，导致雷神、蓝海雷达都无法工作
  - [RCSS-2414] 南非五合一机器人上有 planning 的 core-dump
  - [RCSS-2420] 2022 年 12 月 31 日 caracal_1000 上的 planning 崩溃
  - [RCSS-2453] 71822054002433V 深圳宝安区人民政府消杀 1 上的 planning 崩溃上的 planning 崩溃

## 2.0.0-rc10

- Task
  - [RCSS-2158] 增加开关，禁用 baseboard 串口通讯
  - [RCSS-2395] 开发基于 Pose 变化的主动清障逻辑
  - [RCSS-2433] 新底盘适配光流模块，外参
  - [RCSS-2462] 将 ihawk 的 usburi 改为后缀匹配
  - [RCSS-2471] 当 RGB 摄像头没插时，逐渐延长重试间隔
  - [RCSS-2473] 支持 longbase 新机型
  - [RCSS-2482] 添加内部参数，增大一级算路的耗时，用于测试
- Bug
  - [RCSS-2411] 西站 1 号，深度摄像头不工作，也没有报警
  - [RCSS-2464] bottom sensor pack 的固件版本号没有正确返回
  - [RCSS-2465] 上报启动过程中的 RosWaiter 错误，提高启动速度
  - [RCSS-2467] 81822013000831l 广东韶关东阳光工厂\_\_餐厅 1 上的 1008 误报
  - [RCSS-2477] 大屏新餐厅机器人，运动过程中频繁切换应急
  - [RCSS-2478] 把终点设置到地图外不太远处，planning 中会访问未初始化的变量
  - [RCSS-2483] 没有安装激光雷达，也没有指定 model，服务无法启动

## 2.0.0-rc9

- New Features
  - [RCSS-2319] 头壳 ping 不通报警
  - [RCSS-2365] 优化 RealTimeCorrelativeScanMatcher2D
  - [RCSS-2380] 出长隧道时，如果定位位置错误，自动做校正
  - [RCSS-2423] 当深度相机没有校正时，报 warning: 11501 深度相机没有校正
  - [RCSS-2430] 关键系统文件错误 增加报警码
  - [RCSS-2451] 默认支持带有 ihawk 的 waiter, tray, longtray 等机型，无需在线配置参数
- Task
  - [RCSS-2421] 雷神 lsn10 的激光雷达，一律禁用休眠
  - [RCSS-2306] 保护 odom_error_detect 节点
  - [RCSS-2425] 纠正位姿时，支持设置 window_size
  - [RCSS-2432] 关机时，尽快解锁轮子
  - [RCSS-2435] 当检测到光流硬件，但是没有配置时，报警
  - [RCSS-2448] 当深度图信息全是 0 值时应增加报警
  - [RCSS-2452] 微调深度相机外参矫正参数，提高通过率
  - [RCSS-2456] 除了消杀之外的机型，禁用 vision_based_detector，节约 CPU
- Bug
  - [RCSS-2454] tray 机型摄像头外参错了 6 cm
  - [RCSS-2415] lidar_node 有 5005 Lidar bluesea25d is irresponsive to commands 误报
  - [RCSS-2414] 南非五合一机器人上有 planning 的 core-dump
  - [RCSS-2386] 底盘误报 Connection broken 200
  - [RCSS-2404] 当 ihawk node 启动的时候如果当前没有设备应该不断尝试而不是退出
  - [RCSS-2420] 2022 年 12 月 31 日 caracal_1000 上的 planning 崩溃
  - [RCSS-2436] 避障图中，完全进入车体内部的碰撞虚拟障碍物像素未被擦除
  - [RCSS-2438] 工厂环境有台机器地面有噪点
  - [RCSS-2439] depth_camera_proc info log 太多 刷屏
  - [RCSS-2453] 71822054002433V 上的 planning 崩溃

## 2.0.0-rc8

- Bug
  - [RCSS-2406] bottom_sensor_pack_node 中存在的内存泄露
  - [RCSS-2409] 到达终点未旋转

## 2.0.0-rc7

- New Features
  - [RCSS-2382] 新增激光发送指令异常和光流频率异常报警码
  - [RCSS-2345] 新机器人的急停适配
- Task
  - [RCSS-2374] core dump 文件，需要带上版本信息
  - [RCSS-2054] 光流状态上报。数据有无（光流不会休眠）
  - [RCSS-2239] 上报激光通信状态
  - [RCSS-2399] 升级 ihawk SDK 到 2.0.88，解决部分死机问题
- Bug
  - [RCSS-2371] 乐动雷达在大立柱处有噪点
  - [RCSS-2308] 机器人在运行半路卡死不动（疑似视觉卡死）
  - [RCSS-2314] 双 ihawk 在 caracal_1000 上更加不稳定了
  - [RCSS-2363] 单矩佑摄像头，误报错误
  - [RCSS-2367] 机器人误报正在线充导致运动失败
  - [RCSS-2377] ax_carto 纠正初始定位，纠正到了错误的位姿
  - [RCSS-2379] 回桩任务被取消导致机器卡死
  - [RCSS-2383] 建图开始时，move 误报 7002 造成 action 失败
  - [RCSS-2397] 加拿大 imu 损坏的机器，充电桩复位后定位质量不可靠

## 2.0.0-rc6

- New Features
  - [RCSS-2017] iHawk 摄像头自动校准工具
  - [RCSS-2223] 开发磁盘清理 REST API 和 极度不足自动清理功能
  - [RCSS-2319] 头壳 ping 不通报警
  - [RCSS-2330] 自动防打滑。根据点云，自适应定位前端外推器的权重系数
  - [RCSS-2339] 如果 IoT 长期离线，则自动重启 4G 网卡
  - [RCSS-2347] 前端定位残差在 Web 监控平台可视化
- Task
  - [RCSS-2084] occupancy_grid_server 增加 voxel grid 中体素的向下清除逻辑
  - [RCSS-2323] update ceres-solver to 2.1.0
  - [RCSS-2331] Caracal 需要适配 RGB 摄像头
  - [RCSS-2333] 让所有的消杀类机器人，全都自动用上除雾降噪，无需人工配置
  - [RCSS-2334] `axbag info` 支持下 size by topic 的显示
  - [RCSS-2335] 对 `/path` topic 中广播的路线数据做抽稀
  - [RCSS-2337] 深度相机地面检测没有识别出近处的矿泉水瓶
  - [RCSS-2338] 对外暴露阿里云在线状态
  - [RCSS-2340] 协助自动删除 py_axbot 的陈旧 log 和 video
  - [RCSS-2346] 默认所有型号只配一个 RGB 摄像头
  - [RCSS-2352] occupancy_grid_server 5cm 避障图关闭深度相机记忆时，不再更新 voxel grid
  - [RCSS-2353] 增加 /monitor/recheck 服务
  - [RCSS-2354] occupancy_grid_server 移除不再使用的 publisher
  - [RCSS-2355] occupancy_grid_server 改善 depthTopics 参数的宽容度
  - [RCSS-2356] occupancy_grid_server 改善 publish_matched_points 参数的宽容度
- Bug
  - [RCSS-1805] 碰撞脱困需要考虑脱困的路线的持续可通行性
  - [RCSS-2181] 加拿大机器人休眠异常
  - [RCSS-2252] 把终点设置到地图外，planning 会崩溃
  - [RCSS-2277] 底盘蓝牙节点异常停止
  - [RCSS-2305] 4G 网络掉线，没有成功守护 - 辽源市政府机器
  - [RCSS-2316] 乐动雷达在立柱处有噪点
  - [RCSS-2332] ax_navi_ros 中的 NavFn 在某些情况下结果不是最优路线
  - [RCSS-2336] 1.10.1.2 重启时，monitor_watcher 会瞬间误报心跳错误
  - [RCSS-2342] 运行过程中，删除 video，会导致 video_record 大量报错
  - [RCSS-2344] master 版本，遇到 baseboard_node 崩溃
  - [RCSS-2357] 被障碍物挡住后，撤离障碍物，机器人停止

## 1.12.0-rc1

- New Features
  - [RCSS-2201] 设置初始位姿时，对明显错误的位姿做小幅度自动纠正
  - [RCSS-2330] 自动防打滑。根据点云，自适应定位前端外推器的权重系数
  - [RCSS-2223] 开发磁盘清理 REST API 和 极度不足自动清理功能
  - [RCSS-2302] 如果存在 core dump，则报警 9011
  - [RCSS-2319] 头壳 ping 不通报警
  - [RCSS-2339] 如果 IoT 长期离线，则自动重启 4G 网卡
  - [RCSS-2341] 改善默认参数，深度相机不用每台都在在线平台配置
  - [RCSS-2346] 改善默认参数，默认所有型号只配一个 RGB 摄像头
  - [RCSS-2333] 让所有的消杀类机器人，全都自动用上除雾降噪，无需人工配置
  - [RCSS-2347] 前端定位残差在 Web 监控平台可视化
- Tasks
  - [RCSS-2282] ax_carto 判定丢定位时，停车等待
  - [RCSS-2359] 新增 rosservice `/monitor/recheck` 重新检查一些定时执行的检查
  - [RCSS-2323] update ceres-solver to 2.1.0
  - [RCSS-2334] `axbag info` 支持下 size by topic 的显示
  - [RCSS-2335] 对 `/path` topic 中广播的路线数据做抽稀
  - [RCSS-2340] 协助自动删除 py_axbot 的陈旧 log 和 video
  - [RCSS-2338] 对外暴露阿里云在线状态
- Bug
  - [RCSS-2280] 底盘报旋转超时报错
  - [RCSS-2305] 4G 网络掉线，没有成功守护 - 辽源市政府机器
  - [RCSS-2316] 乐动雷达在立柱处有噪点
  - [RCSS-2342] 运行过程中，删除 video，会导致 video_record 大量报错
  - [RCSS-2336] 1.10.1.2 重启时，monitor_watcher 会瞬间误报心跳错误

## 1.11.0-rc5

- Task
  - [RCSS-1994] 改进 sensor_manager 更好的控制多设备的开关
  - [RCSS-2023] 监听常用崩溃信号并打印出崩溃调用栈
  - [RCSS-2201] 设置初始位姿时，对明显错误的位姿做小幅度自动纠正
  - [RCSS-2282] ax_carto 判定丢定位时，停车等待
  - [RCSS-2296] 构建统一的基于异常检测的服务恢复和记录有效日志用于诊断分析的软件工具和框架
  - [RCSS-2302] 如果存在 backtrace，则报警 9011
  - [RCSS-2312] 支持没有 IMU 的机器
- Bug
  - [RCSS-2111] sensor_manager 死，引起充电桩上的 1008 卡死
  - [RCSS-2174] Alerts 时序错误，导致监控平台无法显示正确的 alerts
  - [RCSS-2207] 鲁迅地铁站，版本上报错误
  - [RCSS-2245] 初次开机，偶现 4001 故障码 IMU 无数据
  - [RCSS-2273] 机器人下桩后方有人阻挡时，会在桩上旋转
  - [RCSS-2280] 底盘报旋转超时报错
  - [RCSS-2294] wifi 连接有一定概率持续报错，并且 ax_networks.py 狂刷日志
  - [RCSS-2298] ax_navi_ros 中 NavFn 长距离算路失败
- 非 axbot 改动
  - [RCSS-82] 使用 Chrony 同步时间

## 1.10.1

- Features
  - [RCSS-2130] 保留更长的历史，解决特征全变的场景的定位错误
  - [RCSS-1396] 自定义 cartographer 存盘文件格式
  - [RCSS-1980] 支持角速度平滑
  - [RCSS-2156] 改进 occupancy_grid_server 中的雾气过滤功能
  - [RCSS-1754] 识别机器人撞击，立刻把撞击位置标记为障碍物，进行绕障
  - [RCSS-1882] 当 /opt/ax-cache/.params.yaml 文件存在，则报警
  - [RCSS-2007] 开发 axbag 包辅助记录工具，便于方便的根据需求种类记录对应的 bag 文件
  - [RCSS-2164] 查看已经应用的在线配置
  - [RCSS-2144] REST API 加一个精简版的 device info，用于向云端上报设备属性
  - [RCSS-2105] 从 lidar 驱动层，精确删除 footprint 内部的点云
- Tasks
  - [RCSS-1526] 改用电压条件，判断是否在充电中
  - [RCSS-1872] 1.8.8 版本以后的行车记录仪无需记录在充电桩上的视频
  - [RCSS-1972] 支持动态设置发送自身运动信息到 `/v2x/outbound` 的频率
  - [RCSS-2008] 泡泡龙电池电量估算
  - [RCSS-2011] 美化 Wifi 设置界面
  - [RCSS-2024] 给深度相机进程加守护，缓解崩溃的问题
  - [RCSS-2039] 改进温度过高报警
  - [RCSS-2063] 弃用欧拉轮子，泡泡龙默认用安普斯
  - [RCSS-2065] 机器人默认使用标准速度，针对特殊餐厅运水要求的机器，可通过调参满足
  - [RCSS-2078] 针对参数异常，做检测和报警
  - [RCSS-2087] DWA 控车自动匹配缓行区的最大速度
  - [RCSS-2091] 针对 waiter, office, hotel，默认启用将 RGB 数据回传底盘
  - [RCSS-2101] 增加光流融合开关 `/fuse_optical_flow_odom`，默认 true
  - [RCSS-2103] 上报光流融合 Debug 数据，并加开关
  - [RCSS-2113] 增强光流失效判断-突然降到 0 的情况
  - [RCSS-2149] imu/gyro_bias_threshold 改成动态的
  - [RCSS-2155] feature_detectors 增加内部开关，控制是否在充电时禁用检测，缺省开启
  - [RCSS-2175] monitor/imu 参数，支持动态修改
  - [RCSS-2193] 放宽 load average 的报警条件
  - [RCSS-2194] 机器人在充电时 vision_based_detector 禁用检测
  - [RCSS-2199] 增加 7004 错误码：axbot_contrib 判断定位不可靠
  - [RCSS-2206] 雷神，调整滤波参数
  - [RCSS-2217] 废弃对主计算板的控电功能
- Bug Fixes

  - [RCSS-2047] 雷神 lsn 激光雷达在立柱处有噪点
  - [RCSS-2034] 蓝海激光立柱拖尾问题
  - [RCSS-1900] 电池充电状态判断高频震荡
  - [RCSS-1916] 机器人经过无避障图的残影区域卡住
  - [RCSS-1941] 到达终点时会有个小旋转
  - [RCSS-2026] 监控平台和建图平台 remote 前进异常慢
  - [RCSS-2031] 1.10.1-rco 上桩不减速导致冲撞充电桩
  - [RCSS-2040] 机器人二次下发 action 时，发了一个同样的角度，导致机器人位姿偏差
  - [RCSS-2057] 加拿大客户反馈机器运行速度偏慢
  - [RCSS-2059] master-opi64，重启机器后出现故障，机器在地图上消失
  - [RCSS-2062] 机器人触发急停后，取消任务或恢复任务时会窜动一下
  - [RCSS-2067] 泡泡龙容易剐蹭，从避障图看并没有碰撞，实际已经撞了
  - [RCSS-2069] 1.10.1 rc0 rc1 炬佑深度相机不工作
  - [RCSS-2071] 1.10.0 远控旋转，有明显延迟
  - [RCSS-2072] 机器人设置参数后，底盘系统无法正常启动
  - [RCSS-2076] 1.10.0-rc0, 1.10.0 发现有误报雷达转速异常
  - [RCSS-2085] RGB Camera Node 崩溃
  - [RCSS-2086] Django 管理平台，guest 用户不应该是超级管理员
  - [RCSS-2098] 磁盘空间不足时，video_recorder 会狂刷 log
  - [RCSS-2104] IMU 外参校准 bug
  - [RCSS-2106] 23922096000871p 运动起来后，机器人后面有避障图，机器人速度不平稳
  - [RCSS-2118] 基于光流的 collide 报错，刹车时，误报
  - [RCSS-2133] usb-audio.rules 文件路径错误
  - [RCSS-2161] cartographer 的临时文件，没有在 ROS_HOME 中
  - [RCSS-2162] 圆形立柱，有拖尾点没有消除
  - [RCSS-2173] 世纪华天 新版本 存在激光立柱影响机器人行走
  - [RCSS-2182] 轮子电流超标，有两种不同的恢复 message
  - [RCSS-2191] 充电自复位未考虑倒桩充电的逻辑
  - [RCSS-2198] RGB 识别头壳回传的图像，乱码
  - [RCSS-2213] 香橙派机器人 4G 守护触发（关机）
  - [RCSS-2214] AP 消失后按三下电源按键无法重置。让 AP 恢复

  - 1.10.0(1.10.0-rc7)

- 可以禁用光流融合，通过更改 `/bottom_sensor_pack/optical_flow/odom_topic_name`。
- [RCSS-1899] 全局定位，如果匹配特别好，可以不用人工确认。
- 增加 ESP Now 的测试指令。增加 bottom sensor pack 的 LED 控光服务。
- [RCSS-1880] Add v2x debugging tool: `bot_top`.
- REST API `GET /device/info` 中，增加 bottom_sensor_pack 和 depth_camera 的固件版本字段。
- Bug Fix:

  - [RCSS-1982] 修复任务 cancel 后 `/planning_state` 的 `move_state` 依然是 `moving` 状态导致机器人状态异常。
  - 修复终点被占用，不容易结束任务的问题。距离终点一个车长内停车，则提前结束任务。
  - 修复视频记录的 bug。多线程导致记录错误。
  - [RCSS-1962] 修复 cartographer 内存缓慢泄漏
  - [RCSS-1960] 修复 绥化巴蜀记忆火锅，光流融合，误报被推的问题
  - [RCSS-1959] 修复了光滑斜坡上误报被推的问题
  - [RCSS-1957] 修复 sensor_manager_node 尝试打开深度相机时，会卡死主线程
  - [RCSS-1952] 改进定位时的 uncertainty radius，避免出隧道无法正确匹配的问题

  - 1.10.0-rc6

- Bug Fix:

  - [RCSS-1951] 机器人设备休眠时，必须等唤醒后才能移动。

  - 1.10.0-rc5

- 增加参数 `/slam/local_match_translation_weight`。设为 `stronger` 则可以一定程度防止打滑。
- [RCSS-1934] 支持通过 `/lidar/max_range` 调节激光测距范围。
- 支持把 V2X 插在 8-1 口的绑定。（有两台发绥化的机器插到了这个口上）
- Bug Fix:

  - 修复了 USB 守护中，reset 连续失败引起的死循环。

  - 1.10.0-rc4

- [RCSS-1884] 增加开关，默认禁用了独享区调度(还不成熟)。
- [RCSS-1821] 新增对 USB-hub 的守护。如果被静电打死了，自动重启。
- [RCSS-1772] 让加(减)速度和速度差相关，从而避免急加速、急减速
- 禁用了打滑报警(误报太多)
- 人体检测

  - [RCSS-1873] 支持建图时，自用禁用检测功能，建图结束后，自动恢复
  - 同步 master 微调过的 coco head 模型，改善近距离人的识别效果

  - 1.10.0-rc3

- Bug Fixes:

  - 改正了启动时深度相机恰巧接触不良，后续又连上还不工作的 bug
  - 改成了 IMU 外参校准的 bug

  - 1.10.0-rc2

- 支持 LC303 光流
- [RCSS-1824] 加长底盘支持后退出电梯
- 解决了部分打滑导致的丢定位问题。当打滑不严重时，不会定位错误。
- 新增 REST API: `/wake_up_device`.
- REST API `/imu/recalibrate`，新增 `calibrate_pose` 参数。可以校正外参。
- monitor 增加了对自身心跳的监控
- 增加了 mmc 寿命监控
- 把所有传感器的外参都放在了参数文件中。
- 电梯检测
  - [RCSS-1858] Add param `/detectors/elevator_occupancy_radius`: radius of elevator stand circle.
  - [RCSS-1846] enhance gate state logic
  - [RCSS-1836] auto switch elevator gate on/off using `map/info`, `enableDoor` field.
- 避障图
  - [RCSS-1847] Add `/occupancy_grid_server/depth_simple_marking_keep_time`.
  - [RCSS-1832] 修改配置文件，餐厅与酒店机器人的下视深度相机配置为近处带记忆远处不带记忆
- Bug Fixes

  - [RCSS-1865] 支持配置乘梯点不同状态时的超时时间。
  - [RCSS-1866] 任务开始一级路线有障碍物，选路时直接切换新路线（不 hold 2s）。(**planning**)
  - [RCSS-1841] 修复回桩充电卡死问题。(**planning**)
  - 尝试解决雷达型号检测错误的问题。(**sensor-drivers**)
  - [RCSS-1860] Sync h264 and compressed image timestamp in `rgb_camera_node`. (**sensor-drivers**)
  - 到终点还剩一个车身的距离时，不再因压脚地势而进入避让模式。 (**planning**)
  - 修复避让模式切换行进模式时的前后震荡。 (**planning**)
  - 提高机器人被阻挡时进入避让模式的阈值。 (**planning**)
  - 修复机器人避让模式切换到行进模式太慢。 (**planning**)
  - 修复旋转时短暂卡顿不流畅。 (**planning**)
  - 修复靠近终点旋转时的左右震荡。 (**planning**)
  - [RCSS-1833] 修复近距离情况下机器人不能到达终点的 BUG。 (**planning**)

  - 1.10.0-rc1

- 支持 bottom sensor pack 元器件。（包括光流、ESP Now 通讯）
  - 支持被推动、自动释放轮子
  - 支持基于轮速打滑检测碰撞，并自动绕开。（向前、向后碰都支持）
- [RCSS-1836] 支持禁用电梯相关检测（某些电梯都是镜子，现有算法无法检测）
- 支持多台深度相机，并修正了报警
- [RCSS-1783] 避障图中，让视觉检测结果保持一段时间。缓解检测闪烁。
- [RCSS-1593] 重构进入电梯相关策略。
  - 未进入电梯时，电梯门关闭，任务直接失败.
  - 乘梯点状态未知或被遮挡时，机器人停车不动.
  - 乘梯点状态未知超过 10s，任务失败.
  - 乘梯点被遮挡超过 20s，任务失败.
  - 乘梯点是 occupied 状态时，车先停 3s 再运动，超过 3s 还是 occupied 状态播报让一让.
  - 运动过程中，超过 3s 进度没有更新播报让一让，超过 10s 进度没有更新任务失败.
- Bug Fix:

  - 避免频繁报雷达转速错误。Add `scan_rate_error_delay`
  - [RCSS-1823] 解决了 USB 绑定的 bug
  - 靠边停车，去掉了卡死误报警
  - 微调了雷神的降噪参数，避免立柱的噪点
  - [RCSS-1769] 修复: 接近障碍物内的终点时二级路线上不必要的曲折。
  - 任务刚发起后二级路算路失败，此时应该沿着一级路线行驶。
  - 修复机器人在桩上充电后自动复位。

  - 1.10.0-rc0

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

  - 1.8.9(1.8.9-rc2)

- 增加参数 `/slam/local_match_translation_weight`。设为 `stronger` 则可以一定程度防止打滑。
- [RCSS-1934] 支持通过 `/lidar/max_range` 调节激光测距范围。

  - 1.8.9-rc1

- 解决了部分打滑导致的丢定位问题。当打滑不严重时，不会定位错误。
- 去掉了对 apt source 的修改。
- Bug Fix:

  - [RCSS-1757] 解决了闲置时，内存不断增大，引起进程大量崩溃的问题。
  - [RCSS-1453] 解决了 `cartographer_occupancy_grid_node` 闲置时内存过大的问题.

  - 1.8.9-rc0

- Fix bug:

  - 任务被取消或者任务失败时，清除 v2x 发布的路线.
  - 适配了雷神雷达：

    - 支持禁用雷达转速不稳自动重启的功能，但是默认开启。`/sensor_manager/reset_lidar_on_scan_rate_error`
    - 支持当雷达转速不稳时，延迟重启(或许能减少雷神雷达重启的问题)。默认 1 秒。 `/monitor/lidar/scan_rate_error_delay`
    - 微调了雷神的降噪参数，避免立柱的噪点
    - [RCSS-1735] 更改了雷神的降噪方案
    - 加长了雷神雷达自检测的时间为 6 秒

  - 1.8.8

- Fix bug:

  - Restore content of network configuration file, which might be messed by other releases.

  - 1.8.8-rc4

- 增加 imu 外参矫正脚本 `/opt/ax/bin/calibrate_imu.py`
- 缓存远程配置，如果启动时网络不可用，则使用缓存的配置。
- [RCSS-1587] 增加 Debug 用的深度点云查看功能。
- Fix bug

  - Fix ROS service exception when setting map or start/stop slamming.
  - Fix bug: `/slam/state` is not send when websocket is connected for the first time.

  - 1.8.8-rc3

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

  - 1.8.8-rc2

- 启用了 vision-based-detector
  - Add websocket topic `/vision_detected_objects`.
  - REST caps 增加 `supportsVisionBasedDetector`。说明支持基于 RGB 的视觉识别。
- REST caps 增加 `supportsExternalRgbCamera`。说明支持从外接摄像头回传 RGB 数据。

  - 1.8.8-rc1

- [RCSS-1575] 修复了静止时(往往在充电)，定位飞的问题
- [RCSS-1615] 支持屁股对桩
- [RCSS-1701] 支持屁股对桩车型，当充电时定位不在充电桩上，则自动复位(必须全机器只有唯一充电桩)
- Bug Fix:

  - [RCSS-1700] 修复急停状态时 v2x 不发送自车位置

  - 1.8.8-rc0

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

  - 1.8.7

- 支持使用 CP210x 和 pl2303 两款 UART-to-USB 转接芯片的 V2X 芯片的绑定。

  - 1.8.7-rc1

- 新增报警 6506(时间不同步) 。当系统时间和 NTP 时间相差 1 分钟以上，则报警。
- Bug fix:

  - 修复了已经在充电桩上，还自动复位的问题
  - 修复了充电桩复位的内存泄漏
  - 修复了统计信息中的错误
  - lidar_odom covariance 修正为 2x2 矩阵

  - 1.8.7-rc0

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

  - 1.8.6

- 支持参数 /occupancy_grid_server/use_depth_cameras。在避障图中禁用深度相机。可以动态修改。
- 2008(严重打滑) 自动录制 bag 包。

  - 1.8.6-rc1

- 增加 v2x 守护服务。 `systemctl cat v2x_guard.service`
- 错误码 2008，重新定义为严重打滑。
- 增加 2501(小打滑) ，仅仅用于统计。
- REST API，新增 `/services/clear_slipping_error`。用于清除打滑错误。
- 增加定期清理 log 和 bag 的后台服务。自动删除 7 天以上的文件。
- 减少 log 文件的写入，去掉 rosout.log。
- Bug fix:

  - 解决了 journalctl -f 查看 log 不及时的问题。

  - 1.8.6-rc0

- [RCSS-1477] **电梯门识别结果** 和 **电梯占用状态** 中，将设备 ID 作为名称 (**feature_detectors**)
- [RCSS-1476] 使用 `v2x_node` 获取周围机器人的信息。
- 支持通过 `v2x` 发布机器人位姿及部分路线用于防碰撞检测。
- 管理平台，可以看到周围的机器人（新增 websocket topic `/nearby_robots`）
- 使用 clang 替代 gcc 进行编译。

  - 1.8.5-rc2

- Bug Fix:

  - rc1 新增的打滑报警忘了开了。

  - 1.8.5-rc1

- 新增打滑检测、报警
- 新增 systemCpuUsageVeryHigh 报警
- 启动时，配置树莓派默认声卡。
- Bug Fix:

  - 修复树莓派深度相机 USB 绑定错误。

  - 1.8.5-rc0

- Bug Fix:

  - [RCSS-1441] 补桩逻辑不全，机器人任然偶现有充不上电的情况
  - [RCSS-1416] 4g 模块异常守护

  - 1.8.4-rc1

- Bug Fix:

  - [RCSS-1508] 解决绍兴几个地铁站，长隧道误报 7002 丢定位的问题。
  - 7002(丢定位)，加入停止运动的白名单中。

  - 1.8.4-rc0

- Bug Fix:

  - 解决切换地图时 1005(超过 1s 没有避障图 /maps/5cm 消息) 误报。
  - Fix [RCSS-1495] 建图时，不应该有残留的虚拟墙。
  - 内存报警门限，从 2G 改为 3G。

  - 1.8.3

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

  - 1.8.2

- bug fix:

  - 急停时，不应该触发机器人卡死报警
  - 修复建图后，pbstream 下载错误的问题

  - 1.8.1

- 修改了 ax_first_time_init，使用新的 frpc 配置，增加连接稳定性。（只对母盘有影响）

  - 1.8.1-rc2 2022/03/23

- Bug Fix:

  - 解决了开机时，如果 imu 矫正失败，导致 IMU 永远无数据的问题。

  - 1.8.1-rc1 2022/03/17

- [RCSS-1344] planning 增加开关，可以禁用动态充电桩。 (**planning**)
- Bug Fix:

  - 充电桩区域支持建图平台画的任意四边形。 (**planning**)
  - 解决了 `POWER_SUPPLY_STATUS_FULL` 电池满状态不可靠的问题。改用充电电流判断。 (**sensor-drivers**)
  - [RCSS-1297] 解决了电梯区域有重复点，导致电梯开关门状态识别错误的问题。(**feature_detectors**)

  - 1.8.1-rc0 2022/03/11

- Bug Fix:

  - [RCSS-1310] Fix a bug in clustering of charger detection result. (**feature_detectors**)
  - 将观察点的观测时间改为动态参数，默认值为 `2s` 。 (**planning**)
  - 修复重新上桩时后退不足导致旋转失败的问题。 (**planning**)

  - 1.8.0 2022/03/08

- 新增报警 10003，充电簧片有信号，但是没有充电电流

  - 1.8.0-rc7 2022/03/07

- Bug Fix:

  - [RCSS-1290] 发起回桩充电时，如果恰好已经在观察点，则不会使用识别结果，可能导致直接撞墙 (**planning**)
  - [RCSS-1228] 新增对桩 `Touch` 后长时间没收到电流时进行补桩。 (**planning**)

  - 1.8.0-rc6 2022/03/02

- Bug Fix:

  - 消杀机器本来就没有深度摄像头，误报 11006(未找到深度摄像头设备)

  - 1.8.0-rc5 2022/03/01

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

  - 1.8.0-rc4

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

  - 1.8.0-rc3

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

  - 1.8.0-rc2

- 监控平台，支持 Action Log。

![](images/2022-03-01-22-52-45.png)

- [RCSS-1089] 提高地图载入性能。支持 `/slam/set_map` 直接加载地图。 (**cartographer_ros**)
- Bug Fix:

  - [RCSS-1136] 修复轮子使能/释放状态错误的 bug (**wheel_control**)
  - [RCSS-1119] 为轮动打补丁，如果删除非常高的速度，则不相信 (**wheel_control**)
  - [RCSS-1110] 修复启动时报 BUS_UNLINK_ERROR. (**wheel_control**)

  - 1.8.0-rc1

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

  - 1.7.4

- 支持远程清除避障图

![](images/2022-03-01-22-58-23.png)

- 1.7.3

- 增加卡死上报

  - 1.7.2

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
