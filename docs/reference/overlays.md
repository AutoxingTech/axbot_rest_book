# Overlays

The `overlays` field of a map is in GeoJson format. It contains virtual walls, virtual regions, auto-doors, dockers, cargo-load points etc.

To update the overlays of a map, see ['Modify Map'](./maps.md#modify-map)

The top level format is:

```json
{
    "type":"FeatureCollection",
    "features":[
        {}, // feature 1
        {}, // feature 2
        {}, // feature 3
    ]
}
```

Each feature can be a point, a polyline or a polygon. For example, this is a polygon:

```json
{
    "type":"FeatureCollection",
    "features":[
        {
            "id":"SampleGate",
            "type":"Feature",
            "properties":{
                "regionType": 4,
                "mac":"30C6F72FAE1C"
            },
            "geometry":{
                "type":"Polygon",
                "coordinates":[
                    [
                        [
                        -2.702,
                        -5.784
                        ],
                        [
                        -1.007,
                        -5.827
                        ],
                        [
                        -1.053,
                        -6.348
                        ],
                        [
                        -2.546,
                        -6.385
                        ]
                    ]
                ]
            }
        }
    ]
}
```

## Virtual Walls/Regions

Virtual walls/regions are used to prevent the robot from moving into certain areas.

**Virtual walls** are `LineString`. It prevents robot from passing from one side to another side. It's also often used to guide global path calculation.

![](./virtual_wall.png)

```json
{
    "id": "19f0684fdf2b1695054df052e002d8f6",
    "type": "Feature",
    "properties": {
        "lineType": "2",
        "mapOverlay": true
    },
    "geometry": {
        "type": "LineString",
        "coordinates": [
            [
                -35.0222214524365,
                -14.968376602837452
            ],
            [
                -35.094466030898275,
                -22.120589758429787
            ],
            [
                2.4727142286451453,
                -22.554057221952917
            ],
            [
                2.54495880739114,
                -15.329599487756695
            ],
            [
                -35.0222214524365,
                -15.112865751092386
            ]
        ]
    }
}
```

**Virtual Regions** are stronger than virtual walls in that if the robot accidentally gets inside the region, it will not be able to move in any direction.

![](./virtual_region.png)

```json
{
   "id": "4d14040ea1ee7dd2e1d778f04a224d7a",
   "type": "Feature",
   "properties": {
      "blocked": false,
      "mapOverlay": true,
      "regionType": "1"
   },
   "geometry": {
      "type": "Polygon",
      "coordinates": [
         [
            [
               -87.30882859651956,
               -43.42832073191971
            ],
            [
               -86.96655334631487,
               -24.85988841115727
            ],
            [
               0.22327395043930665,
               -25.754819491083936
            ],
            [
               0.22327395043930665,
               -44.23768299574249
            ],
            [
               -87.30882859651956,
               -43.42832073191971
            ]
         ]
      ]
   }
}
```

## Free Space

Free spaces are used to clear out an area in the map, and allow the robot to move into those areas.
It's used to remove redundant obstacles after creating the map.

```json
{
   "id": "e4d544e92262c538dc31e116b630043b",
   "type": "Feature",
   "properties": {
      "blocked": false,
      "mapOverlay": true,
      "regionType": "12"
   },
   "geometry": {
      "type": "Polygon",
      "coordinates": [
         [
            [
               1.1439716297445557,
               -16.400667528273516
            ],
            [
               3.5214924133697423,
               -16.438682980748354
            ],
            [
               2.9970246447419413,
               -25.260207920183575
            ],
            [
               0.6399114661803651,
               -25.07582059422475
            ],
            [
               1.1439716297445557,
               -16.400667528273516
            ]
         ]
      ]
   }
}
```

## Charger

Charger are used with move action type `charge`.

![](./charger.png)

```json
{
   "id": "642562bcf0e02ee8aff7dea7",
   "type": "Feature",
   "geometry": {
      "type": "Point",
      "coordinates": [
         0,
         0
      ]
   },
   "properties": {
      "deviceIds": [
         "6181307902152yI"
      ],
      "dockingPointId": "65655d96f0e02ee8afc9cc5e",
      "mapOverlay": true,
      "name": "sac_01",
      "type": "9",
      "yaw": 90
   }
}
```

## Auto Door

When auto-doors are defined, the robot can open the doors ahead of it.
The door is expressed as a polygon and must have a `mac` property.

:::warning
The polygon must cover the entire area where the door moves.
If it's not large enough, when the door opens, it may collide with the waiting robot.
:::

```json
{
    "type":"Feature",
    "properties":{
        "regionType": 4,
        "mac":"30C6F72FAE1C"
    },
    "geometry":{
        "type":"Polygon",
        "coordinates":[
            [
                [
                -2.702,
                -5.784
                ],
                [
                -1.007,
                -5.827
                ],
                [
                -1.053,
                -6.348
                ],
                [
                -2.546,
                -6.385
                ]
            ]
        ]
    }
}
```

## Cargo Point

Similar to charger, this point is used to tell the robot where to find racks to load/unload.
It should be used with move action type `align_with_rack` and `to_unload_point`.


## Barcode

[Barcodes](./services.md#barcode) are used to uniquely determine the global pose of the robot.

```json
{
    "id": "d43d15cf4e4ad0bd2a24891badd74891",
    "type": "Feature",
    "properties": {
        "mapOverlay": true,
        "name": "Some user defined name",
        "barcodeId": "D2_29",
        "type": "37",
        "yaw": "177.8"
    }
    "geometry": {
        "coordinates": [
            -1.052,
            -5.485
        ],
        "type": "Point"
    }
}
```

## Lidar Deceitful Area

In areas where the terrain is not flat, the 2d lidar may hit the ground stably and mistake it for a wall.

![](./lidar_deceitful_area.png)

Adding a "lidar deceitful area" can help the robot to solve this problem. 
When moving in these areas, the robot will put more trust in the odometry of the wheels over lidar observations.

```json
{
    "type":"Feature",
    "properties":{
        "regionType": 8,
    },
    "geometry":{
        "type":"Polygon",
        "coordinates":[
            [
                [
                -2.702,
                -5.784
                ],
                [
                -1.007,
                -5.827
                ],
                [
                -1.053,
                -6.348
                ],
                [
                -2.546,
                -6.385
                ]
            ]
        ]
    }
}
```

## Landmarks

Since 2.11.0

[Landmarks](./landmarks.md) are collected in the mapping process. 
Only when stored in map overlays, they can be used for positioning.

```json
{
    "type":"Feature",
    "properties":{
        "type": "39",
        "landmarkId": "landmark_1"
    },
    "geometry":{
        "type":"Point",
        "coordinates": [-2.702, -5.784]
    }
}
```
