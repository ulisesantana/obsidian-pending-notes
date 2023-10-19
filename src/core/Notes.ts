export interface Note {
	content: Promise<string>
	extension: string
	name: string
	path: string
}

type ProcessedNote = Omit<Note, 'content'> & {
	content: string
}

export interface NotePendingToBeCreated {
	title: string,
	timesLinked: number
}

export class Notes {
	private static filePathExpression = /^[\p{L}\p{N}_\p{Pd}\p{Emoji}\p{P} ]+(\/[\p{L}\p{N}_\p{Pd}\p{Emoji}\p{P} ]+)*(\.[\p{L}\p{N}_\p{Pd}\p{Emoji}\p{P}]+)?$/u;
	private static templaterExpression = /<%.*%>/
	private static wikiLinksExpression = /(?:[^!]|^)\[\[(.+?)]]/g

	static async getPendingToCreate(notes: Note[]): Promise<NotePendingToBeCreated[]> {
		const links = await Notes.getOutlinks(notes);
		const [allNotes, allPaths, allExtensions] = Notes.getUniqueData(notes)
		const missingNotes = {} as Record<string, number>
		for (const link of links) {
			const isMissingNote = Notes.isFilePathLike(link)
				? !Notes.filePathExists(allPaths, allExtensions, link)
				: !allNotes.has(link.toLowerCase())
			if (isMissingNote) {
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

	private static getUniqueData(notes: Note[]): [Set<Note['name']>, Set<Note['path']>, Set<Note['extension']>] {
		const allNotes = new Set<Note['name']>();
		const allPaths = new Set<Note['path']>();
		const allExtensions = new Set<Note['extension']>();

		for (const note of notes) {
			allNotes.add(note.name.toLowerCase());
			allPaths.add(note.path.toLowerCase());
			allExtensions.add(note.extension);
		}

		return [
			allNotes,
			allPaths,
			allExtensions
		]
	}

	private static filePathExists(allPaths: Set<string>, allExtensions: Set<string>, link: string) {
		return allPaths.has(link) || Array.from(allExtensions).some(extension => {
			const path = `${link}.${extension}`.toLowerCase();
			return allPaths.has(path)
		});
	}

	private static isFilePathLike(title: string) {
		return title.includes('/') && Notes.filePathExpression.test(title)
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

	private static extractNoteOutlinks(note: ProcessedNote): string[] {
		return Array.from(note.content.matchAll(Notes.wikiLinksExpression))
			.flatMap(([_, x]) => x)
			.reduce<string[]>(function reduceNoteTitles(outlinks, outlink) {
				const title = outlink.split(/[#|]/g)[0]?.trim()
				if (Notes.templaterExpression.test(title)) {
					return outlinks
				}
				return outlinks.concat(title)
			}, [])
	}

	private static async* cleanNotes(notes: Note[]): AsyncGenerator<ProcessedNote> {
		for (const note of notes) {
			const content = await note.content
			yield ({
				...note,
				content: Notes.removeCodeBlocks(content)
			})
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
