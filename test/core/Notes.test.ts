import {Notes} from "../../src/core/Notes";
import * as fs from "fs/promises";

describe('Notes should', () => {
	describe('extract notes pending to be created', () => {
		it('successfully', async () => {
			const pending = await Notes.getPendingToCreate([
				{
					"name": "Tiempo y Espacio",
					"content": Promise.resolve("[[Tiempo|El tiempo]] y espacio que me ha dado la excedencia me ha venido increíblemente bien. Sin embargo, recuerdo el [[Light and Space.pdf|poema]] de [[Charles Bukowski]] y me encuentro un poco en el medio.\n\nTambién es cierto que Bukowski lo critica desde el punto de vista de *crear*. En ese aspecto estoy de acuerdo con él. La creatividad no tiene nada que ver con el equipo que tengas, sino contigo mismo. Tu pasión y tu [[Actitud|actitud]] serán las que marquen la diferencia a la hora de crear.\n\nYo hablo del tiempo y en espacio para [[Pensar#Reflexionar|reflexionar]], pensar, conocerse a sí mismo. Eso sí que creo que lo es posible en medio de una tormenta.\n\n![[E30BB200-93F5-486D-B293-244788D253DC.mp3]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpeg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.png]]\n![[E30BB200-93F5-486D-B293-244788D253DC.mp4]]\n![[E30BB200-93F5-486D-B293-244788D253DC.ogg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.m4a]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]")
				},
				{
					"name": "Actitud",
					"content": Promise.resolve("Esta nota está creada, pero pendiente de ser rellenada.")
				}
			])
			expect(pending).toEqual([
				'Charles Bukowski',
				'Pensar',
				'Tiempo'
			])
		});

		it('removing anchors from title', async () => {
			const pending = await Notes.getPendingToCreate([
				{
					"name": "Test",
					"content": Promise.resolve("The [[Ideaverse#Definition]] is a very good [[Concept|concept]] \n\n![[E30BB200-93F5-486D-B293-244788D253DC.mp3]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpeg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.png]]\n![[E30BB200-93F5-486D-B293-244788D253DC.mp4]]\n![[E30BB200-93F5-486D-B293-244788D253DC.ogg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.m4a]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]")
				},
			])
			expect(pending).toEqual([
				'Concept',
				'Ideaverse'
			])
		});

		it('skipping attachments', async () => {
			const pending = await Notes.getPendingToCreate([
				{
					"name": "Test",
					"content": Promise.resolve("The [[Light and Space.pdf|poem]] from [[Charles Bukowski]] \n\n![[E30BB200-93F5-486D-B293-244788D253DC.mp3]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.jpeg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.png]]\n![[E30BB200-93F5-486D-B293-244788D253DC.mp4]]\n![[E30BB200-93F5-486D-B293-244788D253DC.ogg]]\n![[E30BB200-93F5-486D-B293-244788D253DC.m4a]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]\n![[E30BB200-93F5-486D-B293-244788D253DC.pdf]]")
				},
			])
			expect(pending).toEqual([
				'Charles Bukowski',
			])
		});

		it('skipping links with templater characters', async () => {
			const pending = await Notes.getPendingToCreate([
				{
					"name": "Test",
					"content": Promise.resolve("[[Chocolate]] for my [[<%* tR += ${friend} %>]] and [[My <% ${emotion} %> family]].")
				},
			])
			expect(pending).toEqual([
				'Chocolate',
			])
		});

		it('skipping code blocks', async () => {
			const pending = await Notes.getPendingToCreate([
				{
					"name": "Test",
					"content": (async () => (await fs.readFile('test/fixtures/code-blocks.md')).toString())()
				},
			])
			expect(pending).toEqual([
				'code blocks',
			])
		});
	});
});
