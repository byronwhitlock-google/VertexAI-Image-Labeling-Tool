"use strict";
const Dumper = require('dumper').dumper;
const CloudStorage = require('./cloud-storage.js');
const path = require("path")

module.exports = class LabelImporter {
    /**
     * @param {Object} options
     */
    constructor(options) {
        console.log(options)
        this.gcsSrc = new CloudStorage(options);            
        this.gcsDest = new CloudStorage(options);    
        
    }

    /**
     * @param {{importUrl: string;copyImages?: boolean;overwriteLabels?: boolean;overwriteImages?: boolean;}} importOptions
     * @param {{ (progress: string): void; }} progressCallback
     * 
     * 
        Import Label Format

        {
        "prediction_regex_phash": {
            "gs://docai_predictions_dev/Batch/converted_images/Converted_files-2021-11-03_102007/56849419_85222772_98512.png": {
                "label": "00639_x",
                "group": null,
                "confidence_score": 0.7
                },
            "gs://docai_predictions_dev/Batch/converted_images/Converted_files-2021-11-03_102007/56849384_85222731_98512.png": {
                "label": "group_2",
                "group": null,
                "confidence_score": 0.3
                }
        }
        }
     */
    async import(importOptions,progressCallback) {
       
       progressCallback("Initializing ");
       //progressCallback(Buffer.allocUnsafe(1024).toString('base64'))
       //progressCallback("Should have used websockets...");
       //progressCallback("Initializing Complete");

       var overwriteLabels = importOptions.overwriteLabels
       var overwriteImages = importOptions.overwriteImages
       var copyImages = importOptions.copyImages
       var importUrl = new URL(importOptions.importUrl)
       
       var bucketName = importUrl.hostname
       var importPathSrc = importUrl.pathname
       var importFilename = path.basename(importPathSrc)
       
       // hack the gcs provider. bad form.
       this.gcsSrc.bucket =  this.gcsSrc.storage.bucket(bucketName);       
       progressCallback("Importing " +importOptions.importUrl)
       try {
           var importDoc = await this.gcsSrc.readJsonDocument(importPathSrc)
       
           for(var pType in importDoc) { // ignore first key
               for(var gcsUrl in importDoc[pType]) { 
                   var label = ""
                   var score = 0.0

                   for(var k in importDoc[pType][gcsUrl]) { 
                       if (k.toLowerCase() == 'label') {
                            label = importDoc[pType][gcsUrl][k]                           
                       } else 
                       if (k.toLowerCase() == 'confidence_score') {
                            score = importDoc[pType][gcsUrl][k]
                           
                       }
                   }

                    var destPath = new URL(gcsUrl).pathname
                    var destFilename = path.basename(destPath)
                    if (copyImages) {
                        progressCallback("Copying " +gcsUrl)
                        // now copy gcsUrl over into the current bucket
                        var data = await this.gcsSrc.readDocument(destPath)
                        this.gcsDest.writeDocument(destFilename,data)
                    }

                    progressCallback("Adding Label " +gcsUrl)
                    if (label)
                        this.gcsDest.setMetadata(destFilename, 'labelName',label )       
                    if (score)
                        this.gcsDest.setMetadata(destFilename, 'score', score.toString() )       

                }
           }
        } catch ( e){
            throw new Error ("Invalid Import URL. ", e.message)
        }
       
       // read the file 
       return true
    }

   
}