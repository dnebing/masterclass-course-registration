import React, { useState } from 'react';
import { ClayForm, ClaySelect, ClayInput, ClayButton } from '@clayui/core';
import ClayAlert from '@clayui/alert';
import api from './api';

/**
 * FormComponent: Implements the form for adding or editing a course registration.
 * @param Courses The list of courses.
 * @param Statuses The list of registration statuses.
 * @param Registration The registration to edit, if any.
 * @param onAfterSave The method to call after the save is complete.
 * @param onCancel The method to call when the form is cancelled.
 */
const FormComponent = ( {Courses, Statuses, Registration, onAfterSave, onCancel}) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [notes, setNotes] = useState('');
    const [status, setStatus] = useState('pending');
    const [id, setId] = useState(null);
    const [toastItems, setToastItems] = useState([]);

    /**
     * onUseEffect: Update the form fields from the given registration object.
     */
    onUseEffect(() => {
        if (Registration) {
            setSelectedCourse(Registration.course.key);
            setNotes(Registration.notes);
            setStatus(Registration.registrationStatus.key);
            setId(Registration.id);
        }
    }, [Registration]);

    /**
     * handleFormSubmit: Handles the form submission.
     */
    const handleFormSubmit = () => {
        // make sure the course is selected
        if (!selectedCourse || selectedCourse === '') {
            setToastItems([...toastItems, {title: 'Error', text: 'Please select a course.', displayType: 'danger'}]);

            return;
        }

        var method = 'POST';
        var body = JSON.stringify({course: {key : selectedCourse}, notes});

        // if there is a registration object, we're doing an update and not a create.
        if (Registration) {
            method = 'PATCH';
            body = JSON.stringify({course: {key : selectedCourse}, notes, id});
        }

        // Call your local function to invoke the api() method for making a REST call
        // to the provided URL
        // Replace 'YOUR_API_URL' with the actual URL
        api('o/c/courseregistrations/', { method: method, body: body })
        .then((response) => {
            onAfterSave();
        })
        .catch((error) => {
            console.log(error);
        });
    };

    return (
        <div>
            <ClayForm onSubmit={handleFormSubmit}>
                <ClayForm.Group>
                    <label htmlFor="course">Select Course:</label>
                    <ClaySelect id="course" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                        <ClaySelect.Option value="">-- Select a Course --</ClaySelect.Option>
                        {Object.entries(Courses).map(([courseID, courseName]) => (
                            <ClaySelect.Option key={courseID} value={courseID}>{courseName}</ClaySelect.Option>
                        ))}
                    </ClaySelect>
                </ClayForm.Group>

                <ClayForm.Group>
                    <label htmlFor="notes">Notes:</label>
                    <ClayInput id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </ClayForm.Group>

                <ClayForm.Group>
                    <label htmlFor="status">Status:</label>
                    <ClayInput id="status" value={Statuses[status]} disabled />
                </ClayForm.Group>

                <ClayForm.Group>
                    <ClayButton type="button" onClick={onCancel}>Cancel</ClayButton>
                    <ClayButton type="submit">Submit</ClayButton>
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
                        spritemap={spritemap}
                        displayType={value.displayType}
                        title={value.title}
                    >{value.text}</ClayAlert>
                ))}
            </ClayAlert.ToastContainer>
        </div>
    );
};

export default FormComponent;