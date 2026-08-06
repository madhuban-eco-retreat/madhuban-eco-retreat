export function zodV4Resolver(schema) {
    return async (values) => {
        const result = await schema.safeParseAsync(values);
        if (result.success) {
            return { values: result.data, errors: {} };
        }
        const errors = {};
        for (const issue of result.error.issues) {
            const key = issue.path.join(".");
            if (!key)
                continue;
            // Only record the first error per field
            if (!(key in errors)) {
                // @ts-expect-error — FieldErrors<T> index signature is too narrow for dynamic keys
                errors[key] = { type: issue.code, message: issue.message };
            }
        }
        return { values: {}, errors };
    };
}
