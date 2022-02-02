import { useState, useMemo } from 'react';

import './index.css';

function ItemList({allowedIdsList, items, handleSelect, show, onHover}){
    const displayItems = useMemo(() => {
        return items
            .filter(item => allowedIdsList.includes(item.id))
            .sort((itemA, itemB) => itemA.name.localeCompare(itemB.name));
    }, [allowedIdsList, items]);

    if(!allowedIdsList){
        return null;
    }

    if(!show){
        return null;
    }

    return <div
        className='select-list-wrapper'
    >
        <table>
            <thead>
                <tr>
                    <th>
                        Name
                    </th>
                    <th>
                        Ergo
                    </th>
                    <th>
                        Recoil
                    </th>
                </tr>
            </thead>
            {displayItems.map((displayItem, index) => {
                // console.log(displayItem)
                return <tr
                    key = {`selected-item-${index}`}
                    onClick={handleSelect.bind(this, displayItem.id)}
                    onMouseEnter={onHover?.bind(this, displayItem.id)}
                    onMouseLeave={onHover?.bind(this, false)}
                >
                    <td>
                        {displayItem.name}
                    </td>
                    <td>
                        {displayItem.itemProperties.Ergonomics}
                    </td>
                    <td>
                        {displayItem.itemProperties.Recoil}
                    </td>
                </tr>
            })}
        </table>
    </div>
}

function Slot({slotData, items, onItemInstalled, onItemUninstalled, onItemTemporarilyInstalled}){
    const [selectedItemId, setSelectedItemId] = useState(false);
    // const [itemSelectedCallback, setItemSelectedCallback] = useState(() => {});
    const [showSelector, setShowSelector] = useState(false);

    const item = useMemo(() => {
        return items.find(item => item.id === selectedItemId);
    }, [items, selectedItemId]);

    const allowedItemIds = useMemo(() => {
        return items.filter(item => slotData._props.filters[0].Filter.includes(item.id)).map(item => item.id);
    }, [slotData, items]);

    return <div
        className='slot'
        // onClick={setSelectedItemId.bind(this, '55d485be4bdc2d962f8b456f')}
        onClick={setShowSelector.bind(this, !showSelector)}
    >
        {item && <div
            className='slot-item-wrapper'
        >
            <img
                alt={item.name}
                loading='lazy'
                src={item.iconLink}
            />
            <div
                className='slot-item-name-wrapper'
            >
                {item.shortName}
            </div>
        </div>}
        {!item && <div
            className='slot-name-wrapper'
        >
            {slotData._name.replace('mod_', '')}
        </div>}
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
};

function StatsLine({min, max, value, text, temporaryValue}) {
    let percentage = (value / max) * 100;
    return <div
        className='graph-wrapper'
    >
        <div
            className='graph'
            style={{
                width: `${percentage}%`,
            }}
        />
        <div
            className='temporary-graph'
            style={{
                width: `${temporaryValue}%`,
            }}
        />
        <div
            className='text-wrapper'
        >
            {text}
        </div>
        <div
            className='stats-wrapper'
        >
            {value}
        </div>
    </div>
};

function TarkovGunBuilder({items}) {
    const [selectedGun, setSelectedGun] = useState(false);
    const [showGunSelector, setShowGunSelector] = useState(false);
    const [installedItems, setInstalledItems] = useState([]);
    const [installedMounts, setInstalledMounts] = useState({});
    const [temporaryItemId, setTemporaryItem] = useState(false);

    const item = useMemo(() => {
        return items.find(item => item.id === selectedGun);
    }, [items, selectedGun]);

    const allGuns = useMemo(() => {
        return items
            .filter(item => item.types.includes('gun'))
            .map(item => item.id);
    }, [items]);

    const ergonomicsModifier = useMemo(() => {
        return items
            .filter(item => installedItems.includes(item.id))
            .map(item => item.itemProperties.Ergonomics || 0)
            .reduce((previousValue, currentValue) => previousValue + currentValue, 0);
    }, [items, installedItems]);

    const temporaryErgonomicsModifier = useMemo(() => {
        return items.find(item => item.id === temporaryItemId)?.itemProperties.Ergonomics || 0
    }, [items, temporaryItemId]);

    console.log(item);

    return <div
        className='builder-outer-wrapper'
    >
        <div>
            <div
                className='gun-wrapper'
            >
                <div
                    className='selected-gun-name-wrapper'
                >
                    {item?.name || 'NO GUN SELECTED'}
                </div>
                <div
                    className='gun-selector-wrapper'
                    onClick={setShowGunSelector.bind(this, !showGunSelector)}
                >
                    {!item && <h2>
                        Click to select gun
                    </h2>}
                    {item &&
                        <img
                            alt={item.name}
                            loading='lazy'
                            src={item.gridImageLink}
                        />
                    }
                    <ItemList
                        allowedIdsList={allGuns}
                        items={items}
                        handleSelect={setSelectedGun}
                        show={showGunSelector}
                    />
                </div>
                <div
                    className='stats-wrapper'
                >
                    <StatsLine
                        min={0}
                        max={150}
                        value={item?.itemProperties.Ergonomics + ergonomicsModifier}
                        text={'Ergonomics'}
                        temporaryValue={item?.itemProperties.Ergonomics + temporaryErgonomicsModifier}
                    />
                    <StatsLine
                        min={0}
                        max={100}
                        value={55}
                        text={'Accuracy'}
                    />
                    <StatsLine
                        min={0}
                        max={100}
                        value={55}
                        text={'Sighting range'}
                    />
                    <StatsLine
                        min={0}
                        max={700}
                        value={item?.itemProperties.RecoilForceUp}
                        text={'Vertical recoil'}
                    />
                    <StatsLine
                        min={0}
                        max={1000}
                        value={item?.itemProperties.RecoilForceBack}
                        text={'Horizontal recoil'}
                    />
                    <StatsLine
                        min={0}
                        max={1000}
                        value={item?.itemProperties.RecoilForceBack}
                        text={'Muzzle velocity'}
                    />
                    <div class="grid-container">
                        <div class="grid-item">Types of Fire<div class="grid-item-right">{item?.itemProperties.weapFireType.join(', ') || '-'}</div></div>
                        <div class="grid-item">Fire Rate<div class="grid-item-right">{item?.itemProperties.bFirerate || '-'}</div></div>
                        <div class="grid-item">Caliber<div class="grid-item-right">{item?.itemProperties.ammoCaliber.replace('Caliber', '') || '-'}</div></div>
                        <div class="grid-item">Effective Distance<div class="grid-item-right">{item?.itemProperties.bEffDist || '-'}</div></div>
                    </div>
                    <div
                        className='slots-wrapper'
                    >
                        {item && item.equipmentSlots.map((slot) => {
                            return <Slot
                                key = {`${item.id}-slot-${slot._name}`}
                                items={items}
                                slotData={slot}
                                onItemInstalled={(newItem) => {
                                    const canMountItems = items.find(item => (newItem === item.id) && item.slots)

                                    setInstalledItems([...installedItems, newItem])

                                    if (canMountItems) {
                                        setInstalledMounts({...installedMounts, [slot._name]: newItem})
                                    } else {
                                        if (installedMounts[slot._name]) {
                                            const state = {...installedMounts}

                                            delete state[slot._name]

                                            setInstalledMounts(state)
                                        }
                                    }
                                }}
                                onItemUninstalled={(uninstalledItem) => {
                                    setInstalledItems(installedItems.filter(item => item.id === uninstalledItem.id))
                                }}
                                onItemTemporarilyInstalled={setTemporaryItem}
                            />;
                        })}
                        {Object.keys(installedMounts).map((key) => {
                            const mount = items.find(item => item.id === installedMounts[key])

                            return mount.equipmentSlots.map((slot) => {
                                return <Slot
                                    key = {`${item.id}-slot-${slot._name}`}
                                    items={items}
                                    slotData={slot}
                                    onItemInstalled={(newItem) => {
                                        setInstalledItems([...installedItems, newItem])
                                    }}
                                    onItemUninstalled={(uninstalledItem) => {
                                        setInstalledItems(installedItems.filter(item => item.id === uninstalledItem.id))
                                    }}
                                    onItemTemporarilyInstalled={setTemporaryItem}
                                />;
                            })
                        })}
                    </div>
                </div>
            </div>
        </div>
    </div>
};

export default TarkovGunBuilder;