// @flow

import { translate } from '../../../../base/i18n';
import { connect } from '../../../../base/redux';
import { navigate } from '../../../../conference/components/native/ConferenceNavigationContainerRef';
import { screen } from '../../../../conference/components/native/routes';
import AbstractSecurityDialogButton, {
    _mapStateToProps as _abstractMapStateToProps,
    type Props as AbstractSecurityDialogButtonProps
} from '../AbstractSecurityDialogButton';

type Props = AbstractSecurityDialogButtonProps;

/**
 * Implements an {@link AbstractSecurityDialogButton} to open the security screen.
 */
class SecurityDialogButton<P: Props, S:*> extends AbstractSecurityDialogButton<P, S> {

    /**
     * Opens / closes the security screen.
     *
     * @private
     * @returns {void}
     */
    _handleClickSecurityButton() {
        navigate(screen.conference.security);
    }
}

export default translate(connect(_abstractMapStateToProps)(SecurityDialogButton));
