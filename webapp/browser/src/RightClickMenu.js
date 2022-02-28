
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
import UserConfig from "./lib/UserConfig.js"
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';


import {    Menu,
            MenuItem,
            Grid, 
            Typography } from '@material-ui/core';

class RightClickMenu extends Component {

    constructor(props) {
        super(props);

        this.documentNode = React.createRef();
        this.config = new UserConfig()

        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleRightClick = this.handleRightClick.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleMenuClick = this.handleMenuClick.bind(this)
        //this.handleUnselectItem = this.handleUnselectItem.bind(this)
    }

    state = {
      mouseX: null,
      mouseY: null,
      leftMouseClicked:false,
      selectedDocuments:[],
    };



    selectText(node){
      if (document.body.createTextRange) {
          const range = document.body.createTextRange();
          range.moveToElementText(node);
          range.select();
      } else if (window.getSelection) {
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(node);
          selection.removeAllRanges();
          selection.addRange(range);
      } else {
          console.warn("Could not select text in node: Unsupported browser.");
      }
    }
   


    // we pass the parent node because e is the inner spans
    handleMouseOver(event, documentNode) {
      event.preventDefault();
      if(this.props.multiSelected){
        return;
      }
      //if multislect state true then return true

    //else
      this.selectText(documentNode.current)
    }

    handleContextMenu(event, documentNode ) {
      event.preventDefault();   
      


      if (this.props.multiSelected) {     
        /// ??????           
        this.setState({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
      } else {
         
        this.selectText(documentNode.current)
        this.setState({
          mouseX: event.clientX - 2,
          mouseY: event.clientY - 4,
        });
      }
    }
      // we pass the parent node because e is the inner spans
    handleRightClick(event, documentNode){

    }


   


    async handleMenuClick(e, labelName,documentName){
      e.preventDefault();
      this.handleClose()
      // make the call async because yeah.
      if(this.props.multiSelected){ 
        //setTimeout(()=>{this.props.onApplyLabelToMulitpleDocuments(labelName)},0) // when multiple documents are selected
        this.props.onApplyLabelToMultipleDocuments(this.props.selectedKeys, labelName)
        this.props.onNonItemClick()
      }
      else {
        //setTimeout(()=>{this.props.onApplyLabelToDocument(labelName,documentName)},0) // when single document is selected
        this.props.onApplyLabelToDocument(labelName,documentName)
      }
    }

    handleClose(){
      this.setState( {
        mouseX: null,
        mouseY: null,
      })
    }
    render(){
      
        return (
          
          
        <span
          ref={this.documentNode} 
          style={{ cursor: 'context-menu' }} 
          onMouseOver={(e)=>{this.handleMouseOver(e, this.documentNode)}}
          onContextMenu={ (e)=>{this.handleContextMenu(e, this.documentNode)}}
          // onClick={this.handleUnselectItem}
        >
           {this.props.children}
           {
              <Menu
                key={this.documentNode}
                keepMounted
                open={this.state.mouseY !== null}
                onClose={this.handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                  this.state.mouseY !== null && this.state.mouseX !== null
                    ? { top: this.state.mouseY, left: this.state.mouseX }
                    : undefined
                }
              >         
                <MenuItem color='secondary' key="none" onClick={(e)=>this.handleMenuClick(e,'None',this.props.documentName)}>             
                  None (Remove Label)
                </MenuItem>

                {Object.keys(this.props.labels).map((labelName) => labelName=="None"?'':
                    <MenuItem 
                      key={labelName} 
                      onClick={(e)=>this.handleMenuClick(e,labelName, this.props.documentName)}>                       
                      {labelName}
                    </MenuItem>                
                  )}            

              </Menu>
          }
        </span>
        )
/*
        return ( <Highlighter
                   // highlightClassName="YourHighlightClass"
                    searchWords={words}
                    autoEscape={true}
                    textToHighlight={sentence}
                    activeStyle={{
                      backgroundColor: 'gray', 
                      display: 'inline'
                    }}
        />)*/
    }
} 
export default RightClickMenu