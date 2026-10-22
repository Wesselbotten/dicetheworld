import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ThirdwebProvider, ConnectButton, TransactionButton, useActiveAccount } from "thirdweb/react";
import { claimTo } from "thirdweb/extensions/erc721";
import { client, contract } from "../../client";
import { polygon } from "thirdweb/chains";

function TokenPageContent() {
  const router = useRouter();
  const { id, price } = router.query;
  const account = useActiveAccount();

  const tokenId = typeof id === "string" ? BigInt(id) : undefined;
  const priceInEth = typeof price === "string" ? price : "0";

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Dice The World</h1>
        <ConnectButton client={client} chain={polygon} />
      </header>

      {tokenId !== undefined ? (
        <div style={{ border: "1px solid #e2e8f0", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginTop: 0 }}>Stad Token #{tokenId.toString()}</h2>
          <p><strong>Netwerk:</strong> Polygon Mainnet</p>
          <p><strong>Prijs:</strong> {priceInEth} ETH</p>

          {!account ? (
            <p style={{ color: "#666", marginTop: "1.5rem" }}>
              Verbind rechtsboven je wallet om deze stad te claimen.
            </p>
          ) : (
            <div style={{ marginTop: "1.5rem" }}>
              <TransactionButton
                transaction={() =>
                  claimTo({
                    contract,
                    to: account.address,
                    quantity: BigInt(1),
                  })
                }
                onTransactionConfirmed={(receipt) => {
                  alert(`Gefeliciteerd! Token #${tokenId} is succesvol geclaimd.`);
                }}
                onError={(error) => {
                  console.error("Transactiefout:", error);
                  alert("Fout bij het claimen: " + error.message);
                }}
              >
                Koop / Claim Stad ({priceInEth} ETH)
              </TransactionButton>
            </div>
          )}
        </div>
      ) : (
        <p>Token parameters worden geladen...</p>
      )}
    </main>
  );
}

export default function TokenPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <p style={{ textAlign: "center", padding: "2rem" }}>Laden...</p>;
  }

  return (
    <ThirdwebProvider>
      <TokenPageContent />
    </ThirdwebProvider>
  );
}
