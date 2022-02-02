function StatsLine({
    min,
    max,
    value,
    text,
    temporaryValue,
    iconURL,
    rightText,
}) {
    let percentage = (value / max) * 100;
    return (
        <div className="graph-wrapper">
            <div
                className="graph"
                style={{
                    width: `${percentage}%`,
                }}
            />
            <div
                className="temporary-graph"
                style={{
                    width: `${temporaryValue}%`,
                }}
            />
            <div className="horizontal-wrapper">
                <img className="icon" src={iconURL} alt="icon" />
                <div>{text}</div>
            </div>
            <div className="stats-wrapper">
                {rightText ? `${value} ${rightText}` : value}
            </div>
        </div>
    );
}

export default StatsLine;
