function StatsLine({ min, max, value, text, temporaryValue, iconURL, rightText }) {
    if (isNaN(value)) {
        value = 0;
    }
    if (!temporaryValue) {
        temporaryValue = value;
    }
    return (
        <div className="graph-wrapper">
            <div
                className={`graph ${temporaryValue < value ? 'red' : ''}`}
                style={{
                    width: `${(value / max) * 100}%`,
                    zIndex: temporaryValue < value ? 0 : 1,
                }}
            />
            <div
                className={`graph ${temporaryValue < value ? '' : 'blue'}`}
                style={{
                    zIndex: temporaryValue < value ? 1 : 0,
                    width: `${(temporaryValue / max) * 100}%`,
                }}
            />
            <div className="horizontal-wrapper">
                <img className="icon" src={iconURL} alt="icon" />
                <div>{text}</div>
            </div>
            <div className="stats-wrapper">{rightText ? `${value} ${rightText}` : value}</div>
        </div>
    );
}

export default StatsLine;
