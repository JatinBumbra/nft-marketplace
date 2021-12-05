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

  return (
    <NFTCardsLayout data={data} message={'No NFTs for sale'}>
      {data &&
        data.map((item, index) => (
          <NFTCard key={index}>
            <NFTCardImage src={item.image} />
            <Button onClick={() => setSelectedNFT(item)}>Click to BUY</Button>
          </NFTCard>
        ))}
      <NFTPreview />
    </NFTCardsLayout>
  );
}
