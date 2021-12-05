import { useRouter } from 'next/dist/client/router';
import { useState } from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAppContext } from '../state';

const options = {
  Authorization: 'Bearer ' + process.env.NEXT_PUBLIC_API_KEY,
};

const __baseURL = 'https://ipfs.io/ipfs/';

const __form = {
  title: {
    label: 'Title',
    value: '',
  },
  description: {
    label: 'Description',
    value: '',
  },
  price: {
    label: 'Price (in ETH)',
    value: '',
    type: 'number',
    min: 1,
  },
};

export default function CreateItem() {
  const router = useRouter();

  const { address, nft, market, loading, setLoading, setAlert } =
    useAppContext();

  const [form, setForm] = useState({ ...__form });
  const [file, setFile] = useState();
  const [fileData, setFileData] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!Object.values(form).every((en) => en.value) || !file)
      return setAlert({
        color: 'red',
        message: 'Please fill in all the fields',
      });
    try {
      setLoading(true);
      setAlert({ color: 'yellow', message: 'Uploading your NFT image' });
      // Upload the file to IPFS and obtain the image CID
      let result = await fetch('https://api.nft.storage/upload', {
        method: 'POST',
        body: file,
        headers: options,
      }).then((res) => res.json());
      let url = __baseURL + result.value.cid;
      // Construct JSON metadata from form. Also add image URL to it
      setAlert({ color: 'yellow', message: 'Uploading your NFT metadata' });
      const meta = JSON.stringify({
        title: form.title.value,
        description: form.description.value,
        price: form.price.value,
        image: url,
      });
      // Upload metadata to IPFS
      result = await fetch('https://api.nft.storage/upload', {
        method: 'POST',
        body: meta,
        headers: options,
      }).then((res) => res.json());
      url = __baseURL + result.value.cid;
      // Create token with CID of uploaded metadata as tokenURI
      setAlert({
        color: 'yellow',
        message: 'Confirm the transaction to mint your NFT token',
      });
      result = await nft.methods
        .createNFT(url)
        .send({ from: address })
        .on('transactionHash', (tx) => {
          setAlert({
            color: 'green',
            message: `Transaction successful: ${tx}.\nPlease wait...`,
          });
        });
      const tokenId = Number(result.events.Transfer.returnValues.tokenId);
      // Add the created token to the market item for sale
      const listingPrice = await market.methods.getListingPrice().call();
      setAlert({
        color: 'yellow',
        message: 'Provide the listing price to add your NFT to the marketplace',
      });
      result = await market.methods
        .createMarketItem(
          nft._address,
          tokenId,
          window.web3.utils.toWei(form.price.value)
        )
        .send({ from: address, value: listingPrice.toString() })
        .on('transactionHash', (tx) => {
          setAlert({
            color: 'green',
            message: `Transaction successful: ${tx}\n.Please wait...`,
          });
        });
      setForm({ ...__form });
      setFile();
      setFileData();
      setAlert({
        color: 'green',
        message: 'NFT created successfully',
      });
      router.push('/');
    } catch (error) {
      setAlert({
        color: 'red',
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => {
      prev[e.target.name].value = e.target.value;
      return { ...prev };
    });
  };
  const handleFile = (e) => {
    const fl = e.target.files[0];
    setFile(fl);
    const reader = new FileReader();
    reader.onload = (data) => {
      setFileData(data.target.result);
    };
    reader.readAsDataURL(fl);
  };

  return (
    <section className='grid grid-cols-2 gap-16 my-4'>
      <form onSubmit={handleSubmit}>
        {Object.entries(form).map(([key, value]) => (
          <Input
            name={key}
            key={key}
            type={value.type}
            value={value.value}
            label={value.label}
            required={value.required}
            onChange={handleChange}
          />
        ))}
        <div className='pb-3' />
        <Button disabled={loading}>Mint NFT</Button>
        <p className='text-sm mt-4 text-gray-500'>
          (Listing an item costs 0.001 ETH and min price for an item is 0.01
          ETH)
        </p>
      </form>
      <div>
        <h2 className='text-xl mb-2'>NFT Image</h2>
        <div>
          {fileData ? (
            <img src={fileData} className='rounded-3xl mb-4' />
          ) : null}
          <input
            type='file'
            className='cursor-pointer bg-gray-100 p-4 rounded-lg w-full border border-gray-300'
            onChange={handleFile}
          />
        </div>
      </div>
    </section>
  );
}
