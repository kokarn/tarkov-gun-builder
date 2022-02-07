import TarkovGunBuilder from './components/tarkov-gun-builder';

import items from './items.json';
import gamePresets from './globals.json';
import defaultPresets from './item_presets.json';

function App() {
    return (
        <div className="App">
            <div className="page-headline-wrapper">
                <h1>Escape from Tarkov Gun Builder</h1>
            </div>
            <TarkovGunBuilder items={items} presets={gamePresets.ItemPresets} defaultPresets={defaultPresets} />
        </div>
    );
}

export default App;
