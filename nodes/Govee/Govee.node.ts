import type {
	IExecuteFunctions,
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { goveeApiRequest } from './GenericFunctions';
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
		description: 'Control and manage Govee smart devices',
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
						description: 'Manage Govee appliances (humidifiers, purifiers, etc.)',
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: IDataObject | IDataObject[];

				// ==========================================
				//              device
				// ==========================================
				if (resource === 'device') {
					// ----- Get Many -----
					if (operation === 'getAll') {
						const response = await goveeApiRequest.call(this, 'GET', '/v1/devices');
						const data = response.data as IDataObject | undefined;
						responseData = (data?.devices as IDataObject[]) ?? [];
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

						let commandValue: string | number | IDataObject;

						switch (command) {
							case 'turn':
								commandValue = this.getNodeParameter('turnValue', i) as string;
								break;
							case 'brightness':
								commandValue = this.getNodeParameter('brightnessValue', i) as number;
								break;
							case 'color':
								commandValue = {
									r: this.getNodeParameter('colorR', i) as number,
									g: this.getNodeParameter('colorG', i) as number,
									b: this.getNodeParameter('colorB', i) as number,
								};
								break;
							case 'colorTem':
								commandValue = this.getNodeParameter('colorTemValue', i) as number;
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown command: ${command}`,
									{ itemIndex: i },
								);
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
						const response = await goveeApiRequest.call(
							this,
							'GET',
							'/v1/appliance/devices',
						);
						const data = response.data as IDataObject | undefined;
						responseData = (data?.devices as IDataObject[]) ?? [];
					}

					// ----- Control -----
					else if (operation === 'control') {
						const device = this.getNodeParameter('device', i) as string;
						const model = this.getNodeParameter('model', i) as string;
						const command = this.getNodeParameter('command', i) as string;

						let commandValue: string | number;

						switch (command) {
							case 'turn':
								commandValue = this.getNodeParameter('turnValue', i) as string;
								break;
							case 'mode':
								commandValue = this.getNodeParameter('modeValue', i) as number;
								break;
							default:
								throw new NodeOperationError(
									this.getNode(),
									`Unknown command: ${command}`,
									{ itemIndex: i },
								);
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
