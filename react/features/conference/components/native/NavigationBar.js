// @flow

import React, { Component } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { getConferenceName } from '../../../base/conference';
import { getFeatureFlag, CONFERENCE_TIMER_ENABLED, MEETING_NAME_ENABLED } from '../../../base/flags';
import { connect } from '../../../base/redux';
import { PictureInPictureButton } from '../../../mobile/picture-in-picture';
import { isToolboxVisible } from '../../../toolbox/functions.native';
import ConferenceTimer from '../ConferenceTimer';

import styles, { NAVBAR_GRADIENT_COLORS } from './styles';
import { ASPECT_RATIO_WIDE } from '../../../base/responsive-ui/constants';

type Props = {

    /**
     * Whether displaying the current conference timer is enabled or not.
     */
    _conferenceTimerEnabled: boolean,

    /**
     * Name of the meeting we're currently in.
     */
    _meetingName: string,

    /**
     * Whether displaying the current meeting name is enabled or not.
     */
    _meetingNameEnabled: boolean,

    /**
     * True if the navigation bar should be visible.
     */
    _visible: boolean
};

/**
 * Implements a navigation bar component that is rendered on top of the
 * conference screen.
 */
class NavigationBar extends Component<Props> {
    /**
     * Implements {@Component#render}.
     *
     * @inheritdoc
     */
    render() {
        if (!this.props._visible) {
            return null;
        }

        const wide = this.props._aspectRatio === ASPECT_RATIO_WIDE;

        return [
            <View
                key = { 2 }
                pointerEvents = 'box-none'
                style = {[ styles.navBarWrapper, wide && { justifyContent: 'flex-end' } ]}>
                {
                    this.props._conferenceTimerEnabled && <ConferenceTimer />
                }
                {/* <PictureInPictureButton
                    styles = { styles.navBarButton } /> */}
                <View
                    pointerEvents = 'box-none'
                    style = { styles.roomNameWrapper }>
                    {
                        this.props._meetingNameEnabled
                        && <Text
                            numberOfLines = { 1 }
                            style = { styles.roomName }>
                            { this.props._meetingName }
                        </Text>
                    }
                </View>
            </View>
        ];
    }

}

/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {Props}
 */
function _mapStateToProps(state) {
    return {
        _conferenceTimerEnabled: getFeatureFlag(state, CONFERENCE_TIMER_ENABLED, true),
        _meetingName: getConferenceName(state),
        _meetingNameEnabled: getFeatureFlag(state, MEETING_NAME_ENABLED, true),
        _visible: isToolboxVisible(state),
        _aspectRatio: state['features/base/responsive-ui'].aspectRatio,
    };
}

export default connect(_mapStateToProps)(NavigationBar);
