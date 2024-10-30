# System Settings

Supported since 2.9.0

The structure of the system settings is as follow.

* **schema.json(readonly)** - It contains the metadata of all settings, including names, types, ranges, descriptions, etc.
* **default.json(readonly)** - It contains the defaults value of all settings.
* **user.json** - It stores the values modified by the user.
* **effective.json(readonly)** - It contains the merged values by overlaying `user.json` over `default.json`.

By design, only `user.json` is modifiable. Whenever it is modified, `effective.json` will be updated automatically.

`schema.json` and `default.json` are constants. They are related to the model of the robot.

## Schema

```
curl http://192.168.25.25:8090/system/settings/schema
```

```json
{
   "ax":[
      {
         "name":"robot.footprint",
         "title":"Robot: Footprint",
         "type":"Polygon",
         "default":[
            [
               0.248,
               0.108
            ],
            ["..."],
            [
               0.248,
               -0.108
            ]
         ]
      },
      {
         "name":"control.auto_hold",
         "title":"Control: Auto Hold",
         "type":"bool",
         "default":true,
         "description":"When idle, the robot shall hold still"
      },
      {
         "name":"control.max_forward_velocity",
         "title":"Control: Max Forward Velocity",
         "type":"float",
         "default":1.2,
         "range":"[0, 2.0]"
      },
      {
         "name":"control.max_backward_velocity",
         "title":"Control: Max Backward Velocity",
         "type":"float",
         "default":-0.2,
         "range":"[-0.3, 0]"
      },
      {
         "name":"control.max_forward_acc",
         "title":"Control: Max Forward Acc",
         "type":"float",
         "default":0.5,
         "range":"[0, 0.8]"
      },
      {
         "name":"control.max_forward_decel",
         "title":"Control: Max Forward Decel",
         "type":"float",
         "default":-2.0,
         "range":"[-2.0, 0]"
      },
      {
         "name":"control.max_angular_velocity",
         "title":"Control: Max Angular Velocity",
         "type":"float",
         "default":1.2,
         "range":"[0, 1.2]"
      },
      {
         "name":"control.acc_smoother.smooth_level",
         "title":"Control: Acc Smoother: Smooth Level",
         "type":"Enum",
         "default":"normal",
         "options":[
            "disabled",
            "lower",
            "normal",
            "higher"
         ]
      },
      {
         "name":"bump_based_speed_limit.enable",
         "title":"enable bump-based speed limit",
         "type":"bool",
         "default":true
      },
      {
         "name":"bump_based_speed_limit.bump_tolerance",
         "title":"Bump Based Speed Limit: Bump Tolerance",
         "type":"float",
         "default":0.5,
         "range":"[0, 1.0]"
      }
   ]
}
```


## Default Settings

```
curl http://192.168.25.25:8090/system/settings/default
```

## User Settings

Get user settings:

```
curl http://192.168.25.25:8090/system/settings/user
```

Save user settings:

```
curl -X POST \
    -H "Content-Type: application/json" \
    -d '...' \
    http://192.168.25.25:8090/system/settings/user
```

Partial update of user settings:

```
curl -X PATCH \
    -H "Content-Type: application/json" \
    -d '...' \
    http://192.168.25.25:8090/system/settings/user
```

## Effective Settings

```
curl http://192.168.25.25:8090/system/settings/effective
```

## Setting Options

This section records all available options.

### rack.specs

The physical representation of a rack. And how a robot should carry it.

```json
{
   "rack.specs": [
      {
         "width": 0.66,
         "depth": 0.7,

         // Some racks have extruded parts(handles, etc) outside 
         // the reams of the wheels.
         "margin": [0, 0, 0, 0], 

         "alignment": "center",  // center/back. 
         "alignment_margin_back": 0.02,

         // Some rack legs have a base plate, which is invisible to laser.
         // When crawling under the rack, the robot will avoid this extra area.
         "extra_leg_offset": 0.02, 

         // Since 2.10  square/round/other
         "leg_shape": "square", 

         // Since 2.10 the side size of a square leg, or the diameter of a round leg.
         "leg_size": 0.03, 

         // Since 2.10 some racks have rotational wheels, 
         // which are invisible to the robot lasers. 
         // Use this parameter to expand the footprint of the robot to avoid collision.
         "foot_radius": 0.05 
      }
   ]
}
```
