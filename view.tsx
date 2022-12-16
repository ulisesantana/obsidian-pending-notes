import {ItemView, TFile, WorkspaceLeaf} from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {createRoot} from "react-dom/client";
import {PendingNotesView} from "./PendingNotesView";

interface Note {
	name: string
	content: string
}

export const VIEW_TYPE_MAIN = "pending-notes:main";

export class MainView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return VIEW_TYPE_MAIN;
	}

	getDisplayText() {
		return "Pending notes";
	}

	async onOpen() {
		const root = createRoot(this.containerEl.children[1]);
		const notes = await this.getPendingNotes()
		const onCreateNote = this.createNote.bind(this)
		root.render(
			<React.StrictMode>
				<PendingNotesView notes={notes} onCreateNote={onCreateNote} />,
			</React.StrictMode>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}

	private createNote(note: string): Promise<string[]> {
		const noteFile = note + '.md'
		const defaultFolder = this.app.fileManager.getNewFileParent("")
		const pathDivider = defaultFolder.parent.path.includes('\\')? '\\' : '/'
		return this.app.vault.create(defaultFolder.path + pathDivider + noteFile,'')
			.then(() => this.app.workspace.openLinkText(noteFile, defaultFolder.path))
			.then(() => this.getPendingNotes())
	}

	private async getPendingNotes(): Promise<string[]> {
		const notes = await Promise.all(this.app.vault.getMarkdownFiles().map(f => this.readNote(f)))
		const links = new Set<string>()
		const vaultNotes = new Set(notes.map(n => n.name))
		const missingNotes = new Set<string>()
		const wikiLinksExpression = /\[\[([^\|\]]+\|)?([^\]]+)\]\]/g
		const mediaExt = ['mp3', 'jpg', 'jpeg', 'png', 'mp4', 'ogg', 'm4a', 'pdf', '#']
		for (const note of notes) {
			let outLinks;
			while ((outLinks = wikiLinksExpression.exec(note.content)) !== null) {
				const [_, note] = outLinks.filter(Boolean)
				if (!mediaExt.some(ext => note.includes(ext))) {
					links.add(note.replace('|', '').trim())
				}
			}
		}
		for (const link of links) {
			if (!vaultNotes.has(link)) {
				missingNotes.add(link)
			}
		}
		return Array.from(missingNotes)
			.filter(Boolean)
			.sort((a,b) => a.toLowerCase() > b.toLowerCase()
				? 1
				: a.toLowerCase() < b.toLowerCase()
					? -1
					: 0
			)
	}

	private async readNote(file: TFile): Promise<Note> {
		return {
			name: file.basename,
			content: await this.app.vault.cachedRead(file)
		}
	}
}
