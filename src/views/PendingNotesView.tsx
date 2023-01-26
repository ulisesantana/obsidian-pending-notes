import * as React from "react";
import {FC, MouseEventHandler, useState} from "react";
import {NotePendingToBeCreated} from "../core/Notes";

interface Props {
	notes: NotePendingToBeCreated[]
	onCreateNote: (note: string, event: MouseEvent) => Promise<NotePendingToBeCreated[]>
}

export const PendingNotesView: FC<Props> = ({notes, onCreateNote}) => {
	const [items, setItems] = useState(notes)
	const generateOnClick: (n: string) => MouseEventHandler<HTMLAnchorElement> = (note: string) => (event) => {
		onCreateNote(note, event.nativeEvent).then(setItems)
	}
	return (
		<div className="pending-notes-view-container">
			<h1>Pending notes</h1>
			<span><strong>{items.length}</strong> notes linked, but not created yet. Times the note is linked is shown in parentheses.</span>
			<ul>
				{items.map(({title, timesLinked}) => (
					<li key={title}>
						<a
							data-href={title}
							href={title}
							onClick={generateOnClick(title)}
							className="internal-link is-unresolved"
							target="_blank"
						>
							({timesLinked}) {title}
						</a>
					</li>
				))}
			</ul>
		</div>
	)
};
