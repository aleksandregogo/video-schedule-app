import { PickType } from "@nestjs/swagger";
import { ScreenCreateDto } from "./screen.create.dto";

export class ToggleScreenStatusDto extends PickType(ScreenCreateDto, ['status'] as const) {}
