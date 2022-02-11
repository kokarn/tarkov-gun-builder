import { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';

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

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    if (item) {
        possibleItemsConflicts.forEach((slotItemSet) => {
            slotItemSet.ids.forEach((id) => {
                if (id === item?.id) {
                    conflict = slotItemSet.item.name;
                }
            });
        });
    }

    return (
        <div className={`slot ${conflict && 'conflict'}`}>
            {item && (
                <div
                    data-for={type}
                    data-tip={`Cannot install both '${item.name}' and '${conflict}' at the same time`}
                    className="slot-item-wrapper"
                    onMouseEnter={(e) => showButton(e)}
                    onMouseLeave={(e) => hideButton(e)}
                >
                    {display && <button onClick={onItemDeselect}>×</button>}
                    <div onClick={onSelect}>
                        <img alt={item.name} loading="lazy" src={item.iconLink} />
                        <div className="slot-item-name-wrapper">{item.shortName}</div>
                    </div>
                    {conflict && <ReactTooltip id={type} />}
                </div>
            )}
            {!item && (
                <div className="slot-name-wrapper" onClick={onSelect}>
                    <img alt={'item.name'} loading="lazy" src={'/assets/slots/generic.jpg'} />
                    <div>{type.replace('mod_', '').replace('_', ' ').toUpperCase()}</div>
                </div>
            )}
        </div>
    );
}

export default Slot;
