/**
 * Copyright 2021 Bart Butenaers
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 module.exports = function(RED) {
    var settings = RED.settings;

    function PolygonTransformNode(config) {
        RED.nodes.createNode(this,config);
        this.nestedObject   = config.nestedObject;
        this.sourceProperty = config.sourceProperty;
        this.sourceType     = config.sourceType;
        this.targetProperty = config.targetProperty;
        this.targetType     = config.targetType;

        var node = this;
        
        const TO_POLYGON = "TO_POLYGON";
        const FROM_POLYGON = "FROM_POLYGON";
                
        function getExtrema(polygonArray) {
            var xCoordinates = polygonArray.map(function(point) {return point[0]});
            var yCoordinates = polygonArray.map(function(point) {return point[1]});

            return {
                left:   Math.min.apply(null, xCoordinates),
                right:  Math.max.apply(null, xCoordinates),
                top:    Math.min.apply(null, yCoordinates),
                bottom: Math.max.apply(null, yCoordinates)
            }
        }
        
        // Transform a polygon with format [[x1, y1], [x2, y2], ...]
        node.polygon_array = function(input, direction) {
            var result;
            
            if (direction == TO_POLYGON) {
                if (!Array.isArray(input) || input.some(function(element) { return !Array.isArray(element) || element.length !== 2 || element.some(isNaN) })) {
                    throw "The source conversion requires an array of sub-arrays with 2 integers";
                }
               
                // No conversion required, since the internal format of this node is also [[x1, y1], [x2, y2], ...]
                result = input;
            }
            else {
                // No conversion required, since the internal format of this node is also [[x1, y1], [x2, y2], ...]
                result = input;                
            }
            
            return result;
        }
        
                
        // Transform a polygon with format [{x:, y:}, {x:, y:}, ...]
        node.polygon_array_objects = function(input, direction) {
            var result = null;
      
            if (direction == TO_POLYGON) {
                if (!Array.isArray(input) || input.some(function(element) { return typeof element !== "object" || !element.hasOwnProperty("x") || !element.hasOwnProperty("y") })) {
                    throw "The source conversion requires an array of objects with 'x' and 'y' properties";
                }
                
                result = input.map(function (obj) { return [obj.x, obj.y] });
            }
            else {
                result = input.map(function (arr) { return { x: arr[0], y: arr[1]} });
            }
            
            return result;
        }

        // Transform a bbox with format [xTopLeft, yTopLeft, width, height]
        node.bbox_array_xTopLeft_yTopLeft_width_height = function(input, direction) {
            var result;
            
            if (direction == TO_POLYGON) {
                if (!Array.isArray(input) || input.length != 4 || input.some(isNaN)) {
                    throw "The source conversion requires an array of 4 integers";
                }
                
                var xTopLeft = input[0];
                var yTopLeft = input[1];
                var width    = input[2];
                var height   = input[3];

                var topLeft     = [xTopLeft        , yTopLeft];
                var topRight    = [xTopLeft + width, yTopLeft];
                var bottomLeft  = [xTopLeft        , yTopLeft + height];
                var bottomRight = [xTopLeft + width, yTopLeft + height];
                
                result = [topLeft, topRight, bottomRight, bottomLeft]; // clock-wise
            }
            else {
                if (input.length != 4) {
                    throw "The target conversion requires 4 points";
                }
                
                var extrema = getExtrema(input);
                
                var width  = extrema.right  - extrema.left;
                var height = extrema.bottom - extrema.top;

                result = [extrema.left, extrema.top, width, height];
            }
            
            return result;
        }
        
        // Transform a bbox with format [xTopLeft, yTopLeft, xBottomRight, xBottomRight]
        node.bbox_array_xTopLeft_yTopLeft_xBottomRight_yBottomRight = function(input, direction) {
            var result = null;
            
            if (direction == TO_POLYGON) {
                if (!Array.isArray(input) || input.length != 4 || input.some(isNaN)) {
                    throw "The source conversion requires an array of 4 integers";
                }
                
                var xTopLeft     = input[0];
                var yTopLeft     = input[1];
                var xBottomRight = input[2];
                var yBottomRight = input[3];

                var topLeft     = [xTopLeft    , yTopLeft];
                var topRight    = [xBottomRight, yTopLeft];
                var bottomLeft  = [xTopLeft    , yBottomRight];
                var bottomRight = [xBottomRight, yBottomRight];
                
                result = [topLeft, topRight, bottomRight, bottomLeft]; // clock-wise
            }
            else {
                if (input.length != 4) {
                    throw "The target conversion requires 4 points";
                }
                
                var extrema = getExtrema(input);

                result = [extrema.left, extrema.top, extrema.right, extrema.bottom];                
            }
            
            return result;
        }
        
        // Transform a bbox with format [xCenter, yCenter, width, height]
        node.bbox_array_xCenter_yCenter_width_height = function(input, direction) {
            var result = null;
            
            if (direction == TO_POLYGON) {
                if (!Array.isArray(input) || input.length != 4 || input.some(isNaN)) {
                    throw "The source conversion requires an array of 4 integers";
                }
                
                var xCenter = input[0];
                var yCenter = input[1];
                var width   = input[2];
                var height  = input[3];
                
                var topLeft     = [xCenter - Math.round(width/2), yCenter - Math.round(height/2)];
                var topRight    = [xCenter + Math.round(width/2), yCenter - Math.round(height/2)];
                var bottomLeft  = [xCenter - Math.round(width/2), yCenter + Math.round(height/2)];
                var bottomRight = [xCenter + Math.round(width/2), yCenter + Math.round(height/2)];
                
                result = [topLeft, topRight, bottomRight, bottomLeft];  // clock-wise
            }
            else {
                if (input.length != 4) {
                    throw "The target conversion requires 4 points";
                }
                
                var extrema = getExtrema(input);
                
                var width   = extrema.right  - extrema.left;
                var height  = extrema.bottom - extrema.top;
                var xCenter = extrema.left   + Math.round(width/2);
                var yCenter = extrema.top    + Math.round(height/2);

                result = [xCenter, yCenter, width, height];                
            }
            
            return result;
        }
        
        function transformObject(obj, nestedPropertyNames) {
            if (nestedPropertyNames.length === 0) {
                // We have reached the specified nested object, so time to transform the specified property
                var sourceProperty = obj[node.sourceProperty];
            
                if(sourceProperty) {
                    // Convert the source property value to a polygon (array of points)
                    var sourceAsPolygon = node[node.sourceType](sourceProperty, TO_POLYGON);
                    
                    // Convert the polygon to the specified target type
                    obj[node.targetProperty] = node[node.targetType](sourceAsPolygon, FROM_POLYGON);                
                }
                else {
                    if (Array.isArray(obj)) {
                        throw "Cannot find the specified source property '" + node.sourceProperty  + "' in the array (since no [..] has been specified)";
                    }
                    else {
                        throw "Cannot find the specified source property '" + node.sourceProperty  + "' in the specified object";
                    }
                }
            }
            else {
                // We have not reached the specified nested object yet, so let's go downwards in the nested hierarchy
                var nestedPropertyName = nestedPropertyNames.shift().trim();

                var isArray = Array.isArray(obj);

                if(isArray) {
                    if(!nestedPropertyName.startsWith("[") || !nestedPropertyName.endsWith("]")) {
                        throw "Missing brackets for array";
                    }
                    
                    // Remove the square brackets
                    nestedPropertyName = nestedPropertyName.slice(1,-1).trim();
                    
                    if(nestedPropertyName === "") {
                        // Expression "[]" means: recursively call this function for every element of the array
                        for (var j = 0; j < obj.length; j++) {
                            transformObject(obj[j], nestedPropertyNames);
                        }
                    }
                    else {
                        var index = parseInt(nestedPropertyName);
                        
                        if(Number.isInteger(index)) {
                            if (index > obj.length) {
                                throw "The specified array index exceeds the array length";                     
                            }
                            
                            // Expression "[2]" means: recursively call this function only for the second element of the array
                            transformObject(obj[index], nestedPropertyNames);                       
                        }
                        else {
                            throw "Specify an integer number between the brackets";
                        }
                    }
                }
                else {
                    // An object, so let's go downwards in the hierarchy
                    if(!obj.hasOwnProperty(nestedPropertyName)) {
                        throw "The nested property '" + nestedPropertyName + "' does not exist";
                    }
            
                    // Get the specified property from the object
                    obj = obj[nestedPropertyName];
            
                    // Go down in the hierarchy
                    transformObject(obj, nestedPropertyNames);
                }
            }
        }

        node.on("input", function(msg) {
            // Support (multi-dimensional) arrays
            var objectPath = node.nestedObject.trim().replace("[", ".[");
            
            var nestedPropertyNames = objectPath.split(".");
            
            try {
                transformObject(msg, nestedPropertyNames);
            }
            catch(err) {
                node.error("Transformation failed: " + err, msg);
                
                // Don't send incomplete transformed messages to the output
                return;
            }
            
            // Send the transformed input message
            node.send(msg);
        });
    }

    RED.nodes.registerType("polygon-transform", PolygonTransformNode);
}