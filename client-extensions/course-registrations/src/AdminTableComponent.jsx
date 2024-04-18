/**
 * TableComponent.js - Implementation of the table component.
 *
 * @author dnebinger
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'
import {Body, Cell, Head, Row, Table, Text } from '@clayui/core';
import api from './api.js';
import Toolbar from "./Toolbar.jsx";
import ActionButtons from './ActionButtons.jsx';
import ClayButton from '@clayui/button';
import filterAndSortData from './FilterAndSort.js';

import { SiteID } from './constants.js';

/**
 * AdminTableComponent: Implements the table for the admin view.
 * @param onAddCourseRegistration The method to call when the user wants to add a course registration.
 * @param onRowSelected The method to call when the user selected a row.
 */
const AdminTableComponent = ({ onRowSelected, onClearSelection }) => {
    const [sort, setSort] = useState(null);
    const [data, setData] = useState([]);
    const [filterQuery, setFilterQuery] = useState('');
    const [rawData, setRawData] = useState([]);

    const navigate = useNavigate();

    /**
     * fetchRegistrations: Fetches the list of registrations from the headless endpoint.
     * @returns {Promise<void>}
     */
    const fetchRegistrations = () => {
        return api('o/c/courseregistrations/scopes/' + SiteID);
    };

    /**
     * updateRegistrations: Updates the registrations data from the headless endpoint.
     */
    const updateRegistrations = () => {
        fetchRegistrations()
        .then((response) => response.json())
        .then((response) => {
             // save the raw data to accommodate filter changing
            setRawData(response.items);

            // set the data to be the filtered and sorted items.
            setData(filterAndSortData(response.items, filterQuery, sort, true));
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
        updateRegistrations();
    }, []);

    /**
     * handleSortChange: Triggered when the sort is changed, either by a new column or direction.
     *
     * @type {(function(*): void)|*}
     */
    const handleSortChange = useCallback(sort => {
        setSort(sort);

        setData(filterAndSortData(rawData, filterQuery, sort, true));
    }, []);

    /**
     * handleView: When a row is clicked, this should switch to the item view.
     * @param row Row the click happened on.
     */
    const handleView = (row) => {
        // user wants to view the selected row.
        onRowSelected(row);

        // navigate to the detail view
        navigate('/detail');
    };

    /**
     * handleFilterChange: Called when the filter text is updated.
     * @param filterText The new filter text.
     */
    const handleFilterChange = (filterText) => {
        setFilterQuery(filterText);

        setData(filterAndSortData(rawData, filterText, sort, true));
    };

    /**
     * handleAddNew: Called when the user wants to add a new course registration.
     */
    const handleAddNew = () => {
        onClearSelection();

        navigate('/add');
    }

    return (
        <div>
            <Toolbar onAddCourseRegistration={handleAddNew} onSearch={handleFilterChange} />
            <Table onSortChange={handleSortChange} sort={sort}>
                <Head items={[{
                    id: "attendeeName",
                    name: "Attendee", sortable: true
                }, {
                    id: "courseName",
                    name: "Course", sortable: true
                }, {
                    id: "registrationStatus",
                    name: "Status", sortable: true
                }, {
                    id: "actions",
                    name: "Actions", sortable: false
                }
                ]}>
                {column => (
                <Cell key={column.id} sortable={column.sortable}>
                    {column.name}
                </Cell>
                )}
                </Head>
                <Body>
                    {data.map(row => (
                        <Row>
                            <Cell>
                                <ClayButton displayType="link" onClick={ () => handleView(row)}>
                                    {row["creator"]["id"] === row["r_courseAttendee_userId"] ? row["creator"]["name"] : "Unknown"}
                                </ClayButton>
                            </Cell>
                            <Cell>
                                <ClayButton displayType="link" onClick={ () => handleView(row)}>
                                    {row["course"]["name"]}
                                </ClayButton>
                            </Cell>
                            <Cell>
                                <ClayButton displayType="link" onClick={ () => handleView(row)}>
                                    {row["registrationStatus"]["name"]}
                                </ClayButton>
                            </Cell>
                            <Cell>
                                <ActionButtons data={row} onUpdateStatus={updateRegistrations} admin={true} onBackToList={null} />
                            </Cell>
                        </Row>
                    ))}
                </Body>
            </Table>
        </div>
    )
};

export default AdminTableComponent;
