import {Notes} from "../../src/core/Notes";
import * as notes from '../fixtures/notes.json'

describe('Notes should', () => {
	it('extract notes pending to be created', () => {
		const pending = Notes.getPendingToCreate(notes)
		expect(pending).toEqual([
			'Charles Bukowski',
			'Pensar',
			'Tiempo'
		])
	});
});
