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
		for await (const note of Notes.cleanNotes(notes)) {
			for (const outLink of note.matchAll(wikiLinksExpression)) {
				const title = outLink.filter(Boolean)[1].split(/[#|]/g)[0]?.trim()
				if (templaterExpression.test(title)) {
					continue
				}
				links.add(title)
			}
		}
		return links;
	}

	private static async* cleanNotes(notes: Note[]): AsyncGenerator<string> {
		for (const note of notes) {
			const content = await note.content
			yield Notes.removeCodeBlocks(content)
		}
	}

	private static removeCodeBlocks(noteContent: string): string {
		const codeBlocks = [
			...Notes.getMatches(noteContent, /```.+```/gms),
			...Notes.getMatches(noteContent, /`.+`/g)
		]
		return codeBlocks.reduce((content, codeBlock) => content.replace(codeBlock, ''), noteContent)
	}

	private static getMatches(note: string, expression: RegExp) {
		return Array.from(note.matchAll(expression)).flatMap(([x]) => x);
	}

	private static filterMarkdown(n: string) {
		// Test if ends with an extension from 1 to 5 characters long
		return !/.+\.\w{1,5}/g.test(n);
	}
}
