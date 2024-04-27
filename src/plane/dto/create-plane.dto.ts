export class CreatePlaneDto {
  readonly manufacturer?: string;
  readonly model?: string;
  readonly capacity?: string;
  readonly registrationNumber?: string;
  readonly userId: string;
}

export class UpdatePlaneDto extends CreatePlaneDto {
  planeId: string;
}
