<script lang="ts">
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createErrorModal,
		createSuccessModal,
	} from '$stores/modalStates';
	import { generateId, supabase } from '$utils';
	// IMPORTED LIB-COMPONENTS
	import { Badge, Button } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import QuestionMultiple from './components/QuestionMultiple.svelte';
	import QuestionShort from './components/QuestionShort.svelte';

	// PROPS
	export let data;

	// STATES
	let assessment = data.assessment;
	let course_student = data.course_student;
	let answers: { id: string; answer: string }[] = [];
	let isLoading = false;

	// REACTIVE STATES
	$: isCompleted = answers.every(({ answer }) => answer);

	// UTILS
	const calculateScore = () => {
		let score = 0;
		answers.forEach((answer) =>
			assessment.questions.forEach((question) => {
				if (answer.id !== question.id) return;
				if (question.answers.includes(answer.answer)) {
					score += question.points;
				}
			}),
		);
		return score;
	};
	const isCriteriaGradeExists = async () => {
		const { data, error } = await supabase.from('criteria_grades').select().match({
			criteria_item_id: assessment.id,
			course_student_id: course_student.id,
		});
		if (error) throw error;
		return data.length ? true : false;
	};
	const handleSubmit = async () => {
		isLoading = true;
		try {
			if (!isCompleted) throw new Error('Please complete the form!');
			const score = calculateScore();
			if (await isCriteriaGradeExists()) {
				const { error } = await supabase.from('criteria_grades').update({ score }).match({
					criteria_item_id: assessment.id,
					course_student_id: course_student.id,
				});
				if (error) throw error;
			} else {
				const { error } = await supabase.from('criteria_grades').insert({
					id: generateId(),
					criteria_item_id: assessment.id,
					course_class_id: assessment.criteria.course_class.id,
					course_student_id: course_student.id,
					score,
					created_at: Date.now(),
				});
				if (error) throw error;
			}
			goto('/app/assessments?student_id=' + data.student.id);
			createSuccessModal({
				message: 'Hooray! Your assessment has been submitted successfully!',
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
</script>

<Header
	breadcrumbItems={[
		{
			icon: 'ph-bold ph-list-checks',
			label: 'Assessments',
			href: '/app/assessments?student_id=' + data.student.id,
		},
		{
			label: assessment.title,
			href: $page.url.pathname + $page.url.search,
		},
	]}
/>

<div class="flex flex-col gap-4 p-4 pt-0">
	<div class="bg-white rounded-md shadow-md p-6 flex flex-col gap-4">
		<div class="flex flex-col md:flex-row justify-between items-start gap-4">
			<h3 class="order-2 md:order-1">{assessment.title}</h3>
			<div class="order-1 md:order-2 flex justify-end w-full md:w-fit gap-2">
				<Badge class="whitespace-nowrap">
					{assessment.total} Point{assessment.total !== 1 ? 's' : ''}
				</Badge>
				<Badge class="whitespace-nowrap" color="yellow">
					{assessment.questions.length} Item{assessment.questions.length !== 1 ? 's' : ''}
				</Badge>
			</div>
		</div>
		{#if assessment.description}
			<p>
				{assessment.description}
			</p>
		{/if}
		<hr />
		<div class="flex-start-center gap-4">
			<small>{assessment.criteria.course_class.name}</small>
			<small class="text-border">|</small>
			<small>Prepared by {assessment.criteria.course_class.instructor.full_name}</small>
		</div>
	</div>
	{#if assessment.questions.length}
		<hr class="mt-2 border-gray-300" />
		<h4>Questions</h4>
	{/if}
	{#if assessment.questions.length}
		{#each assessment.questions as question, index}
			{#if question.type === 'multiple-choice'}
				<QuestionMultiple bind:answers {...{ question, index }} />
			{:else if question.type === 'short-answer'}
				<QuestionShort bind:answers {...{ question, index }} />
			{/if}
		{/each}
	{:else}
		<div class="bg-white rounded-md shadow-md p-6 flex flex-col gap-4 text-center">
			<small>No Questions</small>
		</div>
	{/if}
	<Button
		class="ml-auto"
		disabled={isLoading || !isCompleted}
		on:click={() =>
			createConfirmationModal({
				message: 'Are you sure you want to submit this assessment?',
				handleProceed: handleSubmit,
			})}
	>
		Submit
	</Button>
</div>
