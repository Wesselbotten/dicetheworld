import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ThirdwebProvider, ConnectButton, TransactionButton, useActiveAccount } from "thirdweb/react";
import { prepareContractCall } from "thirdweb";
import { client, marketplaceContract } from "../../client";
import { polygon } from "thirdweb/chains";

function TokenPageContent() {
  const router = useRouter();
  const { id, price } = router.query;
  const account = useActiveAccount();
  const [bidAmount, setBidAmount] = useState("");

  const tokenId = typeof id === "string" ? BigInt(id) : undefined;
  const priceInEth = typeof price === "string" ? price : "0";

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Dice The World Marketplace</h1>
        <ConnectButton client={client} chain={polygon} />
      </header>

      {tokenId !== undefined ? (
        <div style={{ border: "1px solid #e2e8f0", padding: "2rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", textAlign: "left" }}>
          <h2 style={{ marginTop: 0, textAlign: "center" }}>Stad Token #{tokenId.toString()}</h2>
          <p><strong>Netwerk:</strong> Polygon Mainnet</p>
          <p><strong>Richtprijs / Vraagprijs:</strong> {priceInEth} ETH/POL</p>

          {!account ? (
            <p style={{ color: "#666", textAlign: "center", marginTop: "1.5rem" }}>
              Verbind rechtsboven je wallet om te handelen of te bieden op deze stad.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
              {/* OPTIE 1: Direct Kopen */}
              <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>1. Direct Kopen</h3>
                <TransactionButton
                  transaction={() =>
                    prepareContractCall({
                      contract: marketplaceContract,
                      method: "function buyFromListing(uint256 _listingId, address _buyFor, uint256 _quantity, address _currency, uint256 _expectedTotalPrice)",
                      params: [tokenId, account.address, BigInt(1), "0x0000000000000000000000000000000000000000", BigInt(0)],
                    })
                  }
                  onTransactionConfirmed={() => alert(`Stad #${tokenId} succesvol gekocht!`)}
                  onError={(err) => alert("Fout bij kopen: " + err.message)}
                >
                  Koop Nu ({priceInEth})
                </TransactionButton>
              </div>

              {/* OPTIE 2: Bod Uitbrengen */}
              <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>2. Plaats een Bod</h3>
                <input
                  type="number"
                  placeholder="Bedrag in POL/ETH"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem", borderRadius: "4px", border: "1px solid #ccc" }}
                />
                <TransactionButton
                  transaction={() =>
                    prepareContractCall({
                      contract: marketplaceContract,
                      method: "function makeOffer(address _assetContract, uint256 _tokenId, address _currency, uint256 _totalPrice, uint256 _expirationTimestamp)",
                      params: [
                        "0x14ba701863A9734b17fB074bC27104D57B644f8E", // Oorspronkelijke NFT contract
                        tokenId,
                        "0x0000000000000000000000000000000000000000",
                        BigInt(Math.floor(parseFloat(bidAmount || "0") * 1e18)),
                        BigInt(Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60), // 7 dagen geldig
                      ],
                    })
                  }
                  onTransactionConfirmed={() => alert(`Bod op Stad #${tokenId} is geplaatst!`)}
                  onError={(err) => alert("Fout bij bieden: " + err.message)}
                >
                  Verstuur Bod
                </TransactionButton>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Laden...</p>
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
