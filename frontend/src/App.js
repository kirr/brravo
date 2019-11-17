import React from 'react';
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import {MenuBook, Assignment, Info} from '@material-ui/icons';
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

function App() {
  const [screen, setScreen] = React.useState('lesson');
  const screenElement = ScreenById(screen, ()=>{ setScreen('exercise'); });
  return (
    <div className="App">
        {screenElement}
        <AbsoluteButtomNavigation
          value={screen}
          onChange={(event, newValue) => {
                  setScreen(newValue);
          }}
          showLabels
          classes={{label: BottomNavigation}}
        >
          <BottomNavigationAction value="lesson" icon={<MenuBook />} />
          <BottomNavigationAction value="exercises"  icon={<Assignment />} />
          <BottomNavigationAction value="about" icon={<Info />} />
        </AbsoluteButtomNavigation>
    </div>
  );
}

export default App;
