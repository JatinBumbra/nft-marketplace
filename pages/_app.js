import '../styles/globals.css';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Marketplace({ Component, pageProps }) {
  const router = useRouter();

  const routes = [
    {
      route: '/',
      name: 'Home',
    },
    {
      route: '/create-item',
      name: 'Sell Digital Asset',
    },
    {
      route: '/my-assets',
      name: 'My Digital Assets',
    },
    {
      route: '/creator-dashboard',
      name: 'Creator Dashboard',
    },
  ];
  return (
    <div>
      <nav className='p-6 border-b pb-0'>
        <p className='text-4xl font-semibold'>NFTVerse Marketplace</p>
        <div className='flex mt-4'>
          {routes.map((route) => (
            <Link href={route.route} key={route.route}>
              <a
                className={`py-2 mr-6 font-medium ${
                  router.route === route.route
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-400'
                }`}
              >
                {route.name}
              </a>
            </Link>
          ))}
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default Marketplace;
