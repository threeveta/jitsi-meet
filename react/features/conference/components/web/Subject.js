/* @flow */

import React, { Component } from 'react';

import Watermarks from '../../../base/react/components/web/Watermarks';
import { connect } from '../../../base/redux';
import { TvtConnectionIndicator } from '../../../connection-indicator/components/web';
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
     * Indicates whether the component should be visible or not.
     */
    _visible: boolean,
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
        const { _showParticipantCount, _visible } = this.props;
        const meetingType = interfaceConfig.MEETING_IS_WAITING_ROOM ? 'waiting-room' : 'conference';

        return (
            <div className = { `subject ${meetingType} ${_visible ? 'visible' : ''}` }>
                { _showParticipantCount && <ParticipantsCount /> }
                {/*
                    Threeveta added wrapper.
                    We need the wrapper in order to set min height of
                    the timer.
                    The min-height serves to position the TvtConnectionIndicator
                    before the timer is rendered. Otherways the TvtConnectionIndicator
                    is jumping up after the timer renders.
                */}
                <div className = 'tvt-subject-indicator-watermarks-wrapper'>
                    <Watermarks />
                    {!interfaceConfig.MEETING_IS_WAITING_ROOM
                    && <ConferenceTimer />}
                    <TvtConnectionIndicator
                        alwaysVisible = { true }
                        iconSize = { 15.5 }
                        isLocalVideo = { true }
                        showLogs = { true } />
                    {/* {!interfaceConfig.MEETING_IS_WAITING_ROOM && (
                        <div className = 'tvt-status-indicators-wrapper'>
                            <StatusIndicators participantID = { _localParticipant.id } />
                        </div>
                    )} */}
                </div>

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

    return {
        _showParticipantCount: false,
        _visible: isToolboxVisible(state)
    };
}

export default connect(_mapStateToProps)(Subject);
