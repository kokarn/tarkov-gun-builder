import { useMemo, useState } from 'react';

import './index.css';

function ItemList({ allowedIdsList, items, handleSelect, onHover }) {
    const [searchText, setSearchText] = useState();

    const displayItems = useMemo(() => {
        let results = items.filter((item) => allowedIdsList.includes(item.id));

        if (searchText?.length) {
            results = results.filter((item) =>
                item.name.toLowerCase().includes(searchText),
            );
        }

        return results.sort((itemA, itemB) =>
            itemA.name.localeCompare(itemB.name),
        );
    }, [allowedIdsList, items, searchText]);

    if (!allowedIdsList) {
        return null;
    }

    return (
        <div className="select-list-wrapper">
            Search:
            <input
                type="text"
                onChange={(e) => {
                    setSearchText(e.target.value);
                }}
            />
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Name</th>
                        <th>Ergo</th>
                        <th>Recoil</th>
                    </tr>
                </thead>
                <tbody>
                    {displayItems.map((displayItem, index) => {
                        // console.log(displayItem)
                        return (
                            <tr
                                key={`selected-item-${index}`}
                                onClick={handleSelect.bind(this, displayItem.id)}
                                onMouseEnter={onHover?.bind(this, displayItem.id)}
                                onMouseLeave={onHover?.bind(this, false)}
                            >
                                <td>
                                    <img
                                        className="select-list-icon"
                                        alt={displayItem.name}
                                        loading="lazy"
                                        src={displayItem.gridImageLink}
                                    />
                                </td>
                                <td>{displayItem.name}</td>
                                <td>{displayItem.itemProperties.Ergonomics}</td>
                                <td>{displayItem.itemProperties.Recoil}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ItemList;
