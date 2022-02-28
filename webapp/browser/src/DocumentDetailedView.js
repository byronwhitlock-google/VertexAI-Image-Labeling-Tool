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

import * as React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Loader from './Loader.js';
import Image from 'material-ui-image';
import { useState } from "react";

import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import RotateRightIcon from "@material-ui/icons/RotateRight";

const style = {
  position: 'absolute',
  transform: 'translate(135%, -1%)',
  width: 400,
  height:1,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const rotateStyleLeft = {
  fontSize: "40px",
  cursor: "pointer",
  position: "relative",
  zIndex: 1,
  left: "-6vh",
  top: "-50vh",
};

const rotateStyleRight = {
  fontSize: "40px",
  cursor: "pointer",
  position: "relative",
  zIndex: 1,
  left: "99vh",
  top: "-50vh",
};


export default function DocumentDetailedView(props) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [direction, setDirection] = useState(0);

  const rotateLeft = () => {
    setDirection(direction - 90);
  };

  const rotateRight = () => {
    setDirection(direction + 90);
  };

   
  
   const [count,setCount]=React.useState(0);
   const [show,setShow]=React.useState(true)
   


    

 
  var modelImage=`/image?filename=${props.filename}&b=${props.bucketName}`

  return (
      <React.Fragment>
      
      <Image onClick={handleOpen} style={{width:`${props.width}px`}} src={modelImage}></Image>
      
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box style={style}>
          
          
            <Image  
              src={show ? modelImage : ''}
              style={{height:"25vh",marginTop:"24px" ,width:"100vh",transform: `rotate(${direction}deg)`}} ></Image>
              
              <RotateLeftIcon
              style={rotateStyleLeft}
              onClick={rotateLeft}
            ></RotateLeftIcon>
            <RotateRightIcon
              style={rotateStyleRight}
              onClick={rotateRight}
            ></RotateRightIcon>
          </Box>
        </Fade>
      </Modal>
      </React.Fragment>
    
  );
}




