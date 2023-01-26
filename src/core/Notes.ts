export interface Note {
	name: string
	content: Promise<string>
}

export type NotePendingToBeCreated = {
	title: string,
	timesLinked: number
}

export class Notes {
	static async getPendingToCreate(notes: Note[]): Promise<NotePendingToBeCreated[]> {
		const links = await Notes.getOutlinks(notes);
		const allNotes = new Set(notes.map(n => n.name.toLowerCase()))
		const missingNotes = {} as Record<string, number>
		for (const link of links) {
			if (!allNotes.has(link.toLowerCase())) {
				missingNotes[link] = missingNotes[link] !== undefined
					? missingNotes[link] + 1
					: 1
			}
		}
		return Object.entries(missingNotes)
			.reduce<NotePendingToBeCreated[]>((notes, [title, timesLinked]) => {
				if (Boolean(title) && Notes.hasFileExtension(title)) {
					return notes.concat({title, timesLinked})
				}
				return notes
			}, [])
			.sort(Notes.sortByTitle)
			.sort(Notes.sortByTimesLinked)
	}

	private static sortByTimesLinked(a: NotePendingToBeCreated, b: NotePendingToBeCreated) {
		return a.timesLinked < b.timesLinked
			? 1
			: a.timesLinked > b.timesLinked
				? -1
				: 0;
	}

	private static sortByTitle(a: NotePendingToBeCreated, b: NotePendingToBeCreated) {
		return a.title.toLowerCase() > b.title.toLowerCase()
			? 1
			: a.title.toLowerCase() < b.title.toLowerCase()
				? -1
				: 0;
	}

	private static async getOutlinks(notes: Note[]): Promise<string[]> {
		const links = []
		for await (const note of Notes.cleanNotes(notes)) {
			links.push(...Notes.extractNoteOutlinks(note))
		}
		return links;
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

	private static hasFileExtension(n: string) {
		// Test if ends with an extension from 1 to 5 characters long
		return !/.+\.\w{1,5}/g.test(n);
	}
}
