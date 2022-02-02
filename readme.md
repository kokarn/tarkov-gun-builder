# Tarkov Gun Builder

Example in a pre-existing react repo for now

```
import TarkovGunBuilder from '../../components/tarkov-gun-builder';

import items from './items.json';

function GunBuilder() {
    return <div
        className="page-wrapper"
        key = {'display-wrapper'}
    >
        <div
            className='page-headline-wrapper'
        >
            <h1>
                {t('Escape from Tarkov Gun Builder')}
            </h1>
        </div>
        <TarkovGunBuilder
            items = {items}
        />
    </div>
};

export default GunBuilder;
```
