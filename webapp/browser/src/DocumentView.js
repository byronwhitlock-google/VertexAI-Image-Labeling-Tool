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
import UserConfig from "./lib/UserConfig.js";
import RightClickMenu from "./RightClickMenu.js";
import Item from "./Item.js";
import Button from "@material-ui/core/Button";
import DocumentDetailedView from "./DocumentDetailedView.js";
import { VariableSizeList as List } from "react-window";
import { VariableSizeGrid } from "react-window";
import { FixedSizeGrid } from "react-window";
import { SelectableGroup, createSelectable } from "react-selectable";

import {
  Box,
  Divider,
  Grid,
  CardContent,
  CardActions,
  ListItem,
} from "@material-ui/core";

const RightClickMenuSelectable = createSelectable(RightClickMenu); // To make the component multi-selectable

class DocumentView extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.config = new UserConfig();
    this.state = {
      windowWidth: window.innerWidth - 0.3 * window.innerWidth,
      windowHeight: window.innerHeight,
      selectedKeys: [],
      multiSelected: false,
    };
    //this.gridRef=React.createRef();

    this.handleResize = this.handleResize.bind(this);
    this.handleSelection = this.handleSelection.bind(this);
    this.handleNonItemClick = this.handleNonItemClick.bind(this);
    this.handleUnselectClick = this.handleUnselectClick.bind(this);
  }

  handleSelection(selectedKeys) {
    this.setState({ selectedKeys });
    if (selectedKeys.length > 0) {
      this.setState({ multiSelected: true });
    } else {
      this.setState({ multiSelected: false });
    }
    console.log(selectedKeys);
  }

  handleUnselectClick(e,idx) {  //unselect image functionality
    
   

    if (e.ctrlKey) {
      // check for ctrl+click
      if (
        this.state.selectedKeys.indexOf(idx
          
        ) > -1
      ) {
        const selected = this.state.selectedKeys.filter(
          (item) =>
            item !== idx
        );
        this.setState({ selectedKeys: selected });
      }
    }
  }
 // e.currentTarget[unselectedItemKey[1]].children._owner.index

  handleNonItemClick() {
    this.setState({ selectedKeys: [], multiSelected: false }); // to empty the array of the selected items when clicked on non-selectable item
  }

  handleResize = (e) => {
    this.setState({
      windowWidth: window.innerWidth - 0.3 * window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };

  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.addEventListener("resize", this.handleResize);
  }

  render() {
    const { windowWidth, windowHeight } = this.state;

    const rowCount = Math.ceil(
      this.props.documentListFiltered.length /
        Math.floor(
          (window.innerWidth - 0.4 * window.innerWidth) /
            this.config.thumbnailWidth
        )
    );
    const columnCount = Math.floor(windowWidth / this.config.thumbnailWidth);

    return (
      <Grid container>
        <SelectableGroup
          onSelection={this.handleSelection}
          enabled={true}
          onEndSelection={this.handleEndSelection}
          onBeginSelection={this.handleBeginSelection}
          onNonItemClick={this.handleNonItemClick}
        >
          <FixedSizeGrid
            className="Grid"
            columnCount={columnCount}
            columnWidth={parseInt(this.config.thumbnailWidth) * 1.1}
            height={windowHeight}
            rowCount={rowCount}
            rowHeight={parseInt(this.config.thumbnailWidth) * 1.5}
            width={window.innerWidth - 0.1 * window.innerWidth}
          >
            {({ columnIndex, rowIndex, style }) => {
              // TODO: Change "3" into a dynamic mesurment: floor(screen width / image pixel size)
              // const rowCount = Math.ceil(this.props.documentListFiltered.length / 3);
              // const columnCount = 3;

              //const isLastRow = rowIndex === this.state.rowCount - 1;
              const idx = rowIndex * columnCount + columnIndex;
              var document = this.props.documentListFiltered[idx];
              const isSelected = this.state.selectedKeys.indexOf(idx) > -1; // to change the background of the selected documents
              console.log(idx, "document");
              //

              if (!document) {
                return <React.Fragment />;
              }

              return (
                <div style={style}>
                  {this.props.documentListFiltered.length > 0 ? (
                    <RightClickMenuSelectable
                      {...this.props}
                      key={idx}
                      isSelected={isSelected}
                      selectableKey={idx}
                      documentName={document.filename}
                      key={document.filename}
                      multiSelected={this.state.multiSelected}
                      onNonItemClick={this.handleNonItemClick}
                      selectedKeys={this.state.selectedKeys}
                    >
                      <React.Fragment>
                        <Item>
                          <CardContent
                            onContextMenu={(e) => {
                              this.handleUnselectClick(e,idx);
                            }}
                            style={{ background: isSelected ? "#B7DBF2" : "" }}
                          >
                            <DocumentDetailedView
                              filename={document.filename}
                              bucketName={this.config.bucketName}
                              width={this.config.thumbnailWidth}
                            />
                          </CardContent>
                          <CardActions>
                            <small>{document.filename}</small>
                          </CardActions>
                        </Item>
                      </React.Fragment>
                    </RightClickMenuSelectable>
                  ) : (
                    ""
                  )}
                </div>
              );
            }}
          </FixedSizeGrid>
        </SelectableGroup>
        <Divider />
      </Grid>
    );
  }
}
// TODO: dont' use localhost for image location, may need shim
export default DocumentView;
