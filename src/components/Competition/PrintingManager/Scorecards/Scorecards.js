import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import CubingIcon from '../../../common/CubingIcon/CubingIcon';
import { downloadScorecards } from '../../../../logic/scorecards';
import { downloadGroupOverview } from '../../../../logic/group-overview';
import { roundsMissingScorecards, parseActivityCode, activityCodeToName } from '../../../../logic/activities';
import { difference } from '../../../../logic/utils';

export default class Scorecards extends Component {
  constructor(props) {
    super(props);
    const rounds = roundsMissingScorecards(this.props.wcif);
    const selectedRounds = rounds.every(round => parseActivityCode(round.id).roundNumber === 1) ? rounds : []
    this.state = {
      selectedRounds
    };
  }

  handleScorecardsDownloadClick = () => {
    downloadScorecards(this.props.wcif, this.state.selectedRounds);
  };

  handleGroupOverviewDownloadClick = () => {
    downloadGroupOverview(this.props.wcif, this.state.selectedRounds);
  };

  handleRoundClick = round => event => {
    const { selectedRounds } = this.state;
    this.setState({
      selectedRounds: selectedRounds.includes(round)
        ? difference(selectedRounds, [round])
        : [...selectedRounds, round]
    });
  };

  render() {
    const { selectedRounds } = this.state;
    const { wcif } = this.props;
    const rounds = roundsMissingScorecards(wcif);

    return (
      <Paper style={{ padding: 16 }}>
        <Typography variant="body1">Select rounds</Typography>
        <List style={{ width: 400 }}>
          {rounds.map(round => (
            <ListItem key={round.id} button onClick={this.handleRoundClick(round)}>
              <ListItemIcon>
                <CubingIcon eventId={parseActivityCode(round.id).eventId} />
              </ListItemIcon>
              <ListItemText primary={activityCodeToName(round.id)} />
              <Checkbox
                checked={selectedRounds.includes(round)}
                tabIndex={-1}
                disableRipple
                style={{ padding: 0 }}
              />
            </ListItem>
          ))}
        </List>
        <Button onClick={this.handleScorecardsDownloadClick} disabled={selectedRounds.length === 0}>
          Scorecards
        </Button>
        <Button onClick={this.handleGroupOverviewDownloadClick} disabled={selectedRounds.length === 0}>
          Group overview
        </Button>
      </Paper>
    );
  }
}
