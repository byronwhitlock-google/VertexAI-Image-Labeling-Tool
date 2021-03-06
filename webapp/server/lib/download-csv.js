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
const CloudStorage = require('lib/cloud-storage.js');

module.exports = class DownloadCsv {
  constructor(options) {
    this.gcs = new CloudStorage(options);   
    this.options=options
    console.log(options)
  }

  async download()
  {
    var csv = []

    var docs = await this.gcs.listDocuments();

    for (var i = 0;i<docs.length;i++)
    {
      var labelName = docs[i].labelName 
      if (labelName && labelName != "None" ) {
        csv.push(`,gs://${this.gcs.bucketName}/${docs[i].filename},${labelName}`);
      }
    }

    if (csv.length <1)
    {
      throw new Error("No Labeled Documents Found")
    }
    return csv.join("\n")
  }

  
  async persist(name)
  {
    var numRecords = 0
    var toReturn   =[]
    
    var csvData = await this.download()    
    numRecords = csvData.split(/\r\n|\r|\n/).length

    console.log("About to persist main csv data to "+name)
    console.log(csvData)
    toReturn.push({"label":name, "path": `${this.options.bucketName}/${name}`, "numRecords":numRecords})
    
    await this.gcs.writeDocument(name,csvData)
      
    return toReturn
  }
  
}
