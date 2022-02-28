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
import  './styles/styles_sidebar.css'
import { Divider, Typography } from '@material-ui/core';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LabelIcon from '@material-ui/icons/Label';
import LabelOffIcon from '@material-ui/icons/LabelOff';
import EditIcon from '@material-ui/icons/Edit';

import EditLabels from './EditLabels.js'
// Props should look like this

import GenerateCsvButton from './GenerateCsvButton.js'


// import SearchBar from "material-ui-search-bar";







class Sidebar extends Component {

    constructor(props, context) {
        super(props,context);
        // This binding is necessary to make `this` work in the callback
        this.handleLabelClick = this.handleLabelClick.bind(this);
         this.props.onLabelSelected(props.selectedLabel);


    }


   

    handleLabelClick(labelName) {
        this.props.onLabelSelected(labelName)

        
    }


    async componentDidMount(){
        this.props.onLabelSelected(this.props.selectedLabel)
    }
       
    

   

    render (){

        return(        
            <List color="primary">    
                <ListItem 
                        onClick={(e) => {this.handleLabelClick('None')}} button 
                        selected={this.props.selectedLabel=='None'?true:false} >     
                    <LabelOffIcon color="secondary"/>&nbsp;&nbsp;&nbsp;
                    <ListItemText secondary={`${this.props.labels['None']?this.props.labels['None']:0} Unlabeled Docs`} primary={`None`}/>
                </ListItem> 
                   {/*Filter the labels on the basis of Filter Text */}
                {this.props.filter ? this.props.labelsFiltered.map((labelName) =>  
                    labelName == 'None' ?'': 
                    this.props.labels[labelName]!==0 ? (
               <ListItem 
                        key={labelName}
                        onClick={(e) => {this.handleLabelClick(labelName)}} button 
                        selected={this.props.selectedLabel==labelName?true:false}>      
                        <LabelIcon color="primary"/>&nbsp;&nbsp;&nbsp;      
                        <ListItemText primary={labelName} secondary={`${this.props.labels[labelName]} documents`}/>
                    </ListItem>):''
                ): Object.keys(this.props.labels).map((labelName) =>  
                    labelName == 'None' ?'': 
                    this.props.labels[labelName]!==0 ? (
               <ListItem 
                        key={labelName}
                        onClick={(e) => {this.handleLabelClick(labelName)}} button 
                        selected={this.props.selectedLabel==labelName?true:false}>      
                        <LabelIcon color="primary"/>&nbsp;&nbsp;&nbsp;      
                        <ListItemText primary={labelName} secondary={`${this.props.labels[labelName]} documents`}/>
                    </ListItem>):''
                )}
                
                <Divider/> 
                
                <EditLabels {...this.props}/>                 
                
                          
                 {/* <GenerateCsvButton {...this.props}/>                  */}
                
                <Divider/>    


            </List>
        )
    }
}
export default Sidebar;