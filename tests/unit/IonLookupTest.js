/*
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at:
 *
 *     http://aws.amazon.com/apache2.0/
 *
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 */

define(
  function(require) {
      const registerSuite = require('intern!object');
      const assert = require('intern/chai!assert');
      const ion = require('dist/amd/es6/Ion');

      var suite = {
          name: 'Lookup'
      };

      function readerToBytes(reader) {
        var writer = ion.makeTextWriter();
        writer.writeValues(reader);
        writer.close();
        return writer.getBytes();        
      }

      function bytesToString(bytes) {
        var t = '';
        for (var c of bytes) {
          t = t + String.fromCharCode(c);
        }    
        return t;
      }

      function readerToString(reader) {
        return bytesToString(readerToBytes(reader));
      }

      function recursivePathLookup(reader, path) {
        if (path.length === 0) {
          // If the path's length is 0, the current reader node is the value which should be returned.
    
          if (reader._type === ion.IonTypes.LIST) {
            var list = [];
            reader.stepIn(); // Step into the list.
    
            while (reader.next() !== null) {
              var itemInList = recursivePathLookup(reader, []);
              list.push(itemInList);
            }
            
            return list;
          } else if (reader._type === ion.IonTypes.STRUCT) {
            var structToReturn = {};
    
            var type;
            const currentDepth = reader.depth();
            reader.stepIn();
            while (reader.depth() > currentDepth) {
              // In order to get all values within the struct, we need to visit every node.
              if (reader.next() !== null) {
                structToReturn[reader.fieldName()] = recursivePathLookup(reader, []);
              } else {
                // End of the container indicates that we need to step out.
                reader.stepOut();
              }
            }
            return structToReturn;
          } else if (reader._type === ion.IonTypes.DECIMAL) {
            // Decimal needs to be special-cased because IonJS returns an IonDecimal, which needs to be converted to a JavaScript BigDecimal (3rd party library).
            return new BigDecimal(reader.value().numberValue());
          } else if (reader._type === ion.IonTypes.INT) {
            // Integer is special-cased in order to avoid confusion for developers. These Ion utilities do not allow the use of JavaScript numbers. Instead, they
            // use BigInteger and BigDecimal in order to be type-safe.
            return new BigInteger(reader.value());
          } else if (reader._type === ion.IonTypes.TIMESTAMP) {
            // Timestamp needs to be special-cased because IonJS returns an IonTimestamp.
            return new Date(reader.value().stringValue());
          } else if (reader._type === ion.IonTypes.NULL) {
            return null;
          } else {
            return reader.value();
          }
        } else if (path.length === 1) {
          // If the path's length is 1, the single value in the path list is the field should to be returned.
          while (reader.next() !== undefined) {
            if (reader.fieldName() === path[0]) {
              path.shift(); // Remove the path node which we just entered.
              return recursivePathLookup(reader, path);
            }
          }
        } else {
          // If the path's length >= 2, the Ion tree needs to be traversed more to find the value we're looking for.
          while (reader.next() !== undefined) {
            if (reader.fieldName() === path[0]) {
              reader.stepIn(); // Step into the IonStruct.
              path.shift(); // Remove the path node which we just entered.
              return recursivePathLookup(reader, path);
            }
          }
        }
        // If the path doesn't exist, return undefined.
        return undefined;
      }

      suite['Lookup a value'] = function() {
        var data = '{ key: "value" }';
        var reader = ion.makeReader(data);
        reader.next();
        reader.stepIn();
        const value = recursivePathLookup(reader, ['key']);
        assert.equal(value, 'value');
      };

      suite['Lookup a deep path'] = function() {
        var data = '{layer1:{layer2:{layer3:{layer4:{}}}}}';
        var reader = ion.makeReader(data);
        reader.next();
        reader.stepIn();
        const value = recursivePathLookup(reader, ['layer1', 'layer2', 'layer3']);
        assert.deepEqual(value, { layer4: {} });
      };

      suite['Lookup a list'] = function() {
        var data = '{ key1: { key2: [ "value" ] }}';
        var reader = ion.makeReader(data);
        reader.next();
        reader.stepIn();
        const value = recursivePathLookup(reader, ['key1', 'key2']);
        assert.deepEqual(value, [ 'value' ]);
      };

      suite['Lookup a list of lists'] = function() {
        var data = '{ key1: { key2: [[ "value" ]] }}';
        var reader = ion.makeReader(data);
        reader.next();
        reader.stepIn();
        const value = recursivePathLookup(reader, ['key1', 'key2']);
        assert.deepEqual(value, [[ 'value' ]]);
      };

      registerSuite(suite);
  }
);
