import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClayForm, {ClayInput, ClaySelect} from '@clayui/form';
import ClayAlert from '@clayui/alert';
import ClayButton from '@clayui/button';

import api from './api.js';

import { SiteID } from './constants.js';

/**
 * FormComponent: Implements the form for adding or editing a course registration.
 * @param courses The list of courses.
 * @param statuses The list of registration statuses.
 * @param registration The registration to edit, if any.
 * @param onClearSelection The method to call when the form is cancelled.
 */
const FormComponent = ( {courses, statuses, registration, onClearSelection}) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('pending');
    const [id, setId] = useState(null);
    const [toastItems, setToastItems] = useState([]);

    // Use the navigate hook to navigate to the list view.
    const navigate = useNavigate();

    /**
     * useEffect: Update the form fields from the given registration object.
     */
    useEffect(() => {
        if (registration) {
            setSelectedCourse(registration.course.key);
            setNotes(registration.notes);
            setStatus(registration.registrationStatus.key);
            setId(registration.id);
        }
    }, [registration]);

    /**
     * handleFormSubmit: Handles the form submission.
     */
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // make sure the course is selected
        if (!selectedCourse || selectedCourse === '') {
            setToastItems([...toastItems, {title: 'Error', text: 'Please select a course.', displayType: 'danger'}]);

            return;
        }

        // by default we're going to be creating a new registration
        var method = 'POST';
        var body = JSON.stringify({course: {key : selectedCourse}, notes});
        var url = "o/c/courseregistrations/scopes/" + SiteID;

        // if there is a registration object, we're doing an update and not a create.
        if (registration) {
            // switch to a patch method and include the id in the body
            method = 'PATCH';
            url = "o/c/courseregistrations/scopes/" + SiteID + "/by-external-reference-code/" + registration.externalReferenceCode;
        }

        // invoke the api with the method and body
        api(url, { method: method, body: body })
        .then((response) => {
            // check the response from the api call
            if (response.ok) {
                // if the response is ok, clear the selection and navigate back to the list view
                onClearSelection();
                navigate('/');
            }
        })
        .catch((error) => {
            console.log("Error submitting form: ", error);
       });
    };

    /**
     * handleCancel: Handles the cancel button click.
     */
    const handleCancel = () => {
        onClearSelection();
        navigate('/');
    }

    return (
        <div>
            <ClayForm onSubmit={handleFormSubmit}>
                <ClayForm.Group>
                    <label htmlFor="course">Select Course:</label>
                    <ClaySelect id="course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <ClaySelect.Option key="invalid" value="" label="-- Select a Course --" />
                        {Object.entries(courses).map(([courseId, courseName]) => (
                            <ClaySelect.Option key={courseId} value={courseId} label={courseName} />
                        ))}
                    </ClaySelect>
                </ClayForm.Group>

                <ClayForm.Group>
                    <label htmlFor="notes">Notes:</label>
                    <ClayInput id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </ClayForm.Group>

                <ClayForm.Group>
                    <label htmlFor="status">Status:</label>
                    <ClayInput id="status" value={statuses[status]} disabled />
                </ClayForm.Group>

                <ClayForm.Group>
                    <ClayButton.Group spaced>
                        <ClayButton type="button" onClick={handleCancel} displayType="secondary">Cancel</ClayButton>
                        <ClayButton type="submit" displayType="primary">Submit</ClayButton>
                    </ClayButton.Group>
                </ClayForm.Group>
            </ClayForm>
            <ClayAlert.ToastContainer>
                {toastItems.map(value => (
                    <ClayAlert
                        autoClose={5000}
                        key={value}
                        onClose={() => {
                            setToastItems(prevItems =>
                                prevItems.filter(item => item !== value)
                            );
                        }}
                        displayType={value.displayType}
                        title={value.title}
                    >{value.text}</ClayAlert>
                ))}
            </ClayAlert.ToastContainer>
        </div>
    );
};

export default FormComponent;