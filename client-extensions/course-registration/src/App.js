/**
 * App.js - Contains the definition of the course registration custom fragment.
 *
 * @author dnebinger
 */


import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import TableComponent from './TableComponent.js'
import FormComponent from './FormComponent.js'
import DetailComponent from './DetailComponent.js'
import AdminTableComponent from './AdminTableComponent.js'

import api from './api.js';

/*

NOTES:

  Picklists:
    Upcoming Courses:    "externalReferenceCode": "349e4cd7-9a49-d708-cef9-e4c3505caf8d",
    Registration Status: "externalReferenceCode": "8cc56fb2-6de7-df6d-84de-6d81135c26aa",
 */

// should probably look these up instead of hard-coding them.
const UpcomingCoursesERC = "349e4cd7-9a49-d708-cef9-e4c3505caf8d";
const RegistrationStatusERC = "8cc56fb2-6de7-df6d-84de-6d81135c26aa";

const SiteID = "32815";

/**
 * App: This is the application for the course registration.
 *
 * @author dnebinger
 */
const App = ({ admin }) => {
	const [view, setView] = useState('list'); // 'list', 'detail', 'add'
	const [registrationStatuses, setRegistrationStatuses] = useState({});
	const [upcomingCourses, setUpcomingCourses] = useState([{}]);
	const [registrations, setRegistrations] = useState([]);
	const [selectedRegistration, setSelectedRegistration] = useState(null);

	useEffect(() => {
		console.log("App has been bound, fetching data...");

		fetchRegistrationStatuses();
		fetchUpcomingCourses();
	}, []);

	/**
	 * fetchRegistrationStatuses: Fetches the map of registration statuses.
	 * @returns {Promise<void>}
	 */
	const fetchRegistrationStatuses = async () => {
		api('o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/'
			+ RegistrationStatusERC)
			.then((response) => response.json())
			.then((response) => {
				console.log("Have response ", response);

				if (response.listTypeEntries) {
					// extract the object
					const statusObject = response.listTypeEntries.reduce((acc, entry) => {
						acc[entry.key] = entry.name;
						return acc;
					}, {});

					// set it as the value
					setRegistrationStatuses(statusObject);

					console.log("Set registration statuses to ", statusObject);
				}
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.log(error);
			});
	};

	/**
	 * fetchUpcomingCourses: Fetches a map of the upcoming courses
	 * @returns {Promise<void>}
	 */
	const fetchUpcomingCourses = async () => {
		api('o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/'
			+ UpcomingCoursesERC)
			.then((response) => response.json())
			.then((response) => {
				if (response.listTypeEntries) {
					// extract the object
					const courses = response.listTypeEntries.reduce((acc, entry) => {
						acc[entry.key] = entry.name;
						return acc;
					}, {});

					// set it as the value
					setUpcomingCourses(courses);

					console.log("Set upcoming courses to ", courses);
				}
			})
			.catch((error) => {
				// eslint-disable-next-line no-console
				console.log(error);
			});
	};

	/**
	 * handleRowClick: When a row is clicked in the table of registrations, this method handles it.
	 * @param registration
	 */
	const handleRowClick = (registration) => {
		setSelectedRegistration(registration);
		setView('detail');
	};

	/**
	 * handleList: Handled when coming back from a detail view or cancel from a form view.
	 */
	const handleList = () => {
		setSelectedRegistration(null);
		setView('list');
	};

	/**
	 * handleAddNew: When the add button is clicked, this method handles it.
	 */
	const handleAddNew = () => {
		setRegistrationStatuses(null);
		setView('add');
	};

	// Render functions for each view: renderTable, renderDetail, renderAddForm
	return (
		<div>

			{view === 'list' && admin ? <AdminTableComponent onViewRegistration={handleRowClick} onAddCourseRegistration={handleAddNew} /> : 
										<TableComponent onViewRegistration={handleRowClick} onAddCourseRegistration={handleAddNew}  />}
			{view === 'detail' && selectedRegistration && (
				<DetailComponent
					externalReferenceCode={selectedRegistration.externalReferenceCode}
					onBackToList={handleList}
				/>
			)}
			{view === 'add' && (
				<FormComponent Courses={upcomingCourses} Statuses={registrationStatuses} Registration={null} 
					onAfterSave={handleList} onCancel={handleList} />
			)}
		</div>
	);}

export default App;