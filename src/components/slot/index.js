import { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import BackgroundImage from './assets/background.jpg';

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

    const normalizedType = type
        .replace('_000', '')
        .replace('_001', '')
        .replace('_002', '')
        .replace('_003', '')
        .replace('_004', '')
        .replace('_005', '');
    let image = BackgroundImage;

    try {
        image = require(`./assets/${normalizedType}.png`);
    } catch (error) {}

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
                    <img alt={'item.name'} loading="lazy" src={BackgroundImage} />
                    <img alt={'item.name'} loading="lazy" src={image} />
                    <div>
                        {type.replace('mod_', '').replace('_', ' ').replace('reciever', 'receiver').toUpperCase()}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Slot;
