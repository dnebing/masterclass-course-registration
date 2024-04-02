import React from 'react';
import api from './api.js';
import ClayButton from '@clayui/button';


/**
 * ActionButton: Implements the approve or deny button.
 * @param url The URL to invoke the action.
 * @param onUpdateStatus The method to call when the status is updated.
 * @param displayType The display type of the button.
 * @param label The label of the button.
 */
function ActionButton({ url, onUpdateStatus, displayType, label }) {

    /**
     * handleChangeStatus: Handles the click on the approve or deny button.
     */
    const handleChangeStatus = () => {
        const pos = url.indexOf("/o/c/") + 1;
        const part = url.substring(pos);
    
        // invoke the api to change the status on the record
        api(part, { method: 'PUT' })
        .then((response) => {
            onUpdateStatus();
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return (
        <ClayButton onClick={handleChangeStatus} displayType={displayType}>{label}</ClayButton>
    );
}

export default ActionButton;
