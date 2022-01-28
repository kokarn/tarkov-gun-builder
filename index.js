import { useState, useMemo } from 'react';

import './index.css';

function ItemList({allowedIdsList, items, handleSelect}){
    const displayItems = useMemo(() => {
        return items.filter(item => allowedIdsList.includes(item.id));
    }, [allowedIdsList, items]);

    if(!allowedIdsList){
        return null;
    }

    return <div
        className='select-list-wrapper'
    >
        <ul>
            {displayItems.map((displayItem, index) => {
                return <li
                    key = {`selected-item-${index}`}
                    onClick={handleSelect.bind(this, displayItem.id)}
                >
                    {displayItem.name}
                </li>
            })}
        </ul>
    </div>
}

function Slot({slotData, items}){
    const [selectedItemId, setSelectedItemId] = useState(false);

    const item = useMemo(() => {
        return items.find(item => item.id === selectedItemId);
    }, [items, selectedItemId]);

    return <div
        className='slot'
        onClick={setSelectedItemId.bind(this, '55d485be4bdc2d962f8b456f')}
    >
        {item && <img
            alt={item.name}
            loading='lazy'
            src={item.iconLink}
        />}
        {!item && <div
            className='slot-name-wrapper'
        >
            {slotData._name.replace('mod_', '')}
        </div>}
    </div>
};

function StatsLine({min, max, value, text}) {
    return <div
        className='graph-wrapper'
    >
        <div
            className='graph'
            style={{
                width: `${value}%`,
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
    const [selectOneList, setSelectOneList] = useState([]);
    const [itemSelectedCallback, setItemSelectedCallback] = useState(() => {});

    const item = useMemo(() => {
        return items.find(item => item.id === selectedGun);
    }, [items, selectedGun]);

    const allGuns = useMemo(() => {
        return items.filter(item => item.types.includes('gun')).map(item => item.id);
    }, [items]);

    console.log(item);

    return <div
        className='builder-outer-wrapper'
    >
        <div>
            <div
                className='gun-wrapper'
            >
                <div
                    className='gun-selector-wrapper'
                    onClick={() => {
                        setItemSelectedCallback(() => { return setSelectedGun})
                        setSelectOneList(allGuns);
                    }}
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
                </div>
                <div
                    className='stats-wrapper'
                >
                    <StatsLine
                        min={0}
                        max={100}
                        value={42}
                        text={'Ergonomics'}
                    />
                    <StatsLine
                        min={0}
                        max={100}
                        value={88}
                        text={'Vertical recoil'}
                    />
                    <StatsLine
                        min={0}
                        max={100}
                        value={12}
                        text={'Horizontal recoil'}
                    />
                    <div
                        className='slots-wrapper'
                    >
                        {item && item.equipmentSlots.map((slot) => {
                            return <Slot
                                items={items}
                                slotData={slot}
                            />;
                        })}
                    </div>
                </div>
            </div>
        </div>
        <ItemList
            allowedIdsList={selectOneList}
            items={items}
            handleSelect={itemSelectedCallback}
        />
    </div>
};

export default TarkovGunBuilder;