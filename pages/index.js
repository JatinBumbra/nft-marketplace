import Button from '../components/Button';
import {
  NFTCardsLayout,
  NFTCard,
  NFTCardImage,
} from '../components/NFTCardsLayout';
import NFTPreview from '../components/NFTPreview';
import { useAppContext } from '../state';
import { useEffect, useState } from 'react';

export default function Home() {
  const { market, setSelectedNFT, fetchMarketData, setLoading, setAlert } =
    useAppContext();
  const [data, setData] = useState();

  useEffect(() => {
    setLoading(true);
    const condition = (item) => item.sold || item.tokenId == 0;
    market &&
      fetchMarketData(market.methods.fetchMarketItems, condition)
        .then((data) => setData(data))
        .catch((err) => setAlert({ color: 'red', message: err.message }))
        .finally(setLoading);
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
