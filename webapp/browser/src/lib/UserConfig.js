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

class UserConfig {
    // This only changes per server installation!
  clientId =  '976239279537-uo7h85trcol8nl5shb0k9ai7iufbs2ta.apps.googleusercontent.com';

  constructor(){

    this.bucketName = localStorage.getItem("bucketName")|| ""
    this.projectId = localStorage.getItem("projectId") || ""    
    this.thumbnailWidth = localStorage.getItem("thumbnailWidth") || "300"   

    this.locationCsv = localStorage.getItem("locationCsv")|| ""
    this.locationImport = localStorage.getItem("locationImport")|| ""
  }
  
  persist() {
    localStorage.setItem("bucketName",this.bucketName)
    localStorage.setItem("projectId",this.projectId)
    localStorage.setItem("thumbnailWidth",this.thumbnailWidth)

    localStorage.setItem("locationCsv",this.locationCsv)
    localStorage.setItem("locationImport",this.locationImport)

    
  }


}
export default UserConfig



