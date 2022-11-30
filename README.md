# Frontend Dev Assignment Popcor

The project should be build in react with ether.js or an ether.js compatible framework

1. Check the yearn registry for all USDC vaults.(0x50c1a2eA0a861A967D9d0FFE2AE4012c2E053804)
2. Display all of them with their TVL in $ and a deposit/ withdrawal interface
3. Allow the user to connect their wallet.
4. In the deposit/withdrawal interface show a users balance of either usdc or vault token (usdc in deposit, vaultToken in withdrawal)
5. When a user inputs values for either deposit/withdrawal it should show the expected returned amount of vaultToken (on deposit) or assets (on withdrawal) based on the vaults pricePerShare
6. When a user inputs values for either deposit/withdrawal it should check if the user has a sufficient allowance. If not, it should show an approval button.
7. The approval button should approve the maximum possible amount of either usdc/vault token for this vault.
8. If the approval is sufficient and the user didnt enter more tokens than they own it should either deposit or withdraw from the vault and update displayed balances.


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`
