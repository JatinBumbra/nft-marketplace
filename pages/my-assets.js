import {
  NFTCardsLayout,
  NFTCard,
  NFTCardImage,
} from '../components/NFTCardsLayout';
import NFTPreview from '../components/NFTPreview';
import { useAppContext } from '../state';

export default function MyAssets() {
  const { setSelectedNFT } = useAppContext();

  return (
    <NFTCardsLayout>
      {Array(9)
        .fill(true)
        .map((i, index) => (
          <NFTCard key={index}>
            <NFTCardImage
              src='https://instagram.fdel43-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/260032302_692923631587437_4948296121590872956_n.webp.jpg?_nc_ht=instagram.fdel43-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=b0cjP_3_vMIAX9DfkXR&edm=AABBvjUBAAAA&ccb=7-4&oh=e310cdc8d828b26dd24be644393c77fa&oe=61AF5B79&_nc_sid=83d603'
              alt=''
              onClick={() => setSelectedNFT(true)}
            />
            <div className='px-1 font-medium flex justify-between items-center'>
              <span className='opacity-50'>Bought for</span> <span>1 ETH</span>
            </div>
          </NFTCard>
        ))}
      <NFTPreview />
    </NFTCardsLayout>
  );
}
