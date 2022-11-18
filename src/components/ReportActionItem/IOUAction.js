import React from 'react';
import PropTypes from 'prop-types';
import {withOnyx} from 'react-native-onyx';
import lodashGet from 'lodash/get';
import ONYXKEYS from '../../ONYXKEYS';
import IOUQuote from './IOUQuote';
import reportActionPropTypes from '../../pages/home/report/reportActionPropTypes';
import IOUPreview from './IOUPreview';
import Navigation from '../../libs/Navigation/Navigation';
import OfflineWithFeedback from '../OfflineWithFeedback';
import * as ReportActions from '../../libs/actions/ReportActions';
import ROUTES from '../../ROUTES';
import styles from '../../styles/styles';

const propTypes = {
    /** All the data of the action */
    action: PropTypes.shape(reportActionPropTypes).isRequired,

    /** The associated chatReport */
    chatReportID: PropTypes.string.isRequired,

    /** Is this IOUACTION the most recent? */
    isMostRecentIOUReportAction: PropTypes.bool.isRequired,

    /* Onyx Props */
    /** chatReport associated with iouReport */
    chatReport: PropTypes.shape({
        /** The participants of this report */
        participants: PropTypes.arrayOf(PropTypes.string),
    }),
};

const defaultProps = {
    chatReport: {
        participants: [],
    },
};

const IOUAction = (props) => {
    const launchDetailsModal = () => {
        Navigation.navigate(ROUTES.getIouDetailsRoute(props.chatReportID, props.action.originalMessage.IOUReportID));
    };
    return (
        <OfflineWithFeedback
            pendingAction={props.action.pendingAction}
            errors={props.action.errors}
            onClose={() => {
                ReportActions.clearSendMoneyErrors();
            }}
            errorRowStyles={[styles.mbn1]}
        >
            <IOUQuote
                action={props.action}
                shouldShowViewDetailsLink={Boolean(props.action.originalMessage.IOUReportID)}
                onViewDetailsPressed={launchDetailsModal}
            />
            {((props.isMostRecentIOUReportAction && Boolean(props.action.originalMessage.IOUReportID))
                || (props.action.originalMessage.type === 'pay')) && (
                    <IOUPreview
                        pendingAction={lodashGet(props.action, 'pendingAction', null)}
                        iouReportID={props.action.originalMessage.IOUReportID.toString()}
                        chatReportID={props.chatReportID}
                        onPayButtonPressed={launchDetailsModal}
                        onPreviewPressed={launchDetailsModal}
                        containerStyles={[styles.cursorPointer]}
                    />
            )}
        </OfflineWithFeedback>
    );
};

IOUAction.propTypes = propTypes;
IOUAction.defaultProps = defaultProps;
IOUAction.displayName = 'IOUAction';

export default withOnyx({
    chatReport: {
        key: ({chatReportID}) => `${ONYXKEYS.COLLECTION.REPORT}${chatReportID}`,
    },
})(IOUAction);
