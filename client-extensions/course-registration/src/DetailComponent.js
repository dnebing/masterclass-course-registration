import React, { useState, useEffect } from 'react';
import api from './api.js';
import ActionButtons from './ActionButtons.js';

/**
 * DetailComponent: Implements the detail component.
 * @param externalReferenceCode The external reference code.
 * @param onBackToList The method to call when the back to list button is clicked.
 */
function DetailComponent({ externalReferenceCode , onBackToList }) {
  const [data, setData] = useState(null);

  /**
   * fetchRegistrations: Fetches the list of registrations from the headless endpoint.
   * @returns {Promise<void>}
   */
  const fetchRegistration = () => {
    api('o/c/courseregistrations/by-external-reference-code/' + externalReferenceCode)
        .then((response) => response.json())
        .then((response) => {
            setData(response);
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
        });
  };

  /**
   * useEffect: Fetches the registration data when the component is mounted.
   */
  useEffect(() => {
    fetchRegistration();
  }, []);

  return (
    <div>
      <h1>Registration For {data["course.name"]}</h1>
      <div>
        <label>Attendee: </label>
        <span>{data["creator.name"]}</span>
      </div>
      <div>
        <label>Notes: </label>
        <span>{data["notes"]}</span>
      </div>
      <div>
        <label>Status: </label>
        <span>{data["registrationStatus.name"]}</span>
      </div>
      <div>
        <ActionButtons data={data} onUpdateStatus={fetchRegistration} />
        <ClayButton onClick={onBackToList} displayType='primary'>Back to List</ClayButton>
      </div>
    </div>
  );
};

export default DetailComponent;
