import {Plugin} from 'obsidian';
import {MainView, VIEW_TYPE_MAIN} from 'view';

export default class PendingNotesPlugin extends Plugin {

	async onload() {
		this.registerView(
			VIEW_TYPE_MAIN,
			(leaf) => new MainView(leaf)
		);

		// This creates an icon in the left ribbon.
		this.addRibbonIcon('file-clock', 'Pending Notes', () => {
			this.activateView()
		});

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'pending-notes-show-view',
			name: 'Open pending notes list',
			callback: () => {
				this.activateView()
			}
		});
	}

	async onunload() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_MAIN);
	}

	async activateView() {
		this.app.workspace.detachLeavesOfType(VIEW_TYPE_MAIN);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: VIEW_TYPE_MAIN,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(VIEW_TYPE_MAIN)[0]
		);
	}
}
