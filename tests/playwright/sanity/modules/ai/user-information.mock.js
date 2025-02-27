const getJsonMock = ( data ) => {
	return {
		success: true,
		data: {
			responses: {
				ai_get_user_information: data,
			},
		},
	};
};

export const userInformationMock = getJsonMock( {
	success: true,
	code: 200,
	data: {
		is_connected: true,
		is_get_started: '1',
		usage: {
			hasAiSubscription: false,
			usedQuota: 2,
			quota: 100,
		},
	},
} );

export const userInformationExceededQuotaMock = getJsonMock( {
	success: true,
	code: 200,
	data: {
		is_connected: true,
		is_get_started: '1',
		usage: {
			hasAiSubscription: false,
			usedQuota: 100,
			quota: 100,
		},
	},
} );

export const userInformationNoConnectedMock = getJsonMock( {
	success: true,
	code: 200,
	data: {
		is_connected: false,
		is_get_started: '',
		usage: {
			hasAiSubscription: false,
			usedQuota: 0,
			quota: 100,
		},
	},
} );

export const userInformationConnectedNoGetStartedMock = getJsonMock( {
	success: true,
	code: 200,
	data: {
		is_connected: true,
		is_get_started: '',
		usage: {
			hasAiSubscription: false,
			usedQuota: 0,
			quota: 100,
		},
	},
} );

