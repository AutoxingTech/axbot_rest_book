# Localization

Where the robot is: SLAM state, pose, global positioning results, and the barcodes and landmarks used to anchor it.

## Positioning State {#positioning-state}

```json
{
  "topic": "/slam/state",

  // inactive: Idle. Not creating a map, and no map is set.
  // slam: Creating a map.
  // positioning: A map is set, and the robot is in the localization state.
  "state": "positioning",

  "nav_sat_state": "no_fix", // Since 3.14. no_fix, sat_base or rtk_fixed

  "reliable": true, // false means the position is lost.

  // "lidar_reliable = False" means that no constraint exists between newly created
  // observations (submaps) and the current static map.
  //
  // The position loss steps are as follows:
  // 1. No constraints (between new observations and the static map) exist; "lidar_reliable" becomes false.
  // 2. The robot enters pure dead-reckoning mode, and "position_loss_progress" starts to increase.
  // 3. After some movement, if new constraints are created, "lidar_reliable" becomes true.
  //    However, if "position_loss_progress" reaches 1.0, "reliable" also becomes false.
  "lidar_reliable": false, // since 2.11.0-rc18
  "position_loss_progress": 0.35, // since 2.11.0-rc18. Only exists when lidar_reliable = false.

  // The quality of positioning (Experimental).
  //
  // Only valid in the positioning state.
  // since 2.3.0.
  //  0 - unknown
  //  1 - lost
  //  3 - poor
  //  8 - good
  // 10 - excellent
  "position_quality": 10,

  // How much the current LiDAR points match the static map.
  "lidar_matching_score": 0.545,

  // Other debugging flags.
  "lidar_matched": true,
  "wheel_slipping": false,
  "inter_constraint_count": 27,
  "good_constraint_count": 27
}
```

## Current Pose {#current-pose}

The current pose in the world frame.

```json
{
  "topic": "/tracked_pose",
  "pos": [3.7325, -10.8525],
  "ori": -1.56 // Orientation. The positive X-axis is 0, and the positive Y-axis is pi/2.
}
```

## Global Positioning State {#global-positioning-state}

The feedback from the `POST /services/start_global_positioning` service.

```json
{
  "topic": "/global_positioning_state",
  "state": "succeeded",
  "score": "82.1",

  // If false, the pose is globally unique and can be trusted.
  // If true, the environment is not a good match
  // or the pose is not globally unique and should be verified by a human operator.
  //
  // If the result is from a successful barcode match,
  // `needs_confirmation` is always true.
  "needs_confirmation": false,
  "pose": { "pos": [0.32, 0.97], "ori": 0.0 }, // Object position and orientation.
  "message": "Succeeded with barcode R25B13_7"
}
```

## Collected Barcode {#collected-barcode}

This topic is used to collect barcodes. It is a latched topic that remains active as long as the robot is running.
If no barcode is detected, the status is `no_result`. If a barcode is detected and accurately recognized, the status is `ok`.
If a barcode is detected but the target is too far away or at a bad angle, the status will be `too_far`, `unaligned_with_robot`, etc.

```json
{
  "topic": "/collected_barcode",
  "state": "unknown|ok|no_result|not_unique|too_far|unaligned_with_robot",
  "barcode": {
    "id": "D2_125",

    // The global pose of the barcode, defined as its physical center.
    // Only returned when a map and pose are set.
    "pose": { "pos": [-14.842, 17.595], "ori": -1.457 },

    // Since 2.9.1
    // It's only accurate when the robot is not moving
    "relative_pose": { "pos": [-1.992, -0.092], "ori": -0.312 }
  }
}
```

To use collected barcodes for global positioning or precision docking, they must be added to the map's `overlays`. See [overlays](./overlays.md#barcode). Barcodes in `overlays` can then be used for [global positioning](./services-localization.md#start-global-positioning).

## Landmarks {#landmarks}

Since 2.11.0

This topic is used to visualize [landmarks](./landmarks.md) identified during the mapping process.

```json
{
  "topic": "/landmarks",
  "landmarks": [
    {
      "id": "landmark_1",
      "pos": [0.32, 0.97],
      "in_use": true
    }
  ]
}
```
