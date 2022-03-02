import React, { useState, useEffect } from 'react';
import ReactTooltip from 'react-tooltip';
import BackgroundImage from './assets/background.jpg';
import ModBarrelImage from './assets/mod_barrel.png';
import ModBipodImage from './assets/mod_bipod.png';
import ModCatchImage from './assets/mod_catch.png';
import ModChamberImage from './assets/mod_chamber.png';
import ModChargeImage from './assets/mod_charge.png';
import ModEquipmentImage from './assets/mod_equipment.png';
import ModFlashlightImage from './assets/mod_flashlight.png';
import ModForegripImage from './assets/mod_foregrip.png';
import ModGasBlockImage from './assets/mod_gas_block.png';
import ModHammerImage from './assets/mod_hammer.png';
import ModHandguardImage from './assets/mod_handguard.png';
import ModLauncherImage from './assets/mod_launcher.png';
import ModMagShaftImage from './assets/mod_mag_shaft.png';
import ModMagazineImage from './assets/mod_magazine.png';
import ModMountImage from './assets/mod_mount.png';
import ModMuzzleImage from './assets/mod_muzzle.png';
import ModNvgImage from './assets/mod_nvg.png';
import ModPistolGripImage from './assets/mod_pistol_grip.png';
import ModReceiverImage from './assets/mod_reciever.png';
import ModScopeImage from './assets/mod_scope.png';
import ModSightFrontImage from './assets/mod_sight_front.png';
import ModSightRearImage from './assets/mod_sight_rear.png';
import ModSilencerImage from './assets/mod_silencer.png';
import ModStockImage from './assets/mod_stock.png';
import ModTacticalImage from './assets/mod_tactical.png';
import ModTriggerImage from './assets/mod_trigger.png';

import './index.css';

function Slot({ type, onSelect, onItemDeselect, item, possibleItemsConflicts }) {
    const [display, setDisplay] = useState(false);

    let conflict = undefined;

    const showButton = (e) => {
        e.preventDefault();
        setDisplay(true);
    };
    const hideButton = (e) => {
        e.preventDefault();
        setDisplay(false);
    };

    useEffect(() => {
        ReactTooltip.rebuild();
    });

    if (item) {
        possibleItemsConflicts.forEach((slotItemSet) => {
            slotItemSet.ids.forEach((id) => {
                if (id === item?.id) {
                    conflict = slotItemSet.item.name;
                }
            });
        });
    }

    let image = BackgroundImage;

    if (type.includes('barrel')) {
        image = ModBarrelImage;
    } else if (type.includes('mod_bipod')) {
        image = ModBipodImage;
    } else if (type.includes('mod_catch')) {
        image = ModCatchImage;
    } else if (type.includes('mod_chamber')) {
        image = ModChamberImage;
    } else if (type.includes('mod_charge')) {
        image = ModChargeImage;
    } else if (type.includes('mod_equipment')) {
        image = ModEquipmentImage;
    } else if (type.includes('mod_flashlight')) {
        image = ModFlashlightImage;
    } else if (type.includes('mod_foregrip')) {
        image = ModForegripImage;
    } else if (type.includes('mod_gas_block')) {
        image = ModGasBlockImage;
    } else if (type.includes('mod_hammer')) {
        image = ModHammerImage;
    } else if (type.includes('mod_handguard')) {
        image = ModHandguardImage;
    } else if (type.includes('mod_launcher')) {
        image = ModLauncherImage;
    } else if (type.includes('mod_mag_shaft')) {
        image = ModMagShaftImage;
    } else if (type.includes('mod_magazine')) {
        image = ModMagazineImage;
    } else if (type.includes('mod_mount')) {
        image = ModMountImage;
    } else if (type.includes('mod_muzzle')) {
        image = ModMuzzleImage;
    } else if (type.includes('mod_nvg')) {
        image = ModNvgImage;
    } else if (type.includes('mod_pistol_grip')) {
        image = ModPistolGripImage;
    } else if (type.includes('mod_reciever')) {
        image = ModReceiverImage;
    } else if (type.includes('mod_scope')) {
        image = ModScopeImage;
    } else if (type.includes('mod_sight_front')) {
        image = ModSightFrontImage;
    } else if (type.includes('mod_sight_rear')) {
        image = ModSightRearImage;
    } else if (type.includes('mod_silencer')) {
        image = ModSilencerImage;
    } else if (type.includes('mod_stock')) {
        image = ModStockImage;
    } else if (type.includes('mod_tactical')) {
        image = ModTacticalImage;
    } else if (type.includes('mod_trigger')) {
        image = ModTriggerImage;
    }

    return (
        <div className={`tgb-slot ${conflict && 'tgb-conflict'}`}>
            {item && (
                <div
                    data-for={type}
                    data-tip={`Cannot install both '${item.name}' and '${conflict}' at the same time`}
                    className="tgb-slot-item-wrapper"
                    onMouseEnter={(e) => showButton(e)}
                    onMouseLeave={(e) => hideButton(e)}
                >
                    {display && <button onClick={onItemDeselect}>×</button>}
                    <div onClick={onSelect}>
                        <img alt={item.name} loading="lazy" src={item.iconLink} />
                        <div className="tgb-slot-item-name-wrapper">{item.shortName}</div>
                    </div>
                    {conflict && <ReactTooltip id={type} />}
                </div>
            )}
            {!item && (
                <div className="tgb-slot-name-wrapper" onClick={onSelect}>
                    <img alt={'item.name'} loading="lazy" src={BackgroundImage} />
                    <img alt={'item.name'} loading="lazy" src={image} />
                    <div>
                        {type.replace('mod_', '').replace('_', ' ').replace('reciever', 'receiver').toUpperCase()}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Slot;
