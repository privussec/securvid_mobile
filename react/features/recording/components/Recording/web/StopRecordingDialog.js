// @flow

import React from 'react';

import { Dialog } from '../../../../base/dialog';
import { translate } from '../../../../base/i18n';
import { connect } from '../../../../base/redux';
import { toggleScreenshotCaptureSummary } from '../../../../screenshot-capture';
import AbstractStopRecordingDialog, {
    type Props,
    _mapStateToProps
} from '../AbstractStopRecordingDialog';

/**
 * React Component for getting confirmation to stop a file recording session in
 * progress.
 *
 * @augments Component
 */
class StopRecordingDialog extends AbstractStopRecordingDialog<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;

        return (
            <Dialog
                okKey = 'dialog.confirm'
                onSubmit = { this._onSubmit }
                titleKey = 'dialog.recording'
                width = 'small'>
                { t('dialog.stopRecordingWarning') }
            </Dialog>
        );
    }

    _onSubmit: () => boolean;

    /**
     * Toggles screenshot capture.
     *
     * @returns {void}
     */
    _toggleScreenshotCapture() {
        this.props.dispatch(toggleScreenshotCaptureSummary(false));
    }
}

export default translate(connect(_mapStateToProps)(StopRecordingDialog));
