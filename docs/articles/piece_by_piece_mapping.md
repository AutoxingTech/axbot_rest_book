# Piece by Piece Mapping

For a very large map that exceeds the capacity of a single map, we can create several connected maps instead. When the robot moves in the overlapping area between two maps, it can switch to another map and continue moving.

## Simple Method

### Steps for Simple Partition Mapping

![](./suitable.png)

1. First, create Area 1.
2. Use Area 1 for localization and move to the overlapping area between Area1 and Area2.
3. Start creating a new map, ensuring to set `{ "start_pose_type": "current_pose" }`. This way, the current coordinates will be used as the starting point of the new map, making the coordinate systems of both maps continuous.
4. After Area 2 is created.
5. Continue creating Area 3, and so on.

You can appropriately increase the overlap between two maps (when creating Area2, move back a bit). The larger the overlap, the more area available for switching maps.

### Limitation of the Simple Method

The simple method only inherits the coordinates of the previous map at a specific starting point. There is no matching or loop closure between maps, so it can only ensure matching around single points.

Some maps have obvious single-channel cut points and can be divided into multiple parts. In such cases, this method can be used.

If, after cutting, there are multiple channels connecting the two parts, it is not suitable to use this simple method.

As shown in the figure below, the green line is suitable for cutting, while the red line is not suitable.

![](split_line.png)

Additionally, separated multiple areas should not have large loop structures, as shown in the figure:

| Suitable            | Not Suitable            |
| ------------------- | ----------------------- |
| ![](./suitable.png) | ![](./not_suitable.png) |

## Backbone Method

The backbone method can accommodate multi-channel scenarios and properly match all channels.

### Steps for Backbone Partition Mapping

1. First, perform analysis and planning to identify the backbone and areas. The backbone should include major main routes and large loops, and it should connect to all area.
2. Walk along the backbone to create it, naming it "backbone". Once the backbone is established, the overall shape of the map is determined.
3. Load the backbone and walk to the vicinity of the first area, Area 1, then start incremental mapping.
4. Finish mapping, ensuring to select `{"new_map_only": true}`. This means only the incremental part is saved, not the backbone part.
5. Continue creating each subsequent area.

Finally, the backbone map is discarded. It is only used to match and perform loop closure between the parts.

As shown in the figure below, the purple line is the backbone. You can first create the map along the purple line, and then separately create the green, red, and blue areas.

![](./backbone.png)

