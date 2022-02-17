import { useMemo, useState } from 'react';
import './index.css';

function ItemList({ allowedIdsList, items, handleSelect, onHover, possibleItemsConflicts }) {
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
                        <th>NAME</th>
                        <th>ERGONOMICS</th>
                        <th>RECOIL</th>
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
                                <td>{displayItem.itemProperties.Ergonomics || 0}</td>
                                <td>{displayItem.itemProperties.Recoil || 0}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default ItemList;
