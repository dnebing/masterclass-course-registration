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
import ClayButton from '@clayui/button';
import filterAndSortData from './FilterAndSort.js';

const SiteID = "32815";

/**
 * TableComponent: Implements the table for the non-admin view.
 * @param onAddCourseRegistration The method to call when the user wants to add a course registration.
 * @param onRowSelected The method to call when the user selected a row.
 */
function TableComponent({ onRowSelected, onClearSelection }) {
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
     * loadRegistrations: Loads the registration data from the headless endpoint.
     */
    const loadRegistrations = () => {
        fetchRegistrations()
        .then((response) => response.json())
        .then((response) => {
            // save the raw items for later filter/sort updates.
            setRawData(response.items);

            // set the data to the filtered and sorted items.
            setData(filterAndSortData(response.items, filterQuery, sort));
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.log(error);
        });
    }

    /**
     * useEffect: Fetches the registration data when the component is mounted.
     */
    useEffect(() => {
        loadRegistrations();
    }, []);

    /**
     * handleSortChange: Triggered when the sort is changed, either by a new column or direction.
     *
     * @type {(function(*): void)|*}
     */
    const handleSortChange = useCallback(sort => {
        // save the sort state
        setSort(sort);

        // update the data with the new sort
        setData(filterAndSortData(rawData, filterQuery, sort));
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
        // save the filter text
        setFilterQuery(filterText);

        // update the data with the new filter
        setData(filterAndSortData(rawData, filterText, sort));
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
                    id: "courseName",
                    name: "Course"
                }, {
                    id: "registrationStatus",
                    name: "Status"
                }
                ]}>
                {column => (
                    <Cell key={column.id} sortable>{column.name}</Cell>
                )}
                </Head>
                <Body>
                    {data.map(row => (
                        <Row>
                            <Cell>
                                <ClayButton displayType="link" onClick={ () => handleView(row)}>
                                    {row["course"]["name"]}
                                </ClayButton>
                            </Cell>
                            <Cell onClick={ () => handleView(row)}>
                                <ClayButton displayType="link" onClick={ () => handleView(row)}>{row["registrationStatus"]["name"]}</ClayButton>
                            </Cell>
                        </Row>
                    ))}
                </Body>
            </Table>
        </div>
    )
};

export default TableComponent;
