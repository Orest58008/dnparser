enum Token {
	// Blank symbol that gets filtered out after
	Blank,
	// Integers and values
	Integer, FudgeFate,
	// Mathematical operations
	OpenBracket, CloseBracket,
	Plus, Minus, Mult, Div,
	// Dice symbols
	Delimiter,
	KeepHigh, KeepLow,
	OneHigh, OneLow,
	Explode,
};

const tokenStrings = new Map([
	['F', Token.FudgeFate], ['f', Token.FudgeFate],
	['(', Token.OpenBracket], [')', Token.CloseBracket],
	['+', Token.Plus], ['-', Token.Minus],
	['*', Token.Mult], ['x', Token.Mult], ['/', Token.Div],
	['D', Token.Delimiter], ['d', Token.Delimiter],
	['К', Token.Delimiter], ['к', Token.Delimiter],
	['H', Token.OneHigh], ['L', Token.OneLow]
]);

function tokenise(input: string) : [Token, string?][] {
	const result: [Token, string?][] = [];
	
	input.split('').forEach((char: string, index: number, array: string[]) => {
		if (/\s/.test(char)) {
			result.push([Token.Blank, undefined]);
			return;
		};

		if (/[0-9]/.test(char)) {
			const lastToken = result[result.length - 1];
			
			if (lastToken === undefined || lastToken[0] !== Token.Integer)
				result.push([Token.Integer, char]);
			else
				result[result.length - 1][1] += char;

			return;
		};
		
		if (char === '%') {
			result.push([Token.Integer, "100"]);
			return;
		};

		if ((char === 'h' || char === 'l') && array[index - 1] === 'k')
			return;

		if (char === 'k')
			switch (array[index + 1]) {
				case 'h':
					result.push([Token.KeepHigh, undefined]);
					return;
				case 'l':
					result.push([Token.KeepLow, undefined]);
					return;
			};

		const token = tokenStrings.get(char);
		if (token) {
			result.push([token, undefined]);
			return;
		};

		throw `${char} is not a valid token`
	});
	
	return result.filter((e) => e[0] != Token.Blank);
};

export { tokenise };
