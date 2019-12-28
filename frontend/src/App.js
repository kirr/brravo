import React from 'react';
import {Box, BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import {MenuBook, Assignment, Info} from '@material-ui/icons';
import {Lesson, Exercises, About} from './navigation_screens';
import {AutomatitionExercise, GymnasticsExercise, StoryExercise} from './exercises';

import './App.css';

function RenderScreen(screenId, exerciseData, exerciseChooseHandler, lastScreenHandler) {
    switch (screenId) {
      case "lesson":
        return <Lesson handler={exerciseChooseHandler} />;
      case "exercises":
        return <Exercises/>
      case "about":
        return <About/>;
      case "exercise":
        if (exerciseData.type === 'automatition') {
          return <AutomatitionExercise
            params={exerciseData}
            lastScreenCallback={lastScreenHandler}/>;
        } else if (exerciseData.type === 'story') {
          return <StoryExercise
            params={exerciseData}
            lastScreenCallback={lastScreenHandler}/>;
        } else if (exerciseData.type === 'gymnastics') {
          return <GymnasticsExercise
            params={exerciseData}
            lastScreenCallback={lastScreenHandler}/>;
        } else if (exerciseData.type === 'reading') {
          return <StoryExercise
            params={exerciseData}
            lastScreenCallback={lastScreenHandler}
            hasAudioRecording={true} />;
        }
        return <Box>404 Missing exercise :(</Box>;
      default:
        return <Lesson handler={exerciseChooseHandler} />;
    }
}

function RenderBottomNavbar(screen, setScreenCallback) {
  if (screen !== 'exercise') {
    return (<BottomNavigation
              value={screen}
              onChange={(event, newValue) => {
                      setScreenCallback(newValue);
              }}
              showLabels
            >
              <BottomNavigationAction value="lesson" icon={<MenuBook />} />
              <BottomNavigationAction value="exercises"  icon={<Assignment />} />
              <BottomNavigationAction value="about" icon={<Info />} />
            </BottomNavigation>);
  } else {
    return null;
  }
}

function App() {
  const [screen, setScreen] = React.useState('lesson');
  const [currentExercise, setCurrentExercise] = React.useState(null);
  const prevScreenRef = React.useRef();
  React.useEffect(() => {
    prevScreenRef.current = screen;
  });
  const prevScreen = prevScreenRef.current;
  const screenElement = RenderScreen(screen,
                                     currentExercise,
                                     (exercise)=>{
                                       setCurrentExercise(exercise);
                                       setScreen('exercise');
                                     },
                                     ()=>{ setScreen(prevScreen); });
  return (
    <div className="App">
        <div className="ScreenContainer">
          {screenElement}
        </div>
        {RenderBottomNavbar(screen, setScreen)}
    </div>
  );
}

export default App;
