function count(cfg: string, nums: number[]): number {
	if (cfg === '') {
		return nums.length === 0 ? 1 : 0;
	}

	if (nums.length === 0) {
		return cfg.includes('#') ? 0 : 1;
	}

	let result = 0;

	if (cfg[0] === '.' || cfg[0] === '?') {
		result += count(cfg.substring(1), nums);
	}

	if (cfg[0] === '#' || cfg[0] === '?') {
		if (nums[0] <= cfg.length && !cfg.substring(0, nums[0]).includes('.') && (nums[0] === cfg.length || cfg[nums[0]] !== '#')) {
			result += count(cfg.substring(nums[0] + 1), nums.slice(1));
		}
	}

	return result;
}

// Example usage:
const cfg = '...#?';
const nums = [3, 2];
console.log(count(cfg, nums));
