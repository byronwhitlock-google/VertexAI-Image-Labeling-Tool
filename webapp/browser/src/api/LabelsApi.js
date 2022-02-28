import BaseApi from './BaseApi.js';
import Axios from "axios";

class LabelsApi extends BaseApi {
    constructor(accessToken) {
        super(accessToken);
        //this.loadConfig()        
    }

    async getLabels() {
        try {
            console.log("Geting Labels");
            var res = await this.fetch("/get_labels");
            console.log(res);
            return res
        } catch (err) {
            if (err.message == "Not Found")
                throw new Error(`Bucket Not Found: ${this.config.bucketName}. ${err.message}`);

            else
                throw err;
        }
    }
    async setLabel(labelName, documentName) {
        try {
            let toPost = {labelName:labelName, filename:documentName}
            console.log(toPost)
            console.log(`Saving  label ${labelName} on document ${documentName}`);
            var res = await this.post("/set_label", toPost);
            console.log(res);
            return res
        } catch (err) {
            if (err.message == "Not Found")
                throw new Error(`Bucket Not Found: ${this.config.bucketName}. ${err.message}`);

            else
                throw err;
        }
    }
    async addLabel(labelName) {
        try {
            let toPost = {labelName:labelName}
            console.log(toPost)
            console.log(`Adding label ${labelName}`);
            var res = await this.post("/add_label", toPost);
            console.log(res);
            return res
        } catch (err) {
            if (err.message == "Not Found")
                throw new Error(`Bucket Not Found: ${this.config.bucketName}. ${err.message}`);

            else
                throw err;
        }
    }
    async removeLabel(labelName) {
        try {
            let toPost = {labelName:labelName}
            console.log(toPost)
            console.log(`Removing  label ${labelName} `);
            var res = await this.post("/remove_label", toPost);
            console.log(res);
            return res
        } catch (err) {
            if (err.message == "Not Found")
                throw new Error(`Bucket Not Found: ${this.config.bucketName}. ${err.message}`);

            else
                throw err;
        }
    }

        // this one is alittle different, we want to get progress from the backend so we do something special.
        async importLabels(labelPath,progressCallback)  {
        var url = `/import_labels?labelPath=${labelPath}`
        return Axios({
            url: url,
            method: 'GET',
            headers: this.getHeaders(),
            onDownloadProgress: progressEvent => {
            const dataChunk = progressEvent.currentTarget.response;
                // dataChunk contains the data that have been obtained so far (the whole data so far).. 
                
                //console.log(dataChunk)
                
                // grab last row of progress.
                var dataChunks = dataChunk.trim("\n").split("\n")
                //console.log(dataChunks)
                if (dataChunks) {
                    var currentChunk = dataChunks[dataChunks.length-1]
                    progressCallback( currentChunk )
                    console.log(currentChunk)
                }
                
            }


        })

    }
}

export default LabelsApi