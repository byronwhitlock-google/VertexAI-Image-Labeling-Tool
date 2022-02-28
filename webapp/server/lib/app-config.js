/*
# Copyright 2020 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#            http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
*/
"use strict";
const Dumper = require('dumper').dumper;
const CloudStorage = require('./cloud-storage.js');

module.exports = class AppConfig {
    CONFIG_FILENAME="config.json"

    /**
   * @param {{ [x: string]: any; accessToken?: any; projectId: any; locationId?: any; bucketName: any; }} options
   */
    constructor(options) {
        this.gcs = new CloudStorage(options);   
       // console.log(options)
    }

    async getConfig()
    {
        console.log(`Getting ${this.CONFIG_FILENAME}`)
        if (await this.gcs.fileExists(this.CONFIG_FILENAME)) {
            console.log("Found config")
            var data = await this.gcs.readDocument(this.CONFIG_FILENAME);
            try {
                var jsonData = JSON.parse(data)
            } catch (e) {
                Dumper(jsonData)
                console.log("Parse error, cannot parse config file. getting default")
                return this.defaultConfig
            }
            //Dumper(jsonData)
            
            return jsonData
        } else {
            console.log("Not found, returning default config")
            return this.defaultConfig
        }
    }


    /**
     * @param {any} configIn
     */
    async saveConfig(configIn)
    {   
        /**
         * @param {any} obj
         */
        function isString (obj) {return (Object.prototype.toString.call(obj) === '[object String]');}
        var config = configIn

        if (isString(configIn)) {
            config = JSON.parse(configIn)
        }

        //TODO: implement json validation! for now do it really dirty and nasty
        if (config.hasOwnProperty('labels'))
        {
            return this.gcs.writeDocument(this.CONFIG_FILENAME,JSON.stringify(config))                    
        }

        console.error("Invalid Config. ")
        Dumper(config)
        throw new Error("Cannot Save. Invalid Config")        
    }    

    defaultConfig = {
        labels : []
    }
}