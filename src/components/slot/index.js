import './index.css';

function Slot({ type, onSelect, item }) {
    return (
        <div
            className="slot"
            onClick={onSelect}
        >
            {item && (
                <div className="slot-item-wrapper">
                    <img alt={item.name} loading="lazy" src={item.iconLink} />
                    <div className="slot-item-name-wrapper">{item.shortName}</div>
                </div>
            )}
            {!item && <div className="slot-name-wrapper">{type.replace('mod_', '')}</div>}
        </div>
    );
}

export default Slot;
