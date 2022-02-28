
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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';

import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import { blue } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import UserConfig from './lib/UserConfig.js'
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) =>({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    }
  },
  avatar: {
    backgroundColor: blue[100],
    color: blue[600],
  }
}));

export default function  SettingsDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;
  
  var config = new UserConfig();
  const [reloadOnClose, setReloadOnClose] = useState(false);

  const handleClose = () => {
    onClose(selectedValue);   
    if (reloadOnClose){
      setTimeout(()=>window.location.reload(true),1);
    }
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleUpdateProjectId = (evt)=> {
    if (config.projectId != evt.target.value) {
      config.projectId = evt.target.value;
      config.persist()
      setReloadOnClose(true)
    }
  };

  const handleUpdateThumbnailWidth = (evt)=> {
    if (config.thumbnailWidth != evt.target.value) {
      config.thumbnailWidth = evt.target.value;
      config.persist()
      setReloadOnClose(true)
    }
  };

  const handleUpdateBucketName = (evt)=> {
   if (config.bucketName != evt.target.value) {
      config.bucketName = evt.target.value;
      config.persist()
      setReloadOnClose(true)
    }
  };
  const handleUpdateLocationCsv = (evt)=> {
   if (config.locationCsv != evt.target.value) {
      config.locationCsv = evt.target.value;
      config.persist()
      setReloadOnClose(true)
    }
  };
    const handleUpdateLocationImport = (evt)=> {
   if (config.locationImport != evt.target.value) {
      config.locationImport = evt.target.value;
      config.persist()
      setReloadOnClose(true)
    }
  };


  // always turns into table layout for what you want. ;) <font size=+2><blink>old tricks are best</bink></font>
  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
    
    <table><tr>
        <td width="100%"><center><Typography variant="h6">UI Configuration</Typography>  </center>   </td>
      <td> <IconButton aria-label="close" onClick={props.onClose}>
          <CloseIcon />
        </IconButton>   </td>
      </tr></table>

    <List>
     <Divider />
        <ListItem>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="bucketName" label="Bucket Name" onChange={handleUpdateBucketName} defaultValue={config.bucketName}/>
          </form>
        </ListItem> 
        <ListItem>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="projectId" label="Project ID"  onChange={handleUpdateProjectId} defaultValue={config.projectId}/>
          </form>
        </ListItem> 
        
        <ListItem>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField id="thumbnailWidth" label="Thumbnail Width (Pixels)"  onChange={handleUpdateThumbnailWidth} defaultValue={config.thumbnailWidth}/>
          </form>
        </ListItem>     
        <ListItem>
          <Typography variant="strong">
            Csv Location
          </Typography>
          <pre>{config.bucketName}</pre>
          </ListItem>     
        <ListItem>
          <form className={classes.root} noValidate autoComplete="off">
            GS:// <TextField id="locationCsv" label="CSV Location"  onChange={handleUpdateLocationCsv} defaultValue={config.locationCsv}/>
          </form>
          </ListItem>     
                  <ListItem>
          <Typography variant="strong">
            Import Labels
          </Typography>
          <pre>{config.bucketName}</pre>
          </ListItem>   
        <ListItem>
          <form className={classes.root} noValidate autoComplete="off">
            GS:// <TextField id="locationImport" label="Label Import Location"  onChange={handleUpdateLocationImport} defaultValue={config.locationImport}/>
          </form>
          </ListItem>      
      </List>
    </Dialog>
  );
}