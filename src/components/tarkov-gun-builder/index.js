import { useState, useMemo } from 'react';

import './index.css';

function ItemList({ allowedIdsList, items, handleSelect, show, onHover }) {
    const displayItems = useMemo(() => {
        return items
            .filter((item) => allowedIdsList.includes(item.id))
            .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name));
    }, [allowedIdsList, items]);

    if (!allowedIdsList) {
        return null;
    }

    if (!show) {
        return null;
    }

    return (
        <div className="select-list-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Ergo</th>
                        <th>Recoil</th>
                    </tr>
                </thead>
                {displayItems.map((displayItem, index) => {
                    // console.log(displayItem)
                    return (
                        <tr
                            key={`selected-item-${index}`}
                            onClick={handleSelect.bind(this, displayItem.id)}
                            onMouseEnter={onHover?.bind(this, displayItem.id)}
                            onMouseLeave={onHover?.bind(this, false)}
                        >
                            <td>{displayItem.name}</td>
                            <td>{displayItem.itemProperties.Ergonomics}</td>
                            <td>{displayItem.itemProperties.Recoil}</td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
}

function Slot({
    slotData,
    items,
    onItemInstalled,
    onItemUninstalled,
    onItemTemporarilyInstalled,
}) {
    const [selectedItemId, setSelectedItemId] = useState(false);
    // const [itemSelectedCallback, setItemSelectedCallback] = useState(() => {});
    const [showSelector, setShowSelector] = useState(false);

    const item = useMemo(() => {
        return items.find((item) => item.id === selectedItemId);
    }, [items, selectedItemId]);

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
            onClick={setShowSelector.bind(this, !showSelector)}
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
            <ItemList
                allowedIdsList={allowedItemIds}
                items={items}
                show={showSelector}
                onHover={onItemTemporarilyInstalled}
                handleSelect={(itemId) => {
                    setSelectedItemId(itemId);
                    onItemInstalled(itemId);
                }}
            />
        </div>
    );
}

function StatsLine({ min, max, value, text, temporaryValue, iconURL }) {
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
            <div className="stats-wrapper">{value}</div>
        </div>
    );
}

function TarkovGunBuilder({ items }) {
    const [selectedGunId, setSelectedGunId] = useState(false);
    const [showGunSelector, setShowGunSelector] = useState(false);
    const [installedItemsIds, setInstalledItemsIds] = useState([]);
    const [installedMounts, setInstalledMounts] = useState({});
    const [temporaryItemId, setTemporaryItem] = useState(false);

    const gun = useMemo(() => {
        return items.find((item) => item.id === selectedGunId);
    }, [items, selectedGunId]);

    const allGuns = useMemo(() => {
        return items
            .filter((item) => item.types.includes('gun'))
            .map((item) => item.id);
    }, [items]);

    const installedItems = useMemo(() => {
        return installedItemsIds.map((id) =>
            items.find((item) => item.id === id),
        );
    }, [items, installedItemsIds]);

    const ergonomicsModifier = useMemo(() => {
        return items
            .filter((item) => installedItemsIds.includes(item.id))
            .map((item) => item.itemProperties.Ergonomics || 0)
            .reduce(
                (previousValue, currentValue) => previousValue + currentValue,
                0,
            );
    }, [items, installedItemsIds]);

    const temporaryErgonomicsModifier = useMemo(() => {
        return (
            items.find((item) => item.id === temporaryItemId)?.itemProperties
                .Ergonomics || 0
        );
    }, [items, temporaryItemId]);

    let weight = 0;

    if (gun) {
        weight =
            (gun.itemProperties?.Weight || 0) +
            installedItems
                .map((item) => item.itemProperties?.Weight || 0)
                .reduce((a, b) => a + b, 0);
    }

    return (
        <div className="builder-outer-wrapper">
            <div>
                <div className="gun-wrapper">
                    <div className="selected-gun-name-wrapper">
                        {gun?.name || 'NO GUN SELECTED'}
                    </div>
                    <div
                        className="gun-selector-wrapper"
                        onClick={setShowGunSelector.bind(
                            this,
                            !showGunSelector,
                        )}
                    >
                        {!gun && <h2>Click to select gun</h2>}
                        {gun && (
                            <div>
                                <div className="weight">
                                    {weight.toFixed(2)}Kg
                                </div>
                                <img
                                    alt={gun.name}
                                    loading="lazy"
                                    src={gun.gridImageLink}
                                />
                            </div>
                        )}
                        <ItemList
                            allowedIdsList={allGuns}
                            items={items}
                            handleSelect={setSelectedGunId}
                            show={showGunSelector}
                        />
                    </div>
                    <div className="stats-wrapper">
                        <StatsLine
                            min={0}
                            max={150}
                            value={
                                gun?.itemProperties.Ergonomics +
                                ergonomicsModifier
                            }
                            text={'Ergonomics'}
                            iconURL={'/icons/ergonomics.jpg'}
                            temporaryValue={
                                gun?.itemProperties.Ergonomics +
                                temporaryErgonomicsModifier
                            }
                        />
                        <StatsLine
                            min={0}
                            max={100}
                            value={55}
                            text={'Accuracy'}
                            iconURL={'/icons/accuracy.jpg'}
                        />
                        <StatsLine
                            min={0}
                            max={100}
                            value={55}
                            text={'Sighting range'}
                            iconURL={'/icons/sighting-range.jpg'}
                        />
                        <StatsLine
                            min={0}
                            max={700}
                            value={gun?.itemProperties.RecoilForceUp}
                            text={'Vertical recoil'}
                            iconURL={'/icons/recoil.jpg'}
                        />
                        <StatsLine
                            min={0}
                            max={1000}
                            value={gun?.itemProperties.RecoilForceBack}
                            text={'Horizontal recoil'}
                            iconURL={'/icons/recoil.jpg'}
                        />
                        <StatsLine
                            min={0}
                            max={1000}
                            value={gun?.itemProperties.RecoilForceBack}
                            text={'Muzzle velocity'}
                            iconURL={'/icons/muzzle-velocity.jpg'}
                        />
                        <div class="grid-container">
                            <div class="grid-item">
                                <div className="horizontal-wrapper">
                                    <img
                                        className="icon"
                                        src={'/icons/types-of-fire.jpg'}
                                        alt="types-of-fire-icon"
                                    />
                                    <div>Types of Fire</div>
                                </div>

                                <div class="grid-item-right">
                                    {gun?.itemProperties.weapFireType.join(
                                        ', ',
                                    ) || '-'}
                                </div>
                            </div>
                            <div class="grid-item">
                                <div className="horizontal-wrapper">
                                    <img
                                        className="icon"
                                        src={'/icons/fire-rate.jpg'}
                                        alt="fire-rate-icon"
                                    />
                                    <div>Fire Rate</div>
                                </div>
                                <div class="grid-item-right">
                                    {gun?.itemProperties.bFirerate || '-'}
                                </div>
                            </div>
                            <div class="grid-item">
                                <div className="horizontal-wrapper">
                                    <img
                                        className="icon"
                                        src={'/icons/caliber.jpg'}
                                        alt="caliber-icon"
                                    />
                                    <div>Caliber</div>
                                </div>
                                <div class="grid-item-right">
                                    {gun?.itemProperties.ammoCaliber.replace(
                                        'Caliber',
                                        '',
                                    ) || '-'}
                                </div>
                            </div>
                            <div class="grid-item">
                                <div className="horizontal-wrapper">
                                    <img
                                        className="icon"
                                        src={'/icons/effective-distance.jpg'}
                                        alt="effective-distance-icon"
                                    />
                                    <div>Effective Distance</div>
                                </div>
                                <div class="grid-item-right">
                                    {gun?.itemProperties.bEffDist || '-'}
                                </div>
                            </div>
                        </div>
                        <div className="slots-wrapper">
                            {gun &&
                                gun.equipmentSlots.map((slot) => {
                                    return (
                                        <Slot
                                            key={`${gun.id}-slot-${slot._name}`}
                                            items={items}
                                            slotData={slot}
                                            onItemInstalled={(newItem) => {
                                                const canMountItems =
                                                    items.find(
                                                        (item) =>
                                                            newItem ===
                                                                item.id &&
                                                            item.slots,
                                                    );

                                                setInstalledItemsIds([
                                                    ...installedItemsIds,
                                                    newItem,
                                                ]);

                                                if (canMountItems) {
                                                    setInstalledMounts({
                                                        ...installedMounts,
                                                        [slot._name]: newItem,
                                                    });
                                                } else {
                                                    if (
                                                        installedMounts[
                                                            slot._name
                                                        ]
                                                    ) {
                                                        const state = {
                                                            ...installedMounts,
                                                        };

                                                        delete state[
                                                            slot._name
                                                        ];

                                                        setInstalledMounts(
                                                            state,
                                                        );
                                                    }
                                                }
                                            }}
                                            onItemUninstalled={(
                                                uninstalledItem,
                                            ) => {
                                                setInstalledItemsIds(
                                                    installedItemsIds.filter(
                                                        (item) =>
                                                            item.id ===
                                                            uninstalledItem.id,
                                                    ),
                                                );
                                            }}
                                            onItemTemporarilyInstalled={
                                                setTemporaryItem
                                            }
                                        />
                                    );
                                })}
                            {Object.keys(installedMounts).map((key) => {
                                const mount = items.find(
                                    (item) => item.id === installedMounts[key],
                                );

                                return mount.equipmentSlots.map((slot) => {
                                    return (
                                        <Slot
                                            key={`${gun.id}-slot-${slot._name}`}
                                            items={items}
                                            slotData={slot}
                                            onItemInstalled={(newItem) => {
                                                setInstalledItemsIds([
                                                    ...installedItemsIds,
                                                    newItem,
                                                ]);
                                            }}
                                            onItemUninstalled={(
                                                uninstalledItem,
                                            ) => {
                                                setInstalledItemsIds(
                                                    installedItemsIds.filter(
                                                        (item) =>
                                                            item.id ===
                                                            uninstalledItem.id,
                                                    ),
                                                );
                                            }}
                                            onItemTemporarilyInstalled={
                                                setTemporaryItem
                                            }
                                        />
                                    );
                                });
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TarkovGunBuilder;
