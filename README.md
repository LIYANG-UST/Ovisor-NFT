# Ovisor NFT

For ethereum mainnet, network name is "eth"

## Install Dependencies

```
yarn
```

## Set up environment variables

change .env.example to .env and fill in the variables

```
PK_ETH = private key of the ethereum account
ETH_URL = rpc url of the ethereum network
```

## Compile

```
yarn compile
```

## Deploy

Check network names in hardhat.config.js

```
yarn deploy --network {network_name}
```

## Change Status

Status:

- 0: Not for sale
- 1: Airdrop Claim
- 2: Allowlist sale
- 3: Public Sale

```
yarn setStatus --network {network_name} --status {status_number}
```

## Change Airdrop List

- Modify info/airdrop.json
- Run

```
yarn setAirdrop --network {network_name}
```

## Change Airdrop List

- Modify info/airdrop.json
- Run

```
yarn setAllowlist --network {network_name}
```

## Mint NFT for all airdrop users

```
yarn mintAirdrop --network {network_name}
```

## Mint NFT to users by owner

```
yarn ownerMint --network {network_name} --address {user_address} --amount {amount}
```

## Set Price

```
yarn setPrice --network {network_name} --type {"publicSale" || "allowlistSale"} --price {price (in ether)}
```
