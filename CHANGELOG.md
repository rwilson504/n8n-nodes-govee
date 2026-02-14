# Changelog

## 0.2.0 (2026-02-14)

### Features

- **Dynamic device dropdowns** — devices and appliances auto-populate from your Govee account
- **Dynamic model selection** — model auto-populates based on selected device
- **Visual color picker** — use a color picker instead of entering RGB values manually
- **Color temperature range** — input constrained to 2000–9000K with guidance on device-specific ranges
- **Get single device** — new "Get" operation to retrieve one device by MAC address
- **Multi-Command** — new operation to send multiple commands to a device in sequence
- **Command validation** — opt-in validation checks device-supported commands before sending
- **Dynamic appliance modes** — mode dropdown loads available modes from device capabilities
- **Rate limit documentation** — rate limits documented in node description
- **Execution caching** — device lists cached within a single execution to reduce API calls

## 0.1.0 (2026-02-14)

### Features

- Initial release
- **Device** resource: Get Many, Get State, Control (turn, brightness, color, color temperature)
- **Appliance** resource: Get Many, Control (turn, mode)
- API Key authentication via `Govee-API-Key` header
- Credential test against `/v1/devices` endpoint
