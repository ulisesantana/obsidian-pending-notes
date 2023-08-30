import * as React from "react";
import {FC, MouseEventHandler, useState} from "react";
import {NotePendingToBeCreated} from "../core/Notes";

interface Props {
	notes: NotePendingToBeCreated[]
	onCreateNote: (note: string, event: MouseEvent) => Promise<NotePendingToBeCreated[]>
	onSearchNote: (title: string) => Promise<void>
}

export const PendingNotesView: FC<Props> = ({notes, onCreateNote, onSearchNote}) => {
	const [items, setItems] = useState(notes)
	const generateOnClick: (n: string) => MouseEventHandler<HTMLAnchorElement> = (note: string) => (event) => {
		onCreateNote(note, event.nativeEvent).then(setItems)
	}
	const generateOnSearch: (t: string) => MouseEventHandler<HTMLButtonElement> = (title: string) => (event) => {
		onSearchNote(title).then()
	}
	return (
		<div className="pending-notes-view-container">
			<h1>Pending notes</h1>
			<span><strong>{items.length}</strong> notes linked, but not created yet. Times the note is linked is shown in parentheses.</span>
			<ul>
				{items.map(({title, timesLinked}) => (
					<li key={title}>
						<button onClick={generateOnSearch(title)}>🔍</button>
						<a
							data-href={title}
							href={title}
							onClick={generateOnClick(title)}
							className="internal-link is-unresolved"
							target="_blank"
						>
							<button>
								➕
							</button>
						</a>
						<strong><em>({timesLinked})</em> {title}</strong>
					</li>
				))}
			</ul>
		</div>
	)
};
