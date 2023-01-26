import {ItemView, Keymap, TFile, UserEvent, WorkspaceLeaf} from "obsidian";
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

	private createNote(note: string, event: UserEvent): Promise<string[]> {
		const noteFile = note + '.md'
		const defaultFolder = this.app.fileManager.getNewFileParent("")
		const pathDivider = defaultFolder.path.includes('\\')? '\\' : '/'
		return this.app.vault.create(defaultFolder.path + pathDivider + noteFile,'')
			.then(() => {
				const mod = Keymap.isModEvent(event);
				this.app.workspace.openLinkText(noteFile, defaultFolder.path, mod)
			})
			.then(() => this.getPendingNotes())
	}

	private async getPendingNotes(): Promise<string[]> {
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
