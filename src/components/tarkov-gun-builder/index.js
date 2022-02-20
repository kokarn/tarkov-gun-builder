import { useState, useMemo, useEffect } from 'react';
import objectPath from 'object-path';

import ItemList from '../item-list';
import Slot from '../slot';
import StatsLine from '../stats-line';

import usePreviousValue from '../../hooks/usePreviousValue';
import GunWrapperImage from './assets/gun-wrapper.png';
import WeightImage from './assets/icons/weight.png';
import ResetImage from './assets/icons/reset.png';
import DiscardImage from './assets/icons/discard.png';
import ErgoImage from './assets/icons/ergonomics.png';
import AccuracyImage from './assets/icons/accuracy.png';
import SightingRangeImage from './assets/icons/sighting-range.png';
import RecoilImage from './assets/icons/recoil.png';
import MuzzleVelocityImage from './assets/icons/muzzle-velocity.png';
import TypesOfFireImage from './assets/icons/types-of-fire.png';
import FireRateImage from './assets/icons/fire-rate.png';
import CaliberImage from './assets/icons/caliber.png';

import './index.css';

const equipmentSlotsToSlots = (equipmentSlot) => {
    return {
        type: equipmentSlot._name,
        item: undefined,
        slots: [],
        allowedItems: equipmentSlot._props.filters[0].Filter,
    };
};

const getModifierValueFromMods = ({
    targetProperty,
    defaultValue,
    temporaryItemId,
    items,
    slots,
    itemBeingReplaced,
}) => {
    if (!temporaryItemId) {
        return defaultValue;
    }

    const candidateItem = items.find((item) => item.id === temporaryItemId)?.itemProperties[targetProperty] || 0;

    let values = slots;

    if (itemBeingReplaced) {
        values = values.filter((slot) => slot.props.item?.id !== itemBeingReplaced.id);
    }

    const newModsValue = values
        .map((slot) => slot.props.item?.itemProperties[targetProperty] || 0)
        .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

    return { candidateItem, newModsValue };
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

        setTemporaryItemId();
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
        setTemporaryItemId();
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
            const ammoSlot = {
                type: 'mod_chamber',
                item: undefined,
                slots: [],
                allowedItems: gun.allowedAmmoIds,
            };

            const defaultBuild = {
                slots: [...gun.equipmentSlots?.map(equipmentSlotsToSlots), ammoSlot],
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
                slotIdentifier={keyPrefix}
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

    let itemBeingReplaced;
    const slotBeingReplaced = slots.find((slot) => slot.props.slotIdentifier === listTarget);

    if (slotBeingReplaced) {
        itemBeingReplaced = slotBeingReplaced.props.item;
    }

    slots.forEach((slot) => {
        slot.props.possibleItemsConflicts.push(...possibleItemsConflicts);
    });

    let weight = 0;

    if (gun) {
        weight =
            (gun.itemProperties?.Weight || 0) +
            slots.map((slot) => slot.props.item?.itemProperties?.Weight || 0).reduce((a, b) => a + b, 0);
    }

    const ergonomicsModifier = useMemo(() => {
        return slots
            .map((slot) => slot.props.item?.itemProperties.Ergonomics || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }, [slots]);

    const temporaryErgonomicsModifier = useMemo(() => {
        const { candidateItem, newModsValue } = getModifierValueFromMods({
            targetProperty: 'Ergonomics',
            defaultValue: ergonomicsModifier,
            temporaryItemId,
            items,
            slots,
            itemBeingReplaced,
        });

        return newModsValue + candidateItem;
    }, [items, slots, temporaryItemId, itemBeingReplaced, ergonomicsModifier]);

    const verticalRecoilModifier = useMemo(() => {
        const verticalModsRecoil = slots
            .map((slot) => slot.props.item?.itemProperties.Recoil || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

        const verticalGunRecoil = gun?.itemProperties.RecoilForceUp;

        return verticalGunRecoil + (verticalGunRecoil / 100) * verticalModsRecoil;
    }, [slots, gun]);

    const temporaryVerticalRecoilModifier = useMemo(() => {
        const { candidateItem, newModsValue } = getModifierValueFromMods({
            targetProperty: 'Recoil',
            defaultValue: verticalRecoilModifier,
            temporaryItemId,
            items,
            slots,
            itemBeingReplaced,
        });

        const modsRecoil = newModsValue + candidateItem;
        const verticalGunRecoil = gun?.itemProperties.RecoilForceUp;

        return verticalGunRecoil + (verticalGunRecoil / 100) * modsRecoil;
    }, [items, slots, temporaryItemId, itemBeingReplaced, verticalRecoilModifier, gun?.itemProperties.RecoilForceUp]);

    const horizontalRecoilModifier = useMemo(() => {
        const horizontalModsRecoil = slots
            .map((slot) => slot.props.item?.itemProperties.Recoil || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

        const horizontalGunRecoil = gun?.itemProperties.RecoilForceBack;

        return horizontalGunRecoil + (horizontalGunRecoil / 100) * horizontalModsRecoil;
    }, [slots, gun]);

    const temporaryHorizontalRecoilModifier = useMemo(() => {
        const { candidateItem, newModsValue } = getModifierValueFromMods({
            targetProperty: 'Recoil',
            defaultValue: horizontalRecoilModifier,
            temporaryItemId,
            items,
            slots,
            itemBeingReplaced,
        });

        const modsRecoil = newModsValue + candidateItem;
        const horizontalGunRecoil = gun?.itemProperties.RecoilForceBack;

        return horizontalGunRecoil + (horizontalGunRecoil / 100) * modsRecoil;
    }, [
        items,
        slots,
        temporaryItemId,
        itemBeingReplaced,
        horizontalRecoilModifier,
        gun?.itemProperties.RecoilForceBack,
    ]);

    const defaultMuzzleVelocity = useMemo(() => {
        let ammo;
        const ammoSlot = slots.find((slot) => slot.props.type === 'mod_chamber');

        if (ammoSlot?.props.item) {
            ammo = ammoSlot.props.item;
        } else {
            ammo = items.find((item) => gun?.defAmmo === item.id);
        }

        return ammo?.initialSpeed || 0;
    }, [gun, slots, items]);

    const muzzleVelocityModifier = useMemo(() => {
        const modsPercentageChange = slots
            .map((slot) => slot.props.item?.itemProperties.Velocity || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);

        return defaultMuzzleVelocity + (defaultMuzzleVelocity / 100) * modsPercentageChange;
    }, [slots, defaultMuzzleVelocity]);

    const temporaryMuzzleVelocityModifier = useMemo(() => {
        const { candidateItem, newModsValue } = getModifierValueFromMods({
            targetProperty: 'Velocity',
            defaultValue: muzzleVelocityModifier,
            temporaryItemId,
            items,
            slots,
            itemBeingReplaced,
        });

        const modsPercentageChange = newModsValue + candidateItem;

        return defaultMuzzleVelocity + (defaultMuzzleVelocity / 100) * modsPercentageChange;
    }, [items, temporaryItemId, defaultMuzzleVelocity, muzzleVelocityModifier, slots, itemBeingReplaced]);

    const sightingRangeModifier = useMemo(() => {
        const maxSightingRange = Math.max(...slots.map((slot) => slot.props.item?.itemProperties.sightingRange || 0));

        return maxSightingRange;
    }, [slots]);

    const temporarySightingRangeModifier = useMemo(() => {
        if (!temporaryItemId) {
            return sightingRangeModifier;
        }

        const candidateItem = items.find((item) => item.id === temporaryItemId)?.itemProperties.sightingRange || 0;

        let values = slots;

        if (itemBeingReplaced) {
            values = values.filter((slot) => slot.props.item?.id !== itemBeingReplaced.id);
        }

        values = values.map((slot) => slot.props.item?.itemProperties.sightingRange || 0);

        return Math.max(candidateItem, ...values);
    }, [items, temporaryItemId, sightingRangeModifier, slots, itemBeingReplaced]);

    return (
        <div className="builder-outer-wrapper">
            <div className="gun-wrapper">
                <div className="selected-gun-name-wrapper">{gun?.name || 'NO GUN SELECTED'}</div>
                <div
                    className="gun-selector-wrapper"
                    onClick={() => {
                        setListTarget('guns');
                        setAllowedIdsList(allGuns);
                        setTemporaryItemId();
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
                                <div>{weight.toFixed(3)}Kg</div>
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
                            setTemporaryItemId();
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
                                    slots: [
                                        ...gun.equipmentSlots?.map(equipmentSlotsToSlots),
                                        {
                                            type: 'mod_chamber',
                                            item: undefined,
                                            slots: [],
                                            allowedItems: gun.allowedAmmoIds,
                                        },
                                    ],
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
                        value={gun?.itemProperties.Accuracy}
                        text={'Accuracy'}
                        iconURL={AccuracyImage}
                    />
                    <StatsLine
                        min={0}
                        max={2000}
                        text={'Sighting range'}
                        value={Math.max(gun?.itemProperties.sightingRange, sightingRangeModifier)}
                        temporaryValue={temporarySightingRangeModifier}
                        iconURL={SightingRangeImage}
                    />
                    <StatsLine
                        min={0}
                        max={700}
                        value={verticalRecoilModifier.toFixed(0) || '-'}
                        temporaryValue={temporaryVerticalRecoilModifier.toFixed(0)}
                        invertColors={true}
                        text={'Vertical recoil'}
                        iconURL={RecoilImage}
                    />
                    <StatsLine
                        min={0}
                        max={1200}
                        value={horizontalRecoilModifier.toFixed(0) || '-'}
                        temporaryValue={temporaryHorizontalRecoilModifier.toFixed(0)}
                        invertColors={true}
                        text={'Horizontal recoil'}
                        iconURL={RecoilImage}
                    />
                    <StatsLine
                        min={0}
                        max={1300}
                        value={muzzleVelocityModifier.toFixed(0) || '-'}
                        text={'Muzzle velocity'}
                        rightText={'m/s'}
                        iconURL={MuzzleVelocityImage}
                        temporaryValue={temporaryMuzzleVelocityModifier.toFixed(0)}
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
