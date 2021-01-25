/* @flow */

import React, { Component } from 'react';

import { getConferenceName } from '../../../base/conference/functions';
import { getLocalParticipant, getParticipantCount } from '../../../base/participants/functions';
import Watermarks from '../../../base/react/components/web/Watermarks';
import { connect } from '../../../base/redux';
import { TvtConnectionIndicator } from '../../../connection-indicator/components/web';
import { StatusIndicators } from '../../../filmstrip/components/web';
import { isToolboxVisible } from '../../../toolbox/functions.web';
import ConferenceTimer from '../ConferenceTimer';

import ParticipantsCount from './ParticipantsCount';

declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of {@link Subject}.
 */
type Props = {

    /**
     * Whether then participant count should be shown or not.
     */
    _showParticipantCount: boolean,

    /**
     * The subject or the of the conference.
     * Falls back to conference name.
     */
    _subject: string,

    /**
     * Indicates whether the component should be visible or not.
     */
    _visible: boolean,

    /**
     * The local participant.
     */
    _localParticipant: Object
};

/**
 * Subject react component.
 *
 * @class Subject
 */
class Subject extends Component<Props> {

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _localParticipant, _showParticipantCount, _subject, _visible } = this.props;
        const meetingType = interfaceConfig.MEETING_IS_WAITING_ROOM ? 'waiting-room' : 'conference';

        return (
            <div className = { `subject ${meetingType} ${_visible ? 'visible' : ''}` }>
                <span className = 'subject-text'>{ _subject }</span>
                { _showParticipantCount && <ParticipantsCount /> }
                {/*
                    Threeveta added wrapper.
                    We need the wrapper in order to set min height of
                    the timer.
                    The min-height serves to position the TvtConnectionIndicator
                    before the timer is rendered. Otherways the TvtConnectionIndicator
                    is jumping up after the timer renders.
                */}
                <div className = 'tvt-conference-timer-wrapper'>
                    {!interfaceConfig.MEETING_IS_WAITING_ROOM
                    && <ConferenceTimer />}
                </div>
                <div className = 'tvt-subject-indicator-watermarks-wrapper'>
                    <TvtConnectionIndicator
                        alwaysVisible = { true }
                        iconSize = { 16.5 }
                        isLocalVideo = { true }
                        showLogs = { true } />
                    <Watermarks />
                </div>

                {!interfaceConfig.MEETING_IS_WAITING_ROOM
                && <div className = 'tvt-status-indicators-wrapper'>
                    <StatusIndicators
                        participantID = { _localParticipant.id } />
                </div>}
            </div>
        );
    }
}

/**
 * Maps (parts of) the Redux state to the associated
 * {@code Subject}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _subject: string,
 *     _visible: boolean
 * }}
 */
function _mapStateToProps(state) {
    // const participantCount = getParticipantCount(state);
    const _localParticipant = getLocalParticipant(state);

    return {
        _showParticipantCount: false, // participantCount > 2
        _subject: getConferenceName(state),
        _visible: isToolboxVisible(state), // && participantCount > 1,
        _localParticipant
    };
}

export default connect(_mapStateToProps)(Subject);
