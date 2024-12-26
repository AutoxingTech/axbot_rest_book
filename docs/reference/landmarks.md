# Landmarks

Since 2.11.0

In a typical stock area where cargo is lying randomly everywhere,
the only things that don't change are the legs of stock shelves.
In this case, lidar landmarks can be used to consolidate positioning.

Landmarks are made of reflective cohesive material, stuck to the legs of shelves.
There are some pre-made reflective cylinders sold on various online stores.

![](./landmarks.png)

The process to use landmarks is as follows:

## Deploy landmarks

- Stick landmarks on positions that will never change, like the corners of walls, legs of shelves, etc.
- Adjacent landmarks should be at least 1 meter apart. The suggested density is 10 to 50 meters. 

## Collecting Landmarks

There are two ways to collect landmarks:

* Start a new mapping task.
  1. Start the mapping process as usual.
      - Optional: Collected landmarks can be previewed in real-time in the [`/landmarks`](../reference/websocket.md#landmarks) websocket channel.
  2. Finish mapping.
      - The final result of landmarks can be accessed from the [mapping result as `landmark_url`](../reference/mappings.md#mapping-detail).
* Collect landmarks for an existing map.
   1. Use the service [Collect Landmarks](./services.md#collect-landmarks).

The collected landmarks are not used directly but serve as raw materials to be imported into overlays.
Save landmarks into overlays. See [landmarks in overlays](../reference/overlays.md#landmarks).

## Start positioning with the map

Landmarks in the overlays will be used to enhance positioning automatically.

Optional: The in-use landmarks can be observed from the `/constraint_list` websocket channel.
