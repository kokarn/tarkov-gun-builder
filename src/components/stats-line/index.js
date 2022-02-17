function StatsLine({ min, max, value, text, temporaryValue, iconURL, rightText, invertColors }) {
    if (isNaN(value)) {
        value = 0;
    }
    if (!temporaryValue) {
        temporaryValue = value;
    }

    const positiveColor = !invertColors ? 'blue' : 'red';
    const negativeColor = !invertColors ? 'red' : 'blue';

    return (
        <div className="graph-wrapper">
            <div
                className={`graph ${temporaryValue < value ? negativeColor : ''}`}
                style={{
                    width: `${(value / max) * 100}%`,
                    zIndex: temporaryValue < value ? 0 : 1,
                }}
            />
            <div
                className={`graph ${temporaryValue < value ? '' : positiveColor}`}
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
