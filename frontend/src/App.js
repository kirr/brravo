import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Box from '@material-ui/core/Box';
import MenuBook from '@material-ui/icons/MenuBook';
import AssignmentIcon from '@material-ui/icons/Assignment';
import InfoIcon from '@material-ui/icons/Info';
import './App.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import StarIcon from '@material-ui/icons/Star';

import { styled } from '@material-ui/core/styles';

const AbsoluteButtomNavigation = styled(BottomNavigation)({
  position: 'absolute',
  bottom: 0,
  width: '100%',
});

function Lesson() {
  return (
    <List component="nav" aria-label="Lesson">
      <ListItem button>
        <ListItemIcon>
          <StarIcon />
        </ListItemIcon>
        <ListItemText primary="С чего начать" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Базовая гимнастика" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Лошадка и грибок" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Заводим мотор" />
      </ListItem>
      <ListItem button>
        <ListItemText primary="Cлоги РА-РО-РУ" />
      </ListItem>
    </List>
  );
}

function About() {
  return <div/>;
}

function Exercises() {
  return <div/>;
}

function ScreenById(screenId) {
    switch (screenId) {
      case "lesson":
        return <Lesson/>;
      case "exercises":
        return <Exercises/>
      case "about":
        return <About/>;
      default:
        return <Lesson/>;
    }
}

function App() {
  const [screen, setScreen] = React.useState('lesson');
  const screenElement = ScreenById(screen);
  return (
    <div className="App">
        <Box>
          {screenElement}
        </Box>
        <AbsoluteButtomNavigation
          value="lesson"
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
