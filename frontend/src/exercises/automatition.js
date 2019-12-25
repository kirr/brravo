import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';

import {ManualScreenProgress, Toolbar, FinishButton} from './helpers.js';
import {AudioRecorder} from './audio.js';

const gridStyles = makeStyles({
  root: {
    margin: "auto"
  },
  childContainerItem : {
    margin: "auto"
  },
  childContainer : {
    alignContent: "center",
    minHeight: "300px"
  }
});

export function AutomatitionExercise(props) {
  const [screen, setScreen] = React.useState(0);
  const [swiper, setSwiper] = React.useState(null);

  const screens = props.params.content.screens;
  const classes = gridStyles();

  const params = {
    getSwiper: setSwiper,
    containerClass: 'BrravoSwiperContainer'
  };

  React.useEffect(() => {
    if (swiper !== null) {
      swiper.on("slideChange", () => setScreen(swiper.realIndex));
    }

    return () => {
      if (swiper !== null) {
        swiper.off("slideChange", () => setScreen(swiper.realIndex));
      }
    };
  }, [swiper]);

  return (<div class="ExerciseScreenContainer">
    {Toolbar(props.params.name, props.lastScreenCallback)}
    <ManualScreenProgress progress={100.0 * (screen + 1) / screens.length}/>
    <Swiper {...params}>
      {screens.map((item, index)=>{
        const isLast = (screens.length - 1 === index);
        let buttonItem = null;
        if (isLast) {
          buttonItem = (<Grid key="finish_button_item" item>
              <FinishButton lastScreenCallback={props.lastScreenCallback} />
            </Grid>);
        }
        return (
          <Grid container key={"screen_container_top_" + index}
                          direction="column"
                          alignItems="flex-end"
                          classes={{root: classes.root}} >
            <Grid item classes={{root: classes.childContainerItem}} >
              <Grid container key={"screen_container_" + index}
                              justify="center" spacing={2}
                              alignItems="center"
                              classes={{root: classes.childContainer}} >
                  {item.content.map((value, value_index) => {
                    return (
                    <Grid key={"word_" + index + "_" + value_index} item>
                      <Paper elevation={5}>{value}</Paper>
                    </Grid>);
                  })}
              </Grid>
            </Grid>
            <Grid item>
              {buttonItem}
            </Grid>
          </Grid>
      );
      })}
    </Swiper>
    <AudioRecorder/>
  </div>);
}
