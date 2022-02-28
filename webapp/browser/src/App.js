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
import React, { Component } from "react";
import "./App.css";
import AppHeader from "./AppHeader.js";
import UserConfig from "./lib/UserConfig.js";

import ModalPopup from "./ModalPopup.js";
import LabelsApi from "./api/LabelsApi.js";
import DocumentListApi from "./api/DocumentListApi.js";
import GenerateCsvApi from "./api/GenerateCsvApi.js";

//Sidebar Components
import Sidebar from "./Sidebar.js";
import { withRouter } from "react-router-dom";
import { Divider, Grid, Typography, Box } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import List from "@material-ui/core/ListItemText";

//Grid View of the document list
import DocumentView from "./DocumentView.js";

//Search Bar Component
import SearchBar from "material-ui-search-bar";

//TabPanel function for adding tabs
import { TabPanel } from "./TabularView.js";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";

//Transition for tabs
import SwipeableViews from "react-swipeable-views";

//Tab icons
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import LaptopMacIcon from "@material-ui/icons//LaptopMac";
import EqualizerIcon from "@material-ui/icons/Equalizer";

import TrainingView from "./TrainingView";



class App extends Component {
  state = {

    selectedKeys: [],
    selectedLabel: "None",
    selectedModelHash: null,
    filter: "",
    documentList: [],
    autoMLModelList: [],
    autoMLPrediction: false,
    tabValue: 0,
    error: {
      title: null,
      content: null,
      isOpen: false,
    },
    alert: {
      title: null,
      content: null,
      isOpen: false,
    },
    labels: [], // {f_1232:23,f_1232:1,f_1232:15} // associative array key is labelname, count is value
    labelsFiltered: [],
    documentListFiltered:[],

    // used during import process only
    labelsImported: ""
  };

  // TODO: Refactor all API calls to another library
  // TODO: Switch to using context for access token instead of state
  constructor(props, context) {
    super(props, context);
    // This binding is necessary to make `this` work in the callback
    this.refreshDocumentList = this.refreshDocumentList.bind(this);
    //this.handleDocumentUpdate = this.handleDocumentUpdate.bind(this);
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
    this.handleErrorClose = this.handleErrorClose.bind(this);

    this.handleApplyLabelToDocument = this.handleApplyLabelToDocument.bind(this);
    this.handleApplyLabelToMulitpleDocuments = this.handleApplyLabelToMulitpleDocuments.bind(this);

    
    this.refreshLabels = this.refreshLabels.bind(this);
    this.handleLabelSelected = this.handleLabelSelected.bind(this);

    this.handleLabelAdded = this.handleLabelAdded.bind(this);

    this.handleLabelRemoved = this.handleLabelRemoved.bind(this);

    //this.loadCsv = this.loadCsv.bind(this)
    this.generateCsv = this.generateCsv.bind(this);
    this.handleImportLabels = this.handleImportLabels.bind(this);
    
    this.setError = this.setError.bind(this);
    this.setAlert = this.setAlert.bind(this);
    // this.refreshAutoMLModelList = this.refreshAutoMLModelList.bind(this)
    // set selected document from the url string
    this.state.selectedDocument = window.location.pathname.replace(/^\/+/g, "");
    this.config = new UserConfig();


    this.handleChangeLabel=this.handleChangeLabel.bind(this)

  }

  // this is evil but i don't fully understand react cest la vie
  forceUpdateHandler() {
    // I think i understand react now! key property is needed  for re renders to happend based on updated (props) properties :)
    // this.forceUpdate();
  }


  async componentDidMount() {
    // Call our fetch function below once the component mounts

    
    await this.refreshLabels();
    await this.refreshDocumentList();
    await this.handleChangeLabel();
    
  }


  setError(text, title = "Error") {
    var error = this.state.error;
    error.title = title;
    error.content = text;
    error.isOpen = true;
    this.setState({ ...this.state, error });
  }

  setAlert(text, title = "Alert") {
    var alert = this.state.alert;
    alert.title = title;
    alert.content = text;
    alert.isOpen = true;
    this.setState({ ...this.state, alert });
  }

  // also closes alert box
  handleErrorClose() {
    let error = this.state.error;
    error.isOpen = false;

    let alert = this.state.alert;
    alert.isOpen = false;

    this.setState({ ...this.state, alert, error });
  }
  // refresh app 
  async refreshAll() {
    
      this.refreshDocumentList()
      this.refreshLabels()
      this.handleChangeLabel()
    
  }

  async refreshLabels() {
    try {
      var lApi = new LabelsApi();
      var labels = await lApi.getLabels();
      return this.setState({ labels: labels });
    } catch (err) {
      this.setError("Could Not refresh Labels", err.message);
    }
  }

  async handleApplyLabelToMulitpleDocuments(selectedDocumentIndexes, labelName) {
    // do a quick refresh of the state first.
    var documentList = this.state.documentList
    
    for (let idx in selectedDocumentIndexes) {
      let doc = this.state.documentListFiltered[idx];
      this.handleApplyLabelToDocument(labelName, doc.filename)
    }    
  }
  
  async handleApplyLabelToDocument(labelName, filename) {
    var lApi = new LabelsApi();
    lApi.setLabel(labelName, filename);
    var prevLabelName = ""

    // do a quick refresh of the state first.
    var documentList = this.state.documentList
    for (var idx in documentList) {

      if (documentList[idx].filename == filename) {
        prevLabelName = documentList[idx].labelName
        documentList[idx].labelName=labelName
        break;
      }
    }

    // also quick refresh the label counts
    // so decrement prevLabelName, and increment labelName
    var labels = this.state.labels


    for (var currentLabel in this.state.labels) {
      if (currentLabel == prevLabelName) {
        labels[currentLabel]--
      }
      if (currentLabel == labelName) {
        labels[currentLabel]++
      }
    }


    await this.setState({documentList: documentList, labels:labels})

    // update document list filtered
    await this.handleChangeLabel()

    // we don't need to do this but maybe it should run async?
    // return this.refreshAll()
  }

  async handleLabelSelected(labelName) {
   await this.setState({ selectedLabel: labelName });
   await this.handleChangeLabel()
  }

 
  async handleLabelRemoved(labelName) {
    var lApi = new LabelsApi();

    await lApi.removeLabel(labelName);
    await this.refreshLabels();
  }

  async handleLabelAdded(labelName) {
    try {
      var lApi = new LabelsApi();
      await lApi.addLabel(labelName);
      await this.refreshLabels();
    } catch (err) {
      this.setError("Could Not Add Label " + labelName, err.message);
    }
  }
  // ====== Import labels =====
  async handleImportLabels(labelPath) {
    this.setState({labelsImported: "Initializing..."})
    var labelsApi = new LabelsApi(this.state.accessToken);
    if (!this.canLoadDocumentList()) {
      console.log(
        "Missing bucket, or no selected document. Not calling importLabels ."
      );
      return;
    }
    try {

      if (! labelPath ) { throw new Error("Missing Label Path")}
      labelsApi.importLabels(labelPath, (progress)=>{
          this.setState({labelsImported: progress})        
      });
      
      return this.refreshAll()

    } catch (err) {
      this.setError(err.message, "Could not Import Labels");
    }
  }

  // ====== Generate CSV =====
  async generateCsv() {
    var csvApi = new GenerateCsvApi(this.state.accessToken);
    if (!this.canLoadDocumentList()) {
      console.log(
        "Missing bucket, or no selected document. Not calling generateCsv ."
      );
      return;
    }
    try {
      return csvApi.generateCsv();
    } catch (err) {
      this.setError(err.message, "Could not Generate CSV");
    }
  }

  //====== CLOUD STORAGE =======
  // does the current state of the app mean we can try to load the document?
  canLoadDocument() {
    return this.config.bucketName && this.state.selectedDocument;
  }

  canLoadDocumentList() {
    return this.config.bucketName;
  }

  filterLabels(filter) {
    this.setState({
      labelsFiltered: Object.keys(this.state.labels).filter((item) =>
        item.toLowerCase().includes(filter.toLowerCase())
      ),
    });

    console.log(this.state.labelsFiltered, "new filter array");
  }

  //Filter Label Handler
  handleSearchBarchChange(filterText) {
    this.setState({
      filter: filterText,
    });
    this.filterLabels(this.state.filter);
    console.log(this.state.filter, "recording the filter inputs");
  }

  //Clear Filter Handler
  handleSerachBarClear() {
    this.setState({
      filter: "",
    });
    console.log(this.state.filter, "clear search filter");
  }

  a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  handleChange(newValue) {
    const tabId = newValue.currentTarget.attributes[1].ownerElement.id;
    this.setState({ tabValue: parseInt(tabId.substr(tabId.length - 1)) });

    console.log(this.state.tabValue, "tabs");
  }


  handleChangeLabel(){
  let documentList =this.state.documentList;
  let filteredList=[];
  for (var i = 0; i < documentList.length; i++) {
    let doc = documentList[i];

    if (this.state.selectedLabel == "None") {
      if (!doc.labelName || doc.labelName == "None") {
        filteredList.push(doc);
      }
    } else if (doc.labelName == this.state.selectedLabel) {
      filteredList.push(doc);
    }
  }
  return this.setState({documentListFiltered: filteredList})
}


  async refreshDocumentList() {
    console.log("refreshDocumentList??!?!?");
    if (!this.canLoadDocumentList()) {
      console.log(
        "Missing bucket, or no selected document. Not loading document list."
      );
      return;
    }

    try {
      var dlApi = new DocumentListApi(this.state.accessToken);
      var documents = await dlApi.loadDocumentList();      
     return this.setState({ ...this.state, documentList: documents });
     
    } catch (err) {
      if (err.message == "Not Found")
        this.setError(
          "Bucket '" + this.config.bucketName + "' " + err.message,
          "Bucket Not Found"
        );
      else this.setError(err.message, "Could not List Documents");
    }
  }

  handleSelection (selectedKeys) {
  	this.setState({ selectedKeys });
  }


  
  render() {
    console.log(this.state.selectedLabel,"labelname")
    return (
      <div className="App">
        <ModalPopup
          title={this.state.error.title}
          content={this.state.error.content}
          open={this.state.error.isOpen}
          onClose={this.handleErrorClose}
        />
        <ModalPopup
          title={this.state.alert.title}
          content={this.state.alert.content}
          open={this.state.alert.isOpen}
          severity="info"
          onClose={this.handleErrorClose}
        />
        <AppHeader
          // TODO: use context this is getting messy
          selectedDocument={this.state.selectedDocument}
          setError={this.setError}
          setAlert={this.setAlert}
          //loadCsv = {this.loadCsv}
          generateCsv={this.generateCsv}
          userProfile={this.state.userProfile}
          documentList={this.state.documentList}
          refreshDocumentList={this.refreshDocumentList}
          handleDocumentUpdate={this.handleDocumentUpdate}
        />
       

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <AppBar position="static">
              <Tabs
                value={this.state.tabValue}
                onChange={(newValue) => this.handleChange(newValue)}
                aria-label="basic tabs example"
                variant="fullWidth"
              >
                <Tab
                  label="Document Labelling View"
                  icon={<NoteAddIcon />}
                  {...this.a11yProps(0)}
                />

                <Tab
                  label="Training View"
                  icon={<LaptopMacIcon />}
                  {...this.a11yProps(1)}
                />
                <Tab
                  label="Model Manager View"
                  icon={<EqualizerIcon />}
                  {...this.a11yProps(2)}
                />
              </Tabs>
            </AppBar>
          </Box>
          <SwipeableViews
            index={this.state.tabValue}
            onChangeIndex={(newValue) => this.handleChange(newValue)}
          >
            <TabPanel value={this.state.tabValue} index={0}>
              <Grid container>
                <Grid item xs={2}>
                  <Divider />
                  <List color="primary">
                    <ListItem key="labeled">
                      <h3>Document Labels &amp; Clusters</h3>
                    </ListItem>
                  </List>
                  <SearchBar
                    placeholder="Type here to Filter Labels"
                    value={""}
                    onChange={(filterText) =>
                      this.handleSearchBarchChange(filterText)
                    }
                    onCancelSearch={() => this.handleSerachBarClear()}
                  />

                  <Sidebar
                    labels={this.state.labels}
                    labelsFiltered={this.state.labelsFiltered}
                    filter={this.state.filter}
                    onLabelSelected={this.handleLabelSelected}
                    onLabelAdded={this.handleLabelAdded}
                    onLabelRemoved={this.handleLabelRemoved}
                    selectedLabel={this.state.selectedLabel}
                    generateCsv={this.generateCsv}
                    setError={this.setError}
                    setAlert={this.setAlert}
                  />
                </Grid>

                <Grid item xs={10} >
                  <h1>Document List</h1>

                  <Box sx={{ flexGrow: 2 }}>
                    <DocumentView
                      labels={this.state.labels}
                      documentListFiltered={this.state.documentListFiltered} 
                      onApplyLabelToDocument={this.handleApplyLabelToDocument}
                      onApplyLabelToMultipleDocuments={this.handleApplyLabelToMulitpleDocuments}
                      selectedLabel={this.state.selectedLabel}
                      key={this.state.selectedLabel}
                    />
                  </Box>
                </Grid> 
              </Grid>
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={1}>
              <TrainingView
                        labelsImported={this.state.labelsImported}
                        onImportLabels={this.handleImportLabels}
                        generateCsv={this.generateCsv}
                        setError={this.setError}
                        setAlert={this.setAlert}
                        />
            </TabPanel>
            <TabPanel value={this.state.tabValue} index={2}>
              In Progress
            </TabPanel>
          </SwipeableViews>
        </Box>
      </div>
    );
  }
}

export default withRouter(App);
