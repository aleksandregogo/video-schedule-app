import { HttpStatus } from "@nestjs/common";

export class SuccessResponseObjectDto<T> {
  constructor({
    status = HttpStatus.OK,
    data = null,
  }) {
    this.status = status;
    this.data = data;
  }

  public status: HttpStatus;
  public data: T;
}
