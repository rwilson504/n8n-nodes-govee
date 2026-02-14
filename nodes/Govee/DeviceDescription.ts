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
		],
		default: 'getAll',
	},
];

export const deviceFields: INodeProperties[] = [
	// ----------------------------------
	//         device: getAll
	// ----------------------------------
	// No additional fields needed — returns all devices

	// ----------------------------------
	//         device: getState
	// ----------------------------------
	{
		displayName: 'Device MAC Address',
		name: 'device',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getState', 'control'],
			},
		},
		description: 'The MAC address of the Govee device (e.g., AA:BB:CC:DD:EE:FF:00:11)',
	},
	{
		displayName: 'Device Model',
		name: 'model',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['getState', 'control'],
			},
		},
		description: 'The model number of the Govee device (e.g., H6159)',
	},

	// ----------------------------------
	//         device: control
	// ----------------------------------
	{
		displayName: 'Command',
		name: 'command',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
			},
		},
		options: [
			{
				name: 'Brightness',
				value: 'brightness',
				description: 'Set the brightness level of the device',
			},
			{
				name: 'Color',
				value: 'color',
				description: 'Set the RGB color of the device',
			},
			{
				name: 'Color Temperature',
				value: 'colorTem',
				description: 'Set the color temperature of the device',
			},
			{
				name: 'Turn',
				value: 'turn',
				description: 'Turn the device on or off',
			},
		],
		default: 'turn',
		description: 'The command to execute on the device',
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

	// Color command values
	{
		displayName: 'Red',
		name: 'colorR',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 0,
			maxValue: 255,
		},
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
				command: ['color'],
			},
		},
		default: 255,
		description: 'Red component of the RGB color (0–255)',
	},
	{
		displayName: 'Green',
		name: 'colorG',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 0,
			maxValue: 255,
		},
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
				command: ['color'],
			},
		},
		default: 255,
		description: 'Green component of the RGB color (0–255)',
	},
	{
		displayName: 'Blue',
		name: 'colorB',
		type: 'number',
		required: true,
		typeOptions: {
			minValue: 0,
			maxValue: 255,
		},
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
				command: ['color'],
			},
		},
		default: 255,
		description: 'Blue component of the RGB color (0–255)',
	},

	// Color Temperature command value
	{
		displayName: 'Color Temperature',
		name: 'colorTemValue',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['device'],
				operation: ['control'],
				command: ['colorTem'],
			},
		},
		default: 5000,
		description: 'Color temperature value (valid range depends on device, typically 2000–9000)',
	},
];
