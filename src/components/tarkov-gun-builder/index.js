import { useState, useMemo } from 'react';
import objectPath from 'object-path';

import ItemList from '../item-list';
import Slot from '../slot';
import StatsLine from '../stats-line';

import usePreviousValue from '../../hooks/usePreviousValue';

import './index.css';

const equipmentSlotsToSlots = (equipmentSlot) => {
    return {
        type: equipmentSlot._name,
        item: undefined,
        slots: [],
        allowedItems: equipmentSlot._props.filters[0].Filter,
    };
};

function TarkovGunBuilder({ items, presets, defaultPresets, callback }) {
    const [selectedGunId, setSelectedGunId] = useState(false);
    const [temporaryItemId, setTemporaryItem] = useState(false);
    const previousGun = usePreviousValue(selectedGunId);
    const [currentBuild, setCurrentBuild] = useState({
        slots: [],
    });
    const [allowedIdsList, setAllowedIdsList] = useState([]);
    const [listTarget, setListTarget] = useState();

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

    const handleSlotSet = (slotIdString, slotAllowedItems, conflictingItems) => {
        // console.log(`Setting ${slotIdString}`);
        setAllowedIdsList(slotAllowedItems);
        setListTarget(slotIdString);
    };

    const handleItemDeselect = (keyPrefix) => {
        const currentSlots = [...currentBuild.slots];
        const path = keyPrefix.match(/[0-9]+/g);

        const findSlotToReset = (currentSlots, depth) => {
            if (depth + 1 === path.length) {
                return currentSlots[path[depth]];
            } else {
                return findSlotToReset(currentSlots[path[depth]].slots, depth + 1);
            }
        };

        const slot = findSlotToReset(currentSlots, 0);

        delete slot.item;
        delete slot.slots;

        setCurrentBuild({ ...currentBuild, slots: currentSlots });
    };

    const handleListSelect = (itemId) => {
        if (allGuns.includes(itemId)) {
            setSelectedGunId(itemId);
            setAllowedIdsList([]);

            return true;
        }

        console.log(`Setting ${listTarget}.item`);
        const buildCopy = {
            ...currentBuild,
        };

        const targetItem = items.find((item) => item.id === itemId);

        objectPath.set(buildCopy, `${listTarget}.item`, targetItem);
        objectPath.set(buildCopy, `${listTarget}.slots`, targetItem.equipmentSlots?.map(equipmentSlotsToSlots));
        console.log('New build');
        console.log(buildCopy);
        setCurrentBuild(buildCopy);
        setAllowedIdsList([]);
    };

    const allGuns = useMemo(() => {
        return items.filter((item) => item.types.includes('gun')).map((item) => item.id);
    }, [items]);

    useMemo(() => {
        if (gun !== previousGun && gun) {
            const defaultBuild = {
                slots: [...gun.equipmentSlots?.map(equipmentSlotsToSlots)],
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
                        slot.slots = slotItem.equipmentSlots.map(equipmentSlotsToSlots);
                    }
                }
            }

            setCurrentBuild(defaultBuild);
        }
    }, [previousGun, gun, gunPresetId, presets, items]);

    let weight = 0;

    if (gun) {
        weight =
            (gun.itemProperties?.Weight || 0) +
            currentBuild.slots.map((item) => item.itemProperties?.Weight || 0).reduce((a, b) => a + b, 0);
    }

    const possibleItemsConflicts = [];

    const getSlot = (slot, keyPrefix) => {
        possibleItemsConflicts.push({
            key: `${gun.id}-slot-${keyPrefix}`,
            ids: slot.item?.itemProperties.ConflictingItems || [],
        });

        const primarySlot = (
            <Slot
                onSelect={handleSlotSet.bind(this, keyPrefix, slot.allowedItems)}
                onItemDeselect={handleItemDeselect.bind(this, keyPrefix)}
                key={`${gun.id}-slot-${keyPrefix}`}
                items={items}
                type={slot.type}
                item={slot.item}
                possibleItemsConflicts={[]}
            />
        );

        if (!slot.slots) {
            return [primarySlot];
        }

        const childSlots = slot.slots
            .map((innerSlot, index) => {
                return getSlot(innerSlot, `${keyPrefix}.slots.${index}`);
            })
            .flat();

        return [primarySlot, ...childSlots];
    };

    const getSlots = () => {
        return currentBuild.slots
            .map((slot, index) => {
                return getSlot(slot, `slots.${index}`);
            })
            .flat();
    };

    const slots = getSlots();

    slots.forEach((slot) => {
        slot.props.possibleItemsConflicts.push(...possibleItemsConflicts);
    });

    const temporaryErgonomicsModifier = useMemo(() => {
        return items.find((item) => item.id === temporaryItemId)?.itemProperties.Ergonomics || 0;
    }, [items, temporaryItemId]);

    const ergonomicsModifier = useMemo(() => {
        return slots
            .map((slot) => slot.props.item?.itemProperties.Ergonomics || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }, [slots]);

    return (
        <div className="builder-outer-wrapper">
            <div>
                <div className="gun-wrapper">
                    <div className="selected-gun-name-wrapper">{gun?.name || 'NO GUN SELECTED'}</div>
                    <div
                        className="gun-selector-wrapper"
                        onClick={() => {
                            setAllowedIdsList(allGuns);
                        }}
                    >
                        {!gun && <h2>CLICK TO SELECT A GUN</h2>}
                        {gun && (
                            <div>
                                <div className="weight">{weight.toFixed(2)}Kg</div>
                                <img alt={gun.name} loading="lazy" src={gun.gridImageLink} />
                            </div>
                        )}
                    </div>
                    <div className="actions-wrapper">
                        <div className="action irreversible">
                            <img className="icon-wide" src={'/icons/discard.jpg'} alt="discard-icon" />
                            <div>Discard All</div>
                        </div>
                        <div
                            className="action"
                            onClick={() => {
                                callback({
                                    gun,
                                    currentBuild,
                                });
                            }}
                        >
                            <img className="icon" src={'/icons/share.jpg'} alt="share-icon" />
                            <div>Share</div>
                        </div>
                    </div>
                    <div className="stats-wrapper">
                        <StatsLine
                            min={0}
                            max={150}
                            value={gun?.itemProperties.Ergonomics + ergonomicsModifier}
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
                            value={gun?.itemProperties.RecoilForceUp || '-'}
                            text={'Vertical recoil'}
                            iconURL={'/icons/recoil.jpg'}
                        />
                        <StatsLine
                            min={0}
                            max={1000}
                            value={gun?.itemProperties.RecoilForceBack || '-'}
                            text={'Horizontal recoil'}
                            iconURL={'/icons/recoil.jpg'}
                        />
                        <StatsLine
                            min={0}
                            max={1000}
                            value={gun?.itemProperties.RecoilForceBack || '-'}
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
                        <div className="slots-wrapper">{slots}</div>
                    </div>
                </div>
                <div className="selector">
                    {allowedIdsList.length > 0 && (
                        <ItemList
                            allowedIdsList={allowedIdsList}
                            items={items}
                            handleSelect={handleListSelect}
                            onHover={setTemporaryItem}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default TarkovGunBuilder;
