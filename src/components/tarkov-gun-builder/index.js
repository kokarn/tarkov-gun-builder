import { useState, useMemo } from 'react';

import ItemList from '../item-list';
import Slot from '../slot';
import StatsLine from '../stats-line';

import usePreviousValue from '../../hooks/usePreviousValue';

import './index.css';

function TarkovGunBuilder({ items, presets, defaultPresets }) {
    const [currentSelector, setCurrentSelector] = useState();
    const [selectedGunId, setSelectedGunId] = useState(false);
    const [temporaryItemId, setTemporaryItem] = useState(false);
    const previousGun = usePreviousValue(selectedGunId);
    const [currentBuild, setCurrentBuild] = useState({});

    const gun = useMemo(() => {
        return items.find((item) => item.id === selectedGunId);
    }, [items, selectedGunId]);

    const gunPresetId = useMemo(() => {
        if (!gun) {
            return false;
        }

        for (const presetId in defaultPresets) {
            if (gun.id === defaultPresets[presetId].baseId) {
                return presetId;
            }
        }

        return false;
    }, [gun, defaultPresets]);

    const allGuns = useMemo(() => {
        return items
            .filter((item) => item.types.includes('gun'))
            .map((item) => item.id);
    }, [items]);

    // todo make this a memo
    const installedItems = 
         (currentBuild.slots || [])
            .map((slot) => items.find((item) => item.id === slot.item))
            .filter((slot) => !!slot); // todo this line should not be necessary but there are undefined items

    useMemo(() => {
        if (gun !== previousGun && gun) {
            const defaultBuild = {
                slots: [
                    ...gun.equipmentSlots.map((slot) => {
                        return {
                            id: slot._name,
                            item: undefined,
                            slots: [],
                        };
                    }),
                ],
            };
            const gunPreset = presets[gunPresetId];

            for (const presetItem of gunPreset._items) {
                if (!presetItem.slotId) {
                    continue;
                }

                const slot = defaultBuild.slots.find(
                    (slot) => slot.id === presetItem.slotId,
                );

                if (slot) {
                    slot.item = presetItem._tpl;
                }
            }

            console.log(defaultBuild);
            setCurrentBuild(defaultBuild);
        }
    }, [previousGun, gun, gunPresetId, presets]);

    // todo
    // const ergonomicsModifier = useMemo(() => {
    //     return items
    //         .filter((item) => installedItemsIds.includes(item.id))
    //         .map((item) => item.itemProperties.Ergonomics || 0)
    //         .reduce(
    //             (previousValue, currentValue) => previousValue + currentValue,
    //             0,
    //         );
    // }, [items, installedItemsIds]);

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
                                gun?.itemProperties.Ergonomics + 0 // ergonomicsModifier todo
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
                                <div className="grid-item-right">
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
                                <div className="grid-item-right">
                                    {gun
                                        ? `${gun.itemProperties.bEffDist} meters`
                                        : '-'}
                                </div>
                            </div>
                        </div>
                        <div className="slots-wrapper">
                            {(currentBuild.slots || []).map((slot) => {
                                const slotData = gun.equipmentSlots.find(
                                    (eqSlot) => slot.id === eqSlot._name,
                                );

                                const presetItem = items.find(
                                    (item) => item.id === slot.item,
                                );

                                return (
                                    <Slot
                                        setSelectedItemsList={(slotName) => {
                                            setCurrentSelector(slotName);
                                        }}
                                        selectedItemsList={currentSelector}
                                        key={`${gun.id}-slot-${slot.id}`}
                                        items={items}
                                        slotData={slotData}
                                        presetItem={presetItem}
                                        onItemInstalled={(newItem) => {
                                            console.log(newItem);
                                        }}
                                        onItemUninstalled={(
                                            uninstalledItem,
                                        ) => {
                                            console.log(uninstalledItem);
                                        }}
                                        onItemTemporarilyInstalled={
                                            setTemporaryItem
                                        }
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TarkovGunBuilder;
