function build_dfa(string) {
	const characters = [...new Set(string)]; // Get the unique characters in the string
	const dfa = {
		transitions: {},
		acceptingStates: [],
		startState: 0
	};
	let nextState = 1;
	for (let i = 0; i < string.length; i++) {
		const currentChar = string[i];
		if (!(currentChar in dfa.transitions)) {
			// Add a new transition for the current character
			const transition = {};
			for (let j = 0; j < characters.length; j++) {
				transition[characters[j]] = nextState;
			}
			dfa.transitions[nextState - 1] = transition;
			nextState++;
		}
		// Update the current state according to the current input symbol
		dfa.transitions[i] = dfa.transitions[i] || {};
		dfa.transitions[i][currentChar] = i + 1;
	}
	// The final state is an accepting state
	dfa.acceptingStates.push(string.length);
	return dfa;
}
function dfaSearch(string) {
	const dfa = build_dfa(string);
	let currentState = dfa.startState;
	for (let i = 0; i < string.length; i++) {
		const input = string[i];
		currentState = dfa.transitions[currentState][input];
		if (currentState === undefined) {
			return false; // Reject if there is no transition defined for the current input
		}
	}
	return dfa.acceptingStates.includes(currentState); // Accept if the final state is an accepting state
}
let substring = "aba";
let input = "ababbababa";
let search = dfaSearch(substring);
console.log(search)