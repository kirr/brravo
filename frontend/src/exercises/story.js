import React from 'react';
import Swiper from 'react-id-swiper';
import 'swiper/css/swiper.css';

export function StoryExercise(props) {
  const [swiper, setSwiper] = React.useState(null);
  const [screen, setScreen] = React.useState(0);

  console.log(screen);
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

  if (props.params.screens.length === screen) {
    props.lastScreenCallback();
    return null;
  }

  return (<Swiper {...params}>
            {props.params.screens.map((item, index)=>{
              return <div key={index} dangerouslySetInnerHTML={{__html: item}} />;
            })}
            <div key={props.params.length} />
          </Swiper>);
}
