export interface Note {
	name: string
	content: Promise<string>
}

type PendingToCreateNote = string

export class Notes {
	static async getPendingToCreate(notes: Note[]): Promise<PendingToCreateNote[]> {
		const links = await Notes.getOutlinks(notes);
		const allNotes = new Set(notes.map(n => n.name))
		const missingNotes = new Set<string>()
		for (const link of links) {
			if (!allNotes.has(link)) {
				missingNotes.add(link)
			}
		}
		return Array.from(missingNotes)
			.filter(n => Boolean(n) && Notes.filterMarkdown(n))
			.sort(Notes.sortByTitle)
	}

	private static sortByTitle(a: string, b: string) {
		return a.toLowerCase() > b.toLowerCase()
			? 1
			: a.toLowerCase() < b.toLowerCase()
				? -1
				: 0;
	}

	private static async getOutlinks(notes: Note[]): Promise<Set<string>> {
		const links = new Set<string>()
		const wikiLinksExpression = /(?:[^!]|^)\[\[(.+?)]]/g
		const templaterExpression = /<%.*%>/
		for (const note of notes) {
			let outLinks;
			const content = await note.content
			while ((outLinks = wikiLinksExpression.exec(content)) !== null) {
				const title = outLinks.filter(Boolean)[1].split(/[#|]/g)[0]?.trim()
				if (templaterExpression.test(title)) {
					continue
				}
				links.add(title)
			}
		}
		return links;
	}

	private static filterMarkdown(n: string) {
		// Test if ends with an extension from 1 to 5 characters long
		return !/.+\.\w{1,5}/g.test(n);
	}
}
