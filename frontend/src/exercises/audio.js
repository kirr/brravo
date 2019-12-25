import React from 'react';
import { Fade, Menu, MenuItem, ListItemIcon, Grid, Button } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import DeleteIcon from '@material-ui/icons/Delete';
import ShareIcon from '@material-ui/icons/Share';
import { makeStyles } from '@material-ui/core/styles';

import MicRecorder from 'mic-recorder-to-mp3';

import {useLongTouch} from '../tools'

const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const recordingStyles = makeStyles({
  player: {
    overflowX: "auto"
  },
  mic: {
    marginRight: "5px"
  }
});

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function() {
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
})

window.oncontextmenu = function() { return false; }

function PlayableCard(props) {
  const color = props.state === "active" ? "primary" : "default";
  const recordMenuTouchHandler = useLongTouch((ev)=>{
    props.setAnchorElHandler(ev.target);
    props.setContextMenuRecordHandler(props.record);
  }, 300);

  return (<Button variant="contained" color={color}
                  onClick={()=>{props.playCardHandler(props.record);}}
                  {...recordMenuTouchHandler} >
            {props.record.name}
          </Button>);
}

function RecordMenu(props) {
  return (<Menu
            id="record_menu"
            anchorEl={props.anchorEl}
            keepMounted
            open={Boolean(props.anchorEl)}
            onClose={props.handleClose}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={props.handleDelete}>
              <ListItemIcon><DeleteIcon fontSize="small"/></ListItemIcon>
              Remove
            </MenuItem>
            <MenuItem onClick={props.handleShare}>
              <ListItemIcon><ShareIcon fontSize="small"/></ListItemIcon>
              Share
            </MenuItem>
          </Menu>);
}

function Player(props) {
  const [playing, setPlaying] = React.useState(false);
  const playRecord = (record)=>{
    const player = document.getElementById('player');
    if (player.src !== record.url) {
      props.activeRecordHandler(record);
      player.pause();
      player.src = record.url;
      player.play();
      setPlaying(true);
    } else {
      if (player.playing) {
        props.activeRecordHandler(null);
        player.pause();
        setPlaying(false);
      } else {
        props.activeRecordHandler(record);
        player.play();
        setPlaying(true);
      }
    }
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [contextMenuRecord, setContextMenuRecord] = React.useState(null);
  const closeMenu = ()=>{setAnchorEl(null);};
  const deleteRecord = ()=>{
    // TODO: stop player
    const newRecords = props.records.filter((item)=>{return item !== contextMenuRecord;});
    if (contextMenuRecord === props.activeRecord) {
      props.activeRecordHandler(null);
    }
    props.setRecordsHandler(newRecords);
    setAnchorEl(null);
  };
  const shareRecord = ()=>{
    //fetch(contextMenuRecord.url).then(r => r.blob()).then(
      //blobData => navigator.share({blob: blobData, title: "Запись упражнения"}));
    console.log('Share');
    setAnchorEl(null);
  };

  return (
    <div>
      <audio id="player" />
      <RecordMenu anchorEl={anchorEl} handleClose={closeMenu}
                  handleDelete={deleteRecord} handleShare={shareRecord} />
      <Grid container wrap="nowrap" direction="row"
                      alignItems="center" justify="flex-start">
          {
            props.records.slice(0).reverse().map((el)=>{
              let state = "inactive";
              if (props.activeRecord === el) {
                state = playing ? "active" : "stopped";
              }
              return (<Grid item key={"grid_card_" + el.name} >
                <PlayableCard key={"card_" + el.name} record={el}
                              playCardHandler={playRecord}
                              setContextMenuRecordHandler={setContextMenuRecord}
                              setAnchorElHandler={setAnchorEl}
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
    navigator.mediaDevices.getUserMedia({ audio: true }).then(
      () => { setBlocked(false);}).catch(
      (err) => { setBlocked(true); console.log(err)});
    return ()=>{ Mp3Recorder.stop(); }
  }, []);

  const [rec, setRec] = React.useState(false);
  const [activeRecord, setActiveRecord] = React.useState(null);
  const [recordsCount, setRecordsCount] = React.useState(0);

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
          const recordName = (recordsCount + 1).toString();
          const newRecord = {"name": recordName, "url": URL.createObjectURL(blob)};
          const newRecords = records.concat([newRecord]);
          setRec(false);
          setRecords(newRecords);
          setRecordsCount(recordsCount + 1);
        }).catch((e) => console.log(e));
    }
  };

  const classes = recordingStyles();
  return (
    <Grid container wrap="nowrap"
                    direction="row" alignItems="center"
                    justify="space-between">
      <Grid item classes={{root: classes.player}} key="grid_player">
        <Player activeRecord={activeRecord} records={records}
                activeRecordHandler={setActiveRecord}
                setRecordsHandler={setRecords}/>
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
