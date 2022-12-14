const mathF = {
	formA: (angle, type = '') => {
		if (type == 'rad') {
			angle %= 360;
			if (angle < 0) angle += 360;
			angle *= Math.PI / 180;
		}
		if (type == 'degr') {
			angle *= 180 / Math.PI;
			angle %= 360;
			if (angle < 0) angle += 360;
		}
		if (type == '') {
			angle %= 360;
			if (angle < 0) angle += 360;
		}
		return angle;
	},
	rand: (min, max) => {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	},
	rand0: (max) => {
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - 1));
	},
	last: (arr) => {
		if (!Array.isArray(arr)) {
			return false;
		}
		return arr[arr.length-1];
	},
	parentClass: (obj) => {
		return (typeof obj == 'object'? Object.getPrototypeOf(obj.constructor).name : false);
	},
	cosD: (degr) => {
		return Math.cos(mathF.formA(degr, 'rad'));
	},
	sinD: (degr) => {
		return Math.sin(mathF.formA(degr, 'rad'));
	}
}