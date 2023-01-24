export interface Note {
	name: string
	content: Promise<string>
}

type PendingToCreateNote = string

export class Notes {
	static async getPendingToCreate(notes: Note[]): Promise<PendingToCreateNote[]> {
		const links = await Notes.getOutlinks(notes);
		const allNotes = new Set(notes.map(n => n.name.toLowerCase()))
		const missingNotes = new Set<string>()
		for (const link of links) {
			if (!allNotes.has(link.toLowerCase())) {
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
		const links = []
		for await (const note of Notes.cleanNotes(notes)) {
			links.push(...Notes.extractNoteOutlinks(note))
		}
		return new Set(links);
	}

	private static extractNoteOutlinks(note: string): string[] {
		const wikiLinksExpression = /(?:[^!]|^)\[\[(.+?)]]/g
		const templaterExpression = /<%.*%>/
		return Array.from(note.matchAll(wikiLinksExpression))
			.flatMap(([_, x]) => x)
			.reduce<string[]>(function reduceNoteTitles(outlinks, outlink) {
				const title = outlink.split(/[#|]/g)[0]?.trim()
				if (templaterExpression.test(title)) {
					return outlinks
				}
				return outlinks.concat(title)
			}, [])
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

	private static getMatches(note: string, expression: RegExp): string[] {
		return Array.from(note.matchAll(expression)).flatMap(([x]) => x);
	}

	private static filterMarkdown(n: string) {
		// Test if ends with an extension from 1 to 5 characters long
		return !/.+\.\w{1,5}/g.test(n);
	}
}
