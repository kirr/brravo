import React from 'react';
import {Collapse, List, ListItem, ListItemText, Tabs, Tab} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import {config} from '../config.js'

const useStateWithLocalStorage = localStorageKey => {
  const [value, setValue] = React.useState(
    localStorage.getItem(localStorageKey)
  );
  React.useEffect(() => {
    localStorage.setItem(localStorageKey, value);
  }, [value, localStorageKey]);
  return [value, setValue];
};

const useStyles = makeStyles(theme => ({
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function LessonsNavBar(props) {
  return (
     <Tabs
      value={props.lessonId}
      onChange={(event, value)=>{ props.setLessonHandler(value); }}
      variant="scrollable"
      scrollButtons="off"
    >
      {props.lessons.map((item)=>{ return <Tab key={item.id} value={item.id} label={item.name} /> })}
    </Tabs> );
}

function GroupItem(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  return (<div>
            <ListItem key={props.index} button onClick={ ()=> {setOpen(!open);}}>
              <ListItemText primary={props.item.name} secondary={props.item.duration + " мин"} />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
             <List classes={{root: classes.nested}} >
               {props.exercises}
             </List>
           </Collapse>
          </div>);
}

function GetExercises(items, clickHandler) {
  let res = [];
  items.forEach((item, index) => {
      let exElement = null;
      if (item.type === 'group') {
        const exercises = GetExercises(item.items, clickHandler);
        exElement = <GroupItem exercises={exercises} item={item} index={index}/>
      } else {
        exElement = (
          <ListItem key={index} button onClick={()=>{ clickHandler(item); }}>
            <ListItemText primary={item.name} secondary={item.duration + " мин"} />
          </ListItem>);
      }
      res.push(exElement);
  });
  return res;
}

export function Lesson(props) {
  const [lessons, setLessons] = React.useState([]);
  React.useEffect(() => {
    fetch(config.API_URL + '/lessons')
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(response.statusText);
        }
      }).then(data => {
          setLessons(data);
      }).catch(error => console.log(error))
  }, []);

  let [lessonId, setLessonId] = useStateWithLocalStorage('currentLessonId');
  if (!lessonId && lessons.length) {
    lessonId = lessons[0].id;
  }
  const lessonData = lessons.find((item) => { return item.id === lessonId; });
  let exercises = [];
  if (lessonData && lessonData.exercises) {
    lessonData.exercises.forEach((item) => {
      if (item.group_name) {
        let group = exercises.find((val) => { return val.group_name === item.group_name; });
        if (group) {
          group.items.push(item);
          group.duration += item.duration;
        } else {
          exercises.push({
            'items': [item],
            'type': 'group',
            'group_name': item.group_name,
            'name': item.group_name,
            'duration': item.duration
          })
        }
      } else {
          exercises.push(item);
      }
    });
  }

  const exercisesList = GetExercises(exercises, props.handler);
  return (
    <div>
      <LessonsNavBar lessons={lessons}
                     lessonId={lessonId}
                     setLessonHandler={(lessonId)=>{ setLessonId(lessonId); }} />
      <List component="nav">
        {exercisesList}
      </List>
    </div>
  );
}
