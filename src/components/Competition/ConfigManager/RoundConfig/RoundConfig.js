import React, { PureComponent } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import RoundActivityConfig from '../RoundActivityConfig/RoundActivityConfig';

import { flatMap } from '../../../../logic/helpers';
import { roundIdToShortName } from '../../../../logic/formatters';
import { isActivityConfigurable, updateActivity } from '../../../../logic/activities';

export default class RoundConfig extends PureComponent {
  handleActivityChange = activity => {
    const { wcif, onWcifChange } = this.props;
    onWcifChange(updateActivity(wcif, activity));
  };

  render() {
    const { round, wcif, competitorsByRound } = this.props;

    const activitiesWithRooms = flatMap(wcif.schedule.venues[0].rooms, room =>
      room.activities
        .filter(activity => activity.activityCode.startsWith(round.id))
        .filter(isActivityConfigurable)
        .map(activity => [activity, room])
    );

    return (
      <div>
        <Typography variant="subheading">{roundIdToShortName(round.id)}</Typography>
        <Grid container spacing={16}>
        {activitiesWithRooms.map(([activity, room]) =>
          <Grid item xs key={room.id}>
            <Typography variant="body2">
              <span style={{
                  display: 'inline-block',
                  width: 10, height: 10, marginRight: 5,
                  borderRadius: '100%', backgroundColor: room.color
                }}
              />
              <span>{room.name}</span>
            </Typography>
            <RoundActivityConfig
              activity={activity}
              onChange={this.handleActivityChange}
              roundCompetitors={competitorsByRound[round.id]}
            />
          </Grid>
        )}
      </Grid>
      </div>
    );
  }
}
