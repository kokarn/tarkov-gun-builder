import TarkovGunBuilder from './components/tarkov-gun-builder';

import items from './items.json';
import gamePresets from './globals.json';
import defaultPresets from './item_presets.json';

function App() {
    return (
        <div className="App">
            <TarkovGunBuilder
                items={items}
                presets={gamePresets.ItemPresets}
                defaultPresets={defaultPresets}
                callback={(data) => {
                    alert(JSON.stringify(data));
                }}
            />
        </div>
    );
}

export default App;
