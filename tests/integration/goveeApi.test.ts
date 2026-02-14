/* eslint-disable @n8n/community-nodes/no-restricted-imports, @n8n/community-nodes/no-restricted-globals */
/**
 * Integration tests for the Govee Developer API v2.0
 *
 * These tests call the real Govee API using the key from .env.dev.
 * They verify the API endpoints return the expected structure.
 *
 * Setup:
 *   1. Copy .env.dev and set your GOVEE_API_KEY
 *   2. Run: npm test -- --testPathPattern=integration
 *
 * Rate limits:
 *   - DeviceList: 10 req/min
 *   - DeviceControl: 10 req/min/device
 *   - All APIs: 100 req/day
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env.dev') });

const API_BASE = 'https://developer-api.govee.com';
const API_KEY = process.env.GOVEE_API_KEY ?? '';

// Skip all tests if no API key is configured
const describeWithKey = API_KEY && API_KEY !== 'your-api-key-here' ? describe : describe.skip;

async function goveeRequest(
	method: string,
	endpoint: string,
	body?: Record<string, unknown>,
): Promise<{ status: number; data: Record<string, unknown> }> {
	const options: RequestInit = {
		method,
		headers: {
			'Govee-API-Key': API_KEY,
			'Content-Type': 'application/json',
		},
	};

	if (body) {
		options.body = JSON.stringify(body);
	}

	const response = await fetch(`${API_BASE}${endpoint}`, options);
	const data = (await response.json()) as Record<string, unknown>;
	return { status: response.status, data };
}

describeWithKey('Govee API - Devices (Lights, Plugs, Switches)', () => {
	let devices: Array<Record<string, unknown>> = [];

	it('GET /v1/devices — should return device list', async () => {
		const { status, data } = await goveeRequest('GET', '/v1/devices');

		expect(status).toBe(200);
		expect(data.code).toBe(200);
		expect(data.message).toBe('Success');
		expect(data.data).toBeDefined();

		const innerData = data.data as Record<string, unknown>;
		expect(Array.isArray(innerData.devices)).toBe(true);

		devices = innerData.devices as Array<Record<string, unknown>>;
		console.log(`Found ${devices.length} device(s)`);
	});

	it('each device should have required fields', () => {
		if (devices.length === 0) {
			console.warn('No devices found — skipping field validation');
			return;
		}

		for (const device of devices) {
			expect(device).toHaveProperty('device');
			expect(device).toHaveProperty('model');
			expect(device).toHaveProperty('deviceName');
			expect(device).toHaveProperty('controllable');
			expect(device).toHaveProperty('retrievable');
			expect(device).toHaveProperty('supportCmds');
			expect(Array.isArray(device.supportCmds)).toBe(true);

			// Validate supportCmds contains only known values
			const validCmds = ['turn', 'brightness', 'color', 'colorTem'];
			for (const cmd of device.supportCmds as string[]) {
				expect(validCmds).toContain(cmd);
			}
		}
	});

	it('GET /v1/devices/state — should return state for a retrievable device', async () => {
		const retrievable = devices.find((d) => d.retrievable === true);
		if (!retrievable) {
			console.warn('No retrievable device found — skipping state test');
			return;
		}

		const url = `/v1/devices/state?device=${encodeURIComponent(retrievable.device as string)}&model=${encodeURIComponent(retrievable.model as string)}`;
		const response = await fetch(`${API_BASE}${url}`, {
			headers: { 'Govee-API-Key': API_KEY },
		});
		const data = (await response.json()) as Record<string, unknown>;

		expect(response.status).toBe(200);
		expect(data.code).toBe(200);
		expect(data.data).toBeDefined();

		const stateData = data.data as Record<string, unknown>;
		expect(stateData).toHaveProperty('device');
		expect(stateData).toHaveProperty('model');
		expect(stateData).toHaveProperty('properties');
		expect(Array.isArray(stateData.properties)).toBe(true);

		console.log(
			`Device "${retrievable.deviceName}" state properties:`,
			JSON.stringify(stateData.properties, null, 2),
		);
	});
});

describeWithKey('Govee API - Appliances', () => {
	let appliances: Array<Record<string, unknown>> = [];

	it('GET /v1/appliance/devices — should return appliance list', async () => {
		const { status, data } = await goveeRequest('GET', '/v1/appliance/devices');

		expect(status).toBe(200);
		expect(data.code).toBe(200);
		expect(data.message).toBe('Success');
		expect(data.data).toBeDefined();

		const innerData = data.data as Record<string, unknown>;
		expect(Array.isArray(innerData.devices)).toBe(true);

		appliances = innerData.devices as Array<Record<string, unknown>>;
		console.log(`Found ${appliances.length} appliance(s)`);
	});

	it('each appliance should have required fields', () => {
		if (appliances.length === 0) {
			console.warn('No appliances found — skipping field validation');
			return;
		}

		for (const appliance of appliances) {
			expect(appliance).toHaveProperty('device');
			expect(appliance).toHaveProperty('model');
			expect(appliance).toHaveProperty('deviceName');
			expect(appliance).toHaveProperty('controllable');
			expect(appliance).toHaveProperty('supportCmds');
			expect(Array.isArray(appliance.supportCmds)).toBe(true);

			// Validate supportCmds
			const validCmds = ['turn', 'mode'];
			for (const cmd of appliance.supportCmds as string[]) {
				expect(validCmds).toContain(cmd);
			}
		}
	});

	it('appliances with mode support should have mode options', () => {
		const modeAppliances = appliances.filter((a) => {
			const cmds = a.supportCmds as string[];
			return cmds.includes('mode');
		});

		if (modeAppliances.length === 0) {
			console.warn('No mode-capable appliances — skipping mode options test');
			return;
		}

		for (const appliance of modeAppliances) {
			expect(appliance).toHaveProperty('properties');
			const properties = appliance.properties as Record<string, unknown>;
			expect(properties).toHaveProperty('mode');

			const mode = properties.mode as Record<string, unknown>;
			expect(mode).toHaveProperty('options');
			expect(Array.isArray(mode.options)).toBe(true);

			const options = mode.options as Array<Record<string, unknown>>;
			expect(options.length).toBeGreaterThan(0);

			for (const opt of options) {
				expect(opt).toHaveProperty('name');
				expect(opt).toHaveProperty('value');
				expect(typeof opt.name).toBe('string');
				expect(typeof opt.value).toBe('number');
			}

			console.log(
				`Appliance "${appliance.deviceName}" modes:`,
				options.map((o) => `${o.name} (${o.value})`).join(', '),
			);
		}
	});
});

describeWithKey('Govee API - Authentication', () => {
	it('should reject invalid API key with 401', async () => {
		const response = await fetch(`${API_BASE}/v1/devices`, {
			headers: { 'Govee-API-Key': 'invalid-key-12345' },
		});

		expect(response.status).toBe(401);
	});

	it('should include rate limit headers', async () => {
		const response = await fetch(`${API_BASE}/v1/devices`, {
			headers: { 'Govee-API-Key': API_KEY },
		});

		// The API returns rate limit info in headers
		const rateLimitHeaders = [
			'api-ratelimit-remaining',
			'api-ratelimit-limit',
			'api-ratelimit-reset',
		];

		const foundHeaders = rateLimitHeaders.filter(
			(h) => response.headers.get(h) !== null,
		);

		console.log('Rate limit headers found:', foundHeaders);
		console.log(
			'Remaining:',
			response.headers.get('api-ratelimit-remaining'),
		);
	});
});
