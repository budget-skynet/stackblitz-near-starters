<template>
  <div style="max-width: 600px; margin: 40px auto; font-family: sans-serif">
    <h1>Vue + NEAR Starter</h1>
    <p>Network: {{ network }} | Contract: {{ contractId }}</p>
    <div v-if="accountId">
      <p>Connected: <strong>{{ accountId }}</strong></p>
      <button @click="callContract">Call Contract</button>
      <button @click="signOut" style="margin-left: 8px">Sign Out</button>
      <pre v-if="result" style="background: #f5f5f5; padding: 12px">{{ result }}</pre>
    </div>
    <button v-else @click="signIn">Connect NEAR Wallet</button>
  </div>
</template>

<script>
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import '@near-wallet-selector/modal-ui/styles.css';

export default {
  data() {
    return {
      selector: null, modal: null, accountId: null, result: '',
      contractId: 'guest-book.testnet', network: 'testnet',
    };
  },
  async mounted() {
    this.selector = await setupWalletSelector({
      network: this.network,
      modules: [setupMyNearWallet(), setupHereWallet()],
    });
    this.modal = setupModal(this.selector, { contractId: this.contractId });
    const state = this.selector.store.getState();
    if (state.accounts.length > 0) this.accountId = state.accounts[0].accountId;
    this.selector.store.observable.subscribe((s) => {
      const acct = s.accounts.find((a) => a.active);
      this.accountId = acct ? acct.accountId : null;
    });
  },
  methods: {
    signIn() { this.modal?.show(); },
    async signOut() {
      const wallet = await this.selector.wallet();
      await wallet.signOut();
      this.accountId = null;
    },
    async callContract() {
      try {
        const wallet = await this.selector.wallet();
        const res = await wallet.signAndSendTransaction({
          receiverId: this.contractId,
          actions: [{
            type: 'FunctionCall',
            params: { methodName: 'getGreeting', args: {}, gas: '30000000000000', deposit: '0' },
          }],
        });
        this.result = JSON.stringify(res, null, 2);
      } catch (e) { this.result = 'Error: ' + e.message; }
    },
  },
};
</script>