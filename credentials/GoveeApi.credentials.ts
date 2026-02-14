import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
	Icon,
} from 'n8n-workflow';

export class GoveeApi implements ICredentialType {
	name = 'goveeApi';
	displayName = 'Govee API';
	documentationUrl = 'https://govee-public.s3.amazonaws.com/developer-docs/GoveeDeveloperAPIReference.pdf';
	icon: Icon = 'file:govee.svg';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'The Govee Developer API Key obtained from the Govee Home App',
		},
	];
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Govee-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://developer-api.govee.com',
			url: '/v1/devices',
		},
	};
}
