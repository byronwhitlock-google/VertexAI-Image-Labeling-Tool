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
import Typography from '@material-ui/core/Typography';
import HelpIcon from '@material-ui/icons/Help';
import GitHubIcon from '@material-ui/icons/GitHub';
import Tooltip from '@material-ui/core/Tooltip';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  background: '#e3eef4',
  borderRadius:'5px',
  boxShadow: 24,
  cursor:'Pointer',
  p: 4,
};

export default function HelpModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}><HelpIcon/></Button>

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
            <div style={{padding:"15px"}}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          </Typography>
            
            <Typography id="transition-modal-description" >
            <h2>Copyright 2022 Google Inc.</h2>
            <Typography>
              <p>Licensed under the Apache License, Version 2.0 (the "License");
              you may not use this application except in compliance with the License.
              You may obtain a copy of the License at</p>
                        <p>http://www.apache.org/licenses/LICENSE-2.0</p>
              <p>Unless required by applicable law or agreed to in writing, software
              distributed under the License is distributed on an "AS IS" BASIS,
              WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
              See the License for the specific language governing permissions and
              limitations under the License.</p>
            </Typography>
              <h2>Source Code</h2>
               <Tooltip title="View documentation and source code on Github">
                <Button onClick={()=>{window.open("https://github.com/byronwhitlock-google/AutoML-Labeling-Tool")}}>            
                  <GitHubIcon color="inherit"/>&nbsp;&nbsp;Github          
                </Button>
              </Tooltip>   
             </Typography>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
