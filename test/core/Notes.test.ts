import {Notes} from "../../src/core/Notes";
import * as notes from '../fixtures/notes.json'

describe('Notes should', () => {
	describe('extract notes pending to be created', () => {
	it('successfully', () => {
		const pending = Notes.getPendingToCreate(notes)
		expect(pending).toEqual([
			'Charles Bukowski',
			'Pensar',
			'Tiempo'
		])
	});
	it('removing anchors from title', () => {
		const pending = Notes.getPendingToCreate([
			{
				"name": "Test",
				"content": "The [[Ideaverse#Definition]] is a very good [[Concept|concept]] \n\n![[E30BB200-93F5-486D-B293-244788D253DC.mp3]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpeg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.png]]\n![[E30BB200-93F5-486D-B293-244788D253DC.mp4]]\n![[E30BB200-93F5-486D-B293-244788D253DC.ogg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.m4a]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]"
			},
		])
		expect(pending).toEqual([
			'Concept',
			'Ideaverse'
		])
	});

	it('skipping attachments', () => {
		const pending = Notes.getPendingToCreate([
			{
				"name": "Test",
				"content": "The [[Light and Space.pdf|poem]] from [[Charles Bukowski]] \n\n![[E30BB200-93F5-486D-B293-244788D253DC.mp3]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpeg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.png]]\n![[E30BB200-93F5-486D-B293-244788D253DC.mp4]]\n![[E30BB200-93F5-486D-B293-244788D253DC.ogg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.m4a]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]"
			},
		])
		expect(pending).toEqual([
			'Charles Bukowski',
		])
	});

	it('skipping links with templater characters', () => {
		const pending = Notes.getPendingToCreate([
			{
				"name": "Test",
				"content": "[[Chocolate]] for my [[<%* tR += ${friend} %>]] and [[My <% ${emotion} %> family]]."
			},
		])
		expect(pending).toEqual([
			'Chocolate',
		])
	});
	});
});
