import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api.js';
import ActionButtons from './ActionButtons.jsx';

const SiteID = "32815";

/**
 * DetailComponent: Implements the detail component.
 * @param externalReferenceCode The external reference code.
 * @param onClearSelection The method to call when the back to list button is clicked.
 * @param admin The flag to indicate if the user is an admin.
 */
function DetailComponent({ externalReferenceCode , onClearSelection, admin = false }) {
  const [data, setData] = useState(null);

  // Use the navigate hook to navigate to the list view.
  const navigate = useNavigate();

  /**
   * fetchRegistrations: Fetches the list of registrations from the headless endpoint.
   * @returns {Promise<void>}
   */
  const fetchRegistration = () => {
    api('o/c/courseregistrations/scopes/' + SiteID + '/by-external-reference-code/' + externalReferenceCode)
        .then((response) => response.json())
        .then((response) => {
          // response is now the JSON representation of the registration object.
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

  /**
   * handleListView: Handles the back to list button click.
   */
  const handleListView = () => {
    onClearSelection();

    navigate('/');
  }

  return (
    <div>
      { data && ( <div>
      <h1>Registration For {data["course"]["name"]}</h1>
      <div>
        <label>Attendee: </label>
        <span>{data["creator"]["name"]}</span>
      </div>
      <div>
        <label>Notes: </label>
        <span>{data["notes"]}</span>
      </div>
      <div>
        <label>Status: </label>
        <span>{data["registrationStatus"]["name"]}</span>
      </div>
      <div>
        <ActionButtons data={data} onUpdateStatus={fetchRegistration} onBackToList={handleListView} admin={admin} />
      </div>
      </div> )}
    </div>
  );
};

export default DetailComponent;
