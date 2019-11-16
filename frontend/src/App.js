import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Box from '@material-ui/core/Box';
import MenuBook from '@material-ui/icons/MenuBook';
import AssignmentIcon from '@material-ui/icons/Assignment';
import InfoIcon from '@material-ui/icons/Info';
import './App.css';

import {List, ListItem, ListItemText} from '@material-ui/core';

import { styled, makeStyles } from '@material-ui/core/styles';

import { Grid, Paper } from '@material-ui/core';

const AbsoluteButtomNavigation = styled(BottomNavigation)({
  position: 'absolute',
  bottom: 0,
  width: '100%',
});

function Lesson(props) {
  return (
    <List component="nav" aria-label="Lesson">
      <ListItem button>
        <ListItemText primary="С чего начать" secondary="5 мин" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Базовая гимнастика" secondary="3 мин" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Лошадка и грибок" secondary="2 мин" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Заводим мотор" secondary="2 мин" />
      </ListItem>
      <ListItem button onClick={props.handler}>
        <ListItemText primary="Cлоги РА-РО-РУ" secondary="5 мин"/>
      </ListItem>
    </List>
  );
}

function About() {
  return (<Box>
    По всем вопросам: <a href="mailto:info@brravo.ru">info@brravo.ru</a>
    </Box>);
}

function Exercises() {
  return <Box>Список упражнений</Box>;
}

const gridStyles = makeStyles({
  root: {
    position: "absolute",
    top: "calc(50% - 40px)",
    width: "100%"
  }
});

function AutomatitionExercise() {
  const classes = gridStyles();
  return (<Grid container classes={{root: classes.root}} justify="center" spacing={2}>
          {["Pa", "Pa", "Pa"].map(value => (
            <Grid key={value} item>
              <Paper elevation={5}>{value}</Paper>
            </Grid>
          ))}
    </Grid>);
}

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
        <Box>
          {screenElement}
        </Box>
        <AbsoluteButtomNavigation
          value={screen}
          onChange={(event, newValue) => {
                  setScreen(newValue);
          }}
          showLabels
          classes={{label: BottomNavigation}}
        >
          <BottomNavigationAction value="lesson" icon={<MenuBook />} />
          <BottomNavigationAction value="exercises"  icon={<AssignmentIcon />} />
          <BottomNavigationAction value="about" icon={<InfoIcon />} />
        </AbsoluteButtomNavigation>
    </div>
  );
}

export default App;
