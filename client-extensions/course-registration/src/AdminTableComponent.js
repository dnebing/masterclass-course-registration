/**
 * AdminTableComponent.js - Implementation of the admin table component.
 *
 * @author dnebinger
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {Body, Cell, Head, Row, Table, Text } from '@clayui/core';
import api from './api.js';
import Toolbar from "./Toolbar.js";
import ActionButtons from './ActionButtons.js';

const SiteID = "32815";

/**
 * AdminTableComponent: Implements the table for the admin view.
 * @param onViewRegistration
 * @param onAddCourseRegistration
 * @returns {JSX.Element}
 * @constructor
 */
function AdminTableComponent({ onViewRegistration, onAddCourseRegistration }) {
    const [sort, setSort] = useState(null);
    const [data, setData] = useState([]);
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => {
        fetchRegistrations();
    }, []);

    /**
     * fetchRegistrations: Fetches the list of registrations from the headless endpoint.
     * @returns {Promise<void>}
     */
    const fetchRegistrations = async () => {
        api('o/c/courseregistrations/scopes/' + SiteID)
            .then((response) => response.json())
            .then((response) => {
                setData(response.items);
            })
            .catch((error) => {
                // eslint-disable-next-line no-console
                console.log(error);
            });
    };

    /**
     * handleSortChange: Triggered when the sort is changed, either by a new column or direction.
     *
     * @type {(function(*): void)|*}
     */
    const handleSortChange = useCallback(sort => {
        setSort(sort);
    }, []);

    /**
     * filteredAndSortedData: Returns the filtered and sorted data. Since it is based on a memo,
     * it will return cached data when possible, but a change to the filter or sort details or data
     * itself will result in re-filtering and re-sorting.
     * @type {T[]|*[]}
     */
    const filteredAndSortedData = useMemo(() => {
        if (filterQuery.length > 0) {
            if (sort && sort.column && sort.direction) {
                // return the filtered and sorted data
            return data
                .filter(item => item.course.name.toLowerCase().includes(filterQuery) ||
                    item.registrationStatus.name.toLowerCase().includes(filterQuery) ||
                    item.creator.name.toLowerCase().includes(filterQuery))
                .sort((a, b) => {
                    let cmp = new Intl.Collator("en", {numeric: true}).compare(
                        a[sort.column],
                        b[sort.column]
                    );

                    if (sort.direction === "descending") {
                        cmp *= -1;
                    }

                    return cmp;
                });
            }
 
            // no sort, just filter
            return data
                .filter(item => item.course.name.toLowerCase().includes(filterQuery) ||
                    item.registrationStatus.name.toLowerCase().includes(filterQuery));
       }

       if (!sort || !sort.column || !sort.direction) {
        return data;
        }
    
   // no filter, just return the sorted data
        return data
            .sort((a, b) => {
                let cmp = new Intl.Collator("en", {numeric: true}).compare(
                    a[sort.column],
                    b[sort.column]
                );

                if (sort.direction === "descending") {
                    cmp *= -1;
                }

                return cmp;
            });
    }, [ data, filterQuery, sort ] );

    /**
     * handleView: When a row is clicked, this should switch to the item view.
     * @param row Row the click happened on.
     */
    const handleView = (row) => {
        // user wants to view the selected row.
        onViewRegistration(row["externalReferenceCode"]);
    };

    /**
     * handleFilterChange: Called when the filter text is updated.
     * @param filterText The new filter text.
     */
    const handleFilterChange = (filterText) => {
        setFilterQuery(filterText);
    };

    return (
        <div>
            <Toolbar onAddCourseRegistration={onAddCourseRegistration} onSearch={handleFilterChange} />
            <Table onSortChange={handleSortChange} sort={sort}>
                <Head items={[{
                    id: "attendee",
                    name: "Attendee"
                }, {
                    id: "courseName",
                    name: "Course"
                }, {
                    id: "registrationStatus",
                    name: "Status"
                }
                ]}>
                    {column => (
                        <Cell key={column.id} sortable>
                            {column.name}
                        </Cell>
                    )}
                    <Cell key={"actions"} />
                </Head>
                <Body defaultItems={filteredAndSortedData}>
                    {row => (
                        <Row>
                            <Cell onClick={ () => handleView(row)}>
                                <Text size={3} weight="semi-bold">
                                    {row["creator.name"]}
                                </Text>
                            </Cell>
                            <Cell onClick={ () => handleView(row)}>{row["course.name"]}</Cell>
                            <Cell onClick={ () => handleView(row)}>{row["registrationStatus.name"]}</Cell>
                            <Cell>
                                <ActionButtons data={row} onUpdateStatus={fetchRegistrations} />
                            </Cell>
                        </Row>
                    )}
                </Body>
            </Table>
        </div>
    )
};

export default AdminTableComponent;
