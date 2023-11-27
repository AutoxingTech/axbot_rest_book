# Overlays

The `overlays` field is in GeoJson format. In this field, we can have virtual walls, virtual regions, auto-doors, dockers, cargo-load points etc.

To update the over of a map, see ['Modify Map'](./maps.md#modify-map)

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
            },
            "properties":{
                "regionType": 4,
                "mac":"30C6F72FAE1C"
            }
        }
    ]
}
```

## Virtual Walls/Regions

Virtual walls/regions are used to prevent the robot from moving into certain areas.

## Free Space

Free spaces are used to clear out an area in the map, and allow the robot to move into those areas.

## Charger

Charger are used with move action type `charge`.

## Auto Door

Auto doors are defined so the robot can open auto-doors ahead of it.

```json
{
    "type":"Feature",
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
    },
    "properties":{
        "regionType": 4,
        "mac":"30C6F72FAE1C"
    }
}
```

## Cargo Point

Similar to charger, this point is used to tell the robot where to find racks to load/unload.
It should be used with move action type `align_with_rack` and `to_unload_point`.

