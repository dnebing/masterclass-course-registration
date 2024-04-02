import React from 'react';
import ActionButton from './ActionButton';

/**
 * ActionButtons: Implements the approve and deny buttons.
 * @param data The data object.
 * @param onUpdateStatus The method to call when the status is updated.
 */
function ActionButtons({ data, onUpdateStatus }) {
    if (data && data.actions && (data.actions.approveRegistration || data.actions.denyRegistration)) {
        return (
            <div>
                {data.actions.denyRegistration && ( <ActionButton url={data['actions.denyRegistration.href']} onClick={onUpdateStatus} displayType="secondary" label="Deny" /> )}
                {data.actions.approveRegistration && ( <ActionButton url={data['actions.approveRegistration.href']} onClick={onUpdateStatus} displayType="primary" label="Approve" /> )}
            </div>
        );
    }
    return null;
}

export default ActionButtons;

