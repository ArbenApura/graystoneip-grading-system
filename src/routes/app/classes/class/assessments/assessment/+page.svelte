<script lang="ts">
	// IMPORTED LIB-TYPES
	import type { Action } from 'svelte/action';
	// IMPORTED TYPES
	import type { AssessmentQuestion } from '$types';
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	import _ from 'lodash';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createErrorModal,
		createSuccessModal,
	} from '$stores/modalStates';
	import { generateId, selectAssessment, updateAssessment } from '$utils';
	// IMPORTED LIB-COMPONENTS
	import { Button, Tooltip } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import FormHeader from './components/FormHeader.svelte';
	import Question from './components/Question.svelte';

	// PROPS
	export let data;

	// STATES
	let assessment = data.assessment;
	let title = assessment.title;
	let description = assessment.description || '';
	let status = assessment.is_open ? 'open' : 'closed';
	let questions: AssessmentQuestion[] = _.orderBy(data.assessment.questions || [], ['order']);
	let isLoading = false;

	// REACTIVE STATES
	$: isOpen = status === 'open' ? true : false;

	// UTILS
	const handleReset = () => {
		title = assessment.title;
		description = assessment.description || '';
		status = assessment.is_open ? 'open' : 'closed';
		questions = assessment.questions;
	};
	const handleRefresh = async () => {
		assessment = await selectAssessment(assessment.id);
	};
	const handleSave = async () => {
		isLoading = true;
		try {
			if (
				[
					!title,
					questions.some((question) => !question.question),
					questions.some((question) => question.points < 1),
					questions.some(
						(question) =>
							question.type === 'multiple-choice' &&
							question.choices.some((choice) => !choice.label),
					),
					questions.some((question) => !question.answers.length),
				].some((v) => v)
			)
				throw new Error('Please complete the form!');
			await updateAssessment(assessment.id, {
				total: questions.reduce((sum, { points }) => sum + points, 0),
				title,
				description,
				is_open: isOpen,
				questions,
			});
			await handleRefresh();
			createSuccessModal({ message: 'Changes saved successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleAdd = async () => {
		const question: AssessmentQuestion = {
			id: generateId(),
			question: '',
			type: 'multiple-choice',
			order: questions.length + 1,
			choices: [],
			answers: [],
			points: 0,
		};
		questions = [...questions, question];
	};
	const handleDelete = (id: string) =>
		(questions = questions.filter((question) => question.id !== id));

	// ACTIONS
	const portal: Action = (node) => {
		document.body.appendChild(node);
	};
</script>

<Header
	breadcrumbItems={[
		{
			icon: 'ph-bold ph-chalkboard',
			label: 'Classes',
			href: '/app/classes?instructor_id=' + data.instructor.id,
		},
		{
			label: data.instructor.full_name,
			href: '/app/classes?instructor_id=' + data.instructor.id,
		},
		{
			label: data.courseClass.name,
			href:
				'/app/classes/class?instructor_id=' +
				data.instructor.id +
				'&course_class_id=' +
				data.courseClass.id,
		},
		{
			label: 'Assessments',
			href:
				'/app/classes/class/assessments?instructor_id=' +
				data.instructor.id +
				'&course_class_id=' +
				data.courseClass.id,
		},
		{
			label: data.assessment.name,
			href: $page.url.pathname + $page.url.search,
		},
	]}
/>

<div use:portal>
	<Button
		class={`w-[48px] h-[48px] shadow-md fixed bottom-[16px] right-[16px] z-20}`}
		pill={true}
		disabled={isLoading}
		on:click={handleAdd}
	>
		<i class="ph-bold ph-plus text-xl" />
	</Button>
	<Tooltip class="text-xs whitespace-nowrap z-[100]" color="light" placement="top">
		Add Question
	</Tooltip>

	<Button
		class={`w-[48px] h-[48px] shadow-md fixed bottom-[16px] right-[82px] z-20}`}
		pill={true}
		disabled={isLoading}
		on:click={() =>
			createConfirmationModal({
				message: 'Are you sure you want to save the changes?',
				handleProceed: handleSave,
			})}
	>
		<i class="ph-bold ph-download-simple text-xl" />
	</Button>
	<Tooltip class="text-xs whitespace-nowrap z-[100]" color="light" placement="top">Save</Tooltip>

	<Button
		class={`w-[48px] h-[48px] shadow-md fixed bottom-[16px] right-[148px] z-20}`}
		pill={true}
		disabled={isLoading}
		on:click={() =>
			createConfirmationModal({
				message: 'Are you sure you want to reset the changes?',
				handleProceed: handleReset,
			})}
	>
		<i class="ph-bold ph-arrow-counter-clockwise text-xl" />
	</Button>
	<Tooltip class="text-xs whitespace-nowrap z-[100]" color="light" placement="top">Reset</Tooltip>
</div>

<div class="flex flex-col gap-4 p-4 pt-0">
	<FormHeader bind:title bind:description bind:status />
	{#if questions.length}
		<hr class="mt-2 border-gray-300" />
		<h4>Questions <small>({questions.length})</small></h4>
		{#each questions as question, index (question.id)}
			<Question bind:questions bind:question {...{ index, handleDelete }} />
		{/each}
	{/if}
</div>
