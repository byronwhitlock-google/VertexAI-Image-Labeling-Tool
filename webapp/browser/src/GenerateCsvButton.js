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

import React, { Component } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import { FixedSizeList ,VariableSizeList} from 'react-window';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListIcon from '@material-ui/icons/List';
import ListItemText from '@material-ui/core/ListItemText';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import DescriptionTwoToneIcon from '@material-ui/icons/DescriptionTwoTone';
import Tooltip from '@material-ui/core/Tooltip';
import UserConfig from './lib/UserConfig.js'
import FileSaver  from 'file-saver';
import SettingsIcon from '@material-ui/icons/Settings';
import Blob from 'blob'
import ErrorTwoToneIcon from '@material-ui/icons/ErrorTwoTone';
import CheckCircleTwoToneIcon from '@material-ui/icons/CheckCircleTwoTone';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Button from '@material-ui/core/Button';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import GTranslateIcon from '@material-ui/icons/GTranslate';
import AutoMLIcon from './svg/AutoMLIcon.js';
import CloudStorageIcon from './svg/CloudStorageIcon.js';

class GenerateCsvButton extends Component {
  constructor(props) {
      super(props);

    this.handleGenerateCsvClick = this.handleGenerateCsvClick.bind(this)
    console.log("NavigationDrawer props")
    console.log(props)
    
  }

  classes = makeStyles({
              list: {
                width: 250,
              },
              fullList: {
                width: 'auto',
              },
            });
  state = {
      data: null,
      isOpen: false
  };


  async handleGenerateCsvClick() {
    try {
      var csvMap = await this.props.generateCsv()
      var gif = process.env.PUBLIC_URL +'/training-animation.gif'
      var documentLabels=""
      var wordLabels=""
      
      documentLabels = `<font size='+1'><b>gs://${csvMap[0].path}</b></font><br><i>${csvMap[0].numRecords}</i> Documents labeled.<br>`
      for(let i in csvMap) {
        let csv = csvMap[i]
        if (i>0) //HACKYHACKHACK should be idiomatic not magic string
          wordLabels += `<font size='+1'>${csv.label}</font><br>gs://${csv.path}<br><i>${csv.numRecords}</i> Documents labeled. <p>`
      }

      if (wordLabels) {
        documentLabels+= `<h3>Word Labels</h3><blockquote>${wordLabels}</blockquote> `
      }

      this.props.setAlert(
        ` <img style='float:right' width='50%' src='${gif}'>
        <hr>
       ${documentLabels}
       
       <hr>
        Please go to <a target="_new" href='https://console.cloud.google.com/vertex-ai/datasets/create'>Vertex AI Cloud Console</a>. Choose 'Image Classification' then, import dataset.`,
        "CSV Generation Success")
    } catch (e)
    {
      this.props.setError(e.message,"CSV Generation Failed")
    }
    /*
    try {
      // grab the csv, stub for now.
      var csv = await this.props.loadCsv()
      var blob = new Blob([csv.data], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, `automl-labeled-${config.bucketName}.csv`);
    } 
    catch (e)
    {
      this.props.setError(e.message,"Download Failed")
    }*/
  }

  handleDocumentClick =  (newDocumentSrc) => {
    // do a full refresh for new docuemnt keep things snappy?
    //window.location = '/'+newDocumentSrc
    this.props.handleDocumentUpdate(newDocumentSrc)
  }
  componentDidMount =()=>{
    this.setState({windowHeight: window.innerHeight -325}) ;
  }

  toggleDrawer = (open) => (event) => {
    
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    // don't await this call
    // poor mans async
    //setTimeout(function() {
     
    //},0);
    
    this.setState({ ...this.state, isOpen: !this.state.isOpen });
    //setTimeout(function() {
    // this.props.refreshDocumentList()
    //},100);
  };

  render() {


    return (
      
      <React.Fragment>
        <Tooltip title="Generate a CSV file for training a new new model in the AutoML API.">     
          <ListItem onClick={this.handleGenerateCsvClick} button key="generate-csv">            
          <ListItemText primary="Generate CSV" secondary="AutoML training"/>       
          <GTranslateIcon/>            
          </ListItem>
        </Tooltip>   
      </React.Fragment>
    );
  }
}

export default GenerateCsvButton;