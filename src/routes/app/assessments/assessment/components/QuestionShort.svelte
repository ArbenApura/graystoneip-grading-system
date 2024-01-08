<script lang="ts">
	// IMPORTED TYPES
	import type { AssessmentQuestion } from '$types';
	// IMPORTED LIB-COMPONENTS
	import { Badge, Input, Textarea } from 'flowbite-svelte';

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
	<Input placeholder="Answer..." color={!answer ? 'red' : 'base'} bind:value={answer} />
	{#if !answer}
		<small class="text-red-600">Answer is required!</small>
	{/if}
</div>
