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

// THis library uses service account auth and does not authenticate the caller!
// potential security risk.
"use strict";
const Dumper = require('dumper').dumper;
const {Storage} = require('@google-cloud/storage');
//https://googleapis.dev/nodejs/storage/latest/index.html
module.exports = class CloudStorage {
    /**
   * @param {{ [x: string]: any; accessToken?: any; projectId: any; locationId?: any; bucketName: any; }} options
   */
    constructor(options) {

    this.projectId = options.projectId
    this.bucketName = options.bucketName
    this.storage = new Storage({projectId: this.projectId})
    this.bucket = this.storage.bucket(this.bucketName);

//    if (!options['projectId'])
//      throw new Error("Missing projectId in CloudStorage constructor.")

    if (!options['bucketName'])
      throw new Error("Missing bucketName in CloudStorage constructor.")

  }
  /**
   * @param {string} documentName
   */
  async readJsonDocument(documentName) {
    var res = await this.readDocument(documentName) 
    var json = {}
    try {
      json = JSON.parse(res);
    } 
    catch (e) 
    {
      console.error(res)
      throw new Error(e)
    }
    
    //console.log(res);
    if (json.hasOwnProperty('error'))
      throw new Error(json.error.message)
    
    return json;
  }

  /**
   * @param {string} documentName
   */
  async readJsonLDocument(documentName) {
    var res = await this.readDocument(documentName) 

    var lines = res.split("\n")
    var jsonl = []
    for(var i =0;i<lines.length;i++) {      
      //console.log(`About to push ${lines[i]}`)
      try {
        
        jsonl.push(JSON.parse(lines[i]));
      } 
      catch (e) 
      {
       // console.error(res)
        throw new Error("Failed Parsing JSONL document:" +  e.message )
      }
    }
       
    return jsonl;
  }

  // read from cloud storage syncronously.
  /**
   * @param {string} documentName
   */
  async readDocument(documentName,metadataOnly=false)  {
    let buffer = "";
    try {
      // Return file contents    
      let file = await this.bucket.file(documentName)
      let contents = await file.download();
      console.log('got file contents')
      //Dumper(contents)
      return contents.toString();
    } catch (err) {
        let errorMessage = "Cannot read cloud storage object: " + err.message
        console.error(errorMessage)
        throw new Error(errorMessage)
      }
  }

  /**
   * @param {any} documentName
   */
  async downloadImage(documentName){
    try {
      // this.storageHandler is the Storage variable created with new Storage();
      let file = await this.bucket.file(documentName)
      let contents = await file.download();
      return contents[0];
    } catch (err) {
      let errorMessage = "Cannot downloadImage() from cloud. object: " + err.message
      console.error(errorMessage)
      throw new Error(errorMessage)
    }
  }



  /**
   * @param {string} documentName
   * @param {any} contents
   */
  async writeDocument(documentName, contents) {
    let file = this.bucket.file(documentName)
    let stream = file.createWriteStream();

    stream.write(contents)
    return stream.end()
    
  }
  
  // read from cloud storage syncronously.
  async listDocuments(suffix=".png",parentDirectory="", includelabelNameMetaData=true)   {
    console.log(`About to list documents: ${suffix} ${parentDirectory}`)
    // Lists files in the bucket
    let [files] = await this.bucket.getFiles({
        directory:parentDirectory,
        autoPaginate:true,
        delimiter: '/'
    });
    let documentList = []
    
    console.log(`${parentDirectory} Files: ${files.length}`);
    for (var i=0;i<files.length;i++) {
      let file = files[i]    
      let filename = file.metadata.name.substr(parentDirectory.length)

      //console.log(file.metadata.name)  
      if (filename.endsWith(suffix)) {     
        let toPush = filename
        if (includelabelNameMetaData){
          toPush = {filename:filename, labelName: file.metadata.metadata ? file.metadata.metadata['labelName']:undefined}
        }
        documentList.push(toPush);
      }
    }
    return documentList
  }

  /**
   * @param {string} filename
   * @param {string} key
   * @param {string} value
   */
  async setMetadata(filename, key, value){

      if (key == "None") {
          key = ""
      }

      
      return this.bucket.file(filename).setMetadata({metadata: {[key]: value}})
  }

  /**
   * @param {string} documentName
   */
  async fileExists(documentName)
  {
    let file = await this.bucket.file(documentName);
    let res = await file.exists();
    //console.log(res)
    return res[0];
  }

  /**
   * @param {string} documentName
   */
  async delete(documentName) { 
    let file = await this.bucket.file(documentName);
    return await file.delete()
  }

    /**
   * @param {string} prefix
   */
  async deleteMany(prefix) { 
    return await this.bucket.deleteFiles({ prefix: prefix })
  }
}
