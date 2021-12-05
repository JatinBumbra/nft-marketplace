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

export default function MyAssets() {
  const { address, nft, market, setSelectedNFT } = useAppContext();
  const [data, setData] = useState();

  useEffect(() => {
    const init = async () => {
      const decoder = new TextDecoder();
      const items = await market.methods.fetchMyNFTS().call({ from: address });
      const data = [];
      await Promise.all(
        items.map(async (item, i) => {
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
    <NFTCardsLayout
      data={data}
      message={
        "No NFTs purchased by you. Move to 'Home' page to buy some NFTs for your collection"
      }
    >
      {data &&
        data.map((item, index) => (
          <NFTCard key={index}>
            <NFTCardImage
              src={item.image}
              onClick={() => setSelectedNFT(item)}
            />
            <div className='px-1 font-medium flex justify-between items-center'>
              <span className='opacity-50'>Bought for</span>{' '}
              <span>{item.price} ETH</span>
            </div>
          </NFTCard>
        ))}
      <NFTPreview />
    </NFTCardsLayout>
  );
}
