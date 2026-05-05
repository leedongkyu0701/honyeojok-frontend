import { z } from 'zod';
import { ProvinceGroup } from '@/shared/types/util';

export const provinceGroupSchema = z.enum(ProvinceGroup);