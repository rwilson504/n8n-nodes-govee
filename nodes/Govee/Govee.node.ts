import type {
	IExecuteFunctions,
	IDataObject,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { goveeApiRequest, hexToRgb } from './GenericFunctions';
import { deviceOperations, deviceFields } from './DeviceDescription';
import { applianceOperations, applianceFields } from './ApplianceDescription';

export class Govee implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Govee',
		name: 'govee',
		icon: 'file:govee.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Control and manage Govee smart devices. Rate limits: 10,000 req/day overall; 10 req/min for device list; 10 req/min/device for control and state.',
		defaults: {
			name: 'Govee',
		},
		inputs: ['main'],
		outputs: ['main'],
		usableAsTool: true,
		/* eslint-disable @n8n/community-nodes/no-credential-reuse -- false positive: plugin bug with Windows drive-root-level paths (D:\) */
		credentials: [
			{
				name: 'goveeApi',
				required: true,
			},
		],
		/* eslint-enable @n8n/community-nodes/no-credential-reuse */
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Appliance',
						value: 'appliance',
						description:
							'Manage Govee appliances (humidifiers, purifiers, etc.)',
					},
					{
						name: 'Device',
						value: 'device',
						description: 'Manage Govee devices (lights, plugs, switches)',
					},
				],
				default: 'device',
			},
			...deviceOperations,
			...deviceFields,
			...applianceOperations,
			...applianceFields,
		],
	};

	methods = {
		loadOptions: {
			async getDevices(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				try {
					const response = await goveeApiRequest.call(
						this,
						'GET',
						'/v1/devices',
					);
					const data = response.data as IDataObject | undefined;
					const devices = (data?.devices as IDataObject[]) ?? [];
					return devices.map((d) => ({
						name: `${d.deviceName as string} (${d.model as string})`,
						value: d.device as string,
					}));
				} catch {
					return [];
				}
			},

			async getDeviceModels(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const deviceMac = this.getCurrentNodeParameter('device') as string;
				if (!deviceMac) {
					return [];
				}
				try {
					const response = await goveeApiRequest.call(
						this,
						'GET',
						'/v1/devices',
					);
					const data = response.data as IDataObject | undefined;
					const devices = (data?.devices as IDataObject[]) ?? [];
					const device = devices.find((d) => d.device === deviceMac);
					if (device) {
						return [
							{
								name: device.model as string,
								value: device.model as string,
							},
						];
					}
					return [];
				} catch {
					return [];
				}
			},

			async getDeviceCommands(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				try {
					const response = await goveeApiRequest.call(
						this,
						'GET',
						'/v1/devices',
					);
					const data = response.data as IDataObject | undefined;
					const devices = (data?.devices as IDataObject[]) ?? [];
					const deviceMac = this.getCurrentNodeParameter('device') as string;

					if (deviceMac) {
						const device = devices.find((d) => d.device === deviceMac);
						if (device) {
							const supportCmds = (device.supportCmds as string[]) ?? [];
							return supportCmds.map((cmd) => ({
								name: cmd,
								value: cmd,
							}));
						}
					}

					// No device selected — return all unique commands across all devices
					const allCmds = new Set<string>();
					for (const device of devices) {
						const cmds = (device.supportCmds as string[]) ?? [];
						for (const cmd of cmds) {
							allCmds.add(cmd);
						}
					}
					return Array.from(allCmds)
						.sort()
						.map((cmd) => ({
							name: cmd,
							value: cmd,
						}));
				} catch {
					return [];
				}
			},

			async getAppliances(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				try {
					const response = await goveeApiRequest.call(
						this,
						'GET',
						'/v1/appliance/devices',
					);
					const data = response.data as IDataObject | undefined;
					const devices = (data?.devices as IDataObject[]) ?? [];
					return devices.map((d) => ({
						name: `${d.deviceName as string} (${d.model as string})`,
						value: d.device as string,
					}));
				} catch {
					return [];
				}
			},

			async getApplianceModels(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const deviceMac = this.getCurrentNodeParameter('device') as string;
				if (!deviceMac) {
					return [];
				}
				try {
					const response = await goveeApiRequest.call(
						this,
						'GET',
						'/v1/appliance/devices',
					);
					const data = response.data as IDataObject | undefined;
					const devices = (data?.devices as IDataObject[]) ?? [];
					const device = devices.find((d) => d.device === deviceMac);
					if (device) {
						return [
							{
								name: device.model as string,
								value: device.model as string,
							},
						];
					}
					return [];
				} catch {
					return [];
				}
			},

			async getApplianceCommands(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				try {
					const response = await goveeApiRequest.call(
						this,
						'GET',
						'/v1/appliance/devices',
					);
					const data = response.data as IDataObject | undefined;
					const devices = (data?.devices as IDataObject[]) ?? [];
					const deviceMac = this.getCurrentNodeParameter('device') as string;

					if (deviceMac) {
						const device = devices.find((d) => d.device === deviceMac);
						if (device) {
							const supportCmds = (device.supportCmds as string[]) ?? [];
							return supportCmds.map((cmd) => ({
								name: cmd,
								value: cmd,
							}));
						}
					}

					// No device selected — return all unique commands across all appliances
					const allCmds = new Set<string>();
					for (const device of devices) {
						const cmds = (device.supportCmds as string[]) ?? [];
						for (const cmd of cmds) {
							allCmds.add(cmd);
						}
					}
					return Array.from(allCmds)
						.sort()
						.map((cmd) => ({
							name: cmd,
							value: cmd,
						}));
				} catch {
					return [];
				}
			},

			async getApplianceModes(
				this: ILoadOptionsFunctions,
			): Promise<INodePropertyOptions[]> {
				const deviceMac = this.getCurrentNodeParameter('device') as string;
				if (!deviceMac) {
					return [];
				}
				try {
					const response = await goveeApiRequest.call(
						this,
						'GET',
						'/v1/appliance/devices',
					);
					const data = response.data as IDataObject | undefined;
					const devices = (data?.devices as IDataObject[]) ?? [];
					const device = devices.find((d) => d.device === deviceMac);
					if (!device) {
						return [];
					}
					const properties = device.properties as IDataObject | undefined;
					const mode = properties?.mode as IDataObject | undefined;
					const modeOptions = (mode?.options as IDataObject[]) ?? [];
					return modeOptions.map((opt) => ({
						name: opt.name as string,
						value: opt.value as number,
					}));
				} catch {
					return [];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		// Cache device/appliance lists within this execution to avoid redundant API calls
		let deviceListCache: IDataObject[] | null = null;
		let applianceListCache: IDataObject[] | null = null;

		const getDeviceList = async (): Promise<IDataObject[]> => {
			if (deviceListCache === null) {
				const response = await goveeApiRequest.call(this, 'GET', '/v1/devices');
				const data = response.data as IDataObject | undefined;
				deviceListCache = (data?.devices as IDataObject[]) ?? [];
			}
			return deviceListCache;
		};

		const getApplianceList = async (): Promise<IDataObject[]> => {
			if (applianceListCache === null) {
				const response = await goveeApiRequest.call(
					this,
					'GET',
					'/v1/appliance/devices',
				);
				const data = response.data as IDataObject | undefined;
				applianceListCache = (data?.devices as IDataObject[]) ?? [];
			}
			return applianceListCache;
		};

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				// ==========================================
				//              device
				// ==========================================
				if (resource === 'device') {
					// ----- Get Many -----
					if (operation === 'getAll') {
						responseData = await getDeviceList();
					}

					// ----- Get Capabilities -----
					else if (operation === 'getCapabilities') {
						const deviceMac = this.getNodeParameter('device', i, '') as string;
						const devices = await getDeviceList();

						if (deviceMac) {
							const device = devices.find((d) => d.device === deviceMac);
							if (!device) {
								throw new NodeOperationError(
									this.getNode(),
									`Device with MAC address "${deviceMac}" not found`,
									{ itemIndex: i },
								);
							}
							responseData = {
								device: device.device,
								deviceName: device.deviceName,
								model: device.model,
								controllable: device.controllable,
								retrievable: device.retrievable,
								supportCmds: device.supportCmds,
								properties: device.properties,
							} as IDataObject;
						} else {
							responseData = devices.map((d) => ({
								device: d.device,
								deviceName: d.deviceName,
								model: d.model,
								controllable: d.controllable,
								retrievable: d.retrievable,
								supportCmds: d.supportCmds,
								properties: d.properties,
							})) as IDataObject[];
						}
					}

					// ----- Get (single device) -----
					else if (operation === 'get') {
						const deviceMac = this.getNodeParameter('device', i) as string;
						const devices = await getDeviceList();
						const device = devices.find((d) => d.device === deviceMac);
						if (!device) {
							throw new NodeOperationError(
								this.getNode(),
								`Device with MAC address "${deviceMac}" not found`,
								{ itemIndex: i },
							);
						}
						responseData = device;
					}

					// ----- Get State -----
					else if (operation === 'getState') {
						const device = this.getNodeParameter('device', i) as string;
						const model = this.getNodeParameter('model', i) as string;
						const response = await goveeApiRequest.call(
							this,
							'GET',
							'/v1/devices/state',
							{},
							{ device, model },
						);
						responseData = response.data as IDataObject;
					}

					// ----- Control -----
					else if (operation === 'control') {
						const device = this.getNodeParameter('device', i) as string;
						const model = this.getNodeParameter('model', i) as string;
						const command = this.getNodeParameter('command', i) as string;
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						// Validate command against device capabilities if enabled
						if (options.validateCommand) {
							const devices = await getDeviceList();
							const deviceInfo = devices.find((d) => d.device === device);
							if (deviceInfo) {
								const supportedCmds =
									(deviceInfo.supportCmds as string[]) ?? [];
								if (!supportedCmds.includes(command)) {
									throw new NodeOperationError(
										this.getNode(),
										`Device "${device}" does not support the "${command}" command. Supported: ${supportedCmds.join(', ')}`,
										{ itemIndex: i },
									);
								}
							}
						}

						let commandValue: string | number | IDataObject;

						switch (command) {
							case 'turn':
								commandValue = this.getNodeParameter(
									'turnValue',
									i,
								) as string;
								break;
							case 'brightness':
								commandValue = this.getNodeParameter(
									'brightnessValue',
									i,
								) as number;
								break;
							case 'color': {
								const hex = this.getNodeParameter(
									'colorValue',
									i,
								) as string;
								commandValue = hexToRgb(hex);
								break;
							}
							case 'colorTem':
								commandValue = this.getNodeParameter(
									'colorTemValue',
									i,
								) as number;
								break;
							default: {
								// Pass-through for commands not yet handled with dedicated UI fields
								const raw = this.getNodeParameter('genericCommandValue', i, '') as string;
								try {
									commandValue = JSON.parse(raw) as IDataObject;
								} catch {
									commandValue = raw;
								}
								break;
							}
						}

						const body: IDataObject = {
							device,
							model,
							cmd: {
								name: command,
								value: commandValue,
							},
						};

						const response = await goveeApiRequest.call(
							this,
							'PUT',
							'/v1/devices/control',
							body,
						);
						responseData = response as IDataObject;
					}

					// ----- Multi-Command -----
					else if (operation === 'multiControl') {
						const device = this.getNodeParameter('device', i) as string;
						const model = this.getNodeParameter('model', i) as string;
						const commandsRaw = this.getNodeParameter('commands', i);
						const options = this.getNodeParameter('options', i, {}) as IDataObject;

						let commands: Array<{ name: string; value: unknown }>;
						try {
							commands =
								typeof commandsRaw === 'string'
									? JSON.parse(commandsRaw)
									: (commandsRaw as Array<{ name: string; value: unknown }>);
						} catch {
							throw new NodeOperationError(
								this.getNode(),
								'Invalid JSON in Commands field. Expected an array like: [{"name": "turn", "value": "on"}]',
								{ itemIndex: i },
							);
						}

						if (!Array.isArray(commands)) {
							throw new NodeOperationError(
								this.getNode(),
								'Commands must be a JSON array',
								{ itemIndex: i },
							);
						}

						// Validate all commands if enabled
						if (options.validateCommand) {
							const devices = await getDeviceList();
							const deviceInfo = devices.find((d) => d.device === device);
							if (deviceInfo) {
								const supportedCmds =
									(deviceInfo.supportCmds as string[]) ?? [];
								for (const cmd of commands) {
									if (!supportedCmds.includes(cmd.name)) {
										throw new NodeOperationError(
											this.getNode(),
											`Device "${device}" does not support the "${cmd.name}" command. Supported: ${supportedCmds.join(', ')}`,
											{ itemIndex: i },
										);
									}
								}
							}
						}

						const results: IDataObject[] = [];
						for (const cmd of commands) {
							const body: IDataObject = {
								device,
								model,
								cmd: {
									name: cmd.name,
									value: cmd.value as IDataObject,
								},
							};
							const response = await goveeApiRequest.call(
								this,
								'PUT',
								'/v1/devices/control',
								body,
							);
							results.push({
								...(response as IDataObject),
								_command: cmd.name,
							});
						}
						responseData = results;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown operation: ${operation}`,
							{ itemIndex: i },
						);
					}
				}

				// ==========================================
				//              appliance
				// ==========================================
				else if (resource === 'appliance') {
					// ----- Get Many -----
					if (operation === 'getAll') {
						responseData = await getApplianceList();
					}

					// ----- Control -----
					else if (operation === 'control') {
						const device = this.getNodeParameter('device', i) as string;
						const model = this.getNodeParameter('model', i) as string;
						const command = this.getNodeParameter('command', i) as string;

						let commandValue: string | number;

						switch (command) {
							case 'turn':
								commandValue = this.getNodeParameter(
									'turnValue',
									i,
								) as string;
								break;
							case 'mode':
								commandValue = this.getNodeParameter(
									'modeValue',
									i,
								) as number;
								break;
							default: {
								// Pass-through for commands not yet handled with dedicated UI fields
								const raw = this.getNodeParameter('genericCommandValue', i, '') as string;
								try {
									commandValue = JSON.parse(raw) as number;
								} catch {
									commandValue = raw;
								}
								break;
							}
						}

						const body: IDataObject = {
							device,
							model,
							cmd: {
								name: command,
								value: commandValue,
							},
						};

						const response = await goveeApiRequest.call(
							this,
							'PUT',
							'/v1/appliance/devices/control',
							body,
						);
						responseData = response as IDataObject;
					} else {
						throw new NodeOperationError(
							this.getNode(),
							`Unknown operation: ${operation}`,
							{ itemIndex: i },
						);
					}
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Unknown resource: ${resource}`,
						{ itemIndex: i },
					);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = this.helpers.constructExecutionMetaData(
						this.helpers.returnJsonArray({ error: (error as Error).message }),
						{ itemData: { item: i } },
					);
					returnData.push(...executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
