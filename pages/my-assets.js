import {
  NFTCardsLayout,
  NFTCard,
  NFTCardImage,
} from '../components/NFTCardsLayout';
import NFTPreview from '../components/NFTPreview';
import { useAppContext } from '../state';
import { useEffect, useState } from 'react';

export default function MyAssets() {
  const { market, setSelectedNFT, fetchMarketData } = useAppContext();
  const [data, setData] = useState();

  useEffect(() => {
    market &&
      fetchMarketData(market.methods.fetchMyNFTS).then((data) => setData(data));
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
