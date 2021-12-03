export const NFTCardsLayout = ({ children }) => (
  <div className='grid grid-cols-4 gap-4'>{children}</div>
);

export const NFTCard = ({ children }) => (
  <div className='bg-white border border-gray-300 rounded-3xl p-3 hover:shadow-2xl transition-all hover:scale-105 active:scale-100'>
    {children}
  </div>
);

export const NFTCardImage = ({ src, alt, onClick }) => (
  <img
    src={src}
    alt={alt}
    onClick={onClick}
    className='rounded-2xl cursor-pointer mb-4 w-full'
  />
);
