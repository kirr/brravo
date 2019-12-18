import React from 'react';
import { Fade, Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import {ScreenProgress, Toolbar, FinishPopup} from './helpers.js';
import {AudioRecorder} from './audio.js';

const gridStyles = makeStyles({
  root: {
    position: "absolute",
    top: "calc(50% - 40px)",
    width: "100%",
    fontSize: "1.5em"
  }
});

export function AutomatitionExercise(props) {
  const [screen, setScreen] = React.useState(0);
  const [fade, setFade] = React.useState(true);
  const [state, setState] = React.useState('in');

  const screens = props.params.content.screens;
  const desc = screens[Math.min(screen, screens.length - 1)];
  const finished = screen >= screens.length;
  const classes = gridStyles();

  React.useEffect(() => {
    let timer = null;
    if (state === 'in') {
      timer = setTimeout(()=>{ setFade(false); setState('out');}, desc.duration * 1000);
    } else if (state === 'out') {
      if (!finished) {
        timer = setTimeout(()=>{
          setFade(true);
          setScreen(screen + 1);
          setState('in');
        }, 200);
      }
    }

    return () => { clearTimeout(timer); };
  }, [state]);

  let finishPopup = null;
  let screenProgress = null;
  if (finished) {
    finishPopup = <FinishPopup finishCallback={props.lastScreenCallback}/>;
  } else {
    screenProgress = <ScreenProgress duration={desc.duration} screen={screen}/>;
  }

  return (<div>
    {Toolbar(props.params.name, props.lastScreenCallback)}
    {screenProgress}
    <Fade in={fade}>
      <Grid container classes={{root: classes.root}} justify="center" spacing={2}>
          {desc.content.map((value, index) => (
            <Grid key={index + value} item>
              <Paper elevation={5}>{value}</Paper>
            </Grid>
          ))}
      </Grid>
    </Fade>
    {finishPopup}
    <AudioRecorder/>
  </div>);
}
