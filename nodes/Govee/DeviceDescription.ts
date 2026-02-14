import type { INodeProperties } from 'n8n-workflow';

export const deviceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['device'],
			},
		},
		options: [
			{
				name: 'Control',
				value: 'control',
				description: 'Send a command to a device',
				action: 'Control a device',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a single device by its MAC address',
				action: 'Get a device',
			},
			{
				name: 'Get Capabilities',
				value: 'getCapabilities',
				description:
					'Get the supported commands and properties for a device (or all devices)',
				action: 'Get device capabilities',
			},
			{
				name: 'Get Many',
				value: 'getAll',
				description: 'Get a list of many devices',
				action: 'Get many devices',
			},
			{
				name: 'Get State',
				value: 'getState',
				description: 'Get the current state of a device',
				action: 'Get device state',
			},
			{
				name: 'Multi-Command',
				value: 'multiControl',
				description: 'Send multiple commands to a device in sequence',
				action: 'Send multiple commands to a device',
			},
		],
		default: 'getAll',
	},
];

export const deviceFields: INodeProperties[] = [
	// ----------------------------------
	//   device: shared fields
	// ----------------------------------
	{
		displayName: 'Device Name or ID',
		name: 'device',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDevices',
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['get', 'getState', 'control', 'multiControl'],
			},
		},
		description:
			'The Govee device to target. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Device Name or ID',
		name: 'device',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDevices',
		},
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getCapabilities'],
			},
		},
		description:
			'Optional — select a device to see only its capabilities, or leave empty to see all devices. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Model Name or ID',
		name: 'model',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDeviceModels',
			loadOptionsDependsOn: ['device'],
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getState', 'control', 'multiControl'],
			},
		},
		description:
			'The model of the Govee device. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// ----------------------------------
	//         device: control
	// ----------------------------------
	{
		displayName: 'Command Name or ID',
		name: 'command',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getDeviceCommands',
			loadOptionsDependsOn: ['device'],
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
			},
		},
		default: '',
		description:
			'The command to execute on the device. Only commands supported by the selected device are shown. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	// Turn command value
	{
		displayName: 'Turn Value',
		name: 'turnValue',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
				command: ['turn'],
			},
		},
		options: [
			{ name: 'On', value: 'on' },
			{ name: 'Off', value: 'off' },
		],
		default: 'on',
		description: 'Whether to turn the device on or off',
	},

	// Brightness command value
	{
		displayName: 'Brightness',
		name: 'brightnessValue',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 0,
			maxValue: 100,
		},
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
				command: ['brightness'],
			},
		},
		default: 100,
		description: 'Brightness level from 0 (off) to 100 (max)',
	},

	// Color command value — color picker
	{
		displayName: 'Color',
		name: 'colorValue',
		type: 'color',
		required: true,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
				command: ['color'],
			},
		},
		default: '#FF0000',
		description:
			'The color to set on the device. The hex value is automatically converted to RGB for the Govee API.',
	},

	// Color temperature command value
	{
		displayName: 'Color Temperature',
		name: 'colorTemValue',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 2000,
			maxValue: 9000,
		},
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
				command: ['colorTem'],
			},
		},
		default: 4000,
		description:
			"Color temperature in Kelvin (typical range: 2000-9000). The actual range is validated against your device's capabilities at execution time.",
	},

	// Generic command value — shown for any command not handled above
	{
		displayName: 'Command Value',
		name: 'genericCommandValue',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
			},
			hide: {
				command: ['turn', 'brightness', 'color', 'colorTem'],
			},
		},
		default: '',
		description:
			'The value to send with the command. Use a string, number, or JSON object depending on the command.',
	},

	// ----------------------------------
	//     device: multiControl
	// ----------------------------------
	{
		displayName: 'Commands (JSON)',
		name: 'commands',
		type: 'json',
		required: true,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['multiControl'],
			},
		},
		default:
			'[{"name": "turn", "value": "on"}, {"name": "brightness", "value": 80}]',
		description:
			'JSON array of commands to send sequentially. Each command: {"name": "turn|brightness|color|colorTem", "value": ...}. Color example: {"name": "color", "value": {"r": 255, "g": 0, "b": 0}}. Rate limit: 10 commands/min/device.',
	},

	// ----------------------------------
	//     device: control options
	// ----------------------------------
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control', 'multiControl'],
			},
		},
		options: [
			{
				displayName: 'Validate Command',
				name: 'validateCommand',
				type: 'boolean',
				default: false,
				description:
					'Whether to validate that the device supports the command before sending it. Makes an extra API call to check the device capabilities.',
			},
		],
	},
];
