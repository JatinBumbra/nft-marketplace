import {
  NFTCardsLayout,
  NFTCard,
  NFTCardImage,
} from '../components/NFTCardsLayout';
import NFTPreview from '../components/NFTPreview';
import { useAppContext } from '../state';
import { useEffect, useState } from 'react';

export default function CreatorDashboard() {
  const { market, setSelectedNFT, fetchMarketData } = useAppContext();
  const [data, setData] = useState();

  useEffect(() => {
    market &&
      fetchMarketData(market.methods.fetchNFTSCreated).then((data) =>
        setData(data)
      );
  }, [market]);

  return (
    <NFTCardsLayout
      data={data}
      message={
        "No NFTs minted by you. Move to 'Sell Digital Asset' page to mint your first NFT"
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
              <span className='opacity-50'>On Sale</span>{' '}
              <span>{item.price} ETH</span>
            </div>
          </NFTCard>
        ))}
      <NFTPreview />
    </NFTCardsLayout>
  );
}
