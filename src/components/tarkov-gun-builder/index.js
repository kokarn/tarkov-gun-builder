import { useState, useMemo, useEffect } from 'react';
import objectPath from 'object-path';

import ItemList from '../item-list';
import Slot from '../slot';
import StatsLine from '../stats-line';

import usePreviousValue from '../../hooks/usePreviousValue';
import GunWrapperImage from './assets/gun-wrapper.png';
import WeightImage from './assets/icons/weight.jpg';
import ResetImage from './assets/icons/reset.png';
import DiscardImage from './assets/icons/discard.jpg';
import ShareImage from './assets/icons/share.jpg';
import ErgoImage from './assets/icons/ergonomics.jpg';
import AccuracyImage from './assets/icons/ergonomics.jpg';
import SightingRangeImage from './assets/icons/sighting-range.jpg';
import RecoilImage from './assets/icons/recoil.jpg';
import MuzzleVelocityImage from './assets/icons/muzzle-velocity.jpg';
import TypesOfFireImage from './assets/icons/types-of-fire.jpg';
import FireRateImage from './assets/icons/fire-rate.jpg';
import CaliberImage from './assets/icons/caliber.jpg';

import './index.css';

const equipmentSlotsToSlots = (equipmentSlot) => {
    return {
        type: equipmentSlot._name,
        item: undefined,
        slots: [],
        allowedItems: equipmentSlot._props.filters[0].Filter,
    };
};

function TarkovGunBuilder({ items, presets, defaultPresets, callback, defaultConfiguration }) {
    const [defaultState, setDefaultState] = useState(defaultConfiguration);
    const [selectedGunId, setSelectedGunId] = useState(false);
    const [temporaryItemId, setTemporaryItemId] = useState(false);
    const previousGunId = usePreviousValue(selectedGunId);
    const [currentBuild, setCurrentBuild] = useState({
        slots: [],
    });
    const [allowedIdsList, setAllowedIdsList] = useState([]);
    const [listTarget, setListTarget] = useState();

    const gun = useMemo(() => {
        return items.find((item) => item.id === selectedGunId);
    }, [items, selectedGunId]);

    useEffect(() => {
        callback({
            gun,
            currentBuild,
        });
    }, [gun, currentBuild]);

    useEffect(() => {
        if (defaultState) {
            setSelectedGunId(defaultState.gun.id);
        }
    }, [defaultState]);

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

    const handleSlotSet = (slotIdString, slotAllowedItems) => {
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
        if (selectedGunId !== previousGunId && gun) {
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

            if (defaultState) {
                setCurrentBuild(defaultState.currentBuild);

                setDefaultState();
            } else {
                setCurrentBuild(defaultBuild);
            }
        }
    }, [previousGunId, gun, gunPresetId, presets, items]);

    const possibleItemsConflicts = [];

    const getSlot = (slot, keyPrefix) => {
        possibleItemsConflicts.push({
            key: keyPrefix,
            ids: slot.item?.itemProperties.ConflictingItems || [],
            item: slot.item,
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

    let weight = 0;

    if (gun) {
        weight =
            (gun.itemProperties?.Weight || 0) +
            slots.map((slot) => slot.props.item?.itemProperties?.Weight || 0).reduce((a, b) => a + b, 0);
    }

    const temporaryErgonomicsModifier = useMemo(() => {
        return items.find((item) => item.id === temporaryItemId)?.itemProperties.Ergonomics || 0;
    }, [items, temporaryItemId]);

    const ergonomicsModifier = useMemo(() => {
        return slots
            .map((slot) => slot.props.item?.itemProperties.Ergonomics || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }, [slots]);

    const verticalRecoilModifier = useMemo(() => {
        const verticalModsRecoil = slots
            .map((slot) => slot.props.item?.itemProperties.Recoil || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

        const verticalGunRecoil = gun?.itemProperties.RecoilForceUp;

        if (verticalModsRecoil > 0) {
            return verticalGunRecoil - (verticalGunRecoil / 100) * verticalModsRecoil;
        } else {
            return verticalGunRecoil + (verticalGunRecoil / 100) * verticalModsRecoil;
        }
    }, [slots]);

    const horizontalRecoilModifier = useMemo(() => {
        const horizontalModsRecoil = slots
            .map((slot) => slot.props.item?.itemProperties.Recoil || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

        const horizontalGunRecoil = gun?.itemProperties.RecoilForceBack;

        if (horizontalModsRecoil > 0) {
            return horizontalGunRecoil - (horizontalGunRecoil / 100) * horizontalModsRecoil;
        } else {
            return horizontalGunRecoil + (horizontalGunRecoil / 100) * horizontalModsRecoil;
        }
    }, [slots]);

    const accuracyModifier = useMemo(() => {
        return slots
            .map((slot) => slot.props.item?.itemProperties.Accuracy || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }, [slots]);

    return (
        <div className="builder-outer-wrapper">
            <div className="gun-wrapper">
                <div className="selected-gun-name-wrapper">{gun?.name || 'NO GUN SELECTED'}</div>
                <div
                    className="gun-selector-wrapper"
                    onClick={() => {
                        setListTarget('guns');
                        setAllowedIdsList(allGuns);
                    }}
                >
                    <div className="gun-wrapper-top-right">
                        <img className="icon" src={GunWrapperImage} alt="wrapper" />
                    </div>
                    <div className="gun-wrapper-bottom-left">
                        <img className="icon" src={GunWrapperImage} alt="wrapper" />
                    </div>
                    {!gun && <h2>CLICK TO SELECT A GUN</h2>}
                    {gun && (
                        <div>
                            <div className="weight-wrapper">
                                <img className="icon" src={WeightImage} alt="weight-icon" />
                                <div>{weight.toFixed(2)}Kg</div>
                            </div>
                            <div className="gun-selector-wrapper-image">
                                <img alt={gun.name} loading="lazy" src={gun.gridImageLink} />
                            </div>
                        </div>
                    )}
                </div>
                <div className="actions-wrapper">
                    <div
                        className="action"
                        onClick={() => {
                            setListTarget();
                            setSelectedGunId();
                            setCurrentBuild({
                                slots: [],
                            });
                        }}
                    >
                        <img className="icon" src={ResetImage} alt="discard-icon" />
                        <div>Reset</div>
                    </div>
                    <div
                        className="action irreversible"
                        onClick={() => {
                            if (gun) {
                                setCurrentBuild({
                                    slots: [...gun.equipmentSlots?.map(equipmentSlotsToSlots)],
                                });
                            }
                        }}
                    >
                        <img className="icon-wide" src={DiscardImage} alt="discard-icon" />
                        <div>Discard Mods</div>
                    </div>
                </div>
                <div className="stats-wrapper">
                    <StatsLine
                        min={0}
                        max={150}
                        value={gun?.itemProperties.Ergonomics + ergonomicsModifier}
                        text={'Ergonomics'}
                        iconURL={ErgoImage}
                        temporaryValue={gun?.itemProperties.Ergonomics + temporaryErgonomicsModifier}
                    />
                    <StatsLine
                        min={0}
                        max={100}
                        value={gun?.itemProperties.Accuracy + accuracyModifier}
                        text={'Accuracy'}
                        iconURL={AccuracyImage}
                    />
                    <StatsLine min={0} max={100} value={0} text={'Sighting range'} iconURL={SightingRangeImage} />
                    <StatsLine
                        min={0}
                        max={700}
                        value={verticalRecoilModifier.toFixed(0) || '-'}
                        text={'Vertical recoil'}
                        iconURL={RecoilImage}
                    />
                    <StatsLine
                        min={0}
                        max={1000}
                        value={horizontalRecoilModifier.toFixed(0) || '-'}
                        text={'Horizontal recoil'}
                        iconURL={RecoilImage}
                    />
                    <StatsLine
                        min={0}
                        max={1000}
                        value={gun?.itemProperties.RecoilForceBack || '-'}
                        text={'Muzzle velocity'}
                        rightText={'m/s'}
                        iconURL={MuzzleVelocityImage}
                    />
                    <div className="grid-container">
                        <div className="grid-item">
                            <div className="horizontal-wrapper">
                                <img className="icon" src={TypesOfFireImage} alt="types-of-fire-icon" />
                                <div>Types of Fire</div>
                            </div>

                            <div className="grid-item-right">{gun?.itemProperties.weapFireType.join(', ') || '-'}</div>
                        </div>
                        <div className="grid-item">
                            <div className="horizontal-wrapper">
                                <img className="icon" src={FireRateImage} alt="fire-rate-icon" />
                                <div>Fire Rate</div>
                            </div>
                            <div className="grid-item-right">{gun ? `${gun.itemProperties.bFirerate} rpm` : '-'}</div>
                        </div>
                    </div>
                    <div className="grid-item">
                        <div className="horizontal-wrapper">
                            <img className="icon" src={CaliberImage} alt="caliber-icon" />
                            <div>Caliber</div>
                        </div>
                        <div className="grid-item-right">
                            {gun?.itemProperties.ammoCaliber.replace('Caliber', '') || '-'}
                        </div>
                    </div>
                    <div className="slots-wrapper">{slots}</div>
                </div>
            </div>
            <div className="selector-wrapper">
                {listTarget && allowedIdsList.length > 0 && (
                    <ItemList
                        allowedIdsList={allowedIdsList}
                        possibleItemsConflicts={possibleItemsConflicts}
                        items={items}
                        handleSelect={handleListSelect}
                        onHover={(id) => {
                            if (listTarget !== 'guns') {
                                setTemporaryItemId(id);
                            }
                        }}
                    />
                )}
            </div>
        </div>
    );
}

export default TarkovGunBuilder;
