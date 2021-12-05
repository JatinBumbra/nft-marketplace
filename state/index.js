import { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import NFTCompiled from '../contracts/build/NFT.json';
import MarketCompiled from '../contracts/build/Market.json';

export const AppContext = createContext();

const __initAlert = {
  message: '',
  color: '',
};

export const AppState = ({ children }) => {
  const [alert, setAlert] = useState(__initAlert);
  const [loading, setLoading] = useState(false);
  const [contractsLoaded, _setContractsLoaded] = useState(false);

  const [nft, _setNft] = useState();
  const [market, _setMarket] = useState();
  const [address, _setAddress] = useState();

  const [selectedNFT, setSelectedNFT] = useState();

  useEffect(() => {
    _resetUI();
    window.ethereum.on('accountsChanged', _resetUI);
    window.ethereum.on('chainChanged', _resetUI);
  }, []);

  const _loadWeb3 = async () => {
    setLoading(true);
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      setAlert({
        color: 'red',
        message: 'Non-Etherium browser detected. Try MetaMask',
        dismissable: false,
      });
    }
    setLoading(false);
  };

  const _loadBlockchainData = async () => {
    const web3 = window.web3;
    if (!web3) return;
    try {
      setLoading(true);
      // Get accounts
      const accounts = await web3.eth.getAccounts();
      _setAddress(accounts[0]);
      // Get current network
      const netId = await web3.eth.net.getId();
      // Load contracts
      const nftData = NFTCompiled.networks[netId];
      if (nftData) {
        _setNft(new web3.eth.Contract(NFTCompiled.abi, nftData.address));
      }
      const marketData = MarketCompiled.networks[netId];
      if (marketData) {
        _setMarket(
          new web3.eth.Contract(MarketCompiled.abi, marketData.address)
        );
      }
      // If either contracts are not loaded, then throw
      if (!nftData || !marketData)
        throw new Error(
          'Unable to load contracts. Please switch to ropsten network or setup a local Ganache node'
        );
      _setContractsLoaded(true);
    } catch (error) {
      setAlert({
        color: 'red',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const _resetUI = () => {
    setAlert(__initAlert);
    _loadWeb3().then(_loadBlockchainData);
  };

  const fetchMarketData = (method, condition) =>
    new Promise(async (resolve, reject) => {
      try {
        const items = await method().call({ from: address });
        const data = [];
        await Promise.all(
          items.map(async (item) => {
            if (condition && condition(item)) return;
            const url = await nft.methods.tokenURI(item.tokenId).call();
            const result = await fetch(url).then((res) => res.json());
            data.push({ ...item, ...result });
          })
        );
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });

  return (
    <AppContext.Provider
      value={{
        nft,
        alert,
        market,
        loading,
        address,
        setAlert,
        setLoading,
        contractsLoaded,
        selectedNFT,
        setSelectedNFT,
        fetchMarketData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
