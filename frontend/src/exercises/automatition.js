import React from 'react';
import { Grid, Paper, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {FinishPopup} from './helpers.js';

const gridStyles = makeStyles({
  root: {
    position: "absolute",
    top: "calc(50% - 40px)",
    width: "100%"
  }
});

const progressStyles = makeStyles({
  progress: {
    transitionDuration: props => props.duration + "s"
  }
});

function ScreenProgress(props) {
  const [progress, setProgress] = React.useState(0);
  const stepDuration = props.duration / 10.0;
  const step = 100.0 / stepDuration;
  const classes = progressStyles({duration: progress === 0 ? 0 : props.duration});
  React.useEffect(() => {
    setProgress(0);
    const timer = setInterval(()=>{ setProgress(prev => {Math.min(prev + step, 100);});}, 100);
    return () => { clearInterval(timer);};
  }, [props, step]);

  return (
    <LinearProgress classes={{bar1Determinate: classes.progress}} variant="determinate"
                    value={progress} />);
}

export function AutomatitionExercise(props) {
  const [screen, setScreen] = React.useState(0);

  const desc = props.params.screens[Math.min(screen, props.params.screens.length - 1)];
  const finished = screen >= props.params.screens.length;
  const classes = gridStyles();

  React.useEffect(() => {
    if (!finished) {
      setTimeout(()=>{ setScreen(screen+1); }, desc.duration * 1000);
    }
    return () => {};
  }, [screen, desc]);

  let finishPopup = null;
  if (finished) {
    finishPopup = <FinishPopup finishCallback={props.lastScreenCallback}/>;
  }

  return (<div>
    <ScreenProgress duration={desc.duration} screen={screen}/>
    <Grid container classes={{root: classes.root}} justify="center" spacing={2}>
          {desc.content.map((value, index) => (
            <Grid key={index + value} item>
              <Paper elevation={5}>{value}</Paper>
            </Grid>
          ))}
    </Grid>
    {finishPopup}
  </div>);
}
