# n8n-nodes-govee

This is an n8n community node. It lets you use [Govee](https://us.govee.com/) smart devices in your n8n workflows.

Govee is a smart home technology company offering Wi-Fi-enabled lights, plugs, switches, and appliances (humidifiers, purifiers, etc.). This node lets you list devices, query their state, and send control commands — all through the [Govee Developer API](https://govee-public.s3.amazonaws.com/developer-docs/GoveeDeveloperAPIReference.pdf).

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)
[Usage](#usage)
[Resources](#resources)
[Version history](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-govee` and confirm.

## Operations

### Device (Lights, Plugs, Switches)

| Operation | Description |
|-----------|-------------|
| **Get Many** | List all devices associated with your Govee account |
| **Get** | Get a single device by its MAC address |
| **Get State** | Query the current state of a specific device (online status, power, brightness, color, color temperature) |
| **Control** | Send a command to a device — Turn on/off, set Brightness (0–100), set Color (visual color picker), set Color Temperature (2000–9000K) |
| **Multi-Command** | Send multiple commands to a device in sequence (e.g., turn on + set color + set brightness) |

### Appliance (Humidifiers, Purifiers, etc.)

| Operation | Description |
|-----------|-------------|
| **Get Many** | List all appliances associated with your Govee account |
| **Control** | Send a command to an appliance — Turn on/off, set Mode (dynamically loaded from device capabilities) |

## Credentials

You need a **Govee Developer API Key** to use this node.

### Obtaining a Govee Developer API Key

1. **Download the Govee Home App:**
   - iOS: [Govee Home on the App Store](https://apps.apple.com/us/app/govee-home/id1395696823)
   - Android: [Govee Home on Google Play](https://play.google.com/store/apps/details?id=com.govee.home)
2. **Open the app** and navigate to **My Profile** (tap the profile icon).
3. **Go to Settings** (gear icon, top right).
4. **Select "Apply for API Key"**.
5. **Fill in the form** — provide your name and a reason (e.g., "home automation", "n8n integration").
6. **Agree to the Terms of Service** and tap **Submit**.
7. Once approved, your API key will be sent to your email.

In n8n, create a new **Govee API** credential and paste your API key.

## Compatibility

- Tested with n8n v1.x and later.
- Requires devices that support Wi-Fi (Bluetooth-only devices are not supported by the Govee API).

## Usage

### List all your devices

1. Add the **Govee** node to your workflow.
2. Set **Resource** to `Device` and **Operation** to `Get Many`.
3. Execute — you'll get a list of all your Govee devices with their MAC addresses, models, and supported commands.

### Turn on a light

1. Set **Resource** to `Device`, **Operation** to `Control`.
2. Select your device from the **Device Name or ID** dropdown (auto-populated from your Govee account).
3. Select the **Model** (auto-populated based on your device selection).
4. Set **Command** to `Turn`, **Turn Value** to `On`.

### Set a color

1. Set **Resource** to `Device`, **Operation** to `Control`.
2. Select your device and model from the dropdowns.
3. Set **Command** to `Color` and use the **color picker** to choose your color.

### Send multiple commands at once

1. Set **Resource** to `Device`, **Operation** to `Multi-Command`.
2. Select your device and model.
3. Enter a JSON array of commands:
   ```json
   [{"name": "turn", "value": "on"}, {"name": "brightness", "value": 80}, {"name": "color", "value": {"r": 255, "g": 0, "b": 100}}]
   ```

### Command validation

Enable **Options > Validate Command** on Control or Multi-Command operations to check that your device supports the command before sending it. This makes an extra API call but gives a clear error message if the command isn't supported.

### Rate Limits

The Govee API enforces rate limits:
- **All APIs**: 10,000 requests per day (lights/plugs/switches), 100 per day (appliances)
- **Device List**: 10 requests per minute
- **Device Control / State**: 10 requests per minute per device

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
- [Govee Developer API Reference (PDF)](https://govee-public.s3.amazonaws.com/developer-docs/GoveeDeveloperAPIReference.pdf)
- [Govee Website](https://us.govee.com/)

## Version history

### 0.2.0

- **Dynamic device dropdowns** — devices and appliances are loaded from your Govee account, no more copy-pasting MAC addresses
- **Dynamic model selection** — model auto-populates when you select a device
- **Visual color picker** — choose colors with a color picker instead of entering R/G/B values
- **Color temperature range** — min/max constrained to 2000–9000K with device-specific range info
- **Get single device** — new Get operation to retrieve one device by MAC address
- **Multi-Command** — send multiple commands to a device in sequence (e.g., turn on + brightness + color)
- **Command validation** — opt-in validation checks that your device supports the command before sending
- **Dynamic appliance modes** — mode dropdown loads available modes (Low, Medium, High, Sleep, etc.) from device capabilities
- **Rate limit info** — documented in node description for workflow planning

### 0.1.0

- Initial release
- Device resource: Get Many, Get State, Control (turn, brightness, color, color temperature)
- Appliance resource: Get Many, Control (turn, mode)


[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)
