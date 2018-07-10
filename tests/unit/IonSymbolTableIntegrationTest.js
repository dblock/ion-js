/*
 * Copyright 2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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
define([
        'intern',
        'intern!object',
        'intern/chai!assert',
        'dist/amd/es6/IonTests',
    ],
    function(intern, registerSuite, assert, ion) {

        var suite = {
            name: 'Symbol Table Integration'
        };

        suite['Open writer with imports.'] = function() {
            let testTable = new ion.SharedSymbolTable('test', 1, ['hello', 'world']);
            let catalog = new ion.Catalog();
            catalog.addSymbolTable(testTable);
            let reader = new ion.makeReader("{ $10 : $11 }", {catalog, text});
            let writer = new ion.makeTextWriter();
        }

        suite['Append LocalSymbolTable context on flush/close.'] = function() {

        }

        suite['Shared symbol table can belong to multiple catalogs.'] = function() {

        }

        suite['Ambiguous imports fail on read.'] = function() {

        }

        suite['Text writing known symbol from SID resolves text.'] = function() {

        }

        suite['Text writing symbol with unknown text as sid from import writes identifier and forces symbol table.'] = function() {

        }

        suite['Throw error if user attempts to manually write a symbol table.'] = function() {

        }

        suite['Writer constructed with import list includes those imports with every new LST context.'] = function() {

        }

        suite['Flushing, finishing, or closing a writer below top level fails.'] = function() {

        }

        suite['Loading a symbol table without correct ordering of annotations fails.'] = function() {

        }

        suite['Out of range fieldname SID fails.'] = function() {

        }

        suite['Writer accepts imports after construction.'] = function() {

        }
        suite['Adding import below top level fails.'] = function() {

        }

        suite['Add imports skips duplicate imports.'] = function() {

        }

        suite['Add imported tables forces finish when  necessary.'] = function() {

        }

        suite['Addi import tables fails '] = function() {

        }

        suite[''] = function() {

        }

        registerSuite(suite);
    }
);