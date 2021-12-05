import Button from '../components/Button';
import {
  NFTCardsLayout,
  NFTCard,
  NFTCardImage,
} from '../components/NFTCardsLayout';
import NFTPreview from '../components/NFTPreview';
import { useAppContext } from '../state';
import { create } from 'ipfs-http-client';
import { useEffect, useState } from 'react';

const ipfs = create('http://localhost:5001');

export default function Home() {
  const { address, nft, market, setSelectedNFT, setAlert } = useAppContext();
  const [data, setData] = useState();

  useEffect(() => {
    const init = async () => {
      const decoder = new TextDecoder();
      const items = await market.methods.fetchMarketItems().call();
      const data = [];
      await Promise.all(
        items.map(async (item) => {
          if (item.sold || item.tokenId == 0) return;
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
      setData(data);
    };
    market && init();
  }, [market]);

  const createMarketSale = async (item) => {
    try {
      await market.methods
        .createMarketSale(item.nftContract, item.tokenId)
        .send({ from: address, value: window.web3.utils.toWei(item.price) });
      setAlert({
        color: 'green',
        message: 'Purchase successful',
      });
    } catch (error) {
      setAlert({
        color: 'red',
        message: error.message,
      });
    }
  };

  return (
    <NFTCardsLayout data={data} message={'No NFTs for sale'}>
      {data &&
        data.map((item, index) => (
          <NFTCard key={index}>
            <NFTCardImage
              src={item.image}
              onClick={() => setSelectedNFT(item)}
            />
            <Button onClick={() => createMarketSale(item)}>
              Buy for {item.price} ETH
            </Button>
          </NFTCard>
        ))}
      <NFTPreview />
    </NFTCardsLayout>
  );
}
