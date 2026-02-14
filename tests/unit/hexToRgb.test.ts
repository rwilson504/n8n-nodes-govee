import { hexToRgb } from '../../nodes/Govee/GenericFunctions';

describe('hexToRgb', () => {
	it('should convert #FF0000 to red', () => {
		expect(hexToRgb('#FF0000')).toEqual({ r: 255, g: 0, b: 0 });
	});

	it('should convert #00FF00 to green', () => {
		expect(hexToRgb('#00FF00')).toEqual({ r: 0, g: 255, b: 0 });
	});

	it('should convert #0000FF to blue', () => {
		expect(hexToRgb('#0000FF')).toEqual({ r: 0, g: 0, b: 255 });
	});

	it('should convert #FFFFFF to white', () => {
		expect(hexToRgb('#FFFFFF')).toEqual({ r: 255, g: 255, b: 255 });
	});

	it('should convert #000000 to black', () => {
		expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
	});

	it('should handle lowercase hex', () => {
		expect(hexToRgb('#ff8800')).toEqual({ r: 255, g: 136, b: 0 });
	});

	it('should handle hex without # prefix', () => {
		expect(hexToRgb('FF0000')).toEqual({ r: 255, g: 0, b: 0 });
	});
});
