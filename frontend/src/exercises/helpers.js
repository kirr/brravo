import React from 'react';

import { Typography, IconButton, Grid, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const helpersStyles = makeStyles({
  toolbar: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "0",
    verticalAlign: "middle"
  }
});

export function FinishPopup(props) {
  return (
    <Dialog
      open={true}
      onClose={props.finishCallback}
    >
      <DialogTitle>Поздравляем!</DialogTitle>
      <DialogContent>
        Вы закончили упражнение. Можно прододжать :)
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.finishCallback} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>);
}

export function RenderToolbar(name, prevScreenHandler) {
  const classes = helpersStyles();
  return (<Grid container spacing={0}>
    <Grid item key="toolbar">
            <IconButton onClick={()=>{prevScreenHandler();}}>
              <ArrowBack />
            </IconButton>
    </Grid>
    <Grid item key="title" classes={{root: classes.toolbar}} >
      <Typography  color="textSecondary">{name}</Typography>
    </Grid>
    </Grid>);
}

