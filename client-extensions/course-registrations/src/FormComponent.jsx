import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ClayForm, {ClayInput, ClaySelect} from '@clayui/form';
import ClayButton from '@clayui/button';

import api from './api.js';

import { SiteID } from './constants.js';

/**
 * FormComponent: Implements the form for adding or editing a course registration.
 * @param courses The list of courses.
 * @param statuses The list of registration statuses.
 * @param registration The registration to edit, if any.
 * @param onClearSelection The method to call when the form is cancelled.
 * @param renderToast The method to call to render a toast.
 */
const FormComponent = ( {courses, statuses, registration, onClearSelection, renderToast}) => {
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
            renderToast('Error', 'Please select a course.', 'danger');

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
                renderToast('Registration Added', 'Course registration has been added', 'success');

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
    );
};

export default FormComponent;