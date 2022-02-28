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
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import SettingsDialog from './SettingsDialog.js'
import SettingsIcon from '@material-ui/icons/Settings';
import GitHubIcon from '@material-ui/icons/GitHub';
import Tooltip from '@material-ui/core/Tooltip';
import Logo from './assets/MckessonLogo.png'

// refresh token
import { refreshTokenSetup } from './lib/refreshToken';

//Help Modal
import HelpModal from './HelpModal.js'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function AppHeader(props) {
  const classes = useStyles();
  
  const [settingsOpen, setSettingsOpen] = useState(0);
  const [helpOpen,setHelpOpen] = useState(false);


  const openHelpModal=()=>{
    setHelpOpen(true)
  }
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
          { 
          /* 
          Google does not do "work for hire"
          <img style={{paddingLeft:"10px"}} src={Logo}></img>  */ 
          }

          <h3>Vertex AI Image Classification Labeling Tool</h3>
          
          </Typography>
          
          

            <React.Fragment>
              
              <Tooltip title={`Configure Your Settings`}>
                <Button color="inherit" onClick={()=>{setSettingsOpen(1)}}>
                  User Settings
                  <SettingsIcon/>
                </Button>
              </Tooltip>
              <SettingsDialog onClose={()=>{setSettingsOpen(0)}} open={settingsOpen}  {...props}/>          
            </React.Fragment>
            <Tooltip title="Need Help ?">
            <Button onClick={openHelpModal}> 
               <HelpModal/>                    
            </Button>
          </Tooltip>                     
        </Toolbar>
      </AppBar>
    </div>
  );
}

