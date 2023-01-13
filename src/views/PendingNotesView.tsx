import * as React from "react";
import {FC, MouseEventHandler, useState} from "react";

interface Props {
	notes: string[]
	onCreateNote: (note: string, event: MouseEvent) => Promise<string[]>
}

export const PendingNotesView: FC<Props> = ({notes, onCreateNote}) => {
	const [items, setItems] = useState(notes)
	const generateOnClick: (n: string) => MouseEventHandler<HTMLAnchorElement> = (note: string) => (event) => {
		onCreateNote(note, event.nativeEvent).then(setItems)
	}
	return (
		<div className="pending-notes-view-container">
			<h1>Pending notes</h1>
			<span><strong>{items.length}</strong> notes linked, but not created yet.</span>
			<ul>
				{items.map(n => (
					<li key={n}>
						<a
							data-href={n}
							href={n}
							onClick={generateOnClick(n)}
							className="internal-link is-unresolved"
							target="_blank"
						>
							{n}
						</a>
					</li>
				))}
			</ul>
		</div>
	)
};
