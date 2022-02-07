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
    const [currentBuild, setCurrentBuild] = useState({
        slots: [],
    });

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

    const handleSlotSet = (slotName, slotData) => {
        console.log(slotName, slotData);
        setCurrentSelector({
            slotName: slotName,
            item: slotData,
        });
    };

    const allGuns = useMemo(() => {
        return items.filter((item) => item.types.includes('gun')).map((item) => item.id);
    }, [items]);

    // todo make this a memo
    const installedItems = currentBuild.slots || [];
    // .map((slot) => items.find((item) => item.id === slot.item))
    // .filter((slot) => !!slot); // todo this line should not be necessary but there are undefined items

    useMemo(() => {
        if (gun !== previousGun && gun) {
            const defaultBuild = {
                slots: [
                    ...gun.equipmentSlots.map((slot) => {
                        return {
                            type: slot._name,
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

                const slot = defaultBuild.slots.find((slot) => slot.type === presetItem.slotId);

                if (slot) {
                    const slotItem = items.find((item) => item.id === presetItem._tpl);
                    slot.item = slotItem;

                    if (slotItem.equipmentSlots) {
                        slot.slots = slotItem.equipmentSlots.map((equipmentSlot) => {
                            return {
                                type: equipmentSlot._name,
                                item: undefined,
                                slots: [],
                            };
                        });
                    }
                }
            }

            setCurrentBuild(defaultBuild);
        }
    }, [previousGun, gun, gunPresetId, presets, items]);

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
        return items.find((item) => item.id === temporaryItemId)?.itemProperties.Ergonomics || 0;
    }, [items, temporaryItemId]);

    let weight = 0;

    if (gun) {
        weight =
            (gun.itemProperties?.Weight || 0) +
            installedItems.map((item) => item.itemProperties?.Weight || 0).reduce((a, b) => a + b, 0);
    }

    // todo useMemo here
    // const allSlots = [];

    // const flattenSlots = (slots) => {
    //     slots.forEach((slot) => {
    //         allSlots.push(slot);

    //         if (slot.slots) {
    //             flattenSlots(slot.slots);
    //         }
    //     });
    // };

    // flattenSlots(currentBuild.slots || []);

    let allowedIdsList = [];
    let handleSelect;

    if (currentSelector) {
        if (currentSelector.slotName === 'gun') {
            allowedIdsList = allGuns;
            handleSelect = setSelectedGunId;
        } else {
            const slotData = gun.equipmentSlots.find((eqSlot) => currentSelector.slotName === eqSlot._name);

            allowedIdsList = items
                .filter((item) => slotData._props.filters[0].Filter.includes(item.id))
                .map((item) => item.id);
        }
    }

    console.log(currentBuild);

    return (
        <div className="builder-outer-wrapper">
            <div>
                <div className="gun-wrapper">
                    <div className="selected-gun-name-wrapper">{gun?.name || 'NO GUN SELECTED'}</div>
                    <div
                        className="gun-selector-wrapper"
                        onClick={() => {
                            setCurrentSelector({ slotName: 'gun' });
                        }}
                    >
                        {!gun && <h2>Click to select gun</h2>}
                        {gun && (
                            <div>
                                <div className="weight">{weight.toFixed(2)}Kg</div>
                                <img alt={gun.name} loading="lazy" src={gun.gridImageLink} />
                            </div>
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
                            temporaryValue={gun?.itemProperties.Ergonomics + temporaryErgonomicsModifier}
                        />
                        <StatsLine min={0} max={100} value={55} text={'Accuracy'} iconURL={'/icons/accuracy.jpg'} />
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
                                    <img className="icon" src={'/icons/types-of-fire.jpg'} alt="types-of-fire-icon" />
                                    <div>Types of Fire</div>
                                </div>

                                <div className="grid-item-right">
                                    {gun?.itemProperties.weapFireType.join(', ') || '-'}
                                </div>
                            </div>
                            <div className="grid-item">
                                <div className="horizontal-wrapper">
                                    <img className="icon" src={'/icons/fire-rate.jpg'} alt="fire-rate-icon" />
                                    <div>Fire Rate</div>
                                </div>
                                <div className="grid-item-right">
                                    {gun ? `${gun.itemProperties.bFirerate} rpm` : '-'}
                                </div>
                            </div>
                            <div className="grid-item">
                                <div className="horizontal-wrapper">
                                    <img className="icon" src={'/icons/caliber.jpg'} alt="caliber-icon" />
                                    <div>Caliber</div>
                                </div>
                                <div className="grid-item-right">
                                    {gun?.itemProperties.ammoCaliber.replace('Caliber', '') || '-'}
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
                                    {gun ? `${gun.itemProperties.bEffDist} meters` : '-'}
                                </div>
                            </div>
                        </div>
                        <div className="slots-wrapper">
                            {currentBuild.slots.map((slot, index) => {
                                return (
                                    <Slot
                                        setCurrentSelector={handleSlotSet}
                                        key={`${gun.id}-slot-${index}`}
                                        items={items}
                                        type={slot.type}
                                        item={slot.item}
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="selector">
                    {currentSelector && (
                        <ItemList
                            allowedIdsList={allowedIdsList}
                            items={items}
                            handleSelect={(itemId) => {
                                setCurrentSelector();

                                if (currentSelector.slotName === 'gun') {
                                    handleSelect(itemId);
                                    return;
                                }

                                const itemHasSlots = items.find((item) => itemId === item.id && item.slots);

                                const additionalSlots = [];

                                if (itemHasSlots) {
                                    itemHasSlots.equipmentSlots.forEach((slot) => {
                                        additionalSlots.push({
                                            id: slot._name,
                                            item: slot._id,
                                            slots: [], // todo should this be recursive?
                                        });
                                    });
                                }

                                const slots = [...currentBuild.slots, ...additionalSlots];

                                const walkSlots = (slots) => {
                                    slots.forEach((slot) => {
                                        if (slot.id === currentSelector.slotName) {
                                            slot.item = itemId;
                                        } else if (slot.slots) {
                                            walkSlots(slot.slots);
                                        }
                                    });
                                };

                                walkSlots(slots);

                                setCurrentBuild({
                                    ...currentBuild,
                                    slots,
                                });
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default TarkovGunBuilder;
