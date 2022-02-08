import { useState } from 'react';
import './index.css';

function Slot({ type, onSelect, onItemDeselect, item, possibleItemsConflicts }) {
    const [display, setDisplay] = useState(false);

    let conflict = undefined;

    const showButton = (e) => {
        e.preventDefault();
        setDisplay(true);
    };
    const hideButton = (e) => {
        e.preventDefault();
        setDisplay(false);
    };

    if (item) {
        possibleItemsConflicts.forEach((slotItemSet) => {
            slotItemSet.ids.forEach((id) => {
                if (id === item?.id) {
                    conflict = slotItemSet.key;
                }
            });
        });
    }

    return (
        <div className="slot" onClick={onSelect}>
            {item && (
                <div
                    className="slot-item-wrapper"
                    onMouseEnter={(e) => showButton(e)}
                    onMouseLeave={(e) => hideButton(e)}
                >
                    <img alt={item.name} loading="lazy" src={item.iconLink} />
                    {display && <button onClick={onItemDeselect}>Delete</button>}
                    {conflict && `Conflict with ${conflict}`}
                    <div className="slot-item-name-wrapper">{item.shortName}</div>
                </div>
            )}
            {!item && <div className="slot-name-wrapper">{type.replace('mod_', '')}</div>}
        </div>
    );
}

export default Slot;
