import './index.css';

function Slot({ type, onSelect, item, possibleItemsConflicts }) {
    let conflict = undefined;

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
                <div className="slot-item-wrapper">
                    <img alt={item.name} loading="lazy" src={item.iconLink} />
                    {conflict && `Conflict with ${conflict}`}
                    <div className="slot-item-name-wrapper">{item.shortName}</div>
                </div>
            )}
            {!item && <div className="slot-name-wrapper">{type.replace('mod_', '')}</div>}
        </div>
    );
}

export default Slot;
