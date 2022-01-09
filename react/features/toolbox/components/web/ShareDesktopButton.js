// @flow

import { translate } from '../../../base/i18n';
import { IconShareDesktop } from '../../../base/icons';
import JitsiMeetJS from '../../../base/lib-jitsi-meet/_';
import { connect } from '../../../base/redux';
import { AbstractButton, type AbstractButtonProps } from '../../../base/toolbox/components';
import { isScreenVideoShared } from '../../../screen-share';
import { isDesktopShareButtonDisabled } from '../../functions';

type Props = AbstractButtonProps & {

     /**
     * Whether or not screensharing is initialized.
     */
      _desktopSharingEnabled: boolean,

    /**
     * The tooltip key to use when screensharing is disabled. Or undefined
     * if non to be shown and the button to be hidden.
     */
    _desktopSharingDisabledTooltipKey: string,

    /**
     * Whether or not the local participant is screensharing.
     */
     _screensharing: boolean,

    /**
     * The redux {@code dispatch} function.
     */
     dispatch: Function,
};

/**
 * Implementation of a button for sharing desktop / windows.
 */
class ShareDesktopButton extends AbstractButton<Props, *> {
    accessibilityLabel = 'toolbar.accessibilityLabel.shareYourScreen';
    label = 'toolbar.startScreenSharing';
    icon = IconShareDesktop;
    toggledLabel = 'toolbar.stopScreenSharing';
    tooltip = 'toolbar.accessibilityLabel.shareYourScreen';

    /**
     * Retrieves tooltip dynamically.
     */
    get tooltip() {
        const { _desktopSharingDisabledTooltipKey, _desktopSharingEnabled, _screensharing } = this.props;

        if (_desktopSharingEnabled) {
            if (_screensharing) {
                return 'toolbar.stopScreenSharing';
            }

            return 'toolbar.startScreenSharing';
        }

        return _desktopSharingDisabledTooltipKey;
    }

    /**
     * Required by linter due to AbstractButton overwritten prop being writable.
     *
     * @param {string} _value - The icon value.
     */
    set tooltip(_value) {
        // Unused.
    }

    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._screensharing;
    }

    /**
     * Indicates whether this button is in disabled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return !this.props._desktopSharingEnabled;
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
*
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const mapStateToProps = state => {
    let desktopSharingEnabled = JitsiMeetJS.isDesktopSharingEnabled();
    const { enableFeaturesBasedOnToken } = state['features/base/config'];
    let desktopSharingDisabledTooltipKey;

    if (enableFeaturesBasedOnToken) {
        // we enable desktop sharing if any participant already have this
        // feature enabled
        desktopSharingEnabled = state['features/base/participants'].haveParticipantWithScreenSharingFeature;
        desktopSharingDisabledTooltipKey = 'dialog.shareYourScreenDisabled';
    }

    // Disable the screenshare button if the video sender limit is reached and there is no video or media share in
    // progress.
    desktopSharingEnabled = desktopSharingEnabled && !isDesktopShareButtonDisabled(state);

    return {
        _desktopSharingDisabledTooltipKey: desktopSharingDisabledTooltipKey,
        _desktopSharingEnabled: desktopSharingEnabled,
        _screensharing: isScreenVideoShared(state)
    };
};

export default translate(connect(mapStateToProps)(ShareDesktopButton));
