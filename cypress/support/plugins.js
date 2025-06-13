export default async function plugins(on, config) {
	const cypressSplit = await import('cypress-split')
	return {
		...cypressSplit.default(on, config),
	}
}
