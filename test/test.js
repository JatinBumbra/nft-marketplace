const { expect } = require('chai');

const NFT = artifacts.require('NFT');
const Market = artifacts.require('Market');

require('chai').use(require('chai-as-promised')).should();

describe('Marketplace Functionality', () => {
  contract('NFT & Market Contracts', ([creator, buyer]) => {
    let nft,
      market,
      item1index,
      item2index,
      result,
      listingPrice,
      price = web3.utils.toWei('1');
    const item1uri = 'https://item1.uri';
    const item2uri = 'https://item2.uri';

    before(async () => {
      market = await Market.new();
      nft = await NFT.new(market.address);
    });

    describe('NFT Contract', () => {
      describe('attributes', () => {
        it('has correct name', async () => {
          const name = await nft.name();
          expect(name.toString()).equal('NFT Verse');
        });

        it('has correct symbol', async () => {
          const symbol = await nft.symbol();
          expect(symbol.toString()).equal('NFTV');
        });
      });

      describe('createToken()', () => {
        it('creates an NFT item', async () => {
          result = await nft.createNFT(item1uri, { from: creator });
          item1index = result.logs[0].args[2].toString();
          result = await nft.createNFT(item2uri, { from: creator });
          item2index = result.logs[0].args[2].toString();

          expect((await nft.tokenURI(item1index)).toString()).equal(item1uri);
          expect((await nft.tokenURI(item2index)).toString()).equal(item2uri);

          expect((await nft.ownerOf(item1index)).toString()).equal(creator);
          expect((await nft.ownerOf(item2index)).toString()).equal(creator);
        });
      });
    });

    describe('Market Contract', () => {
      describe('getListingPrice()', () => {
        it('returns the correct listing price', async () => {
          listingPrice = await market.getListingPrice();
          expect(listingPrice.toString()).equal(web3.utils.toWei('0.025'));
        });
      });

      describe('createMarketItem()', () => {
        describe('success', () => {
          it('creates a market item', async () => {
            result = await market.createMarketItem(
              nft.address,
              item1index,
              price,
              { from: creator, value: listingPrice }
            );
            expect((await nft.ownerOf(item1index)).toString()).equal(
              market.address
            );
          });
        });

        describe('failure', () => {
          it('rejects price less than 1 ETH', async () => {
            expect(
              market.createMarketItem(nft.address, item2index, price - 1, {
                from: creator,
                value: listingPrice,
              })
            ).to.be.rejected;
          });
          it('rejects if listing price is not provided', async () => {
            expect(
              market.createMarketItem(nft.address, item2index, price, {
                from: creator,
                value: listingPrice - 1,
              })
            ).to.be.rejected;
          });
        });
      });
    });
  });
});
