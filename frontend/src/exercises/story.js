import React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';

import {ManualScreenProgress, Toolbar, FinishButton} from './helpers.js';
import {AudioRecorder} from './audio.js';

export function StoryExercise(props) {
  const [swiper, setSwiper] = React.useState(null);
  const [screen, setScreen] = React.useState(0);

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


  const screens = props.params.content.screens;

  const isLast = (screens.length - 1 === screen);
  return (<div className="ExerciseScreenContainer">
            {Toolbar(props.params.name, props.lastScreenCallback)}
            <ManualScreenProgress progress={100.0 * (screen + 1) / screens.length}/>
            <Swiper {...params}>
              {screens.map((item, index)=>{
                return (
                  <div key={index + '_container'}>
                    <div key={index} dangerouslySetInnerHTML={{__html: item}} />
                    {isLast ? <FinishButton lastScreenCallback={props.lastScreenCallback} /> : null }
                  </div>);
              })}
            </Swiper>
            {props.hasAudioRecording ? <AudioRecorder/> : null }
          </div>);
}
