import { useState, useMemo } from 'react';

import ItemList from '../item-list';
import Slot from '../slot';
import StatsLine from '../stats-line';

import usePreviousValue from '../../hooks/usePreviousValue';

import './index.css';

function TarkovGunBuilder({ items }) {
    const [currentSelector, setCurrentSelector] = useState();
    const [selectedGunId, setSelectedGunId] = useState(false);
    const [installedItemsIds, setInstalledItemsIds] = useState([]);
    const [installedMounts, setInstalledMounts] = useState({});
    const [temporaryItemId, setTemporaryItem] = useState(false);
    const previousGun = usePreviousValue(selectedGunId);

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

    useMemo(() => {
        if (gun !== previousGun && gun) {
            setInstalledItemsIds(
                gun.containsItems.map((containedItem) => containedItem.item.id),
            );
        }
    }, [previousGun, gun, setInstalledItemsIds]);

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
                        onClick={() => {
                            setCurrentSelector('gun');
                        }}
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
                        {currentSelector === 'gun' && (
                            <ItemList
                                allowedIdsList={allGuns}
                                items={items}
                                handleSelect={setSelectedGunId}
                            />
                        )}
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
                            rightText={'m/s'}
                            iconURL={'/icons/muzzle-velocity.jpg'}
                        />
                        <div className="grid-container">
                            <div className="grid-item">
                                <div className="horizontal-wrapper">
                                    <img
                                        className="icon"
                                        src={'/icons/types-of-fire.jpg'}
                                        alt="types-of-fire-icon"
                                    />
                                    <div>Types of Fire</div>
                                </div>

                                <div className="grid-item-right">
                                    {gun?.itemProperties.weapFireType.join(
                                        ', ',
                                    ) || '-'}
                                </div>
                            </div>
                            <div className="grid-item">
                                <div className="horizontal-wrapper">
                                    <img
                                        className="icon"
                                        src={'/icons/fire-rate.jpg'}
                                        alt="fire-rate-icon"
                                    />
                                    <div>Fire Rate</div>
                                </div>
                                <div class="grid-item-right">
                                    {gun
                                        ? `${gun.itemProperties.bFirerate} rpm`
                                        : '-'}
                                </div>
                            </div>
                            <div className="grid-item">
                                <div className="horizontal-wrapper">
                                    <img
                                        className="icon"
                                        src={'/icons/caliber.jpg'}
                                        alt="caliber-icon"
                                    />
                                    <div>Caliber</div>
                                </div>
                                <div className="grid-item-right">
                                    {gun?.itemProperties.ammoCaliber.replace(
                                        'Caliber',
                                        '',
                                    ) || '-'}
                                </div>
                            </div>
                            <div className="grid-item">
                                <div className="horizontal-wrapper">
                                    <img
                                        className="icon"
                                        src={'/icons/effective-distance.jpg'}
                                        alt="effective-distance-icon"
                                    />
                                    <div>Effective Distance</div>
                                </div>
                                <div class="grid-item-right">
                                    {gun
                                        ? `${gun.itemProperties.bEffDist} meters`
                                        : '-'}
                                </div>
                            </div>
                        </div>
                        <div className="slots-wrapper">
                            {gun &&
                                gun.equipmentSlots.map((slot) => {
                                    return (
                                        <Slot
                                            setSelectedItemsList={(
                                                slotName,
                                            ) => {
                                                setCurrentSelector(slotName);
                                            }}
                                            selectedItemsList={currentSelector}
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
                                            setSelectedItemsList={(
                                                slotName,
                                            ) => {
                                                setCurrentSelector(slotName);
                                            }}
                                            selectedItemsList={currentSelector}
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
