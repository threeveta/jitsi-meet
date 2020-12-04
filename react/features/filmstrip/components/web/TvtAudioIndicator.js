/* @flow */

import React, { Component } from 'react';

import { IconMicDisabled, IconMicEnabled } from '../../../base/icons';
import { BaseIndicator } from '../../../base/react';

/**
 * The type of the React {@code Component} props of {@link AudioMutedIndicator}.
 */
type Props = {

    /**
     * From which side of the indicator the tooltip should appear from.
     */
    tooltipPosition: string,

    muted: boolean,

    isModerator: boolean,
};

/**
 * React {@code Component} for showing an audio muted icon with a tooltip.
 *
 * @extends Component
 */
class TvtAudioIndicator extends Component<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { muted, isModerator } = this.props;
        const className = `audioMuted toolbar-icon ${
            !muted && !isModerator ? 'canBeMuted' : ''}`;
        const tooltipKey = muted
            ? 'videothumbnail.mute'
            : 'threeveta.videothumbnail.audioAvailable';

        return (
            <BaseIndicator
                className = { className }
                icon = { muted ? IconMicDisabled : IconMicEnabled }
                iconId = { muted ? 'mic-disabled' : 'mic-enabled' }
                iconSize = { 13 }
                tooltipKey = { tooltipKey }
                tooltipPosition = { this.props.tooltipPosition } />
        );
    }
}

export default TvtAudioIndicator;

