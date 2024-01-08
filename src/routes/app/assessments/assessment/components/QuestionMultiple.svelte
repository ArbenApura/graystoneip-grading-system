<script lang="ts">
	// IMPORTED TYPES
	import type { AssessmentQuestion } from '$types';
	// IMPORTED LIB-COMPONENTS
	import { Badge } from 'flowbite-svelte';

	// PROPS
	export let question: AssessmentQuestion,
		index: number,
		answers: { id: string; answer: string }[];

	// STATES
	let answer = '';

	// REACTIVE STATESMENTS
	$: (() => {
		if (answers.some((answer) => answer.id === question.id)) {
			answers = answers.map((_answer) => {
				if (_answer.id === question.id) {
					_answer.answer = answer;
				}
				return _answer;
			});
		} else {
			answers = [...answers, { id: question.id, answer }];
		}
	})();
</script>

<div class="bg-white rounded-md shadow-md p-6 flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<h5>Question {index + 1}</h5>
		<Badge>{question.points} Point{question.points !== 1 && 's'}</Badge>
	</div>
	<hr />
	<p>{question.question}</p>
	<div class="flex flex-col border">
		{#each question.choices as choice}
			{@const selected = answer === choice.letter}
			<button
				class="flex items-start gap-3 p-4 border-b last-of-type:border-b-0 {selected
					? 'bg-blue-600'
					: 'hover:bg-gray-100'}"
				on:click={() => (answer = choice.letter)}
			>
				<div class="flex-center">
					<small
						class="rounded-md px-2 py-1 {selected
							? 'bg-white'
							: 'bg-blue-600 text-white'}"
					>
						{choice.letter}
					</small>
				</div>
				<p class={selected ? 'text-white' : ''}>
					{choice.label}
				</p>
			</button>
		{/each}
	</div>
	{#if !answer}
		<small class="text-red-600">Answer is required!</small>
	{/if}
</div>
