import { useMemo, useState } from 'react';
import './index.css';

function ItemList({ allowedIdsList, items, handleSelect, onHover }) {
    const [searchText, setSearchText] = useState();

    const displayItems = useMemo(() => {
        let results = items.filter((item) => allowedIdsList.includes(item.id));

        if (searchText?.length) {
            results = results.filter((item) => item.name.toLowerCase().includes(searchText));
        }

        return results.sort((itemA, itemB) => itemA.name.localeCompare(itemB.name));
    }, [allowedIdsList, items, searchText]);

    if (!allowedIdsList) {
        return null;
    }

    return (
        <div className="select-list-wrapper">
            <input
                type="text"
                onChange={(e) => {
                    setSearchText(e.target.value);
                }}
                placeholder="Search by item name"
            />
            <table style={{ width: '100%' }}>
                <thead>
                    <tr>
                        <th></th>
                        <th>NAME</th>
                        <th>ERGONOMICS</th>
                        <th>RECOIL</th>
                    </tr>
                </thead>
                <tbody>
                    {displayItems.map((displayItem, index) => {
                        return (
                            <tr
                                className="selected-item"
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
                                <td className="selected-item-name">{displayItem.name}</td>
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
