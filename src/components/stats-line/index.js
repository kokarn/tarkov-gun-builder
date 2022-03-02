function StatsLine({ min, max, value, text, temporaryValue, iconURL, rightText, invertColors }) {
    if (isNaN(value)) {
        value = 0;
    }
    if (!temporaryValue) {
        temporaryValue = value;
    }

    const positiveColor = !invertColors ? 'tgb-blue' : 'tgb-red';
    const negativeColor = !invertColors ? 'tgb-red' : 'tgb-blue';

    return (
        <div className="tgb-graph-wrapper">
            <div
                className={`tgb-graph ${temporaryValue < value ? negativeColor : ''}`}
                style={{
                    width: `${(value / max) * 100}%`,
                    zIndex: temporaryValue < value ? 0 : 1,
                }}
            />
            <div
                className={`tgb-graph ${temporaryValue < value ? '' : positiveColor}`}
                style={{
                    zIndex: temporaryValue < value ? 1 : 0,
                    width: `${(temporaryValue / max) * 100}%`,
                }}
            />
            <div className="tgb-horizontal-wrapper">
                <img className="tgb-icon" src={iconURL} alt="icon" />
                <div>{text}</div>
            </div>
            <div className="tgb-stats-wrapper">{rightText ? `${value} ${rightText}` : value}</div>
        </div>
    );
}

export default StatsLine;
