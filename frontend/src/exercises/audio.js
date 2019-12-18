import React from 'react';
import { Grid, Button } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import { makeStyles } from '@material-ui/core/styles';

import MicRecorder from 'mic-recorder-to-mp3';

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const recordingStyles = makeStyles({
  root: {
    position: "absolute",
    bottom: 0
  },
  player: {
    overflowX: "auto"
  },
  mic: {
    marginRight: "5px"
  }
});

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})

function PlayableCard(props) {
  let color = "default";
  if (props.state === "active") {
    color = "primary";
  } else if (props.state === "stopped") {
    color = "secondary";
  }

  return (<Button variant="contained" color={color} onClick={()=>{props.playCardHandler(props.record);}}>
            {props.record.name}
          </Button>);
}

function Player(props) {
  const [playing, setPlaying] = React.useState(false);
  const playRecord = (record)=>{
    props.activeRecordHandler(record);
    const player = document.getElementById('player');
    if (player.src !== record.url) {
      player.pause();
      player.src = record.url;
      player.play();
      setPlaying(true);
    } else {
      if (player.playing) {
        player.pause();
        setPlaying(false);
      } else {
        player.play();
        setPlaying(true);
      }
    }
  };

  return (
    <div>
      <audio id="player" />
      <Grid container wrap="nowrap" direction="row"
                      alignItems="center" justify="flex-start">
          {
            props.records.slice(0).reverse().map((el)=>{
              let state = "inactive";
              if (props.activeRecord === el) {
                state = playing ? "active" : "stopped";
              }

              return (<Grid item key={"grid_card_" + el.name}>
                <PlayableCard key={"card_" + el.name} record={el}
                              playCardHandler={playRecord}
                              state={state} />
              </Grid>);
            })
          }
      </Grid>
    </div>);
}

function MicButton(props) {
  const micIcon = props.active ? <MicOffIcon/> : <MicIcon/>;
  return (<Button variant="contained"
                  color={props.active ? "default" : "secondary"}
                  disabled={props.disabled}
                  onClick={props.onClick}>
    {micIcon}
  </Button>);
}

export function AudioRecorder(props) {
  const [isBlocked, setBlocked] = React.useState(false);
  React.useEffect(()=>{
    navigator.getUserMedia({ audio: true },
      () => {
        console.log('Permission Granted');
        setBlocked(false);
      },
      () => {
        console.log('Permission Denied');
        setBlocked(true);
      },
    );
  }, []);

  const [rec, setRec] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState(null);
  let [records, setRecords] = React.useState([]);
  const setRecording = (recording)=>{
    if (isBlocked) {
      console.log('Permission Denied');
      return;
    };

    if (recording) {
      Mp3Recorder
        .start()
        .then(() => {
          setRec(true);
          setActiveRecord(null);
        }).catch((e) => console.error(e));
    } else {
      Mp3Recorder
        .stop()
        .getMp3()
        .then(([buffer, blob]) => {
          const newRecord = {"name": (records.length + 1).toString(), "url": URL.createObjectURL(blob)};
          records.push(newRecord);
          setRecords(records);
          setRec(false);
        }).catch((e) => console.log(e));
    }
  };

  const classes = recordingStyles();
  return (
    <Grid container classes={{root: classes.root}}
                    wrap="nowrap"
                    direction="row" alignItems="center"
                    justify="space-between">
      <Grid item classes={{root: classes.player}} key="grid_player">
        <Player activeRecord={activeRecord} records={records}
                activeRecordHandler={setActiveRecord}/>
      </Grid>
      <Grid item classes={{root: classes.mic}} key="grid_mic">
        <MicButton active={rec}
                   onClick={()=>{
                     if (!isBlocked) {
                       setRecording(!rec);
                     }
                   }}
                   disabled={isBlocked}/>
      </Grid>
    </Grid>);
}
