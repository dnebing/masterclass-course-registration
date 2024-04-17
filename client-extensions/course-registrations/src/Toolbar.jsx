import React, { useState } from 'react';
import {ClayButtonWithIcon} from '@clayui/button';
import {ClayInput} from '@clayui/form';
import ClayManagementToolbar from '@clayui/management-toolbar';

/**
 * Toolbar: Implementation of the toolbar component.
 * @param onAddCourseRegistration
 * @param onSearch
 * @returns {JSX.Element}
 * @constructor
 */
const Toolbar = ( { onAddCourseRegistration, onSearch } ) => {
    const [inputValue, setInputValue] = useState('');

    /**
     * handleChange: Handles the change in the search input.
     * @param {*} e The event object.
     */
    const handleChange = (e) => {
        setInputValue(e.target.value);
        onSearch(inputValue);
    };

    /**
     * handleClear: Handles the clear of the search input.
     */
    const handleClear = () => {
        setInputValue('');
        onSearch(inputValue);
    };

    return (
        <ClayManagementToolbar>
            <ClayManagementToolbar.ItemList>
                <ClayManagementToolbar.Search>
                    <ClayInput.Group>
                        <ClayInput.GroupItem>
                            <ClayInput
                                aria-label="Search"
                                className="form-control input-group-inset input-group-inset-after"
                                value={inputValue}
                                type="text"
                                onChange={handleChange}
                            />
                            <ClayInput.GroupInsetItem after tag="span">
                                <ClayButtonWithIcon
                                    aria-label="Close search"
                                    className="navbar-breakpoint-d-none"
                                    displayType="unstyled"
                                    onClick={() => { handleClear(); }}
                                    symbol="times"
                                />
                            </ClayInput.GroupInsetItem>
                        </ClayInput.GroupItem>
                    </ClayInput.Group>
                </ClayManagementToolbar.Search>

                <ClayManagementToolbar.Item>
                    <ClayButtonWithIcon
                        aria-label="Add"
                        className="nav-btn nav-btn-monospaced"
                        symbol="plus"
                        onClick={onAddCourseRegistration}
                    />
                </ClayManagementToolbar.Item>
            </ClayManagementToolbar.ItemList>
        </ClayManagementToolbar>
    );
};

export default Toolbar;
