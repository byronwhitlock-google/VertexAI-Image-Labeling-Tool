import * as React from "react";
import { CardContent, Checkbox, FormControlLabel, Grid, IconButton, Input, List, TextField, Tooltip, Typography } from "@material-ui/core"
import GenerateCsvButton from "./GenerateCsvButton"
import ImportLabelsButton from "./ImportLabelsButton"
import Item from "./Item"
import UserConfig from "./lib/UserConfig";
import RefreshRoundedIcon from '@material-ui/icons/RefreshRounded';


class TrainingView extends React.Component {
    state = {
        csvFilename: '',
        importLabelFilename:''
    }
    constructor(props) {
      super(props);
        this.handleChangeCsvFilename = this.handleChangeCsvFilename.bind(this)       
        this.handleChangeImportLabelFilename = this.handleChangeImportLabelFilename.bind(this)   
        this.config = new UserConfig(); 
        this.defaultFilename = `${this.config.bucketName}/training.csv`

    }
    
    sampleImportLabelJson = {
        "prediction_regex_phash": {
            "gs://docai_predictions_dev/Batch/converted_images/Converted_files-2021-11-03_102007/56849419_85222772_98512.png": {
                "label": "00639_x",
                "group": null,
                "confidence_score": 0.7
            },
            "gs://docai_predictions_dev/Batch/converted_images/Converted_files-2021-11-03_102007/56849384_85222731_98512.png": {
                "label": "group_2",
                "group": NaN,
                "confidence_score": 0.3
            },
        }
    }
    componentDidMount() {
        if (!this.state.csvFilename){
            this.setState({csvFilename: this.defaultFilename})
        }
    }
    
    handleChangeImportLabelFilename(e){        
         this.setState({importLabelFilename: e.target.value})
    }
    handleChangeCsvFilename(e){        
         this.setState({csvFilename: e.target.value})
    }
    
    render() {
        return  <Grid style={{ margin: "50px" }}>    
                <Grid>
                    <h3>AutoML Training CSV</h3>     
                    <table>
                        <tr>
                            <td valign="top">
                               GS:// <TextField  
                                                            value={this.state.csvFilename}
                                                         iu   onChange={this.handleChangeCsvFilename}
                                                            />
                                    <Tooltip title={`Reset training file path to default (${this.defaultFilename})`}>
                                        <IconButton aria-label="delete" size="small" onClick={()=>{this.setState({csvFilename:this.defaultFilename})}}>
                                            <RefreshRoundedIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                </td><td valign="top">
                                <Item>
                                    <GenerateCsvButton {...this.props} csvFilename={this.state.csvFilename} />
                                </Item>
                            </td>
                        </tr> 
                    </table>
                </Grid>
                <Grid>    
                     <h3>Import Labels</h3>     
                    <table>
                        <tr>
                            <td valign="top">
                                GS:// <TextField  
                                    value={this.state.importLabelFilename}
                                    onChange={this.handleChangeImportLabelFilename}
                                    /><br/>
                                                                                        
                                <FormControlLabel control={<Checkbox defaultChecked color="primary"/>} label="Copy Files ?" />
                            </td><td valign="top"> 
                                <Item>
                                    <ImportLabelsButton {...this.props} importLabelFilename={this.state.importLabelFilename}
                                     />
                                </Item>
                            </td>
                            <td></td>
                            <td valign="top">{this.props.labelsImported? <Typography color="primary"><b>Import Status</b>: {this.props.labelsImported}</Typography>: ''} </td>
                        </tr>
                        </table>
                        <h3>Import Label Format </h3>
                        <pre>{JSON.stringify(this.sampleImportLabelJson, null, 2)}</pre>
                        
                </Grid>                
            </Grid>
    }
}export default TrainingView