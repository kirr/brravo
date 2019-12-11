import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';

import {Toolbar} from './helpers.js';

const storiesStyles = makeStyles({
  continueButton: {
    marginBottom: "20px"
  }
});

export function StoryExercise(props) {
  const [swiper, setSwiper] = React.useState(null);
  const [screen, setScreen] = React.useState(0);

  const params = {
    getSwiper: setSwiper,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    }
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


  const classes = storiesStyles();
  const screens = props.params.content.screens;

  const isLast = (screens.length - 1 === screen);
  let finishButton = null;
  if (isLast) {
    finishButton = <Button classes={{root: classes.continueButton}} color="primary" onClick={props.lastScreenCallback}>
      Продолжить урок
    </Button>
  }

  return (<div>
            {Toolbar(props.params.name, props.lastScreenCallback)}
            <Swiper {...params}>
              {screens.map((item, index)=>{
                return (
                  <div key={index + '_container'}>
                    <div key={index} dangerouslySetInnerHTML={{__html: item}} />
                    {finishButton}
                  </div>);
              })}
            </Swiper>
          </div>);
}
