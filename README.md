media-service
=============

## Docker

```bash
$ docker pull youmeb/meida-service
```

## 特色

* 透過相同 URL 上傳、瀏覽圖片
* 所有內容使用 gzip 壓縮，etag cache
* 修改儲存機制不影響圖片網址
* 基本 mobile 偵測

## config

自訂 Config 必須修改 Config 檔案路徑

```bash
$ node app.js --config /config/filepath
```

Config 必須是一個 JavaScript 檔案，`exports` 一個 wrapper function

```javascript
module.exports = function (config, storages) {
  config.port = 8080;
  //...
};
```

### 圖片尺寸

一般圖片尺寸可以透過 `sizes` 來設定：

```javascript
config.sizes = {
  'large': '1000x1000',
  'small': '100x100'
};
```

### Mobile 圖片尺寸

media-service 可以判斷使用者是手機還是平板，設定方是不是直接重新定義大小，是透過名稱的對應：

```javascript
config.enableMobileDetect = true;
config.mobileSizes = {
  phone: {
    'large': 'small'
  }
};
```

這個範例讓在手機瀏覽的情況下 large 的圖片會變成 small 的尺寸

## 自訂 Storage

自訂 Storage 必須實作 media-service 的 Storage，在 Config 裡面可以透過第二個參數 `storages` 取得：

```javascript
var path = require('path');
var customStorage = require('./custom-storage');

module.exports = function (config, storages) {
  var CustomStorage = customStorage(storages.Storage);

  config.storages = [
    new storages.LocalStorages('local', {
      baseUrl: 'http://localhost:80',
      dir: path.join(__dirname, 'medias')
    }),
    new CustomStorage('custom')
  ];
};
```

> [保持統一] 所有 Storage 的第一個參數必須是 Storage 名稱，第二個參數是 `options`，`options` 必須是個 `Object`

```javascript
var util = require('util');

module.exports = function (Storage) {
  util.inherits(CustomStorage, Storage);

  return CustomStorage;

  var proto = CustomStorage.prototype;

  function CustomStorage(name, options) {
    options || (options = {});
    Storage.call(name);
  }

  proto.serve = function *serve() {
    // ...
  };
};
```

### Storage 名稱建議

Storage 名稱不要跟範例一樣用 `local` 或 `S3` 這種按處存機制命名的方式，而是透過用途，像是儲存頭像的 Storage 可以命名為 `avatar`，這樣切換後端處存方式會比較方便，可能一開始頭像處存在 Local，後來改到 S3，那我們只需要把原本名稱為 `avatar` 的 `LocalStorage` 換成名稱同樣為 `avatar` 的 `S3Storage`。

### 讀寫權限

media-service 用最單純的方式來控制誰可以存取哪些 API，IP 白名單，預設這個選想是關閉的，我們要在 Config 中開啟：

```javascript
config.enableAccessControl = true;
```

設定白名單

```javascript
config.accessControl = {
  read: [ '*.*.*.*' ],
  write: [ '220.134.*.*' ]
};
```

### #serve(ctx)

__[GeneratorFunction]__

* ctx: Koa 的 Context

在這裡把圖片從 Storage 中抓出來給使用者瀏覽，以 S3 為例，這邊可以直接把使用者導到 S3 的網址。

### #save(stream, filepath)

__[GeneratorFunction]__

* stream: 從 mutipart 取得的 Readable Stream
* filepath: 目的地位址

### #url(filepath)

__[Function]__

* filepath: 檔案位址

使用檔案位置取得真實的檔案 URL，如果儲存在本地的話可以直接回傳使用者瀏覽位置，S3 要回傳 S3 網址。

### #exists(filepath)

__[GeneratorFunction]__

* filepath: 檔案位址

檢查檔案是否存在，主要用來檢查縮圖，縮圖不存在就要建立縮圖。

### #list(filepath)

__[GeneratorFunction]__

* filepath: 檔案位址

列出目前存在的所有檔案尺寸

### #resize(filepath, thumbpath, transform)

__[GeneratorFunction]__

* filepath: 檔案位址
* thumbpath: 縮圖位址
* transform: 縮圖用的 Transform Stream

如果有時作 Cache 的話，可以在這裡寫入 Cache，然後在 `exists` 檢查 Cache 是否存在，`serve` 從 Cache 抓資料。縮完圖之後可以直接回傳檔案內容，避免還要從 Cache 抓資料。

## API

### 上傳圖片

```bash
$ curl -F 'image=@image.png' http://localhost/[storage]/[filepath]
```

### 瀏覽圖片

```bash
http://localhost/[storage]/[filepath]
```

### Resize

```bash
http://localhost/[storage]/[filepath]?size=[size name]
```

## Todo

 - [ ] S3Storage
 - [ ] `sizes` 更多的設定，不是單純的簡單設定，還要可以設定切圖方式

## License

The MIT License (MIT)

Copyright (c) 2014 YouMeb, Po-Ying Chen <poying.me@gmail.com>
