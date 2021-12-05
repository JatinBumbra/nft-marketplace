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
  const { nft, market, setSelectedNFT } = useAppContext();
  const [data, setData] = useState();

  useEffect(() => {
    const init = async () => {
      const decoder = new TextDecoder();
      const items = await market.methods.fetchMarketItems().call();
      const data = [];
      items.forEach(async (item, i) => {
        const url = await nft.methods.tokenURI(item.tokenId).call();
        const cid = url.slice(url.length - 46);
        const arr = [];
        for await (const chunk of ipfs.cat(cid)) {
          arr.push(chunk);
        }
        const buf = Buffer.concat(arr);
        data.push(JSON.parse(decoder.decode(buf)));
        if (i === items.length - 1) {
          setData(data);
        }
      });
    };
    market && init();
  }, [market]);

  return (
    <NFTCardsLayout data={data}>
      {data &&
        data.map((item, index) => (
          <NFTCard key={index}>
            <NFTCardImage
              src={item.image}
              onClick={() => setSelectedNFT(item)}
            />
            <Button>Buy for {item.price} ETH</Button>
          </NFTCard>
        ))}
      <NFTPreview />
    </NFTCardsLayout>
  );
}
