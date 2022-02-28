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

// @ts-ignore
require('app-module-path').addPath(__dirname);
// @ts-ignore
const Dumper = require('dumper').dumper;
const CloudStorage = require('./lib/cloud-storage')

const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 5000;

const DownloadCsv = require('./lib/download-csv');
const AppConfig = require('./lib/app-config');
const LabelImporter = require('./lib/label-importer')
const BodyParser = require('body-parser');
const Axios = require('axios');

app.use(BodyParser.json());

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

async function get_header_options(req) {
    
  // Dumper(json)
    let options =  {
        //accessToken: req.header("X-Bearer-Token"),
        projectId: req.header("X-Project-Id"),
        locationId:req.header("X-Location-Id"),
        bucketName: req.header("X-Bucket-Name") ,
    };
    //Dumper(options)
    return options
}

app.get('/get_labels', async (req, res) => {

    try {
        var options = await get_header_options(req)
        //console.log("trying to list docs")
        //console.log(options)

        var gcs = new CloudStorage(options);    

        var docs = await gcs.listDocuments('.png','',true);
        
        var appConfig = new AppConfig(options)
        var appConfigData = await appConfig.getConfig()
        var userLabels = appConfigData.labels;

        var labelData = Object()
        //populate our user labels
        for(var i =0;i<userLabels.length;i++) {
            if (userLabels[i]) {
                labelData[userLabels[i]] = 0
            }
        }

        //Dumper(docs)
        // merge labels and text so we know what is labeled
        for(var i=0 ; i<docs.length ; i++) {
            
            let labelName = docs[i].labelName

            if (! labelName ) {
                labelName = "None"
            }
            if (!labelData.hasOwnProperty(labelName)) {
                labelData[labelName]=0
            }
            labelData[labelName]++                                
        }
        //Dumper(labelData)
        
        res.send({'data': labelData});
    } catch (e) {
     //   Dumper(e)
        console.error(`${e.message} ${e.stack}`)
        res.send({'error': e.message, 'trace':e.stack });
    }
    
 })


app.post('/set_label', async (req, res) => {
    try {        
   
        var options = await  get_header_options(req);
        console.log("trying to set_label");
        Dumper(req.body);

        var q = req.body
        var gcs = new CloudStorage(options);   
        
        await gcs.setMetadata(q.filename, 'labelName',q.labelName )        
        res.send({'data': 1}); // no errors? then we return the configuration we just saved.
    } catch (e) {
      //  Dumper(e);
      console.error(`${e.message} ${e.stack}`)
        res.send({'error': e.message, 'trace':e.stack });
    }
});


app.post('/add_label', async (req, res) => {
    try {        
   
        var options = await  get_header_options(req);
        //console.log("trying to add_label");
        Dumper(req.body);

        var q = req.body
        var appConfig = new AppConfig(options);   
        var config = await appConfig.getConfig()

        if (! config.labels.includes(q.labelName)) {
            config.labels.push(q.labelName)
        }

        if (q.labelName == "None") {
            throw new Error("Cannot add label named 'None'")
        }
        await appConfig.saveConfig(config)
        
        res.send({'data': 1}); // no errors? then we return the configuration we just saved.
    } catch (e) {
      //  Dumper(e);
      console.error(`${e.message} ${e.stack}`)
        res.send({'error': e.message, 'trace':e.stack });
    }
});



app.post('/remove_label', async (req, res) => {
    try {        
   
        var options = await  get_header_options(req);
        //console.log("trying to remove_label");
        Dumper(req.body);
        
        var q = req.body
        var appConfig = new AppConfig(options);   
        var config = await appConfig.getConfig()
        
        var labelsOut = []
        for(var i=0;i<config.labels.length;i++) {
            if (config.labels[i] != q.labelName) {
                labelsOut.push(config.labels[i])
            }
        }
        if (q.labelName == "None") {
            throw new Error("Cannot add label named 'None'")
        }
        if (labelsOut) {
            config.labels = labelsOut
            await appConfig.saveConfig(config)
        } 
        res.send({'data': 1}); // no errors? then we return the configuration we just saved.
            
    } catch (e) {
      //  Dumper(e);
      console.error(`${e.message} ${e.stack}`)
        res.send({'error': e.message, 'trace':e.stack });
    }
});

app.get('/image', async (req, res) => {
    try {
        //var options = await get_header_options(req)
        //console.log("trying to list docs")
        //console.log(options)

        let options =  {
            //accessToken: req.header("X-Bearer-Token"),
            projectId: "n/a",
            locationId: "n/a",
            bucketName: req.query.b,
        };
       // Dumper(options)
        var gcs = new CloudStorage(options);    

        var data = await gcs.downloadImage(req.query.filename);
        res.set('Content-Type', 'image/png')        
        res.set('Cache-Control', 'max-age=86400') // 24 hour expiry        
        res.send(data);
    } catch (e) {
     //   Dumper(e)
        console.error(`${e.message} ${e.stack}`)
        res.send({'error': e.message, 'trace':e.stack });
    }
});


app.get('/list_documents', async (req, res) => {
    
    
    
    try {
        
        var options = await get_header_options(req)
        //console.log("trying to list docs")
        //console.log(options)
        var c=0;
        var gcs = new CloudStorage(options);    

        var docs = await gcs.listDocuments();

        res.send({'data': docs});
    } catch (e) {
     //   Dumper(e)
        console.error(`${e.message} ${e.stack}`)
        res.send({'error': e.message, 'trace':e.stack });
    }
});


app.get('/import_labels', async (req, res) => {    
    try {
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Transfer-Encoding': 'chunked'
        });

        var options = await  get_header_options(req);
        var overwriteLabels = true;
        var overwriteImages = true; // if copyImages is true, overwrite images on import?
        var importUrl = req.query.importUrl; // must be GCS url
        var copyImages = req.query.copyImages // also cop
        var li = new LabelImporter(options);   


        // 9import labels
        var results = await li.import({
            importUrl,
            copyImages
        }, (/** @type {string} */ progress) => {
                res.write(progress + "\n")
                console.log(progress)
            }        
        );        
        
        res.write("Import Complete" + "\n");   
        res.end();     
    } catch (e) {
     //   Dumper(e);
     console.error(`${e.message} ${e.stack}`)
        res.write("Import Failed-- " +e.message+ "\n");   
        res.end();  
    }
});

app.get('/generate_csv', async (req, res) => {    
    try {
        var options = await  get_header_options(req);
        var csv = new DownloadCsv(options);   

        // persist downloads and saves to bucket
        var results = await csv.persist("training.csv");        
        var data = {'data': results}


        // todo: Call cloud function with csv

        console.log (data);
        res.send(data);
        
    } catch (e) {
     //   Dumper(e);
     console.error(`${e.message} ${e.stack}`)
        res.send({'error': e.message, 'trace':e.stack });
    }
});

app.get('/get_config', async (req, res) => {
    try {
        var options = await get_header_options(req)
        //console.log("trying to list docs")
        //console.log(options)
        await sleep(500)
        var appConfig = new AppConfig(options)
        var data = await appConfig.getConfig()
        res.send({'data': data});
    } catch (e) {
     //   Dumper(e)
        console.error(`${e.message} ${e.stack}`)
        res.send({'error': e.message, 'trace':e.stack });
    }   
});

app.post('/save_config', async (req, res) => {
    try {        
   
        var options = await  get_header_options(req);
        console.log("trying to save_config");
        console.log(req.body);

        var appConfig = new AppConfig(options);
        await appConfig.saveConfig(req.body);
        res.send({'data': req.body}); // no errors? then we return the configuration we just saved.
    } catch (e) {
      //  Dumper(e);
      console.error(`${e.message} ${e.stack}`)
        res.send({'error': e.message, 'trace':e.stack });
    }
});



/**
 * @param {number} ms
 */
function sleep(ms) {
    return //new Promise(resolve => setTimeout(resolve, ms));
}

// production endpoint served from here
app.use(express.static(path.join(__dirname, '../browser/build')));
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../browser/build', 'index.html'));
});


