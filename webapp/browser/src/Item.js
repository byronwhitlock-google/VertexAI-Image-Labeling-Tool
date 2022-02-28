import * as React from 'react';
import { styled } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';


 const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  margin:4
}));



export default Item;