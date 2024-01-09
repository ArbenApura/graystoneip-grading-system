<script lang="ts">
	// IMPORTED TYPES
	import type { AssessmentQuestion, AssessmentQuestionChoice } from '$types';
	import { generateId, numberToLetter } from '$utils';
	// IMPORTED LIB-UTILS
	import _ from 'lodash';
	// IMPORTED LIB-COMPONENTS
	import { Input, Select, Label, Button, Tooltip } from 'flowbite-svelte';

	// PROPS
	export let questions: AssessmentQuestion[],
		question: AssessmentQuestion,
		index: number,
		handleDelete: (id: string) => void;

	// CONSTANTS
	const TYPE_OPTIONS = [
		{ value: 'multiple-choice', name: 'Multiple Choice' },
		{ value: 'short-answer', name: 'Short Answer' },
	];

	// STATES
	let selected: AssessmentQuestionChoice[] = [];
	let answers = question.answers.join('|'),
		points = question.points.toString();

	if (question.answers) {
		question.answers.forEach((answer) =>
			question.choices.forEach((choice) => {
				if (choice.letter === answer)
					selected = [...selected, choice as AssessmentQuestionChoice];
			}),
		);
	}

	// REACTIVE STATEMENTS
	$: if (question.type === 'multiple-choice' && !question.choices.length) {
		question.choices = [
			{
				id: generateId(),
				letter: 'A',
				label: '',
			},
		];
	}
	$: if (question.type === 'multiple-choice') {
		question.answers = selected.map(({ letter }) => letter);
	} else if (question.type === 'short-answer') {
		question.answers = answers.split('|');
	}
	$: (() => {
		question.choices = question.choices.map((choice, i) => {
			choice.letter = numberToLetter(i);
			return choice;
		});
	})();
	$: (() => (question.points = parseInt(points || '0')))();

	// UTILS
	const sortQuestions = () => {
		questions = _.orderBy(questions, ['order']);
	};
	const handleAdd = () => {
		question.choices = [
			...question.choices,
			{
				id: generateId(),
				letter: numberToLetter(question.choices.length),
				label: '',
			},
		];
	};
	const handleUp = () => {
		question.order--;
		questions[index - 1].order++;
		sortQuestions();
	};
	const handleDown = () => {
		question.order++;
		questions[index + 1].order--;
		sortQuestions();
	};
</script>

<div class="bg-white rounded-md shadow-md p-6 flex flex-col gap-4">
	<h5>Question {index + 1}</h5>
	<hr />
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
		<div class="flex flex-col gap-2">
			<Label for="question">Question</Label>
			<Input
				id="question"
				placeholder="Question..."
				color={!question.question ? 'red' : 'base'}
				bind:value={question.question}
			/>
			{#if !question.question}
				<small class="text-red-600">Question is required!</small>
			{/if}
		</div>
		<div class="flex flex-col gap-2">
			<Label for="type">Type</Label>
			<Select class="z-0" id="type" items={TYPE_OPTIONS} bind:value={question.type} />
		</div>
	</div>
	{#if question.type === 'multiple-choice'}
		<Label>Choices</Label>
		{#each question.choices as choice, i}
			{@const correct = selected.some(({ id }) => id === choice.id)}
			<div class="relative flex gap-4">
				<div class="flex-center absolute h-[42px] w-10">
					<small class="bg-blue-600 rounded-md text-white px-2 py-1">
						{choice.letter}
					</small>
				</div>
				<Input class="pl-10" placeholder="Choice..." bind:value={choice.label} />
				<Button
					class="w-[42px] h-[42px]"
					color={correct ? 'green' : 'light'}
					on:click={() => {
						if (correct) {
							selected = selected.filter(({ id }) => id !== choice.id);
						} else {
							selected = [...selected, choice];
						}
					}}
				>
					<i class="ph-bold ph-check text-lg" />
				</Button>
				{#if !(i === 0 && question.choices.length === 1)}
					<Button
						class="w-[42px] h-[42px]"
						color="light"
						on:click={() => {
							selected = selected.filter(({ id }) => id !== choice.id);
							question.choices = question.choices.filter(
								({ letter }) => letter !== choice.letter,
							);
						}}
					>
						<i class="ph-bold ph-x text-lg" />
					</Button>
				{/if}
			</div>
		{/each}
		{#if !selected.length}
			<small class="text-red-600">There should be one or more answers!</small>
		{/if}
		{#if question.choices.length !== 26}
			<Button class="sm:w-fit ml-auto" on:click={handleAdd}>Add Choice</Button>
		{/if}
	{/if}
	<div class="grid grid-cols-1 gap-4 {question.type === 'short-answer' && 'sm:grid-cols-2'}">
		{#if question.type === 'short-answer'}
			<div class="flex flex-col gap-2">
				<Label for="answers">
					Answers
					<small class="text-gray-500">(should be seperated by pipe symbol '|')</small>
				</Label>
				<Input
					id="answers"
					placeholder="Answers..."
					color={!answers ? 'red' : 'base'}
					bind:value={answers}
				/>
				{#if !answers}
					<small class="text-red-600">There should be one or more answers!</small>
				{/if}
			</div>
		{/if}
		<div class="flex flex-col gap-2">
			<Label for="points">Points</Label>
			<Input
				id="points"
				type="number"
				placeholder="Points..."
				color={parseInt(points || '0') < 1 ? 'red' : 'base'}
				bind:value={points}
			/>
			{#if parseInt(points || '0') < 1}
				<small class="text-red-600">Points should be greater than 1!</small>
			{/if}
		</div>
	</div>
	<hr />
	<div class="flex justify-end gap-4">
		<Button color="red" on:click={() => handleDelete(question.id)}>Delete</Button>
		{#if questions.length !== index + 1}
			<Button color="light" size="xs" on:click={handleDown}>
				<i class="ph-bold ph-arrow-down text-lg" />
			</Button>
			<Tooltip class="text-xs whitespace-nowrap z-[100]" color="light" placement="top">
				Move Down
			</Tooltip>
		{/if}
		{#if index !== 0}
			<Button color="light" size="xs" on:click={handleUp}>
				<i class="ph-bold ph-arrow-up text-lg" />
			</Button>
			<Tooltip class="text-xs whitespace-nowrap z-[100]" color="light" placement="top">
				Move Up
			</Tooltip>
		{/if}
	</div>
</div>
