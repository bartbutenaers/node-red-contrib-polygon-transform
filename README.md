# node-red-contrib-polygon-transform
A Node-RED node to transform polygons (and bounding boxes) in different formats

## Install
Run the following npm command in your Node-RED user directory (typically ~/.node-red):
```
npm install bartbutenaers/node-red-contrib-polygon-transform
```

## Support my Node-RED developments

Please buy my wife a coffee to keep her happy, while I am busy developing Node-RED stuff for you ...

<a href="https://www.buymeacoffee.com/bartbutenaers" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy my wife a coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" ></a>

## Node usage

This node allows polygons (and bounding boxes) to be tranformed from one format to another.  This is useful since lots of different formats are being used by individual projects:
+ In [YOLO](https://pjreddie.com/darknet/yolo/) the bounding box is represented as [x_center, y_center, width, height].
+ In [CreateML](https://developer.apple.com/machine-learning/create-ml/) the the bounding box is represented as [x_center, y_center, width, height].
+ In [Tensorflow](https://www.tensorflow.org/lite/examples/object_detection/overview) the bounding box is represented as [y_min, x_min, y_max, x_max] .
+ ...

Remark: a ***bounding box*** is the smallest rectangle with vertical and horizontal sides, that completely surrounds an object.

![bounding box](https://user-images.githubusercontent.com/14224149/147291316-8b3ef937-97e7-4ffb-92af-676a8a1db5ac.png)

### Supported formats

The following formats are supported at this moment:

+ ***Polygon 2D array***: a two-dimensional array of point coordinates, like `[[x1,y1], [x2,y2], ...]]`.

![array](https://user-images.githubusercontent.com/14224149/147199516-51aa7bb4-4fc5-4dc3-8799-6fbf072541c6.png)

+ ***Polygon object array***: a array of objects, containing an 'x' and 'y' property, like`[{x:..,y:..}, {x:..,y:..}, ...]`.

![array](https://user-images.githubusercontent.com/14224149/147199516-51aa7bb4-4fc5-4dc3-8799-6fbf072541c6.png)

+ ***BBox dimensions***: an array with 4 integer numbers, representing the bounding box upper left and its dimensions like `[xTopLeftx, yTopLeft, width, height]`.

![top left](https://user-images.githubusercontent.com/14224149/147199432-93ca3457-ae59-47a3-92ab-e9c74c71d78d.png)

+ ***Bbox diagonal***: an array with 4 integer numbers, representing the bounding box upper left and lower right points like `[xTopLeft, yTopLeft, xBottomRight, yBottomRight]`.

![diagonal](https://user-images.githubusercontent.com/14224149/147199655-ab2743df-a040-4383-9d6e-b6c0ae5483b2.png)

+ ***Bbox center***: an array with 4 integer numbers, representing the bounding box center point and the dimensions like `[xCenter, yCenter, width, height]`.

![center](https://user-images.githubusercontent.com/14224149/147199580-b0047a32-41e8-4eee-811e-3ed3559d2a44.png)

## Node properties

### Nested object
Specify the path of the nested object in the input message, which has a property that needs to be transformed.

For example when the field `msg.payload.bbox` needs to be transformed, then the nested object should be `msg.payload`. 

### Source property
Specify which property of the input object contains the polygon numbers (e.g. `msg.payload.bbox`), which needs to be transformed.

For example when the field `msg.payload.bbox` needs to be transformed, then the source property should be `bbox`.

### Source type
Specify which kind of polygon format is being injected in the source property.  Multiple formats are available, as explained above.
  
### Target property
Specify in which property of the nested object the transformed value needs to be stored.

For example when the field `msg.payload.bbox` needs to be transformed and the result needs to be stored in `msg.payload.bbox_transformed`, then the target property should be `bbox_transformed`.

When the target property is equal to the source property, then the original polygon data will be overwritten by the transformed polygon data.  If you want to keep the original source property content untouched in the output message, then the target property should not be equal to the source property.
  
### Target type
Specify which kind of polygon format needs to be stored in the target property.  Multiple formats are available, as explained above.

## Example flow

In the following example flow, we simulate the output of the [node-red-contrib-tfjs-coco-ssd[(https://github.com/dceejay/tfjs-coco-ssd) node and convert that bbox to an array of points:

![example flow](https://user-images.githubusercontent.com/14224149/147292055-daba0998-a467-4fdd-9d34-28b7369fe218.png)
```
[{"id":"29bff064a95b6ca3","type":"inject","z":"dd961d75822d1f62","name":"Simulate coco-ssd node","props":[{"p":"detect","v":"[{\"bbox\":[79.09654235839844,192.61730122566223,382.6765899658203,921.5669391155243],\"class\":\"person\",\"score\":0.9850512742996216},{\"bbox\":[979.6520385742188,365.9173641204834,256.22845458984375,742.8991394042969],\"class\":\"person\",\"score\":0.9641230702400208},{\"bbox\":[1662.4927978515625,297.36822152137756,310.5625,828.3472430706024],\"class\":\"person\",\"score\":0.947250485420227},{\"bbox\":[1420.769287109375,347.9553225040436,267.52392578125,774.4156711101532],\"class\":\"person\",\"score\":0.9345033168792725},{\"bbox\":[1192.1279296875,331.08206820487976,240.014404296875,780.5426781177521],\"class\":\"person\",\"score\":0.9112244248390198},{\"bbox\":[415.2801513671875,287.25230145454407,257.5223388671875,816.6256387233734],\"class\":\"person\",\"score\":0.8221092224121094},{\"bbox\":[632.0958251953125,311.4929995536804,227.0247802734375,809.7190074920654],\"class\":\"person\",\"score\":0.788152813911438},{\"bbox\":[757.0150146484375,322.2277572154999,247.5357666015625,789.4857695102692],\"class\":\"person\",\"score\":0.7647720575332642}]","vt":"json"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","x":320,"y":2020,"wires":[["010b5e123e98da6b"]]},{"id":"010b5e123e98da6b","type":"polygon-transform","z":"dd961d75822d1f62","nestedObject":"detect[]","sourceProperty":"bbox","sourceType":"bbox_array_xTopLeft_yTopLeft_width_height","targetProperty":"polygon","targetType":"polygon_array","name":"Bboxes to polygons","x":570,"y":2020,"wires":[["85ca37eaebfe5552"]]},{"id":"85ca37eaebfe5552","type":"debug","z":"dd961d75822d1f62","name":"","active":true,"tosidebar":true,"console":false,"tostatus":false,"complete":"true","targetType":"full","statusVal":"","statusType":"auto","x":750,"y":2020,"wires":[]}]
```

Note that the `[]` in the *"nested object"* expression:

![expression](https://user-images.githubusercontent.com/14224149/147292415-394b2704-d982-4a84-9c30-ecbbab8838db.png)

Means that the *"bbox"* property will be searched in every element of the *"msg.detect"* array.  If you want to apply the transform e.g. only to the second array element, then you need to use `[1]`.
