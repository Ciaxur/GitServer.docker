// Schema Validator Import
import Joi from 'joi';

export interface IRepository {
  title:          string,
  description?:   string,
}

export const RepositorySchema = Joi.object<IRepository>({
  title: Joi.string().required().alphanum().min(3).max(32).trim(),
  description: Joi.string().optional().max(128).trim(),
});