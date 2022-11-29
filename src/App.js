import './App.css';

import Header from './Components/Header';
import Body from './Components/Body';
import { ContractProvider } from './web3/ContractProvider';

function App() {
  return (
    <ContractProvider>
      <div className="bg-blue-300 min-w-screen min-h-screen overflow-x-hidden">
        <Header></Header>
        <Body></Body>
      </div>
    </ContractProvider>
  );
}

export default App;
