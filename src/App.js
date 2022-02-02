import TarkovGunBuilder from './components/tarkov-gun-builder';

import items from './items.json';

function App() {
    return (
        <div className="App">
            <div className="page-headline-wrapper">
                <h1>Escape from Tarkov Gun Builder</h1>
            </div>
            <TarkovGunBuilder items={items} />
        </div>
    );
}

export default App;
