import { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import NFTCompiled from '../contracts/build/NFT.json';
import MarketCompiled from '../contracts/build/Market.json';
import { create } from 'ipfs-http-client';

const ipfs = create('http://localhost:5001');

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
          'Unable to load contracts. Please switch to mainnet, ropsten or rinkiby networks'
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
      const decoder = new TextDecoder();
      const items = await method().call({ from: address });
      const data = [];
      await Promise.all(
        items.map(async (item) => {
          if (condition && condition(item)) return;
          // if (item.sold || item.tokenId == 0) return;
          const url = await nft.methods.tokenURI(item.tokenId).call();
          const cid = url.slice(url.length - 46);
          const arr = [];
          for await (const chunk of ipfs.cat(cid)) {
            arr.push(chunk);
          }
          const buf = Buffer.concat(arr);
          data.push({ ...item, ...JSON.parse(decoder.decode(buf)) });
        })
      );
      resolve(data);
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
