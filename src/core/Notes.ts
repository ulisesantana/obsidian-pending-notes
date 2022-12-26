export interface Note {
	name: string
	content: string
}

type PendingToCreateNote = string

export class Notes {
	static getPendingToCreate(notes: Note[]): PendingToCreateNote[] {
		const links = Notes.getOutlinks(notes);
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

	private static getOutlinks(notes: Note[]): Set<string> {
		const links = new Set<string>()
		const wikiLinksExpression = /(?:[^!]|^)\[\[(.+?)]]/g
		for (const note of notes) {
			let outLinks;
			while ((outLinks = wikiLinksExpression.exec(note.content)) !== null) {
				const note = outLinks.filter(Boolean)[1].split(/[#|]/g)[0]!.trim()
				links.add(note)
			}
		}
		return links;
	}

	private static filterMarkdown(n: string) {
		// Test if ends with an extension from 1 to 5 characters long
		return !/.+\.\w{1,5}/g.test(n);
	}
}
