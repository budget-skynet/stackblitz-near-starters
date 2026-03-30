<script>
  import { onMount } from 'svelte';
  import { setupWalletSelector } from '@near-wallet-selector/core';
  import { setupModal } from '@near-wallet-selector/modal-ui';
  import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
  import { setupHereWallet } from '@near-wallet-selector/here-wallet';
  import '@near-wallet-selector/modal-ui/styles.css';

  const CONTRACT_ID = 'guest-book.testnet';
  const NETWORK = 'testnet';

  let selector = null;
  let modal = null;
  let accountId = null;
  let result = '';

  onMount(async () => {
    selector = await setupWalletSelector({
      network: NETWORK,
      modules: [setupMyNearWallet(), setupHereWallet()],
    });
    modal = setupModal(selector, { contractId: CONTRACT_ID });
    const state = selector.store.getState();
    if (state.accounts.length > 0) accountId = state.accounts[0].accountId;
    selector.store.observable.subscribe((s) => {
      const acct = s.accounts.find((a) => a.active);
      accountId = acct ? acct.accountId : null;
    });
  });

  function signIn() { modal?.show(); }

  async function signOut() {
    const wallet = await selector.wallet();
    await wallet.signOut();
    accountId = null;
  }

  async function callContract() {
    try {
      const wallet = await selector.wallet();
      const res = await wallet.signAndSendTransaction({
        receiverId: CONTRACT_ID,
        actions: [{
          type: 'FunctionCall',
          params: { methodName: 'getGreeting', args: {}, gas: '30000000000000', deposit: '0' },
        }],
      });
      result = JSON.stringify(res, null, 2);
    } catch (e) { result = 'Error: ' + e.message; }
  }
</script>

<div style="max-width: 600px; margin: 40px auto; font-family: sans-serif">
  <h1>Svelte + NEAR Starter</h1>
  <p>Network: {NETWORK} | Contract: {CONTRACT_ID}</p>
  {#if accountId}
    <p>Connected: <strong>{accountId}</strong></p>
    <button on:click={callContract}>Call Contract</button>
    <button on:click={signOut} style="margin-left: 8px">Sign Out</button>
    {#if result}<pre style="background: #f5f5f5; padding: 12px">{result}</pre>{/if}
  {:else}
    <button on:click={signIn}>Connect NEAR Wallet</button>
  {/if}
</div>