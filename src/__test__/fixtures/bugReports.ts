type BugReport = {
	date: string
	cases: {
		source: string[]
		__original: string[]
		expected: string[]
	}[]
}

export const bugReports: BugReport[] = [
	{
		date: '2021-07-18 15:35:00',
		cases: [
			{
				source: `A BATTERY THAT IS NOT IN USE WILL GRADUALLY DETERIORATE
DUE TO SLOW, INTERNAL CHEMICAL REACTION
AND CHANGES IN MOISTURE CONTENT. THIS PROCESS IS CALLED LOCAL ACTION.`.split(
					'\n',
				),
				__original: [
					'A battery that is not in use will gradually deteriorate due to slow, internal chemical reaction and changes in moisture content. this process is called local action.',
				],
				expected: [
					'A battery that is not in use will gradually deteriorate due to slow, internal chemical reaction and changes in moisture content. This process is called local action.',
				],
			},
			{
				source: `TAKE A MOMENT BEFORE BEGINNING ANY TASK AND ASK YOURSELF -
<i>AM I PROPERLY EQUIPPED FOR THE JOB I AM ABOUT TO PERFORM?</i>
WEAR APPROVED EYE PROTECTION FOR THE TYPE OF WORK YOU ARE DOING.`.split('\n'),
				__original: [
					'TAKE A MOMENT BEFORE BEGINNING ANY TASK AND ASK YOURSELF - <i>AM I PROPERLY EQUIPPED FOR THE JOB I AM ABOUT TO PERFORM?</i> WEAR APPROVED EYE PROTECTION FOR THE TYPE OF WORK YOU ARE DOING.',
				],
				expected: [
					'Take a moment before beginning any task and ask yourself - <i>am I properly equipped for the job I am about to perform?</i>',
					'Wear approved eye protection for the type of work you are doing.',
				],
			},
			{
				source: `Note that as the UNKNOWN_ACRONYM number increases,
the gear teeth decrease in size
for a given pitch diameter.`.split('\n'),
				__original: [
					'Note that as the UNKNOWN_ACRONYM number increases, the gear teeth decrease in size for a given pitch diameter.',
				],
				expected: [
					'Note that as the UNKNOWN_ACRONYM number increases, the gear teeth decrease in size for a given pitch diameter.',
				],
			},
		],
	},
]

//
