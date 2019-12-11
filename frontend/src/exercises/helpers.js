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
  timer: {
    marginTop: "auto",
    marginBottom: "auto",
    marginRight: "20px",
    marginLeft: "auto",
    right: "0",
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

function CountDownTimer(props) {
  const [coundown, setCountdown] = React.useState(props.durationSec);
  React.useEffect(() => {
    const timer = setInterval(()=> {
        setCountdown((prev) => { setCountdown(Math.max(prev - 1, 0)); });
      }, 1000);
    return ()=>{clearInterval(timer);}
  }, [props]);
  const min = Math.floor(coundown / 60);
  const sec = ("0" + coundown % 60).slice(-2);
  return <Typography color="textSecondary"> {min}:{sec} </Typography>;
}

export function Toolbar(name, prevScreenHandler, duration) {
  const classes = helpersStyles();
  let timer = null;
  if (duration) {
    timer = <CountDownTimer durationSec={duration*60}/>
  }
  return (<Grid container spacing={0}>
            <Grid item key="toolbar">
                    <IconButton onClick={()=>{prevScreenHandler();}}>
                      <ArrowBack />
                    </IconButton>
            </Grid>
            <Grid item key="title" classes={{root: classes.toolbar}} >
              <Typography  color="textSecondary">{name}</Typography>
            </Grid>
            <Grid item key="timer" classes={{root: classes.timer}} >
              {timer}
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
