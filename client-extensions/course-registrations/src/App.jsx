/**
 * App.jsx - This file defines the main component of the application.
 */

import React, { useState, useEffect } from 'react'
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import api from './api.js';
import TableComponent from './TableComponent.jsx';
import DetailComponent from './DetailComponent.jsx';
import FormComponent from './FormComponent.jsx';
import AdminTableComponent from './AdminTableComponent.jsx';
import { RegistrationStatusERC, UpcomingCoursesERC } from './constants.js';
import fetchMap from './fetchMap.js';

import './App.css'

/**
 * App: This is the main  component for the course registrations application.
 * @param {*} admin Flag to indicate to display the admin table or not.
 * @returns 
 */
function App({ admin = false}) {
	const [registrationStatuses, setRegistrationStatuses] = useState({});
	const [upcomingCourses, setUpcomingCourses] = useState([{}]);
	const [selectedRegistration, setSelectedRegistration] = useState(null);

	/**
	 * fetchRegistrationStatuses: Fetches the map of registration statuses.
	 */
	const fetchRegistrationStatuses = async () => {
		try {
			const map = await fetchMap('o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/'
				+ RegistrationStatusERC);
			
			setRegistrationStatuses(map);
		} catch (error) {
			console.log(error);
		}
	};

	/**
	 * fetchUpcomingCourses: Fetches a map of the upcoming courses
	 */
	const fetchUpcomingCourses = async () => {
		try {
		const map = await fetchMap('o/headless-admin-list-type/v1.0/list-type-definitions/by-external-reference-code/'
			+ UpcomingCoursesERC);
	
		setUpcomingCourses(map);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		fetchRegistrationStatuses();
		fetchUpcomingCourses();
	}, []);

	/**
	 * handleRowSelected: When a row is clicked in the table of registrations, this method handles it.
	 * @param registration
	 */
	const handleRowSelected = (registration) => {
		setSelectedRegistration(registration);
	};

	/**
	 * clearSelectedRow: Handled when coming back from a detail view or cancel from a form view.
	 */
	const clearSelectedRow = () => {
		setSelectedRegistration(null);
	};

  return (
		<MemoryRouter initialEntries={['/']}>
		  <Routes>
			<Route path="/" element={ admin ? <AdminTableComponent onRowSelected={handleRowSelected} onClearSelection={clearSelectedRow} /> 
				: <TableComponent onRowSelected={handleRowSelected} onClearSelection={clearSelectedRow} />} />
			<Route path="/detail" element={ <DetailComponent externalReferenceCode={selectedRegistration ? selectedRegistration.externalReferenceCode : null} onClearSelection={clearSelectedRow} admin={admin} />} />
			<Route path="/add" element={ <FormComponent courses={upcomingCourses} statuses={registrationStatuses} registration={null} onClearSelection={clearSelectedRow} />} />
		  </Routes>
		</MemoryRouter>
  )
};

export default App;
