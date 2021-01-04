// @flow

import { translate } from '../../../base/i18n';
import { IconUserGroups } from '../../../base/icons';
import { getParticipantCount, openParticipants } from '../../../base/participants';
import { connect } from '../../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox/components';

/**
 * The type of the React {@code Component} props of {@link ParticipantsButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * Whether the current conference is in audio only mode or not.
     */
    _participantsCount: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * An implementation of a button for toggling the audio-only mode.
 */
class ParticipantsButton extends AbstractButton<Props, *> {
    accessibilityLabel = '';
    icon = IconUserGroups;
    label = this.props.t('toolbar.participants', { count: this.props._participantsCount });

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        // this.props.dispatch(toggleAudioOnly());
        this.props.dispatch(openParticipants())
    }
}

/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ParticipantsButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _audioOnly: boolean
 * }}
 */
function _mapStateToProps(state): Object {
    return {
        _participantsCount: getParticipantCount(state)
    };
}

export default translate(connect(_mapStateToProps)(ParticipantsButton));
