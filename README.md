media-service
=============

## Docker

```bash
$ docker pull youmeb/meida-service
```

## API

### Upload

```bash
$ curl -F 'image=@image.png' http://localhost/[storage]/[filepath]
```

### View File

```bash
http://localhost/[storage]/[filepath]
```

### Resize

```bash
http://localhost/[storage]/[filepath]?size=[size name]
```
