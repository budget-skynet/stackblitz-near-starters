'use client';
import { useState, useEffect, useCallback } from 'react';
import { setupWalletSelector, WalletSelector } from '@near-wallet-selector/core';
import { setupModal, WalletSelectorModal } from '@near-wallet-selector/modal-ui';
import { setupMyNearWallet } from '@near-wallet-selector/my-near-wallet';
import { setupHereWallet } from '@near-wallet-selector/here-wallet';
import '@near-wallet-selector/modal-ui/styles.css';

const CONTRACT_ID = 'guest-book.testnet';
const NETWORK = 'testnet';

export default function Home() {
  const [selector, setSelector] = useState<WalletSelector | null>(null);
  const [modal, setModal] = useState<WalletSelectorModal | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [result, setResult] = useState('');

  useEffect(() => {
    setupWalletSelector({
      network: NETWORK,
      modules: [setupMyNearWallet(), setupHereWallet()],
    }).then((sel) => {
      setSelector(sel);
      setModal(setupModal(sel, { contractId: CONTRACT_ID }));
      const state = sel.store.getState();
      if (state.accounts.length > 0) setAccountId(state.accounts[0].accountId);
      sel.store.observable.subscribe((s) => {
        const acct = s.accounts.find((a) => a.active);
        setAccountId(acct ? acct.accountId : null);
      });
    });
  }, []);

  const viewMethod = useCallback(async () => {
    if (!selector) return;
    const wallet = await selector.wallet();
    try {
      const res = await wallet.signAndSendTransaction({
        receiverId: CONTRACT_ID,
        actions: [{
          type: 'FunctionCall',
          params: { methodName: 'getGreeting', args: {}, gas: '30000000000000', deposit: '0' },
        }],
      });
      setResult(JSON.stringify(res, null, 2));
    } catch (e: any) {
      setResult('Error: ' + e.message);
    }
  }, [selector]);

  return (
    <main style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>Next.js + NEAR Starter</h1>
      <p>Network: {NETWORK} | Contract: {CONTRACT_ID}</p>
      {accountId ? (
        <>
          <p>Connected: <strong>{accountId}</strong></p>
          <button onClick={viewMethod}>Call Contract</button>
          <button onClick={async () => { const w = await selector!.wallet(); await w.signOut(); setAccountId(null); }} style={{ marginLeft: 8 }}>Sign Out</button>
          {result && <pre style={{ background: '#f5f5f5', padding: 12, overflow: 'auto' }}>{result}</pre>}
        </>
      ) : (
        <button onClick={() => modal?.show()}>Connect NEAR Wallet</button>
      )}
    </main>
  );
}