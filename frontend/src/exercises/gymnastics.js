import React from 'react';
import {ScreenProgress, Toolbar, FinishPopup} from './helpers.js';

export function GymnasticsExercise(props) {
  const [finished, setFinished] = React.useState(false);
  const duration = props.params.duration * 60;
  React.useEffect(() => {
    const timer = setTimeout(()=>{setFinished(true);}, duration * 1000);
    return () => { clearTimeout(timer); };
  }, [props]);


  let finishPopup = null;
  if (finished) {
    finishPopup = <FinishPopup finishCallback={props.lastScreenCallback}/>;
  }
  const content = props.params.content.html;
  return (<div>
            {Toolbar(props.params.name, props.lastScreenCallback)}
            <ScreenProgress duration={duration} screen={0}/>
            <div key="gymnastics_container" dangerouslySetInnerHTML={{ __html: content }} />
            {finishPopup}
          </div>);
}
