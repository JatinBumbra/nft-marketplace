import { useRouter } from 'next/dist/client/router';
import { useAppContext } from '../state';
import Button from './Button';
import { NFTCardImage } from './NFTCardsLayout';

export default function NFTPreview() {
  const router = useRouter();
  const { market, address, selectedNFT, setSelectedNFT, setAlert } =
    useAppContext();

  const createMarketSale = async (item) => {
    try {
      await market.methods
        .createMarketSale(item.nftContract, item.tokenId)
        .send({ from: address, value: window.web3.utils.toWei(item.price) })
        .on('transactionHash', (tx) => {
          setAlert({
            color: 'green',
            message: `Transaction successful: ${tx}`,
          });
        });
      setAlert({
        color: 'green',
        message: 'Purchase successful',
      });
      setSelectedNFT();
    } catch (error) {
      setAlert({
        color: 'red',
        message: error.message,
      });
    }
  };

  return selectedNFT ? (
    <div className='fixed top-0 left-0 h-screen w-screen'>
      <div className='absolute w-full h-full bg-black opacity-50'></div>
      <div className='absolute bg-white w-2/3 min-h-full z-50 right-0 p-10 h-full'>
        <p
          className='text-sm underline -translate-y-4 cursor-pointer opacity-60 hover:opacity-100'
          onClick={() => setSelectedNFT()}
        >
          Close
        </p>
        <div className='grid grid-cols-2 gap-10 items-center h-full'>
          <NFTCardImage src={selectedNFT.image} alt='' />
          <div className='py-4 pr-10'>
            <h1 className='text-4xl font-semibold mb-2'>{selectedNFT.title}</h1>
            <p className='text-gray-500'>{selectedNFT.description}</p>
            <div className='flex justify-between items-center my-8 text-2xl justify-self-end'>
              <span className='font-medium text-gray-700'>
                {selectedNFT?.owner === address ? 'Bought for' : 'Price'}
              </span>
              <span className='font-bold text-4xl'>
                {selectedNFT.price} ETH
              </span>
            </div>
            {router.route === '/' ? (
              <Button
                className='py-4'
                disabled={selectedNFT?.seller === address}
                onClick={() => createMarketSale(selectedNFT)}
              >
                Buy Now
              </Button>
            ) : null}
            {selectedNFT?.seller === address ? (
              <div className='p-4 text-center mt-4 rounded-xl bg-gray-100'>
                <p>On sale by you</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
