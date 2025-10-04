import Ajv from 'ajv';
import schema from '../../schemas/scene-graph.schema.json' assert { type: 'json' };

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema as any);

export function validateSceneJSON(data: unknown) {
  const valid = validate(data);
  if (!valid) {
    return {
      valid: false,
      errors: validate.errors ?? [],
    };
  }
  return { valid: true, errors: [] };
}