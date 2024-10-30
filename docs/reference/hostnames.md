# Host Name API

This service is used to add/delete local DNS entries:

## List Available Names

```bash
curl http://192.168.25.25:8090/hostnames/
```

```json
[
  {
    "hostname": "local.autoxing.com",
    "url": "http://192.168.25.25:8090/hostnames/local.autoxing.com"
  }
]
```

## Add Hostname

```bash
curl -X PATCH \
  -H "Content-Type: application/json" \
  -d '{"ip": "192.168.10.12"}' \
  http://192.168.25.25:8090/hostnames/local.autoxing.com
```

```json
{
  "message": "192.168.10.12 local.autoxing.com added"
}
```

```json
// status = 400
{
  "message": "error: local2.autoxing.com is not allowed. It must be one of ['local.autoxing.com']"
}
```

## Get Hostname

```bash
curl http://192.168.25.25:8090/hostnames/local.autoxing.com
```

```json
{
  "ip": "192.168.20.20"
}
```

```json
// status = 404
{
  "message": "error: local.autoxing.com not found"
}
```

## Delete Hostname

```bash
curl -X DELETE http://192.168.25.25:8090/hostnames/local.autoxing.com
```

```json
{
  "message": "error: Hostname local.autoxing.com deleted"
}
```

```json
// status = 404
{
  "message": "error: local.autoxing.com not found"
}
```
