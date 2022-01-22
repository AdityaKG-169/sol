const {
	Keypair,
	PublicKey,
	Connection,
	clusterApiUrl,
	LAMPORTS_PER_SOL,
	Transaction,
	SystemProgram,
	sendAndConfirmTransaction,
} = require("@solana/web3.js");

const from = new Keypair();
const to = new Keypair();

const establishConnection = () => {
	const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
	return connection;
};

const getPublicKey = (keypair) => {
	const myWallet = Keypair.fromSecretKey(keypair._keypair.secretKey);
	const publicKey = new PublicKey(
		"ACTpReVBvLUWYbcPT8oX8oHPjhwuWcWkm3H6wfnQDoYY"
	);
	// ACTpReVBvLUWYbcPT8oX8oHPjhwuWcWkm3H6wfnQDoYY
	return publicKey;
};

const getWalletBalance = async (connection, keypair) => {
	const publicKey = new PublicKey(keypair._keypair.publicKey).toString();

	try {
		const getBalance = await connection.getBalance(new PublicKey(publicKey));
		console.log(`For wallet address: ${publicKey.toString()}`);
		console.log(`Wallet balance is ${getBalance / LAMPORTS_PER_SOL}SOL`);
	} catch (err) {
		console.log("Error1: ", err);
	}
};

const airDropSol = async (connection, myAddress, amount) => {
	try {
		const signature = await connection.requestAirdrop(
			new PublicKey(myAddress._keypair.publicKey),
			amount * LAMPORTS_PER_SOL
		);

		console.log(await connection.confirmTransaction(signature));
	} catch (err) {
		console.log("Error2: ", err);
	}
};

const transferSol = async (connection, from, to, amount) => {
	const transaction = new Transaction().add(
		SystemProgram.transfer({
			fromPubkey: new PublicKey(from.publicKey.toString()),
			toPubkey: new PublicKey(to.publicKey.toString()),
			lamports: amount * LAMPORTS_PER_SOL,
		})
	);

	const signature = await sendAndConfirmTransaction(connection, transaction, [
		from,
	]);

	console.log(signature);
};

const generatorFunction = async (amount) => {
	const connection = establishConnection();
	const publicKey = getPublicKey(secretKey);

	await getWalletBalance(connection, publicKey);
	await airDropSol(connection, publicKey, amount);
	await getWalletBalance(connection, publicKey);
};

generatorFunction(2);

const transferTest = async (from, to, amount) => {
	const connection = establishConnection();

	await airDropSol(connection, from, 2);

	await getWalletBalance(connection, from);

	await getWalletBalance(connection, to);

	await transferSol(connection, from, to, amount);

	await getWalletBalance(connection, from);

	await getWalletBalance(connection, to);
};

transferTest(from, to, 0.5);
