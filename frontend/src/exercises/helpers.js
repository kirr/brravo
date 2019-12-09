import React from 'react';

import { Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@material-ui/core';

export function FinishPopup(props) {
  return (
    <Dialog
      open={true}
      onClose={props.finishCallback}
    >
      <DialogTitle>Поздравляем!</DialogTitle>
      <DialogContent>
        Вы закончили упражнение. Можно прододжать :)
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.finishCallback} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>);
}
