import {ItemView, Keymap, TFile, UserEvent, WorkspaceLeaf} from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {createRoot} from "react-dom/client";
import {PendingNotesView} from "./PendingNotesView";
import {Note, NotePendingToBeCreated, Notes} from "../core/Notes";

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
		const onSearchNote = this.searchNotes.bind(this)
		const onRefreshNotes = this.getPendingNotes.bind(this)
		
		root.render(
			<React.StrictMode>
				<PendingNotesView
					notes={notes}
					onCreateNote={onCreateNote}
					onSearchNote={onSearchNote}
					onRefreshNotes={onRefreshNotes}
				/>
			</React.StrictMode>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}

	private async searchNotes(title: string) {
		// https://forum.obsidian.md/t/api-endpoint-for-searching-file-content/11482/6

		// Perform the search
		// @ts-ignore
		app.internalPlugins.plugins['global-search'].instance.openGlobalSearch(`"${title}"`)
		const searchLeaf = app.workspace.getLeavesOfType('search')[0]
		const search = await searchLeaf.open(searchLeaf.view)
		await new Promise(resolve => setTimeout(() => {
			// @ts-ignore
			resolve(search.dom.resultDomLookup)
		}, 300)) // the delay here was specified in 'obsidian-text-expand' plugin; I assume they had a reason
	} 

	private createNote(note: string, event: UserEvent): Promise<NotePendingToBeCreated[]> {
		const noteFile = note + '.md'
		const defaultFolder = this.app.fileManager.getNewFileParent("")
		const pathDivider = defaultFolder.path.includes('\\') ? '\\' : '/'
		return this.app.vault.create(defaultFolder.path + pathDivider + noteFile,'')
			.then(() => {
				const mod = Keymap.isModEvent(event);
				this.app.workspace.openLinkText(noteFile, defaultFolder.path, mod)
			})
			.then(() => this.getPendingNotes())
	}

	private async getPendingNotes(): Promise<NotePendingToBeCreated[]> {
		const notes = this.app.vault.getMarkdownFiles().map(f => this.readNote(f))
		return Notes.getPendingToCreate(notes)
	}

	private readNote(file: TFile): Note {
		return {
			name: file.basename,
			content: this.app.vault.cachedRead(file)
		}
	}
}
