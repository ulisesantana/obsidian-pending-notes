import {ItemView, TFile, WorkspaceLeaf} from "obsidian";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {createRoot} from "react-dom/client";
import {PendingNotesView} from "./PendingNotesView";
import {Note, Notes} from "../core/Notes";



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
				<PendingNotesView
					notes={notes}
					onCreateNote={onCreateNote}
				/>
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
		return Notes.getPendingToCreate(notes)
	}

	private async readNote(file: TFile): Promise<Note> {
		return {
			name: file.basename,
			content: await this.app.vault.cachedRead(file)
		}
	}
}