import React from 'react';
import {BottomNavigation, BottomNavigationAction, IconButton} from '@material-ui/core';
import {MenuBook, Assignment, Info, ArrowBack} from '@material-ui/icons';
import {Lesson, Exercises, About} from './navigation_screens';
import {AutomatitionExercise} from './exercises';

import './App.css';

import { styled } from '@material-ui/core/styles';

const AbsoluteButtomNavigation = styled(BottomNavigation)({
  position: 'absolute',
  bottom: 0,
  width: '100%',
});

function ScreenById(screenId, exerciseChooseHandler) {
    switch (screenId) {
      case "lesson":
        return <Lesson handler={exerciseChooseHandler} />;
      case "exercises":
        return <Exercises/>
      case "about":
        return <About/>;
      case "exercise":
        return <AutomatitionExercise/>;
      default:
        return <Lesson handler={exerciseChooseHandler} />;
    }
}

function RenderBottomNavbar(screen, setScreenCallback) {
  if (screen !== 'exercise') {
    return (<AbsoluteButtomNavigation
              value={screen}
              onChange={(event, newValue) => {
                      setScreenCallback(newValue);
              }}
              showLabels
              classes={{label: BottomNavigation}}
            >
              <BottomNavigationAction value="lesson" icon={<MenuBook />} />
              <BottomNavigationAction value="exercises"  icon={<Assignment />} />
              <BottomNavigationAction value="about" icon={<Info />} />
            </AbsoluteButtomNavigation>);
  } else {
    return null;
  }
}

function RenderBackButton(screen, prevScreen, setScreenCallback) {
  if (screen === 'exercise') {
    return (<IconButton onClick={()=>{setScreenCallback(prevScreen);}}>
              <ArrowBack />
            </IconButton>);
  } else {
    return null;
  }
}

function App() {
  const [screen, setScreen] = React.useState('lesson');
  const prevScreenRef = React.useRef();
  React.useEffect(() => {
    prevScreenRef.current = screen;
  });
  const prevScreen = prevScreenRef.current;
  const screenElement = ScreenById(screen, ()=>{ setScreen('exercise'); });
  return (
    <div className="App">
        {RenderBackButton(screen, prevScreen, setScreen)}
        {screenElement}
        {RenderBottomNavbar(screen, setScreen)}
    </div>
  );
}

export default App;
