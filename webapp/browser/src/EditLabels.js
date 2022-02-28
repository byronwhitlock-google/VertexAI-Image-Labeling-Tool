
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
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LabelIcon from '@material-ui/icons/Label';

import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import UserConfig from './lib/UserConfig.js'
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';

import { Divider, Grid, Typography,Box } from '@material-ui/core';

class EditLabels extends Component {

    constructor(props) {
        super(props);

        this.config = new UserConfig()

        this.handleClickOpen = this.handleClickOpen.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.updateLabelState = this.updateLabelState.bind(this)
        this.addLabel = this.addLabel.bind(this)
        this.removeLabel = this.removeLabel.bind(this)
    }


    state = {
        open:false,
        newLabel:''
    }
 
    handleClickOpen() {
        this.setState({open:true});
    }

    handleClose(){
        this.setState({open:false});
    }

    updateLabelState (e){
        this.setState({newLabel:e.target.value})
    }

    addLabel (){
        this.setState({newLabel:""})
        this.props.onLabelAdded(this.state.newLabel)
    }

    removeLabel (labelName){
        this.props.onLabelRemoved(labelName)
    }
    render() {
        return (
            <div>


            
            <Tooltip title="Add or remove labels.">     
            <ListItem onClick={this.handleClickOpen} button key="edit-labels">            
            <ListItemText primary="Edit Labels" secondary="Add or remove labels"/>     
             <EditIcon/>       
            </ListItem>
            </Tooltip>   
        
        
            <Dialog open={this.state.open} onClose={this.handleClose}>
                <DialogTitle>Edit Labels</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    Predefined labels. Labels below are merged in context menu  with predictions and existing document labels.
                    <small ><pre>gs://{this.config.bucketName}/config.json</pre> </small>
                </DialogContentText>
                


                    <ListItem  secondary="Add new Label">
                            <ListItemAvatar>
                                New Label: 
                            </ListItemAvatar>
                                <TextField value={this.state.newLabel} onChange={this.updateLabelState}/>
                                <IconButton edge="end" aria-label="save">
                                    <CheckIcon onClick={this.addLabel} />
                                </IconButton>
                        </ListItem>



                    <List dense={true}>
        

                    {Object.keys(this.props.labels).map((labelName) =>  
                            labelName == 'None' ?'': 
                                <ListItem key={labelName}>
                                    <ListItemAvatar>
                                        <LabelIcon />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={labelName} secondary={`${this.props.labels[labelName]} documents`}
                                    />
                                    <IconButton edge="end" aria-label="delete">
                                    <DeleteIcon onClick={()=>{this.removeLabel(labelName)}}/>
                                    </IconButton>
                                </ListItem>
                    )}
                    </List>


                </DialogContent>
                <DialogActions>
        
                            <Button onClick={this.handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
            </div>
        )
    }
}
export default EditLabels