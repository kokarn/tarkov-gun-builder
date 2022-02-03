import { useState, useMemo } from 'react';

import ItemList from '../item-list';

import './index.css';

function Slot({
    slotData,
    items,
    onItemInstalled,
    onItemUninstalled,
    onItemTemporarilyInstalled,
    selectedItemsList,
    setSelectedItemsList,
    presetItem,
}) {
    const [selectedItemId, setSelectedItemId] = useState(false);
    // const [itemSelectedCallback, setItemSelectedCallback] = useState(() => {});

    const item = useMemo(() => {
        if (presetItem) {
            return presetItem;
        }

        return items.find((item) => item.id === selectedItemId);
    }, [items, selectedItemId, presetItem]);

    const allowedItemIds = useMemo(() => {
        return items
            .filter((item) =>
                slotData._props.filters[0].Filter.includes(item.id),
            )
            .map((item) => item.id);
    }, [slotData, items]);

    return (
        <div
            className="slot"
            // onClick={setSelectedItemId.bind(this, '55d485be4bdc2d962f8b456f')}
            onClick={() => {
                setSelectedItemsList(slotData._name);
            }}
        >
            {item && (
                <div className="slot-item-wrapper">
                    <img alt={item.name} loading="lazy" src={item.iconLink} />
                    <div className="slot-item-name-wrapper">
                        {item.shortName}
                    </div>
                </div>
            )}
            {!item && (
                <div className="slot-name-wrapper">
                    {slotData._name.replace('mod_', '')}
                </div>
            )}
            {selectedItemsList === slotData._name && (
                <ItemList
                    allowedIdsList={allowedItemIds}
                    items={items}
                    onHover={onItemTemporarilyInstalled}
                    handleSelect={(itemId) => {
                        setSelectedItemId(itemId);
                        onItemInstalled(itemId);
                    }}
                />
            )}
        </div>
    );
}

export default Slot;
