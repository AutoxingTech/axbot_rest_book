# Landmarks

Since 2.11.0

In a typical stock area where cargos are lying randomly everywhere,
the only thing that doesn't change are the legs of stock shelves.
In this case, lidar landmarks then can be used to consolidate positioning.

Landmarks are made of reflective cohesive material, sticked to legs of shelves, corners of walls.

The process to use landmarks are as follow:

1. Deploy landmarks
   - Stick on positions that will never change, like the corners of walls, legs of selves, etc.
   - Adjacent landmarks should be at least 1 meters apart. The suggested density is 5 to 10 meters. 
2. Start mapping process as normal
   - Collected landmarks can be previewed in [`/landmarks`](../reference/websocket.md#landmarks) websocket channel.
3. Finish mapping
   - The final result of landmarks can be accessed from [mapping result as `landmark_url`](../reference/mappings.md#mapping-detail).
4. Import mapping result as a map
   - The collected landmarks are not used directly, but serves as raw materials to be imported into overlays.
   - See [landmarks in overlays](../reference/overlays.md#landmarks)
5. Start positioning with the map
   - Landmarks will be used to enhance positioning automatically.
   - The in-use landmarks can be observed from `/constraint_list` websocket channel.
