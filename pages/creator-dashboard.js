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

export default function CreatorDashboard() {
  const { address, nft, market, setSelectedNFT } = useAppContext();
  const [data, setData] = useState();

  useEffect(() => {
    const init = async () => {
      const decoder = new TextDecoder();
      const items = await market.methods
        .fetchNFTSCreated()
        .call({ from: address });
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
            <div className='px-1 font-medium flex justify-between items-center'>
              <span className='opacity-50'>On Sale</span>{' '}
              <span>{item.price} ETH</span>
            </div>
          </NFTCard>
        ))}
      <NFTPreview />
    </NFTCardsLayout>
  );
}
