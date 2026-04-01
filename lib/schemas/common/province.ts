import { z } from 'zod';
import { ProvinceGroup } from '@/types/util';

export const provinceGroupSchema = z.enum(ProvinceGroup);