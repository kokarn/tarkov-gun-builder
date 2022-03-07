import React, { useEffect, useMemo, useState } from 'react';
import usePreviousValue from '../../hooks/usePreviousValue.js';
import './index.css';

function ItemList({ slotType, allowedIdsList, items, handleSelect, onHover, possibleItemsConflicts }) {
    const [searchText, setSearchText] = useState('');
    const [sortedByKey, setSortedByKey] = useState({ key: null, order: 'asc' });
    const previousAllowedIdsLength = usePreviousValue(allowedIdsList.length);

    const displayItems = useMemo(() => {
        let results = [...items.filter((item) => allowedIdsList.includes(item.id))];

        if (searchText?.length) {
            results = results.filter((item) => item.name.toLowerCase().includes(searchText));
        }

        if (!sortedByKey.key || sortedByKey.key === 'name') {
            results.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name));

            if (sortedByKey.order === 'desc') {
                results = results.reverse();
            }
        } else {
            results.sort((itemA, itemB) => {
                return (
                    parseFloat(itemA.itemProperties[sortedByKey.key] || 0) -
                    parseFloat(itemB.itemProperties[sortedByKey.key] || 0)
                );
            });

            if (sortedByKey.order === 'desc') {
                results = results.reverse();
            }
        }

        return results;
    }, [allowedIdsList, items, searchText, sortedByKey]);

    useEffect(() => {
        if (previousAllowedIdsLength !== allowedIdsList.length) {
            setSearchText('');
            setSortedByKey({ key: null, order: 'asc' });
        }
    }, [previousAllowedIdsLength, allowedIdsList.length]);

    if (!allowedIdsList) {
        return null;
    }

    let keys = ['Ergonomics', 'Recoil'];
    let tableHeaders = ['ergo', 'recoil'];
    let symbols = ['', '%'];

    if (slotType === 'mod_scope') {
        keys = ['Ergonomics', 'sightingRange'];
        tableHeaders = ['ergo', 'sighting r.'];
        symbols = ['', ''];
    } else if (slotType === 'mod_sight_front') {
        keys = ['Ergonomics', 'sightingRange'];
        tableHeaders = ['ergo', 'sighting r.'];
        symbols = ['', ''];
    } else if (slotType === 'mod_sight_rear') {
        keys = ['Ergonomics', 'sightingRange'];
        tableHeaders = ['ergo', 'sighting r.'];
        symbols = ['', ''];
    } else if (slotType === 'mod_magazine') {
        keys = ['Ergonomics'];
        tableHeaders = ['ergo'];
        symbols = [''];
    } else if (slotType === 'mod_chamber') {
        keys = [];
        tableHeaders = [];
        symbols = [];
    } else if (!slotType) {
        keys = ['Ergonomics'];
        tableHeaders = ['ergonomics'];
        symbols = ['%'];
    }

    return (
        <div className="select-list-wrapper">
            <input
                type="text"
                onChange={(e) => {
                    setSearchText(e.target.value);
                }}
                placeholder="Search by Item Name"
                // ref={(input) => {
                //     if (input != null) {
                //         input.focus();
                //     }
                // }}
                value={searchText}
            />
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    verticalAlign: 'middle',
                }}
            >
                <thead>
                    <tr>
                        <th></th>
                        <th>
                            NAME
                            <div className="order-by-buttons">
                                <div
                                    onClick={() => {
                                        setSortedByKey({ key: 'name', order: 'asc' });
                                    }}
                                >
                                    ▲
                                </div>
                                <br />
                                <div
                                    onClick={() => {
                                        setSortedByKey({ key: 'name', order: 'desc' });
                                    }}
                                >
                                    ▼
                                </div>
                            </div>
                        </th>
                        {tableHeaders.map((header, index) => {
                            return (
                                <th>
                                    <div>{header.toUpperCase()}</div>
                                    <div className="order-by-buttons">
                                        <div
                                            onClick={() => {
                                                setSortedByKey({ key: keys[index], order: 'asc' });
                                            }}
                                        >
                                            ▲
                                        </div>
                                        <div
                                            onClick={() => {
                                                setSortedByKey({ key: keys[index], order: 'desc' });
                                            }}
                                        >
                                            ▼
                                        </div>
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {displayItems.map((displayItem, index) => {
                        const conflict = possibleItemsConflicts.find((x) => x.ids.includes(displayItem.id));
                        let conflictText;

                        if (conflict) {
                            conflictText = `This mod conflicts with '${conflict.item.name}'`;
                        }

                        return (
                            <tr
                                className={`selected-item ${conflict && 'conflict'}`}
                                key={`selected-item-${index}`}
                                onClick={handleSelect.bind(this, displayItem.id)}
                                onMouseEnter={onHover?.bind(this, displayItem.id)}
                                onMouseLeave={onHover?.bind(this, false)}
                            >
                                <td>
                                    <img
                                        className="selected-item-image"
                                        alt={displayItem.name}
                                        loading="lazy"
                                        src={displayItem.gridImageLink}
                                    />
                                </td>
                                <td className="selected-item-name">
                                    <div>
                                        <p>{displayItem.name}</p>
                                        <p className="selected-item-name-conflict">{conflictText}</p>
                                    </div>
                                </td>
                                {tableHeaders.map((_, index) => {
                                    return (
                                        <td>
                                            {displayItem.itemProperties[keys[index]] || 0}
                                            {symbols[index]}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ItemList;
