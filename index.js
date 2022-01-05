const {
	Connection,
	PublicKey,
	clusterApiUrl,
	Keypair,
	LAMPORTS_PER_SOL,
	Transaction,
	Account,
} = require("@solana/web3.js");

const newPair = new Keypair();
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const secretKey = newPair._keypair.secretKey;

const getWalletBalance = async () => {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
		const myWallet = Keypair.fromSecretKey(secretKey);
		const walletBalance = await connection.getBalance(
			new PublicKey(myWallet.publicKey)
		);
		console.log(`=> For wallet address ${publicKey}`);
		console.log(
			`   Wallet balance: ${parseInt(walletBalance) / LAMPORTS_PER_SOL}SOL`
		);
	} catch (err) {
		console.log(err);
	}
};

const airDropSol = async () => {
	try {
		const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
		const myWallet = Keypair.fromSecretKey(secretKey);
		const fromAirDropSignature = await connection.requestAirdrop(
			new PublicKey(myWallet.publicKey),
			2 * LAMPORTS_PER_SOL
		);

		const confirmation = await connection.confirmTransaction(
			fromAirDropSignature
		);

		console.log(confirmation);
	} catch (err) {
		console.log(err);
	}
};

const driverFunction = async () => {
	await getWalletBalance();
	await airDropSol();
	await getWalletBalance();
};

driverFunction();
