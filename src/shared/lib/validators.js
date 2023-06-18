export const minLengthValidator = (count) => {
	return (rule, value, callback) => {
		if (value && value.length < count) {
			callback(`Минимальная длинна поля ${count} символов`);
		} else {
			callback();
		}
	};
}
