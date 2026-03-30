import React, { useState, useEffect, useCallback } from 'react';
import { setupWalletSelector } from '@near-wallet-selector/core';
import { setupModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import '@near-wallet-selector/modal-ui/styles.css';

const CONTRACT_ID = 'guest-book.testnet';
const NETWORK = 'testnet';

export default function App() {
  const [selector, setSelector] = useState(null);
  const [modal, setModal] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    setupWalletSelector({
      network: NETWORK,
      modules: [setupMyNearWallet(), setupHereWallet()],
    }).then((sel) => {
      setSelector(sel);
      const m = setupModal(sel, { contractId: CONTRACT_ID });
      setModal(m);
      const state = sel.store.getState();
      if (state.accounts.length > 0) {
        setAccountId(state.accounts[0].accountId);
      }
      sel.store.observable.subscribe((state) => {
        const acct = state.accounts.find((a) => a.active);
        setAccountId(acct ? acct.accountId : null);
      });
    });
  }, []);

  const handleSignIn = () => modal && modal.show();

  const handleSignOut = async () => {
    if (!selector) return;
    const wallet = await selector.wallet();
    await wallet.signOut();
    setAccountId(null);
  };

  const callContract = useCallback(async () => {
    if (!selector) return;
    const wallet = await selector.wallet();
    try {
      const result = await wallet.signAndSendTransaction({
        receiverId: CONTRACT_ID,
        actions: [{
          type: 'FunctionCall',
          params: {
            methodName: 'getGreeting',
            args: {},
            gas: '30000000000000',
            deposit: '0',
          },
        }],
      });
      setGreeting(JSON.stringify(result, null, 2));
    } catch (e) {
      setGreeting('Error: ' + e.message);
    }
  }, [selector]);

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>React + NEAR Starter</h1>
      <p>Network: {NETWORK} | Contract: {CONTRACT_ID}</p>
      {accountId ? (
        <>
          <p>Connected: <strong>{accountId}</strong></p>
          <button onClick={callContract}>Call Contract</button>
          <button onClick={handleSignOut} style={{ marginLeft: 8 }}>Sign Out</button>
          {greeting && <pre style={{ background: '#f5f5f5', padding: 12 }}>{greeting}</pre>}
        </>
      ) : (
        <button onClick={handleSignIn}>Connect NEAR Wallet</button>
      )}
    </div>
  );
}