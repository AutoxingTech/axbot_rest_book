# Answers 2022/08/24

## know the process of how to save map to cloud

After mapping action finished, use `GET /mappings/:id` to get the [detail of the mapping action](./mappings.md#mapping-detail). Including origin, resolution. But the Map(binary) and Image(PNG) should be download with additional requests(The URLs is given in the last request)

You can then send data to some servers.

## do u do mapping and saving in cloud or local ?

Mapping is always done locally. After that, you can do whatever you wish to. For example:

1. [Save Mapping Artifacts Directly as a Map](./mappings.md#save-mapping-artifacts-directly-as-a-map)
2. Or send the mapping artifacts to remote server.

## Is fine tuning capabilities possible

Currently, only some [motion metrics](./robot_params.md) can be tuned at runtime.

## how does map saving work - cloud to local or local to cloud

These are implemented on APP side. May be someone else could answer it.

## currently docking we need to give x,y,z attributes. we would like to have auto docking

It's a valid question. I think we can provide a API to start docking with a POI ID.

## cancel mission how does it work. and is there a pause mission

No, with this layer of REST API, you can only cancel an action. Pausing/Resuming is implemented on APP level.

## What is the use of bluetooth

Bluetooth is used to query or operate elevator, auto gates.

At current stage, [Bluetooth API](./bluetooth.md) only serves as a communication channel. The APP logic communicates with devices directly(with websocket channel). This may change in the future.
