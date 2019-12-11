import React from 'react';

import { LinearProgress, Typography, IconButton, Grid, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const helpersStyles = makeStyles({
  toolbar: {
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "0",
    verticalAlign: "middle"
  },
  progress: {
    transitionDuration: props => props.duration + "s"
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

export function Toolbar(name, prevScreenHandler) {
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

export function ScreenProgress(props) {
  const [progress, setProgress] = React.useState(0);
  const stepDuration = props.duration / 10.0;
  const step = 100.0 / stepDuration;
  const classes = helpersStyles({duration: progress === 0 ? 0 : props.duration});
  React.useEffect(() => {
    setProgress(0);
    const timer = setInterval(()=>{ setProgress(prev => {
      Math.min(prev + step, 100);
    });}, 100);
    return () => { clearInterval(timer); };
  }, [props, step]);

  return (
    <LinearProgress classes={{bar1Determinate: classes.progress}} variant="determinate"
                    value={progress} />);
}
