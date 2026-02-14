import type { INodeProperties } from 'n8n-workflow';

export const applianceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['appliance'],
			},
		},
		options: [
			{
				name: 'Control',
				value: 'control',
				description: 'Send a command to an appliance',
				action: 'Control an appliance',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get a list of many appliances',
				action: 'Get many appliances',
			},
		],
		default: 'getAll',
	},
];

export const applianceFields: INodeProperties[] = [
	// ----------------------------------
	//         appliance: control
	// ----------------------------------
	{
		displayName: 'Device MAC Address',
		name: 'device',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
			},
		},
		description: 'The MAC address of the Govee appliance',
	},
	{
		displayName: 'Device Model',
		name: 'model',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
			},
		},
		description: 'The model number of the Govee appliance (e.g., H7121)',
	},
	{
		displayName: 'Command',
		name: 'command',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
			},
		},
		options: [
			{
				name: 'Mode',
				value: 'mode',
				description: 'Set the mode of the appliance',
			},
			{
				name: 'Turn',
				value: 'turn',
				description: 'Turn the appliance on or off',
			},
		],
		default: 'turn',
		description: 'The command to execute on the appliance',
	},

	// Turn command value
	{
		displayName: 'Turn Value',
		name: 'turnValue',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
				command: ['turn'],
			},
		},
		options: [
			{ name: 'On', value: 'on' },
			{ name: 'Off', value: 'off' },
		],
		default: 'on',
		description: 'Whether to turn the appliance on or off',
	},

	// Mode command value
	{
		displayName: 'Mode Value',
		name: 'modeValue',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
				command: ['mode'],
			},
		},
		default: 1,
		description: 'The mode ID to set on the appliance (get available modes from Get Many)',
	},
];
