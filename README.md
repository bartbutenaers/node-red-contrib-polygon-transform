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
+ For [CreateML](https://developer.apple.com/machine-learning/create-ml/), the the bounding box is represented as [x_center, y_center, width, height].
+ ...

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
