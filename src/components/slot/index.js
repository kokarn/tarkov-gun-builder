import './index.css';

function Slot({ slotName, setSelectedItemsList, item }) {
    return (
        <div
            className="slot"
            onClick={() => {
                setSelectedItemsList(slotName, item);
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
                    {slotName.replace('mod_', '')}
                </div>
            )}
        </div>
    );
}

export default Slot;
