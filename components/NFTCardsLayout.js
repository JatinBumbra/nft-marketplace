import { useAppContext } from '../state';

export const NFTCardsLayout = ({ children, data, message }) => {
  const { loading } = useAppContext();

  return loading ? (
    <div className='my-8 text-lg'>Loading...</div>
  ) : data && data?.length ? (
    <div className='grid grid-cols-4 gap-4'>{children}</div>
  ) : (
    <div>
      <p className='text-xl font-medium my-4'>{message}</p>
    </div>
  );
};

export const NFTCard = ({ children }) => (
  <div className='bg-white border border-gray-300 rounded-3xl p-3 hover:shadow-2xl transition-all hover:scale-105 active:scale-95'>
    {children}
  </div>
);

export const NFTCardImage = ({ src, alt, onClick }) => (
  <img
    src={src}
    alt={alt}
    onClick={onClick}
    className={`rounded-2xl ${onClick ? 'cursor-pointer' : ''} mb-4 w-full`}
  />
);
