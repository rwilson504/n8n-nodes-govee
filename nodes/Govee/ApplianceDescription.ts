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
	//   appliance: shared fields
	// ----------------------------------
	{
		displayName: 'Device Name or ID',
		name: 'device',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAppliances',
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
			},
		},
		description:
			'The Govee appliance to target. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Model Name or ID',
		name: 'model',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getApplianceModels',
			loadOptionsDependsOn: ['device'],
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
			},
		},
		description:
			'The model of the Govee appliance. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// ----------------------------------
	//     appliance: control
	// ----------------------------------
	{
		displayName: 'Command Name or ID',
		name: 'command',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getApplianceCommands',
			loadOptionsDependsOn: ['device'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
			},
		},
		default: '',
		description:
			'The command to execute on the appliance. Only commands supported by the selected device are shown. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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

	// Mode command value — dynamic dropdown from device capabilities
	{
		displayName: 'Mode Name or ID',
		name: 'modeValue',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getApplianceModes',
			loadOptionsDependsOn: ['device'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
				command: ['mode'],
			},
		},
		default: '',
		description:
			'The mode to set on the appliance. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Generic command value — shown for any command not handled above
	{
		displayName: 'Command Value',
		name: 'genericCommandValue',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['appliance'],
				operation: ['control'],
			},
			hide: {
				command: ['turn', 'mode'],
			},
		},
		default: '',
		description:
			'The value to send with the command. Use a string, number, or JSON object depending on the command.',
	},
];
