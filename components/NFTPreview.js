import { useAppContext } from '../state';
import Button from './Button';
import { NFTCardImage } from './NFTCardsLayout';

export default function NFTPreview() {
  const { selectedNFT, setSelectedNFT } = useAppContext();

  return selectedNFT ? (
    <div className='fixed top-0 left-0 h-screen w-screen'>
      <div className='absolute w-full h-full bg-black opacity-50'></div>
      <div className='absolute bg-white w-2/3 min-h-full z-50 right-0 p-10'>
        <p
          className='text-sm underline -translate-y-4 cursor-pointer opacity-60 hover:opacity-100'
          onClick={() => setSelectedNFT()}
        >
          Close
        </p>
        <div className='grid grid-cols-2 gap-10 items-center'>
          <NFTCardImage
            src='https://instagram.fdel43-1.fna.fbcdn.net/v/t51.2885-15/e35/p1080x1080/260032302_692923631587437_4948296121590872956_n.webp.jpg?_nc_ht=instagram.fdel43-1.fna.fbcdn.net&_nc_cat=109&_nc_ohc=b0cjP_3_vMIAX9DfkXR&edm=AABBvjUBAAAA&ccb=7-4&oh=e310cdc8d828b26dd24be644393c77fa&oe=61AF5B79&_nc_sid=83d603'
            alt=''
          />
          <div className='py-4 pr-10'>
            <h1 className='text-4xl font-semibold mb-2'>NFT Art Title</h1>
            <p className='text-gray-500'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
              molestiae id assumenda mollitia placeat deserunt in totam tempore
              fuga doloremque esse cumque, accusamus repudiandae maxime eaque at
              vero libero. Harum.
            </p>
            <div className='flex justify-between items-center my-8 text-2xl justify-self-end'>
              <span className='font-medium text-gray-700'>Price</span>
              <span className='font-bold text-4xl'>1 ETH</span>
            </div>
            <Button className='py-4'>Buy Now</Button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
