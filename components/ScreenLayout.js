import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppContext } from '../state';

export default function ScreenLayout({ children }) {
  const router = useRouter();
  const { alert, setAlert } = useAppContext();

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
    <>
      <p className='bg-red-500'></p>
      <p className='bg-red-600'></p>
      <p className='bg-red-700'></p>
      <p className='bg-red-800'></p>
      <p className='bg-green-500'></p>
      <p className='bg-green-600'></p>
      <p className='bg-green-700'></p>
      <p className='bg-green-800'></p>
      <p className='bg-yellow-500'></p>
      <p className='bg-yellow-600'></p>
      <p className='bg-yellow-700'></p>
      <p className='bg-yellow-800'></p>
      {alert.message ? (
        <div
          className={`bg-${alert.color}-500 text-white p-3 pl-6 absolute m-4 rounded-md left-1/2 -translate-x-1/2 flex justify-between items-center z-50 shadow-xl`}
        >
          <p>{alert.message}</p>
          <button
            className={`bg-${alert.color}-600 text-xs p-2 rounded hover:bg-${alert.color}-700 active:bg-${alert.color}-800 ml-3 transition-all`}
            onClick={setAlert}
          >
            Close
          </button>
        </div>
      ) : null}
      <header className='border-b-2 pt-6 px-12'>
        <div className='custom-container flex justify-between'>
          <div>
            <p className='text-4xl font-semibold'>NFTVerse Marketplace</p>
            <nav className='flex mt-4'>
              {routes.map((route) => (
                <Link href={route.route} key={route.route}>
                  <a
                    className={`py-1 mr-6 font-medium ${
                      router.route === route.route
                        ? 'border-b-2 border-blue-600 text-blue-600'
                        : 'text-gray-400'
                    }`}
                  >
                    {route.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      <main className='custom-container'>{children}</main>
    </>
  );
}
